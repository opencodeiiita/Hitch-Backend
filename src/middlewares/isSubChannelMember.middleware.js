const SubChannel = require('../models/subChannel.models.js');
const Workspace = require('../models/workspace.models.js');
const Channel = require('../models/channel.models.js');

const {response_403, response_404, response_500} = require('../utils/responseCodes.utils.js');

exports.isSubChannelMember= async(req, res, next)=>{
    try {
        const userId = req.body.user._id;
        const subChannelId = req.params.id;
        const subChannel = await SubChannel.findById(subChannelId).populate('channel');

        console.log(userId)
        const workSpace = await Workspace.findById(subChannel.channel.workspace);
        const workspace = await Channel.findById(subChannel.channel._id).populate('workspace');
        if(!subChannel) {
            return response_404(res, 'SubChannel not found');
        }

        const channelMember = subChannel.channel.members.find(member => member._id === userId);

        const channelAdmin = subChannel.channel.createdBy.equals(userId);
        const workspaceAdmin = workspace.createdBy.equals(userId);
        if(!channelMember && !workspaceAdmin && !channelAdmin) {
            return response_403(res, 'You are not authorized to perform this action');
        }
        console.log(subChannel.channel)
        req.subChannel = subChannel;
        req.channel = subChannel.channel;
        req.workspace = subChannel.channel.workspace;
        next();
    } catch (error) {
        return response_500(res, 'Internal Server error', error);
    }
}
