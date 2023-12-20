const Channel = require("../models/channel.models");
const Workspace = require("../models/workspace.models");
const User = require("../models/user.models");
const USER_ROLE = require("../enums/userRoles.enums");

const {
    response_200,
    response_201,
    response_400,
    response_500,
} = require("../utils/responseCodes.utils");

exports.createChannel = async (req, res) => {
    try {
        const { type, description, name, user, workspace } = req.body;
        if (!type || !description || !name || !req.workspace._id) {
            return response_400(
                res,
                "Invalid input! Please send all the required properties to create the channel"
            );
        }

        const channel = new Channel({
            type,
            description,
            name,
            workspace: workspace._id,
            createdBy: user._id,
        });

        const savedChannel = await channel.save();

        const updatedWorkspace = await Workspace.findByIdAndUpdate(
            workspace._id,
            {
                $push: { channels: savedChannel._id },
            }
        );

        return response_201(res, "Channel Created Successfully", {
            createdBy: req.user._id,
            name: savedChannel.name,
            description: savedChannel.description,
            id: savedChannel._id,
        });
    } catch (error) {
        return response_500(res, "Error creating channel", error);
    }
};

exports.updateChannel = async (req, res) => {
    try {
        const { name, description } = req.body;

        if (!name && !description) {
            return response_400(res, "Please provide name or description");
        }

        const channel = await Channel.findByIdAndUpdate(req.body.channel._id, {
            name: name,
            description: description,
        });

        return response_200(res, "Channel Updated Successfully", {
            name: channel.name,
            description: channel.description,
            workspaceId: req.workspace.workspaceId,
            id: channel._id,
        });
    } catch (err) {
        return response_500(res, "Error updating channel", err);
    }
};

exports.deleteChannel = async (req, res) => {
    try {
        const channelId = req.body.channel._id;
        await Channel.findByIdAndDelete(channelId);

        return response_200(res, "Channel Deleted Successfully");
    } catch (err) {
        return response_500(res, "Error deleting channel", err);
    }
};

exports.getChannels = async (req, res) => {
    try {
        const workspace = req.body.workspace;

        const data = await Promise.all(
            workspace.channels.map(async (channelId) => {
                const channel = await Channel.findById(channelId);
                return {
                    id: channel._id,
                    name: channel.name,
                    description: channel.description,
                    workspaceId: workspace.workspaceId,
                };
            })
        );

        return response_200(res, "Channels Found", data);
    } catch (err) {
        return response_500(res, "Error fetching channels", err);
    }
};

exports.AddUserToChannel = async (req, res) => {
    try {
        const { user, channel, workspace } = req.body;

        if (channel.members.includes(user._id)) {
            return response_400(res, "User already a member of the channel");
        }

        channel.members.push(user._id);
        user.channels.push({
            channel: channel._id,
            role: USER_ROLE.NORMAL_USER,
        });

        await User.findByIdAndUpdate(
            user._id,
            { channels: user.channels },
            { new: true }
        );

        await Channel.findByIdAndUpdate(
            channel._id,
            { members: channel.members },
            { new: true }
        );

        return response_200(res, "User Added to Channel Successfully", {
            name: channel.name,
            description: channel.description,
            workspaceId: workspace._id,
            id: channel._id,
            channel,
            user,
        });
    } catch (err) {
        return response_500(res, "Error removing user from channel", err);
    }
};

exports.removeUserFromChannel = async (req, res) => {
    try {
        const { channel } = req.body;
        const userToBeRemovedId = req.body.userId;

        if (!channel.members.includes(userToBeRemovedId)) {
            return response_400(res, "User is not a part of the channel");
        }

        const userToBeRemoved = await User.findById(userToBeRemovedId);

        const filteredChannel = channel.members.filter(
            (user) => user !== userToBeRemovedId
        );
        const filteredUser = userToBeRemoved.channels.filter(
            ({ channel }) => channel !== channel._id
        );

        const updatedChannel = await Channel.findByIdAndUpdate(channel._id, {
            members: filteredChannel,
        });
        const updatedUser = await User.findByIdAndUpdate(userToBeRemovedId, {
            channels: filteredUser,
        });

        return response_200(res, "User Removed from Channel Successfully");
    } catch (error) {
        return response_500(res, "Error removing user from channel", error);
    }
};

exports.getUsers = async (req, res) => {
    try {
        const ChannelId = req.channel._id;
        const channel = await Channel.findById(ChannelId).populate("members");
        const users = channel.members;
        function selectFewerProps(x) {
            const { username, email, name, _id } = x;
            return { username, email, name, _id };
        }
        const newUsers = users.map(selectFewerProps);
        return response_200(res, "Users Found", newUsers);
    } catch (err) {
        return response_500(res, "Error finding users", err);
    }
};

exports.createDefaultChannel = async(req,res)=>{
    try{
        const { name, description, workspaceId, user} = req.body;
        const defChannel = new Channel({
            name:"General",
            workspace: workspaceId,
            createdBy: user._id,
        })
        const savedChannel = await defChannel.save();

        const updatedWorkspace = await Workspace.findByIdAndUpdate(
            workspace._id,
            {
                $push: { channels: savedChannel._id },
            }
        );
    }catch(err){
        return response_500(res,"Error creating default Channel",err);
    }
}