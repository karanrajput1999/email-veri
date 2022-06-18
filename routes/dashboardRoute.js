const express = require("express");
const router = express.Router();
const { loginRequired } = require("../config/JWT");

router.get("/", loginRequired, (req, res) => {
  res.render("dashboard");
});

module.exports = router;
