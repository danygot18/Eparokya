// const Notification = require("../../models/Notification/notification");

// exports.getUserNotifications = async (req, res) => {
//     try {
//       if (!req.user) {
//         return res.status(401).json({ message: "Unauthorized. Please log in." });
//       }

//       // Fetch only notifications for the logged-in user
//       const notifications = await Notification.find({ 
//         user: req.user._id, // Filter by the logged-in user's ID
//         isRead: false 
//       }).sort({ createdAt: -1 });

//       res.status(200).json(notifications);
//     } catch (error) {
//       console.error("Error fetching notifications:", error);
//       res.status(500).json({ message: "Server error" });
//     }
// };

const notificationService = require("../../service/notificationService");
const Notification = require("../../models/Notification/notification");

exports.getUserNotifications = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized. Please log in." });
        }

        const notifications = await notificationService.getUserNotifications(req.user._id);
        res.status(200).json(notifications);
    } catch (error) {
        console.error("Error fetching notifications:", error);
        res.status(500).json({ message: "Server error" });
    }
};

exports.getUnreadNotifications = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized. Please log in." });
        }

        const notifications = await notificationService.getUnreadNotifications(req.user._id);
        res.status(200).json(notifications);
    } catch (error) {
        console.error("Error fetching unread notifications:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// exports.markNotificationAsRead = async (req, res) => {
//     try {
//         const { notificationId } = req.params;
        
//         if (!req.user) {
//             return res.status(401).json({ message: "Unauthorized. Please log in." });
//         }

//         const notification = await Notification.findByIdAndUpdate(
//             notificationId,
//             { isRead: true },
//             { new: true }
//         );

//         if (!notification) {
//             return res.status(404).json({ message: "Notification not found" });
//         }

//         res.status(200).json(notification);
//     } catch (error) {
//         console.error("Error marking notification as read:", error);
//         res.status(500).json({ message: "Server error" });
//     }
// };

exports.markAllNotificationsAsRead = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized. Please log in." });
        }

        // Update all unread notifications for the logged-in user
        await Notification.updateMany(
            { user: req.user._id, isRead: false },
            { $set: { isRead: true } }
        );

        res.status(200).json({ message: "All notifications marked as read" });
    } catch (error) {
        console.error("Error marking notifications as read:", error);
        res.status(500).json({ message: "Server error" });
    }
};


