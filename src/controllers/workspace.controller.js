const Workspace = require("../models/workspace.models");
const Channel = require("../models/channel.models.js");
const {
    response_200,
    response_201,
    response_400,
    response_403,
    response_500,
} = require("../utils/responseCodes.utils");

exports.createWorkspace = async (req, res) => {
    try {
        const { name, description, workspaceId, user } = req.body;
        if (!name || !description || !workspaceId) {
            return response_400(
                res,
                "Invalid Request: Missing required fields"
            );
        }

        const workspaceIdExists = await Workspace.findOne({
            workspaceId: workspaceId,
        }).exec();
        if (workspaceIdExists) {
            return response_400(
                res,
                "Invalid Request: workspaceId already in use"
            );
        }

        const workspace = new Workspace({
            name: name,
            description: description,
            workspaceId: workspaceId,
            createdBy: user._id,
        });

        const savedWorkspace = await workspace.save();
        const DefaultChannel = new Channel({
            name: "General",
            workspace: workspace._id.toString(),
            createdBy: user._id,
        });
        const savedChannel = await DefaultChannel.save();
        const updatedWorkspace = await Workspace.findByIdAndUpdate(
            workspace._id,
            {
                $push: { channels: savedChannel._id },
            }
        );

        return response_201(res, "Workspace created successfully", {
            name: savedWorkspace.name,
            description: savedWorkspace.description,
            workspaceId: savedWorkspace.workspaceId,
            id: savedWorkspace._id,
        });
    } catch (err) {
        return response_500(res, "Error creating workspace", err);
    }
};

exports.updateWorkspace = async (req, res) => {
    try {
        const { name, description, workspaceId } = req.body;

        if (!name && !description && !workspaceId) {
            return response_400(res, "Invalid Request: No field to update");
        }

        const workspaceIdExists = await Workspace.findOne({
            workspaceId: workspaceId,
        }).exec();

        if (workspaceIdExists) {
            return response_400(
                res,
                "Invalid Request: workspaceId already in use"
            );
        }

        const workspace = await Workspace.findByIdAndUpdate(
            req.body.workspace._id,
            {
                name: name,
                description: description,
                workspaceId: workspaceId,
            }
        );

        return response_200(res, "Workspace Updated Successfully", {
            name: workspace.name,
            description: workspace.description,
            workspaceId: workspace.workspaceId,
            id: workspace._id,
        });
    } catch (err) {
        return response_500(res, "Error updating workspace", err);
    }
};

exports.deleteWorkspace = async (req, res) => {
    try {
        await Workspace.findByIdAndDelete(req.body.workspace._id);
        return response_200(res, "Workspace Deleted Successfully");
    } catch (err) {
        return response_500(res, "Error deleting workspace", err);
    }
};

exports.getWorkspace = async (req, res) => {
    try {
        const userId = req.body.user._id;

        // Find channels where user is the creator
        const channelsAdmin = await Channel.find({ createdBy: userId }).exec();

        // Find channels where user is a member
        const channelsMember = await Channel.find({
            members: { $elemMatch: { user: userId } },
        }).exec();

        // Combine both sets of channels
        const channels = [...channelsAdmin, ...channelsMember];

        // Extract unique workspace ids
        const uniqueWorkspaceIds = [...new Set(channels.map(channel => channel.workspace))];

        // Fetch workspace details for each unique workspace id
        const workspaces = await Promise.all(uniqueWorkspaceIds.map(async (workspaceId) => {
            const workspaceDetails = await Workspace.findById(workspaceId).populate('channels');
            return workspaceDetails;
        }));

        // Map workspace details to required format
        const requiredWorkspaces = workspaces.map(workspace => ({
            name: workspace.name,
            description: workspace.description,
            workspaceId: workspace._id, // Corrected to use _id
            id: workspace._id, // Using _id for consistency
            channels: workspace.channels.map(channel => ({
                name: channel.name,
                description: channel.description,
                id: channel._id, // Using _id for consistency
            })),
        }));

        return response_200(
            res,
            "Workspaces fetched successfully",
            requiredWorkspaces
        );
    } catch (err) {
        return response_500(res, "Error getting workspaces", err);
    }
};