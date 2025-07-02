const bcrypt = require("bcrypt");
const UserModel = require("../Models/user");
const jwt = require("jsonwebtoken");

const signup = async (req, res) => {
  try {
    // Extract user data from request body
    const { name, email, password } = req.body; // req.body -json object se value nikali with the help of destructuring
    const user = await UserModel.findOne({ email });
    if (user) {
      return res
        .status(409)
        .json({ error: "User already exists", sucess: false });
    }
    const userModel = new UserModel({ name, email, password });
    // TODO: Add validation and hashing logic here
    userModel.password = await bcrypt.hash(password, 11);
    // TODO: Save user to database
    await userModel.save(); // save()- it will save the data in the data base for further login and validation
    res.status(201).json({
      message: "User registered successfully :athctrl",
      success: true,
    });
  } catch (error) {
    res.status(500).json({ error: "Internal Server error (athctrl)" });
  }
};

// login ------------------//
const login = async (req, res) => {
  try {
    // Extract user data from request body
    const { email, password } = req.body; // req.body -json object se value nikali with the help of destructuring
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res
        .status(409)
        .json({ message: "email or password is not valid", success: false });
    }
    const isPassEqual = await bcrypt.compare(password, user.password);
    if (!isPassEqual) {
      return (
        res
          .status(409)
          // .json({ error: "email or password is not valid", success: false });// using error will not work in the client side and will not show th toaster message
          .json({ message: "email or password is not valid", success: false })
      );
    }
    const jwtToken = jwt.sign(
      { email: user.email, _id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );
    res.status(200).json({
      message: "Login success",
      success: true,
      jwtToken,
      email,
      name: user.name,
    });
  } catch (error) {
    res.status(500).json({ error: "Internal Server error (athctrl)" });
  }
};

module.exports = { signup, login };
