const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.cookie("login-cookie", "", { max: 0 });
  res.redirect("/login");
});

module.exports = router;
