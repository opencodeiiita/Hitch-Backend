const Channel = require("../models/channel.models");
const Workspace = require("../models/workspace.models");
const {
    response_403,
    response_500,
    response_404,
} = require("../utils/responseCodes.utils");

exports.isWorkspaceMember = async (req, res, next) => {
    try {
        const user = req.body.user;
        const workspace = await Workspace.findById(req.params.id);

        if (!workspace) {
            return response_404(res, "Workspace doesn't exist");
        }

        if (user._id == workspace.createdBy) {
            req.body.workspace = workspace;
            next();
        }

        let isMember = false;
        const channels = workspace.channels;
        for (const channelId of channels) {
            const channel = await Channel.findById(channelId);
            if (channel.members.some(memberId => memberId === user._id)) {
                isMember = true;
                break;
            }
        }

        if (!isMember) {
            return response_403(res, "You are not authorized to perform this action");
        }

        req.body.workspace = workspace;
        next();

    } catch (err) {
        return response_500(res, "Error");
    }
};
