const mongoose = require("mongoose");

const ChatRoomSchema = new mongoose.Schema({
    __created: {
        type: Date,
        default: Date.now,
    },

    isGroupChat: {
        type: Boolean,
        default: true,
    },

    messages: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "messages",
        },
    ],

    latestMessage: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "messages",
    },

});

module.exports = mongoose.model("chatrooms", ChatRoomSchema);