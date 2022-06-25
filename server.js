require("dotenv").config();
const cookieParser = require("cookie-parser");
const express = require("express");
const path = require("path");
const db = require("./config/db.js");
const userRoutes = require("./Routes/userRoutes");
const dashboardRoutes = require("./Routes/dashboardRoute");

const app = express();

// Parsing JSON
app.use(express.json());

// Using static files
app.use(express.static(path.join(__dirname, "./public")));

// using cookie parser
app.use(cookieParser());

app.use("/*", (req, res, next) => {
  console.log("Request URL: ", req.originalUrl, req.body);
  next();
})

// setting view engine to ejs
app.set("view engine", "ejs");

app.use("/", dashboardRoutes)
app.use("/user", userRoutes);


app.listen(process.env.PORT, () => {
  console.log(`server running at port http://localhost:${process.env.PORT}`);
});
