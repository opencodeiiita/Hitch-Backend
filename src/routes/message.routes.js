const { isSubChannelMember}=require('../middlewares/isSubChannelMember.middleware')
const isAuthorized = require('../middlewares/auth.middleware');
const { sendMessage } = require('../controllers/message.controller');
const express = require('express');

const { getAllMessages } = require("../controllers/message.controller");

const router = express.Router();
router.post('/send/in/:id', [isAuthorized, isSubChannelMember], sendMessage);
router.get("/getAll/in/:id", [isAuthorized, isSubChannelMember], getAllMessages);

module.exports = router;
