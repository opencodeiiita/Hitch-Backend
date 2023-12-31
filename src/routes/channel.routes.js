const {
  createChannel,
  deleteChannel,
  getChannels,
  AddUserToChannel,
  removeUserFromChannel,
  updateChannel,
  getUsers,
} = require("../controllers/channel.controller");
const {
  isWorkspaceAdmin,
} = require("../middlewares/isWorkspaceAdmin.middleware");
const isAuthorized = require("../middlewares/auth.middleware");

const express = require("express");
const { isChannelAdmin } = require("../middlewares/isChannelAdmin.middleware");
const {
  isChannelMember,
} = require("../middlewares/isChannelMember.middleware");

const router = express.Router();
module.exports = router;

router.get("/get/:id", [isAuthorized, isChannelMember], getChannels);
router.post("/create/in/:id", [isAuthorized, isWorkspaceAdmin], createChannel);
router.delete("/delete/:id", [isAuthorized, isChannelAdmin], deleteChannel);
router.put("/update/:id", [isAuthorized, isChannelAdmin], updateChannel);
router.post("/addUser/:id", [isAuthorized, isChannelAdmin], AddUserToChannel);
router.delete("/removeUser/:id", [isAuthorized, isChannelMember], removeUserFromChannel);
router.get("/getUsers/:id", [isAuthorized, isChannelMember], getUsers);

