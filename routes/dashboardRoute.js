const express = require("express");
const dashboardRouter = express.Router();
const { authenticateUser } = require("../Middlewares/Auth");

dashboardRouter.get("/", (req, res) => {
    res.render("home");
});

dashboardRouter.get("/dashboard", authenticateUser, (req, res) => {
    res.render("dashboard");
});

module.exports = dashboardRouter;