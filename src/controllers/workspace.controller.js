const Workspace = require('../models/workspace.models');
const {
    response_200,
    response_201,
    response_400,
    response_403,
    response_500
} = require('../utils/responseCodes.utils')

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

        if (!name || !description || !workspaceId || !userId || !req.params.id) {
            return response_400(res, "Invalid Request: Missing required fields")
        }

        let workspace = await Workspace.findById(req.params.id);
        if (!workspace) {
            return response_400(res, "Invalid Request: Workspace not found")
        }
        if (workspace.createdBy !== userId) {
            return response_403(res, "Invalid Request: User not authorized to update workspace")
        }

        const workspaceIDExists = await Workspace.findOne({workspaceId: workspaceId}).exec();
        if (workspaceIDExists) {
            return response_400(res, "Invalid Request: workspaceId already in use")
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

exports.deleteWorkspace = async (req, res) => {
    try {
        if (!req.body.userId || !req.params.id) {
            return response_400(res, "Invalid Request: Missing required fields")
        }

        const workspace = await Workspace.findById(req.params.id);
        if (!workspace) {
            return response_400(res, "Invalid Request: Workspace not found")
        }
        if (workspace.createdBy !== req.body.userId) {
            return response_403(res, "Invalid Request: User not authorized to delete workspace")
        }

        await Workspace.findByIdAndDelete(req.params.id);

        return response_200(res, 'Workspace Deleted Successfully')
    } catch (err) {
        return response_500(res, "Error deleting workspace", err)
    }
}