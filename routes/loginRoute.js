const LoginController = require("../controllers/loginController");
const express = require("express");
const router = express.Router();

router.get("/", LoginController.alreadyLoggedIn, LoginController.loginGet);
router.post("/", LoginController.loginPost);

module.exports = router;
