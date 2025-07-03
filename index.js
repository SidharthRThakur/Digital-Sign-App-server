const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();

require("dotenv").config();
require("./Models/db");

const AuthRouter = require("./Routes/authrouter");
const ProductRouter = require("./Routes/productrouter");
const DocRouter = require("./Routes/docRoutes");
const SignatureRouter = require("./Routes/signatureRoutes");
const PORT = process.env.PORT || 8080;

app.use(bodyParser.json());
app.use(cors());

// Serve uploaded files
app.use("/uploads", express.static("uploads"));

// Routes
app.use("/auth", AuthRouter);
app.use("/products", ProductRouter);
app.use("/docs", DocRouter);
app.use("/signatures", SignatureRouter);
app.get("/ping", (req, res) => {
  res.send("PONG");
});

// app.listen(PORT, () => {
//   console.log(`Server is running on ${PORT}`);
// });
