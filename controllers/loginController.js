const jwt = require("jsonwebtoken");
const cookie = require("cookie-parser");
const bcrypt = require("bcrypt");
const User = require("../model/user");

class LoginController {
  async loginPost(req, res) {
    try {
      // function to create JWT token
      const createToken = (id) => {
        return jwt.sign({ id }, process.env.JWT_SECRET);
      };
      const { email, password } = req.body;

      const findUser = await User.findOne({ email: email });
      if (!findUser) {
        console.log("User Not registered!");
      } else {
        const match = await bcrypt.compare(password, findUser.password);
        if (match) {
          // creating jwt token
          // added "_" in front of id because database has the same
          const token = createToken(findUser._id);

          // storing jwt token into cookie
          res.cookie("login-cookie", token);
          res.redirect("/dashboard");
        } else {
          console.log("Password does not match with our records");
        }
      }
    } catch (err) {
      console.log("error ->" + err);
    }
  }

  // it will redirect you to Dashboard if you have already logged in previously
  // Experiment
  async alreadyLoggedIn(req, res, next) {
    try {
      const token = req.cookies["login-cookie"];
      if (token) {
        const validateToken = jwt.verify(token, process.env.JWT_SECRET);
        if (validateToken) {
          res.redirect("/dashboard");
        } else {
          res.redirect("/login");
        }
      } else {
        next();
      }
    } catch (err) {
      console.log(err);
    }
  }
  // Experiment
  async loginGet(req, res) {
    res.render("login");
  }
}

module.exports = new LoginController();
