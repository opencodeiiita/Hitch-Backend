const {createSubChannel, updateSubChannel} = require('../controllers/subChannel.controller');
const { isChannelAdmin } = require('../middlewares/isChannelAdmin.middleware');
const { isSubChannelAdmin } = require('../middlewares/isSubChannelAdmin.middleware');
const isAuthorized = require('../middlewares/auth.middleware');

const express = require('express');

const router = express.Router();
module.exports = router;

router.post('/create/in/:id', [isAuthorized, isChannelAdmin], createSubChannel);
router.put('/update/:id', [isAuthorized,isSubChannelAdmin ],updateSubChannel);