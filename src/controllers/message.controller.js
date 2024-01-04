const SubChannel = require("../models/subChannel.models");
const Message = require("../models/message.models")

const {
  response_200,
  response_400,
  response_500,
} = require("../utils/responseCodes.utils");



exports.getAllMessages = async (req, res) => {
  try {
    const SubChannelId = req.body.subchannel.id;
    const isValidSubchannel = await SubChannel.findById(SubChannelId).populate('messages');

    if (!isValidSubchannel) {
      return response_400(res,'Missing required fields');
    }

    const messages = isValidSubchannel.messages;
    return response_200(res, "Messages Found",messages);


  }
  catch (err) {
    return response_500(res, "Error getting the messages", err);
  }
}