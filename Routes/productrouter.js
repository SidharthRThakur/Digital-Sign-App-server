const ensureAuthenticated = require("../Middlewares/auth");

const router = require("express").Router();

router.get("/", ensureAuthenticated, (req, res) => {
  console.log("logged user detials ", req.user);
  res.status(200).json([
    {
      name: "TO/DO List",
      price: "Pending",
    },
    {
      name: "Bug Fixing",
      price: "In Progress",
    },
  ]);
});

module.exports = router;
