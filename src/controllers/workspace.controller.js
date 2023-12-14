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

exports.updateWorkspace = async (req, res) => {
    try {
        const {name, description, workspaceId, userId} = req.body;

        if (!name || !description || !workspaceId || !userId) {
            return response_500(res, "Invalid Request: Missing required fields")
        }

        const workspace = await Workspace.findById(req.params.id);
        if (!workspace) {
            return response_500(res, "Invalid Request: Workspace not found")
        }

        if (workspace.createdBy !== userId) {
            return response_500(res, "Invalid Request: User not authorized to update workspace")
        }

        const workspaceIDExists = await Workspace.findOne({workspaceId: workspaceId}).exec();
        if (workspaceIDExists) {
            return response_500(res, "Invalid Request: workspaceId already in use")
        }

        workspace = await Workspace.findByIdAndUpdate(req.params.id, {
            name: name,
            description: description,
            workspaceId: workspaceId,
        });

        return response_201(res, 'Workspace Updated Successfully', {
            name: workspace.name,
            description: workspace.description,
            workspaceId: workspace.workspaceId,
            id: workspace._id,
        })
    } catch (err) {
        return response_500(res, "Error updating workspace", err)
    }
}