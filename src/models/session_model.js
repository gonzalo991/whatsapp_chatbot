const mongoose = require("mongoose");
const { Schema } = mongoose;

const sessionSchema = new Schema({
    sessionData: {
        type: Object,
        required: true,
    },
});

module.exports = mongoose.model('Session', sessionSchema);