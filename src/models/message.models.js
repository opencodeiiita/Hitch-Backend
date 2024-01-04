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
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
    },
    subChannel: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "chatrooms",
    },
});

module.exports = mongoose.model("messages", MessageSchema);