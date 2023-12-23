const SubChannel = require('../models/subChannel.models.js');
const Workspace = require("../models/workspace.models");
const USER_ROLE = require('../enums/userRoles.enums.js');
const {response_403, response_404, response_500} = require('../utils/responseCodes.utils.js');

exports.isSubChannelAdmin = async (req, res, next) => {
    try {
        const user = req.body.user;
        const subChannel = await SubChannel.findById(req.params.id).populate('channel').populate('channel.workspace');

        if (!subChannel) {
            return response_404(res, 'Subchannel not found');
        }
   
        const currentWorkspace = await Workspace.findById(subChannel.channel.workspace._id);  
        const workspaceAdmin = currentWorkspace.createdBy.equals(user._id);
     
    
        const channelAdmin = user.channels.some((channel) => channel.channel._id.equals(subChannel.channel._id) && channel.role === USER_ROLE.ADMIN);
        console.log(channelAdmin)
       
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