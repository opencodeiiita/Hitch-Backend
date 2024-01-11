const { getAllMessages } = require("../controllers/message.controller");
const isAuthorized  = require("../middlewares/auth.middleware");

const express = require("express");
const {isSubChannelMember} = require("../middlewares/isSubChannelMember.middleware");

const router = express.Router();

router.get("/getAll/in/:id", [isAuthorized, isSubChannelMember], getAllMessages);

module.exports = router;