const jwt = require("jsonwebtoken");
const cookie = require("cookie-parser");

const loginRequired = async (req, res, next) => {
  const token = req.cookies["login-cookie"];
  if (token) {
    const validateToken = await jwt.verify(token, process.env.JWT_SECRET);

    if (validateToken) {
      // res.user = validateToken.id;

      next();
    } else {
      console.log("Token expired");
    }
  } else {
    console.log("Token not found");
    res.redirect("/login");
  }
};

module.exports = { loginRequired };
