const Notification = require("../../models/Notification/notification");

exports.getUserNotifications = async (req, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Unauthorized. Please log in." });
      }

      // Fetch only notifications for the logged-in user
      const notifications = await Notification.find({ 
        user: req.user._id, // Filter by the logged-in user's ID
        isRead: false 
      }).sort({ createdAt: -1 });

      res.status(200).json(notifications);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      res.status(500).json({ message: "Server error" });
    }
};

  
