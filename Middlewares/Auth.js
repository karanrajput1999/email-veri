const jwt = require("jsonwebtoken");
const cookie = require("cookie-parser");

class Auth {
    async authenticateUser(req, res, next) {
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
            res.redirect("/user/login");
        }
    };

    async alreadyLoggedIn(req, res, next) {
        try {
            const token = req.cookies["login-cookie"];
            if (token) {
                const validateToken = jwt.verify(token, process.env.JWT_SECRET);
                if (validateToken) {
                    res.redirect("/dashboard");
                } else {
                    res.redirect("/user/login");
                }
            } else {
                next();
            }
        } catch (err) {
            console.log(err);
        }
    }
}
module.exports = new Auth();
