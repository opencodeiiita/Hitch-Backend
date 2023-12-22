const Channel = require('../models/channel.models.js');
const USER_ROLE = require('../enums/userRoles.enums.js');
const {response_403, response_404, response_500} = require('../utils/responseCodes.utils.js');

exports.isChannelAdmin = async (req, res, next) => {
    try {
        const user = req.body.user;
        const channel = await Channel.findById(req.params.id).populate('workspace');

        if (!channel) {
            return response_404(res, 'Channel not found');
        }

        const isAdminChannel = user.channels.some((channel) => channel.channel._id.toString() === req.params.id && channel.role == USER_ROLE.ADMIN);

        if (!isAdminChannel || !channel.workspace.createdBy.equals(user._id )) {
            return response_403(res, 'You are not authorized to perform this action');
        }

        console.log(channel);
        req.body.channel = channel;
        req.body.workspace = channel.workspace;
        next();


    } catch (error) {
        return response_500(res, 'Internal Server error', error);
    }
}