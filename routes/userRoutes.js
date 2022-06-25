const express = require("express");
const userRouter = express.Router();
const { authenticateUser, alreadyLoggedIn } = require("../Middlewares/Auth");
const { userController, testController } = require("../Controllers");
const { userValidator } = require("../Middlewares/Validators");

userRouter.get("/logout", (req, res) => {
    res.cookie("login-cookie", "", { max: 0 });
    res.redirect("/user/ogin");
});
testController.testPrint2("hello class");
userRouter.get("/login", alreadyLoggedIn, (req, res) => { res.render("login"); });
userRouter.post("/login", userController.loginPost);
userRouter.get("/register", userController.registerGet);
userRouter.post("/register", userValidator.register, userController.registerPost);

module.exports = userRouter;