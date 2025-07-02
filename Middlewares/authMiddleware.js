const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers["authorization"]; // or req.header("Authorization")

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: decoded._id };
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = authMiddleware;
// This middleware checks for a JWT in the Authorization header, verifies it, and attaches the user ID to the request object.
// If the token is missing or invalid, it responds with a 401 status code and an error message.
// Ensure that the JWT_SECRET environment variable is set in your .env file for this to work
