const Workspace = require('../models/workspace.models');
const {response_201, response_500} = require('../utils/responseCodes.utils')

exports.createWorkspace = async (req, res) => {
    const workspace = new Workspace({
        name: req.body.name,
        description: req.body.description,
        workspaceId: req.body.workspaceId,
        createdBy: req.body.userId,
    });

    try {
        const savedWorkspace = await workspace.save();
        return response_201(res, 'Workspace created successfully', {
            name: savedWorkspace.name,
            description: savedWorkspace.description,
            workspaceId: savedWorkspace.workspaceId,
            id: savedWorkspace._id,
        })
    } catch (err) {
        return response_500(res, "Error creating workspace", err)
    }
}