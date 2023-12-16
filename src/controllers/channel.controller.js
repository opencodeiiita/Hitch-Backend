const Channel = require('../models/channel.model');

const {
    response_200,
    response_400,
    response_500
} = require('../utils/responseCodes.utils')


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
