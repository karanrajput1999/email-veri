const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const User = require("../model/user");
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;

class RegisterController {
  async registerPost(req, res, next) {
    try {
      const { username, email, password } = req.body;
      const hashedPass = await bcrypt.hash(password, 10);

      const newUser = await User.create({
        username: username,
        email: email,
        password: hashedPass,
      });
      newUser.save();
      console.log(newUser);

      next();
      res.redirect("/login");
    } catch (err) {
      console.log(err);
    }
  }
  // MAILER STARTS HERE
  async sendMailController(req, res) {
    try {
      const createTransporter = async (req, res) => {
        const oauth2client = new OAuth2(
          process.env.CLIENT_ID,
          process.env.CLIENT_SECRET,
          "https://developers.google.com/oauthplayground"
        );
        console.log("it works here at create transport");
        oauth2client.setCredentials({
          refresh_token: process.env.REFRESH_TOKEN,
        });

        const accessToken = await new Promise((resolve, reject) => {
          oauth2client.getAccessToken((err, token) => {
            if (err) {
              reject("Failed to create access token");
            }
            resolve(token);
          });
        });

        const transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            type: "OAuth2",
            user: process.env.EMAIL,
            accessToken,
            clientId: process.env.CLIENT_ID,
            clientSecret: process.env.CLIENT_SECRET,
            refreshToken: process.env.REFRESH_TOKEN,
          },
          tls: { rejectUnauthorized: false },
        });
        return transporter;
      };

      const sendEmail = async (emailOptions) => {
        let emailTransporter = await createTransporter();
        await emailTransporter.sendMail(emailOptions);
      };
      sendEmail({
        subject: "Verfiy you Email!",
        to: "karannayak0420@gmail.com",
        from: process.env.EMAIL,
        html: `<h2> Hello ! thanks for registering on our site.</h2>
        <h4> Please verify your email to enjoy our services...</h4>
        `,
      });

     
    } catch (err) {
      console.log("SEND MAIL ERROR", err);
    }
  }

  // MAILER ENDS HERE

  async registerGet(req, res) {
    res.render("register");
  }
}
module.exports = new RegisterController();
