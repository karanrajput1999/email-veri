// const User = require("../model/user");
const RegisterController = require("../controllers/registerController");
const express = require("express");
const RegisterValidator = require("../middlewares/registerValidator");
const router = express.Router();

router.get("/", RegisterController.registerGet);

router.post(
  "/",
  RegisterValidator.register,
  RegisterController.registerPost,
  RegisterController.sendMailController
);

module.exports = router;
