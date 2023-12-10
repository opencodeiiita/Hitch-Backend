const mongoose = require("mongoose");

const USER_ROLE = require("../enums/userRoles.enums");

const ChannelSchema = new mongoose.Schema({
    __created: {
        type: Date,
        default: Date.now,
    },
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
    createdBy: {
        type: mongoose.Schema.ObjectId,
        ref: "users",
        required: [true, "Channel must belong to a user"],
    },
    // store the members of the channel withh there role
    members: [
        {
            user: {
                type: mongoose.Schema.ObjectId,
                ref: "users",
            },
            role: {
                type: String,
                enum: USER_ROLE,
                default: USER_ROLE.NORMAL_USER,
            },
        },
    ],
    chatRooms: [
        {
            type: mongoose.Schema.ObjectId,
            ref: "chatrooms",
        },
    ],
});

module.exports = mongoose.model("channels", ChannelSchema);
