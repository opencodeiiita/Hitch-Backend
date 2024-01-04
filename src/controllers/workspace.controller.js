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
        const channelsAdmin = await Channel.find({ createdBy: userId }).exec();
        // get all the channels in which user is present in channel members array
        const channelsMember = await Channel.find({
            members: { $elemMatch: { user: userId } },
        }).exec();

        const workspace = [];
        for (let channel of channelsAdmin) {
            const workspaceId = channel.workspace;
            const workspaceDetails =
                await Workspace.findById(workspaceId).populate("channels");
            workspace.push(workspaceDetails);
        }

        for (let channel of channelsMember) {
            const workspaceId = channel.workspace;
            const workspaceDetails =
                await Workspace.findById(workspaceId).populate("channels");
            workspace.push(workspaceDetails);
        }

        // remove duplicate workspaces
        const uniqueWorkspaces = Array.from(
            new Set(workspace.map((a) => a._id))
        ).map((_id) => {
            return workspace.find((a) => a._id === _id);
        });
        // Get required fields from workspace
        const requiredWorkspaces = uniqueWorkspaces.map((workspace) => {
            return {
                name: workspace.name,
                description: workspace.description,
                workspaceId: workspace.workspaceId,
                id: workspace._id,
                channels: workspace.channels.map((channel) => {
                    return {
                        name: channel.name,
                        description: channel.description,
                        id: channel._id,
                    };
                }),
            };
        });
        return response_200(
            res,
            "Workspace fetched successfully",
            requiredWorkspaces
        );
    } catch (err) {
        return response_500(res, "Error getting workspace", err);
    }
};
