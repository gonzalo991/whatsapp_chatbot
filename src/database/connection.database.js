const mongoose = require("mongoose");
require("dotenv").config();

const DB_URI = process.env.MONGO_DB_URI;

mongoose.connect(DB_URI).then(() => {
    console.log("DB connection successful");
}).catch(err => {
    console.error(`Database connection failed: `, err);
});

module.exports = mongoose;