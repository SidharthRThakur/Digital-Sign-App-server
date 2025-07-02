const { signup, login } = require("../Controllers/authcontroller");
const {
  signupValidation,
  loginValidation,
} = require("../Middlewares/authvalidation");

const router = require("express").Router();

router.post("/login", loginValidation, login);
router.post("/signup", signupValidation, signup); //we have written signupValidadtion first so that system will go to at signup validation first and than signup funciton
module.exports = router;
