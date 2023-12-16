import  Channel  from '../models/channel.models.js';
import Workspace from '../models/workspace.models.js';
import User from '../models/user.models.js';
import USER_ROLE from '../enums/userRoles.enums.js';
import { response_404, response_400, response_500 } from '../utils/responseCodes.utils.js';
export async function isChannelAdmin(req, res, next) {
    try {
        const userid = req.body.user;
        const user = await User.findById(userid._id);
        const channel = await Channel.findById(req.params.id);
        const workspace = await Workspace.findById(channel.workspace._id);

        if (!channel) {
            return response_404(res, 'Channel not found');
        }

        const isAdminChannel = user.channels.some((channel) => channel._id === req.params.id && channel.role === USER_ROLE.ADMIN);

        if (!isAdminChannel || workspace.createdBy !== userid._id) {
            return response_400(res, 'You are not an admin of this channel');
        }

        req.body.channel = channel;
        req.body.workspace = workspace;
        next();


    } catch (error) {
        return response_500(res, 'Internal Server error', error);
    }
}