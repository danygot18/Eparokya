const express = require("express");
const { getUserNotifications } = require("../../controllers/Notification/notificationController");
const router = express.Router();
const { isAuthenticatedUser, authorizeAdmin } = require('../../middleware/auth');

router.get("/notifications", isAuthenticatedUser, getUserNotifications);

module.exports = router;
