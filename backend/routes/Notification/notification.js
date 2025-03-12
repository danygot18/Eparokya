const express = require("express");
const {
    getUserNotifications,
    getUnreadNotifications,
    markNotificationAsRead,
    markAllNotificationsAsRead
} = require("../../controllers/Notification/notificationController");

const router = express.Router();
const { isAuthenticatedUser } = require('../../middleware/auth');

// ✅ Fetch all notifications for the logged-in user
router.get("/notifications", isAuthenticatedUser, getUserNotifications);

// ✅ Fetch only unread notifications
router.get("/notifications/unread", isAuthenticatedUser, getUnreadNotifications);

// ✅ Mark all notifications as read
// router.put("/notifications/mark-read", isAuthenticatedUser, markNotificationAsRead);

router.put("/notifications/mark-read", isAuthenticatedUser, markAllNotificationsAsRead);

module.exports = router;
