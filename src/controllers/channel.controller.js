const Channel = require('../models/channel.model');

const {
    response_201,
    response_400,
    response_500
} = require('../utils/responseCodes.utils')


exports.updateChannel = async (req, res) => {
    try {
        const {name, description} = req.body;

        if (!name || !description || !req.params.id) {
            return response_400(res, "Invalid Request: Missing required fields")
        }

        channel = await Channel.findByIdAndUpdate(req.params.id, {
            name: name,
            description: description,
        });

        return response_201(res, 'Channel Updated Successfully', {
            name: channel.name,
            description: channel.description,
            workspaceId: channel.workspaceId,
            id: channel._id,
        })
    } catch (err) {
        return response_500(res, "Error updating channel", err)
    }
}