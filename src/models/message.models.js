const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema({
    __created: {
        type: Date,
        default: Date.now,
    },
    text: {
        type: String,
    },
    images: [
        {
            type: String,
        },
    ],
    files: [
        {
            type: String,
        },
    ],
    videos: [
        {
            type: String,
        },
    ],
});

module.exports = mongoose.model("messages", MessageSchema);