const Channel = require('../models/channel.model');

const {
    response_200,
    response_400,
    response_500
} = require('../utils/responseCodes.utils');

exports.createChannel = async (req,res) => {
    try {
        const {type, description, name} = req.body;
        if(!type || !description || !name || !req.params)
        {
            return response_400(res, "Invalid input! Please send all the required properties to create the channel");
        }

        const channel = new Channel({...req.body,workspace:req.params});
        const newChannel = await channel.save();

        return response_200(res,"Channel Created Successfully",{
            name: newChannel.name,
            description: newChannel.description,
            workspaceId: newChannel.workspaceId,
            id: newChannel._id,
        })
    }
    catch(error)
    {
        return response_500(res, "Error creating channel", error);
    }
}