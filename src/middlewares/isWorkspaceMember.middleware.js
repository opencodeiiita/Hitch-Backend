const Channel = require("../models/channel.models");
const Workspace = require("../models/workspace.models");
const {
    response_403,
    response_500,
    response_404,
} = require("../utils/responseCodes.utils");

exports.ensureUserIsMember = async (req, res, next) => {
    try {
        const user = req.body.user;
        const workspace = await Workspace.findById(req.params.id);

        if (!workspace) {
            return response_404(res, "Workspace doesn't exist");
        }

        const isMember = await Channel.exists({
            workspace: workspace._id,
            members: { $in: [user._id] },
        });

        if (!isMember) {
            return response_403(res, "You are not authorized to perform this action");
        }

        req.body.workspace = workspace;
        next();

    } catch (err) {
        return response_500(res, "Error");
    }
};
