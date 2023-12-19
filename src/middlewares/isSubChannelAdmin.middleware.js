const SubChannel = require('../models/subChannel.models.js');
const USER_ROLE = require('../enums/userRoles.enums.js');
const {response_403, response_404, response_500} = require('../utils/responseCodes.utils.js');

export async function isSubChannelAdmin(req, res, next) {
    try {
        const user = req.body.user;
        const subChannel = await SubChannel.findById(req.params.id).populate('channel').populate('channel.workspace');

        if (!subChannel) {
            return response_404(res, 'Subchannel not found');
        }

        const workspaceAdmin = (subChannel.channel.workspace.createdBy === user._id);
        const channelAdmin = user.channels.some((channel) => channel._id.toString() === req.params.id && channel.role === USER_ROLE.ADMIN);
        if(!workspaceAdmin || !channelAdmin) {
            return response_403(res, 'You are not authorized to perform this action');
        }

        req.subChannel = subChannel;
        req.channel = subChannel.channel;
        req.workspace = subChannel.channel.workspace;
        next();
    } catch (error) {
        return response_500(res, 'Internal Server error', error);
    }
}