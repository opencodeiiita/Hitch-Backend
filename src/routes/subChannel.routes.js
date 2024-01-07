const {
    createSubChannel,
    updateSubChannel,
    deleteSubChannel,
    getSubChannel
} = require('../controllers/subChannel.controller');
const { isChannelAdmin } = require('../middlewares/isChannelAdmin.middleware');
const { isSubChannelAdmin } = require('../middlewares/isSubChannelAdmin.middleware');
const { isChannelMember}=require('../middlewares/isChannelMember.middleware')
const isAuthorized = require('../middlewares/auth.middleware');

const express = require('express');

const router = express.Router();
module.exports = router;

router.post('/create/in/:id', [isAuthorized, isChannelAdmin], createSubChannel);
router.put('/update/:id', [isAuthorized,isSubChannelAdmin ],updateSubChannel);
router.delete('/delete/:id', [isAuthorized, isSubChannelAdmin], deleteSubChannel);
router.get('/get/:id',[isAuthorized,isChannelMember], getSubChannel);
