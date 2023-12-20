const Workspace = require("../models/workspace.models");
const {
    response_403,
    response_500,
    response_404,
} = require("../utils/responseCodes.utils");

exports.isWorkspaceAdmin = async (req, res, next) => {
    try {
        const user = req.body.user;
        const workspace = await Workspace.findById(req.params.id);

        if (!workspace) {
            return response_404(res, "Workspace doesn't exist");
        }

        if (user._id.toString() != workspace.createdBy.toString()) {
            return response_403(
                res,
                "You are not authorized to perform this action"
            );
        }

        req.body.workspace = workspace;
        next();
    } catch (err) {
        return response_500(res, "Error");
    }
};
