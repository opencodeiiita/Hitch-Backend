const { createChannel, deleteChannel } = require('../controllers/channel.controller');
const { isWorkspaceAdmin } = require('../middlewares/isWorkspaceAdmin.middleware');
const isAuthorized = require('../middlewares/auth.middleware');

const express = require('express');
const { isChannelAdmin } = require('../middlewares/isChannelAdmin.middleware');

const router = express.Router();
module.exports = router;

router.post('/create/in/:id', [isAuthorized, isWorkspaceAdmin], createChannel);
router.delete('/delete/:id', [isAuthorized, isChannelAdmin], deleteChannel);