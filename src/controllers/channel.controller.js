const Channel = require("../models/channel.models");
const Workspace = require("../models/workspace.models");
const subChannel = require("../models/subChannel.models");
const User = require("../models/user.models");
const USER_ROLE = require("../enums/userRoles.enums");

const {
  response_200,
  response_201,
  response_400,
  response_500,
} = require("../utils/responseCodes.utils");

exports.createChannel = async (req, res) => {
  try {
    const { type, description, name, user, workspace } = req.body;
    if (!description || !name || !workspace._id.toString()) {
      return response_400(
        res,
        "Invalid input! Please send all the required properties to create the channel"
      );
    }

    const channel = new Channel({
      type,
      description,
      name,
      workspace: workspace._id.toString(),
      createdBy: user._id.toString(),
    });

    const savedChannel = await channel.save();
    console.log(savedChannel);

    const DefaultSubChannel = new subChannel({
      name: "Announcement",
      description: "Announcement SubChannel",
      channel: savedChannel._id.toString(),
    });

    const savedDefaultSubChannel = await DefaultSubChannel.save();
    console.log(savedDefaultSubChannel);

    savedChannel.subChannels = [savedDefaultSubChannel._id.toString()];
    const updatedChannel = await Channel.findByIdAndUpdate(
      savedChannel._id.toString(),
      {
        $push: { subChannels: savedDefaultSubChannel._id.toString() },
      }
    );
    console.log(updatedChannel);

    const updatedWorkspace = await Workspace.findByIdAndUpdate(
      workspace._id.toString(),
      {
        $push: { channels: savedChannel._id.toString() },
      }
    );

    console.log(updatedWorkspace);

    const updatedUser = await User.findByIdAndUpdate(user._id, {
      $push: {
        channels: { channel: savedChannel._id, role: USER_ROLE.ADMIN },
      },
    });

    console.log(updatedUser);
    return response_201(res, "Channel Created Successfully", {
      createdBy: user._id.toString(),
      name: savedChannel.name,
      description: savedChannel.description,
      id: savedChannel._id.toString(),
    });
  } catch (error) {
    return response_500(res, "Error creating channel", error);
  }
};

exports.updateChannel = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name && !description) {
      return response_400(res, "Please provide name or description");
    }

    const channel = await Channel.findByIdAndUpdate(req.body.channel._id, {
      name: name,
      description: description,
    });

    return response_200(res, "Channel Updated Successfully", {
      name: channel.name,
      description: channel.description,
      workspaceId: channel.workspace,
      id: channel._id,
    });
  } catch (err) {
    return response_500(res, "Error updating channel", err);
  }
};

exports.deleteChannel = async (req, res) => {
  try {
    const channelId = req.body.channel._id;
    await Channel.findByIdAndDelete(channelId);

    // delete all the subchannels in channel
    const subChannels = await subChannel.find({ channel: channelId });

    await Promise.all(
      subChannels.map(async (subCh) => {
        await subChannel.findByIdAndDelete(subCh._id);
      })
    );

    // delete the channels instance for all users in that channel
    const users = await User.find({
      channels: { $elemMatch: { channel: channelId } },
    });

    await Promise.all(
      users.map(async (user) => {
        await User.findByIdAndUpdate(user._id, {
          $pull: { channels: { channel: channelId } },
        });

        console.log(user);
      })
    );

    // delete the channel instance from workspace
    const workspace = await Workspace.findByIdAndUpdate(
      req.body.workspace._id,
      {
        $pull: { channels: channelId },
      }
    );

    return response_200(res, "Channel Deleted Successfully");
  } catch (err) {
    return response_500(res, "Error deleting channel", err);
  }
};

exports.getChannels = async (req, res) => {
  try {
    const workspace = req.body.workspace;
    const data = await Promise.all(
      workspace.channels.map(async (channelId) => {
        const channel = await Channel.findById(channelId);
        return {
          id: channel._id,
          name: channel.name,
          description: channel.description,
          workspaceId: workspace.workspaceId,
        };
      })
    );

    return response_200(res, "Channels Found", data);
  } catch (err) {
    return response_500(res, "Error fetching channels", err);
  }
};

exports.AddUserToChannel = async (req, res) => {
  try {
    const { userId } = req.body;
    const channel = req.body.channel;
    const user = await User.findById(userId);
    if (!user) {
      return response_400(res, "No such User Exists");
    }
    if (channel.members) {
      if (channel.members.includes(user._id)) {
        return response_400(res, "User already a member of the channel");
      }
    }
    channel.members.push(user);
    //console.log(channel.members);
    user.channels.push({
      channel: channel._id,
      role: USER_ROLE.NORMAL_USER,
    });

    await User.findByIdAndUpdate(
      user._id,
      { channels: user.channels },
      { new: true }
    );

    await Channel.findByIdAndUpdate(
      channel._id,
      { members: channel.members },
      { new: true }
    );
    const workspace = channel.workspace;
    //console.log(workspace);
    return response_200(res, "User Added to Channel Successfully", {
      name: channel.name,
      description: channel.description,
      workspaceId: workspace._id,
      id: channel._id,
      channel,
      user,
    });
  } catch (err) {
    return response_500(res, "Error adding user from channel", err);
  }
};

exports.removeUserFromChannel = async (req, res) => {
  try {
    const { userId } = req.body;
    const channel = req.body.channel;

    if (!channel.members.includes(userId)) {
      return response_400(res, "User is not a part of the channel");
    }

    const userToBeRemoved = await User.findById(userId);

    const filteredChannel = channel.members.filter(
      (user) => user !== userId
    );
    const filteredUser = userToBeRemoved.channels.filter(
      ({ channel }) => channel !== channel._id
    );

    const updatedChannel = await Channel.findByIdAndUpdate(channel._id, {
      members: filteredChannel,
    });
    const updatedUser = await User.findByIdAndUpdate(userId, {
      channels: filteredUser,
    });

    return response_200(res, "User Removed from Channel Successfully");
  } catch (error) {
    return response_500(res, "Error removing user from channel", error);
  }
};

exports.getUsers = async (req, res) => {
  try {
    //console.log(req.body);
    const ChannelId = req.channel._id;
    //console.log(ChannelId);
    const channel = await Channel.findById(ChannelId).populate("members");
    const users = channel.members;
    console.log(users);
    function selectFewerProps(x) {
      const { username, email, name, _id } = x;
      return { username, email, name, _id };
    }
    const newUsers = users.map(selectFewerProps);
    return response_200(res, "Users Found", newUsers);
  } catch (err) {
    return response_500(res, "Error finding users", err);
  }
};
