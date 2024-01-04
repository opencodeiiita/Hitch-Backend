const Message = require("../models/message.models");
const SubChannel = require("../models/subChannel.models");
const {response_500, response_400, response_200} = require("../utils/responseCodes.utils");


exports.sendMessage = async (req, res) => {
    try {
        const {message, attachments, user} = req.body;
        const subChannelId = req.body.subchannel.id;

        if (!message || !attachments) {
            return response_400(res, "Missing required fields");
        }

        const subChannel = await SubChannel.findById(subChannelId);

        const newMessage = new Message({
            message,
            files: attachments.map((file) => file.file.toString()),
            createdBy: user._id.toString(),
            subChannel: subChannelId,
        })

        const savedMessage = await newMessage.save();

        const updatedSubChannel = await SubChannel.findByIdAndUpdate(
            subChannelId,
            {
                $push: { messages: savedMessage._id.toString() },
                latestMessage: savedMessage._id.toString(),
            }
        );

        return response_200(res, "Message sent successfully", {id: savedMessage._id});

    }
    catch (err) {
        return response_500(res, "Error sending message", err);
    }
}