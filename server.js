require("dotenv").config();
const cookieParser = require("cookie-parser");
const express = require("express");
const path = require("path");
const db = require("./config/db.js");
const register = require("./routes/registerRoute");
const login = require("./routes/loginRoute");
const home = require("./routes/homeRoute");
const dashboard = require("./routes/dashboardRoute");
const logout = require("./routes/logoutRoute");

const app = express();

// Parsing JSON
app.use(express.json());

// Using static files
app.use(express.static(path.join(__dirname, "./public")));

// using cookie parser
app.use(cookieParser());

// setting view engine to ejs
app.set("view engine", "ejs");

app.use("/register", register);
app.use("/login", login);
app.use("/", home);
app.use("/dashboard", dashboard);
app.use("/logout", logout);

app.listen(process.env.PORT, () => {
  console.log(`server running at port ${process.env.PORT}`);
});
