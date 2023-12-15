const Channel = require('../models/channel.model');

const {
    response_201,
    response_500
} = require('../utils/responseCodes.utils')


exports.updateChannel = async (req, res) => {
    try {
        const {name, description} = req.body;

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