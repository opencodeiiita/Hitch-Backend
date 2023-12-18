const SubChannel = require('../models/subChannel.models.js');
const {response_403, response_404, response_500} = require('../utils/responseCodes.utils.js');

export async function isSubChannelMember(req, res, next) {
    try {
        const userId = req.body.user._id;
        const subChannelId = parseInt(req.params.id);
        const subChannel = await SubChannel.findById(subChannelId).populate('channel').populate('channel.workspace');
        if(!subChannel) {
            return response_404(res, 'SubChannel not found');
        }

        const channelMember = subChannel.channel.members.find(member => member._id === userId);
        const workspaceAdmin = subChannel.channel.workspace.createdBy === userId;
        if(!channelMember && !workspaceAdmin) {
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
