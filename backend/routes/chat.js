const express = require('express');
const router = express.Router();
const { isAuthenticatedUser, isAuthorized, isAuthenticatedMobile } = require('../middleware/auth');

const ChatController = require("./../controllers/ChatController");

router.post('/sendMessage', isAuthenticatedUser, ChatController.sendMessage);
router.get('/getMessage/:userId/:senderId',isAuthenticatedUser, ChatController.getMessages)
router.get('/getAllMessage/:userId', isAuthenticatedUser, ChatController.getChatUsers);

module.exports = router;