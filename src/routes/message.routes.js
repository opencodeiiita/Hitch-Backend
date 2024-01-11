const { isSubChannelMember}=require('../middlewares/isSubChannelMember.middleware')
const isAuthorized = require('../middlewares/auth.middleware');
const { sendMessage } = require('../controllers/message.controller');
const express = require('express');

const router = express.Router();
module.exports = router;

router.post('/send/in/:id', [isAuthorized, isSubChannelMember], sendMessage);
