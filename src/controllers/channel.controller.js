const Channel = require('../models/channel.model');

const {
    response_201,
    response_400,
    response_403,
    response_500
} = require('../utils/responseCodes.utils')


exports.updateChannel = async (req, res) => {
    try {
        const {name, description, userId} = req.body;

        if (!name || !description || !userId || !req.params.id) {
            return response_400(res, "Invalid Request: Missing required fields")
        }

        let channel = await Channel.findById(req.params.id);
        if (!channel) {
            return response_400(res, "Invalid Request: Channel not found")
        }
        if (channel.createdBy !== userId) {
            return response_403(res, "Invalid Request: User not authorized to update channel")
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