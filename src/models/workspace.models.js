const mongoose = require("mongoose");

const WorkspaceSchema = new mongoose.Schema({
    __created: {
        type: Date,
        default: Date.now,
    },
    name: {
        type: String,
        required: [true, "Name is required for workspace"],
        validate: {
            validator: function (v) {
                return /^[a-zA-Z ]+$/.test(v);
            },
            message: (name) =>
                `${name.value} is not a valid name for a workspace!`,
        },
    },
    workspaceId: {
        type: String,
        required: [true, "Workspace Id is required"],
        unique: [true, "Workspace Id already exist"],
        validate: {
            validator: function (v) {
                return /^[a-zA-Z0-9]+$/.test(v); // Alphanumeric characters only
            },
            message: (workspaceId) =>
                `${workspaceId.value} is not a valid workspaceId!`,
        },
    },
    description: {
        type: String,
    },
    createdBy: {
        type: mongoose.Schema.ObjectId,
        ref: "users",
        required: [true, "Workspace must belong to a user"],
    },
    channels: [
        {
            type: mongoose.Schema.ObjectId,
            ref: "channels",
        },
    ],
});

module.exports = mongoose.model("workspaces", WorkspaceSchema);
