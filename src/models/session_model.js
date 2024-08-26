const mongoose = require("mongoose");

const sessionSchema = new mongoose.Schema({
    sessionData: {
        type: Object,
        required: true,
    },
});

module.exports = mongoose.model('Session', sessionSchema);