const Channel = require('../models/channel.models');

const {
    response_200,
    response_201,
    response_400,
    response_500
} = require('../utils/responseCodes.utils');

exports.createChannel = async (req,res) => {
    try {
        const {type, description, name} = req.body;
        if(!type || !description || !name || !req.workspace._id)
        {
            return response_400(res, "Invalid input! Please send all the required properties to create the channel");
        }

        const channel = new Channel({...req.body,workspace:req.workspace._id});
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

        channel = await Channel.findByIdAndUpdate(req.body.channel._id, {
            name: name,
            description: description,
        });

        return response_200(res, 'Channel Updated Successfully', {
            name: channel.name,
            description: channel.description,
            workspaceId: channel.workspaceId,
            id: channel._id,
        })
    } catch (err) {
        return response_500(res, "Error updating channel", err)
    }
}
