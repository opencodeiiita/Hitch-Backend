const SubChannel = require('../models/subChannel.models.js');
const Workspace = require('../models/workspace.models.js');

const {response_403, response_404, response_500} = require('../utils/responseCodes.utils.js');

exports.isSubChannelMember= async(req, res, next)=>{
    try {
        const userId = req.body.user._id;
        const subChannelId = req.params.id;
        const subChannel = await SubChannel.findById(subChannelId).populate('channel');
        console.log(userId)
        const workSpace = await Workspace.findById(subChannel.channel.workspace);
        if(!subChannel) {
            return response_404(res, 'SubChannel not found');
        }

        const channelMember = subChannel.channel.members.find(member => member._id === userId);
        const workspaceAdmin = subChannel.channel.createdBy.equals(userId);
        console.log(subChannel.channel.members)
        if(!channelMember && !workspaceAdmin) {
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
