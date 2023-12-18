const subChannelModels = require('../models/subChannel.models');
const SubChannel = require('../models/subChannel.models');
const {
    response_201,
    response_400,
    response_500,
    response_200
} = require('../utils/responseCodes.utils');

exports.createSubChannel = async (req, res) => {
    try {
        const { name, description } = req.body;
        const  channelId = req.channel._id;

        if (!name || !description) {
            return response_400(res, "Please provide name or description")
        }

        const subchannel = new SubChannel({
            name: name,
            description: description,
            channel: channelId,
        }).save();
        return response_201(res, "SubChannel Created Successfully", {
            name: newSubChannel.name,
            description: newSubChannel.description,
            id: newSubChannel._id,
        })
    } catch (error) {
        return response_500(res, "Error creating subchannel", error);
    }
}

exports.updateSubChannel = async (req, res) => {
    try {
        const {name, description} = req.body;
        // assuming req.subChannel will contain the subChannel object

        if (!name && !description) {
            return response_400(res, "Please provide name or description")
        }

        const updatedSubChannel = await SubChannel.findByIdAndUpdate(req.subChannel._id, {
            name: name,
            description: description,
        });

        return response_200(res, 'Sub-Channel Updated Successfully', {
            name: updatedSubChannel.name,
            description: updatedSubChannel.description,
            id: updatedSubChannel._id,
        })
    } catch (err) {
        return response_500(res, "Error updating the subChannel", err)
    }
}

exports.deleteSubChannel = async (req, res) => {
    try {
        const SubChannelId = req.SubChannel._id;
        await SubChannel.findByIdAndDelete(SubChannelId);

        return response_200(res, 'Sub-Channel Deleted Successfully')
    } catch (err) {
        return response_500(res, "Error deleting subChannel", err)
    }
}