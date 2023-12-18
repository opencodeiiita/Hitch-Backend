const Channel = require('../models/channel.models');
const Workspace = require('../models/workspace.models');
const User = require('../models/user.models');

const {
    response_200,
    response_201,
    response_400,
    response_500,
    response_204
} = require('../utils/responseCodes.utils');

exports.createChannel = async (req,res) => {
    try {
        const {type, description, name} = req.body;
        if(!type || !description || !name || !req.workspace._id)
        {
            return response_400(res, "Invalid input! Please send all the required properties to create the channel");
        }

        const channel = new Channel({ ...req.body, workspace: req.workspace._id });       // bug!
        // Needed to add the channel to the workspace's channels array

        const newChannel = await channel.save();

        return response_201(res,"Channel Created Successfully",{
            createdBy:req.user._id,
            name: newChannel.name,
            description: newChannel.description,
            workspaceId: req.workspace.workspaceId,
            id: newChannel._id,
        })
    }
    catch(error)
    {
        return response_500(res, "Error creating channel", error);
    }
}

exports.updateChannel = async (req, res) => {
    try {
        const {name, description} = req.body;


        if (!name && !description) {
            return response_400(res, "Please provide name or description")
        }

        const channel = await Channel.findByIdAndUpdate(req.body.channel._id, {
            name: name,
            description: description,
        });

        return response_200(res, 'Channel Updated Successfully', {
            name: channel.name,
            description: channel.description,
            workspaceId: req.workspace.workspaceId,
            id: channel._id,
        })
    } catch (err) {
        return response_500(res, "Error updating channel", err)
    }
}

exports.deleteChannel = async (req, res) => {
    try {
        const channelId = req.body.channel._id;
        await Channel.findByIdAndDelete(channelId);

        return response_200(res, 'Channel Deleted Successfully')
    } catch (err) {
        return response_500(res, "Error deleting channel", err)
    }
}

exports.getChannels = async (req, res)=>{
    try{
        const workspace = req.workspace;
    
        const data = await Promise.all(workspace.channels.map(async (channelId) => { 
            const channel = await Channel.findById(channelId);
            return {
                id: channel._id,
                name: channel.name,
                description: channel.description,
                workspaceId: workspace.workspaceId,
            }
        }));
        

        return response_200(res, "Channels Found",data);
    }   
    catch(err)
    {
        return response_500(res, "Error fetching channels", err);
    }
}

exports.AddUserToChannel = async (req, res) => {
    try {
        const{
            user,
            channel,
            workspace
        } = req.body;

        if(!user || !channel || !workspace)
        {
            return response_400(res, "Please provide all the required properties");
        }

        if(channel.members.includes(user._id))
        {
            return response_400(res, "User already a member of the channel");
        }

        if(channel.workspace!==workspace._id)
        {
            return response_400(res, "Channel does not belong to the workspace");
        }

        channel.members.push(user._id);
        user.channels.push({channel: channel._id, role: 'NORMAL_USER'});

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
        });


    }
    catch(err)
    {
        return response_500(res, "Error removing user from channel", err);
    }
}