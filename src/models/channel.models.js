const mongoose = require("mongoose");
const CHANNEL_TYPE = require("../enums/channelType.enums");

const ChannelSchema = new mongoose.Schema({
    __created: {
        type: Date,
        default: Date.now,
    },
    // the workspace to which the channel belongs
    workspace: {
        type: mongoose.Schema.ObjectId,
        ref: "workspaces",
        required: [true, "Channel must belong to a workspace"],
    },
    // name of the channel should be unique in the workspace
    name: {
        type: String,
        required: [true, "Name is required for channel"],
        validate: {
            validator: function (v) {
                return /^[a-zA-Z ]+$/.test(v);
            },
            message: (name) =>
                `${name.value} is not a valid name for a channel!`,
        },
    },
    description: {
        type: String,
    },
    type: {
        type: String,
        enum: CHANNEL_TYPE,
        default: CHANNEL_TYPE.PUBLIC,
    },
    createdBy: {
        type: mongoose.Schema.ObjectId,
        ref: "users",
        required: [true, "Channel must belong to a user"],
    },
    // store the members of the channel.
    members: [
        {
            type: mongoose.Schema.ObjectId,
            ref: "users",
        },
    ],
    subChannels: [
        {
            type: mongoose.Schema.ObjectId,
            ref: "chatrooms",
        },
    ],
});

module.exports = mongoose.model("channels", ChannelSchema);
