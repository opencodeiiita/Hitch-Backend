const mongoose = require("mongoose");

const HuddleSchema = new mongoose.Schema({
    __created: {
        type: Date,
        default: Date.now,
    },

    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
    },
    
    description: {
        type: String,
    },

    chatRoom: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "chatrooms",
    },

    scheduledAt: {
        type: Date,
    },

    startTime: {
        type: Date,
    },

    endTime: {
        type: Date,
    },
});

module.exports = mongoose.model("huddles", HuddleSchema);
