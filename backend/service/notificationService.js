const Notification = require("../models/Notification/notification");
const User = require("../models/user");

/**
 * Create and save a new notification
 */
const createNotification = async (userId, type, message, link) => {
    const newNotification = new Notification({
        user: userId,
        type,
        message,
        link,
        isRead: false,
    });

    await newNotification.save();
    return newNotification;
};

/**
 * Fetch all notifications for a user
 */
const getUserNotifications = async (userId) => {
    return await Notification.find({ user: userId }).sort({ createdAt: -1 });
};

/**
 * Fetch unread notifications for a user
 */
const getUnreadNotifications = async (userId) => {
    return await Notification.find({ user: userId, isRead: false }).sort({ createdAt: -1 });
};

/**
 * Mark all notifications as read
 */
const markNotificationsAsRead = async (userId) => {
    await Notification.updateMany(
        { user: userId, isRead: false },
        { $set: { isRead: true } }
    );
};

module.exports = {
    createNotification,
    getUserNotifications,
    getUnreadNotifications,
    markNotificationsAsRead,
};
