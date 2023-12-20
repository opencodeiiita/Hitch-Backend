const { createChannel } = require('../controllers/channel.controller');
const { isWorkspaceAdmin } = require('../middlewares/isWorkspaceAdmin.middleware');
const isAuthorized = require('../middlewares/auth.middleware');

const express = require('express');

const router = express.Router();
module.exports = router;

router.post('/create/in/:id', [isAuthorized, isWorkspaceAdmin], createChannel);