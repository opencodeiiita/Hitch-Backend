const SubChannel = require('../models/subChannel.models');

const {
    response_201,
    response_400,
    response_500
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
