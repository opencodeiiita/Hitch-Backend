const mongoose = require('mongoose');

const WorkspaceSchema = new mongoose.Schema({
    __created: {
        type: Date,
        default: Date.now,
    },
    name: {
        type: String,
        required: [true, 'Name is required for workspace'],
        validate: {
            validator: function (v) {
                return /^[a-zA-Z ]+$/.test(v);
            },
            message: (name) => `${name.value} is not a valid name for a workspace!`,
        },
    },
    description: {
        type: String,
    },
    createdBy: {
        type: mongoose.Schema.ObjectId,
        ref: 'users',
        required: [true, 'Workspace must belong to a user'],
    },
    channels: [
        {
            type: mongoose.Schema.ObjectId,
            ref: 'channels',
        },
    ],
});

module.exports = mongoose.model('workspaces', WorkspaceSchema);