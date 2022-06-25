const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const { User } = require("../models");
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;
const jwt = require("jsonwebtoken");

class UserControllers {
    constructor() {
        this.registerPost = this.registerPost.bind(this);
        this.registerGet = this.registerGet.bind(this);
        this.loginPost = this.loginPost.bind(this);
        this.alreadyLoggedIn = this.alreadyLoggedIn.bind(this);
        this.sendMailController = this.sendMailController.bind(this);
        // console.log("UserControllers", this);
    }
    async sendMailController({ emailAddress }) {
        try {
            const createTransporter = async () => {
                const oauth2client = new OAuth2(
                    process.env.CLIENT_ID,
                    process.env.CLIENT_SECRET,
                    "https://developers.google.com/oauthplayground"
                );
                console.log("it works here at create transport");
                oauth2client.setCredentials({
                    refresh_token: process.env.REFRESH_TOKEN,
                });

                const accessToken = await oauth2client.getAccessToken();

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
            let emailTransporter = await createTransporter();
            return await emailTransporter.sendMail({
                subject: "Verfiy you Email!",
                to: emailAddress,
                from: process.env.EMAIL,
                html: `<h2> Hello ! thanks for registering on our site.</h2>
            <h4> Please verify your email to enjoy our services...</h4>
            `,
            });
        } catch (err) {
            console.log("SEND MAIL ERROR", err);
            return false;
        }
    }

    async registerPost(req, res, next) {
        try {
            console.log("req.body", this);
            const { username, email, password } = req.body;
            const hashedPass = await bcrypt.hash(password, 10);

            const newUser = await User.create({
                username: username,
                email: email,
                password: hashedPass,
            });
            newUser.save();
            console.log(newUser, this);
            this.sendMailController({ emailAddress: newUser.email });
            return res.redirect("/user/login");
        } catch (err) {
            console.log(err);
            return res.redirect("/user/register");
        }
    }

    async registerGet(req, res) {
        console.log("registerGet", this);
        return res.render("register");
    }

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
                    return res.redirect("/dashboard");
                } else {
                    console.log("Password does not match with our records");
                    return res.redirect("/");
                }
            }
        } catch (err) {
            console.log("error ->" + err);
            return res.redirect("/");
        }
    }

    async alreadyLoggedIn(req, res, next) {
        try {
            const token = req.cookies["login-cookie"];
            if (token) {
                const validateToken = jwt.verify(token, process.env.JWT_SECRET);
                if (validateToken) {
                    return res.redirect("/dashboard");
                } else {
                    return res.redirect("/user/login");
                }
            } else {
                next();
            }
        } catch (err) {
            console.log(err);
            return res.redirect("/");
        }
    }
}

module.exports = new UserControllers();