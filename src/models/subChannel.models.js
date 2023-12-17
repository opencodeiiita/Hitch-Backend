const mongoose = require("mongoose");

const SubChannelSchema = new mongoose.Schema({
    __created: {
        type: Date,
        default: Date.now,
    },
    // the chennel to which the SubChannel belongs
    channel: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "channels",
        required: [true, "SubChannel must belong to a channel"],
    },
    // name of the SubChannel should be unique in the channel
    name: {
        type: String,
        required: [true, "Name is required for SubChannel"],
        validate: {
            validator: function (v) {
                return /^[a-zA-Z ]+$/.test(v);
            },
            message: (name) =>
                `${name.value} is not a valid name for a SubChannel!`,
        },
    },

    description: {
        type: String,
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

module.exports = mongoose.model("subchannels", SubChannelSchema);
