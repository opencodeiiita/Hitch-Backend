const SubChannel = require("../models/subChannel.models");
const Channel = require("../models/channel.models");
const {
    response_201,
    response_400,
    response_500,
    response_200,
} = require("../utils/responseCodes.utils");

exports.createSubChannel = async (req, res) => {
    try {
        const { name, description } = req.body;
        const channelId = req.body.channel._id;

        if (!name || !description) {
            return response_400(res, "Please provide name or description");
        }

        const subChannel = new SubChannel({
            name: name,
            description: description,
            channel: channelId,
        });

        const newSubChannel = await subChannel.save();

        const updatedChannel = await Channel.findByIdAndUpdate(channelId, {
            $push: { subChannels: newSubChannel._id },
        });
        
        console.log(updatedChannel);
        return response_201(res, "SubChannel Created Successfully", {
            name: newSubChannel.name,
            description: newSubChannel.description,
            id: newSubChannel._id,
        });
    } catch (error) {
        return response_500(res, "Error creating subchannel", error);
    }
};

exports.updateSubChannel = async (req, res) => {
    try {
        const { name, description } = req.body;
        // assuming req.subChannel will contain the subChannel object

        if (!name && !description) {
            return response_400(res, "Please provide name or description");
        }
        
        const updatedSubChannel = await SubChannel.findByIdAndUpdate(
            req.subChannel._id,
            {
                name: name,
                description: description,
            }
        );
        
        return response_200(res, "Sub-Channel Updated Successfully", {
            name: updatedSubChannel.name,
            description: updatedSubChannel.description,
            id: updatedSubChannel._id,
        });
    } catch (err) {
        return response_500(res, "Error updating the subChannel", err);
    }
};

exports.deleteSubChannel = async (req, res) => {
    try {
        const SubChannelId = req.subChannel._id;
        const subchannel = await SubChannel.findById(SubChannelId);

        const channel = await Channel.findById(subchannel.channel);


        await Channel.findByIdAndUpdate(channel._id, {
            $pull: { subChannels: SubChannelId },
        });

        await SubChannel.findByIdAndDelete(SubChannelId);

        return response_200(res, "SubChannel Deleted Successfully");
    } catch (err) {
        return response_500(res, "Error deleting subChannel", err);
    }
};

exports.getSubChannel = async (req, res) => {
    try {
        const ChannelId = req.params.id
        const channel =
            await Channel.findById(ChannelId).populate("subChannels");
        const subChannels = channel.subChannels;
        function selectFewerProps(x) {
            const { name, description, _id } = x;
            return { name, description, _id };
        }
        const newSubChannels = subChannels.map(selectFewerProps);
        return response_200(res, "Subchannel Found", newSubChannels);
    } catch (err) {
        return response_500(res, "Error Finding The subchannel", err);
    }
};
