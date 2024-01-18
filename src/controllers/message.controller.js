const SubChannel = require("../models/subChannel.models");
const Message = require("../models/message.models");
const Channel = require("../models/channel.models");
const { emitSocketEvent } = require("../socket/index.socket");

const {
    response_200,
    response_400,
    response_500,
} = require("../utils/responseCodes.utils");
const ChatEventEnum = require("../enums/chatEvents.enums");

exports.getAllMessages = async (req, res) => {
    try {
        const UserId = req.user.id;
        const SubChannelId = req.body.subchannel.id;
        const subchannel =
            await SubChannel.findById(SubChannelId).populate("messages");

        const messages = subchannel.messages.map((message) => {
            const isSentByUser = message.createdBy.equals(UserId);
            return {
                ...message.toObject(),
                sentByUser: isSentByUser,
            };
        });
        return response_200(res, "Messages Found", messages);
    } catch (err) {
        return response_500(res, "Error getting the messages", err);
    }
};

exports.sendMessage = async (req, res) => {
    try {
        const { message, attachments, user } = req.body;
        console.log(message);
        const subChannelId = req.subChannel._id;
        console.log(message);
        if (!message || !attachments) {
            return response_400(res, "Missing required fields");
        }

        const subChannel = await SubChannel.findById(subChannelId);

        const newMessage = new Message({
            text: message,
            files: attachments.map((file) => file.file.toString()),
            createdBy: user._id.toString(),
            subChannel: subChannelId,
        });

        const savedMessage = await newMessage.save();

        const updatedSubChannel = await SubChannel.findByIdAndUpdate(
            subChannelId,
            {
                $push: { messages: savedMessage._id.toString() },
                latestMessage: savedMessage._id.toString(),
            }
        );

        const channel = await Channel.findById(subChannel.channel);

        channel.members.forEach((participantObjectId) => {
            if (!participantObjectId.equals(user._id)) {
                emitSocketEvent(
                    req,
                    subChannel._id,
                    ChatEventEnum.MESSAGE_RECEIVED_EVENT,
                    receivedMessage
                );
            }
        });

        return response_200(res, "Message sent successfully", {
            id: savedMessage._id,
        });
    } catch (err) {
        return response_500(res, "Error sending message", err);
    }
};
