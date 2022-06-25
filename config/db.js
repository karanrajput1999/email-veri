const mongoose = require("mongoose");

const db_Connect = mongoose
    .connect(process.env.DB_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log("Database bhi connect ho gya ji !");
    });

module.exports = db_Connect;
