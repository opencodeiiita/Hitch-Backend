import  Channel  from '../models/channel.models.js';
import USER_ROLE from '../enums/userRoles.enums.js';
import { response_404, response_403, response_500 } from '../utils/responseCodes.utils.js';
export async function isChannelAdmin(req, res, next) {
    try {
        const user = req.body.user;
        const channel = await Channel.findById(req.params.id).populate('workspace');

        if (!channel) {
            return response_404(res, 'Channel not found');
        }

        const isAdminChannel = user.channels.some((channel) => channel._id.toString() === req.params.id && channel.role === USER_ROLE.ADMIN);

        if (!isAdminChannel || channel.workspace.createdBy !== user._id ) {
            return response_403(res, 'You are not authorized to perform this action');
        }

        req.body.channel = channel;
        req.body.workspace = channel.workspace;
        next();


    } catch (error) {
        return response_500(res, 'Internal Server error', error);
    }
}