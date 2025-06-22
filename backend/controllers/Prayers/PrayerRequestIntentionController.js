const express = require('express');
const router = express.Router();
const PrayerRequestIntention = require('../../models/PrayerWall/prayerRequestIntention');
const notificationService = require("../../service/notificationService");
const Notification = require('../../models/Notification/notification');
const User = require('../../models/user');
const { body, validationResult } = require('express-validator');
const mongoose = require('mongoose');
const leoProfanity = require('leo-profanity');
const sendEmail = require('../../utils/sendEmail');

// exports.createPrayerRequestIntention = async (req, res) => {
//     console.log("Received Data:", req.body);
//     console.log("Authenticated User:", req.user);

//     if (!req.user) {
//         return res.status(401).json({ message: "User is not defined. Please authenticate." });
//     }

//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//         return res.status(400).json({ errors: errors.array() });
//     }

//     try {
//         const { prayerType, addPrayer, prayerDescription, Intentions } = req.body;

//         if (prayerType === 'Others' && !addPrayer) {
//             return res.status(400).json({ message: 'Please specify your prayer when selecting Others.' });
//         }

//         if (leoProfanity.check(addPrayer) || leoProfanity.check(prayerDescription)) {
//             return res.status(400).json({ message: 'Your submission contains inappropriate language.' });
//         }

//         const newPrayerRequest = new PrayerRequestIntention({
//             ...req.body,
//             userId: req.user._id,
//             Intentions: Array.isArray(Intentions) ? Intentions : [],
//         });

//         await newPrayerRequest.save();

//         // ✅ Find all Admins
//         const admins = await User.find({ isAdmin: true }, '_id');
//         const adminIds = admins.map(admin => admin._id.toString());

//         // ✅ Save Notification to Database
//         const notification = new Notification({
//             user: req.user._id,
//             type: "prayer request",
//             message: "A new prayer request has been submitted.",
//             link: `${process.env.FRONTEND_URL}/admin/prayerIntention/details/:id`,
//             isRead: false
//         });

//         await notification.save();

//         // ✅ Emit Notification to Connected Admins (Check io)
//         if (req.app.get("io")) {
//             const io = req.app.get("io"); // Get Socket.io instance
//             io.emit("send-notification", { adminIds, message: notification.message, link: notification.link });
//             io.emit("push-notification", {
//                 message: notification.message,
//                 link: notification.link,
//                 adminIds: adminIds,
//             });
//         } else {
//             console.error("❌ Socket.io is not initialized");
//         }

//         res.status(201).json({
//             message: 'Prayer submitted. This will be reviewed shortly.',
//             data: newPrayerRequest,
//         });
//     } catch (err) {
//         console.error("❌ Server Error:", err.message);
//         res.status(500).json({ message: err.message });
//     }
// };
exports.createPrayerRequestIntention = async (req, res) => {
    // console.log("Received Data:", req.body);
    // console.log("Authenticated User:", req.user);

    if (!req.user) {
        return res.status(401).json({ message: "User is not defined. Please authenticate." });
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { prayerType, addPrayer, prayerDescription, Intentions } = req.body;

        if (prayerType === 'Others' && !addPrayer) {
            return res.status(400).json({ message: 'Please specify your prayer when selecting Others.' });
        }

        if (leoProfanity.check(addPrayer) || leoProfanity.check(prayerDescription)) {
            return res.status(400).json({ message: 'Your submission contains inappropriate language.' });
        }

        const newPrayerRequest = new PrayerRequestIntention({
            ...req.body,
            userId: req.user._id,
            Intentions: Array.isArray(Intentions) ? Intentions : [],
        });

        await newPrayerRequest.save();

        const userEmail = req.user.email;
        const htmlMessage = `
  <div style="font-family: Arial, sans-serif; padding: 24px; background-color: #f9f9f9; color: #333;">
    <!-- Greeting -->
    <p style="font-size: 16px;">Good Day!</p>

    <!-- Body -->
    <p style="font-size: 16px;">
      Thank you for submitting your prayer request through the <strong>E:Parokya</strong>.
      Your prayer has been received and will be reviewed by our team shortly.
    </p>

    <!-- Prayer Request Details Section -->
    <h3 style="margin-top: 20px;">Prayer Details</h3>
    <ul style="list-style: none; padding: 0;">
      <li><strong>📖 Prayer Type:</strong> ${prayerType}</li>
      ${prayerType === "Others" ? `<li><strong>Custom Prayer:</strong> ${addPrayer}</li>` : ""}
      <li><strong>Description:</strong> ${prayerDescription}</li>
      <li><strong>Intentions:</strong> ${Intentions?.join(", ") || "None listed"}</li>
    </ul>

    <!-- Closing -->
    <p style="margin-top: 20px; font-size: 16px;">
      May you feel the warmth of our prayers and the grace of God in your journey.
    </p>

    <!-- Footer -->
    <hr style="margin: 30px 0; border: none; border-top: 1px solid #ccc;">
    <footer style="font-size: 14px; color: #777;">
      <p><strong>E:Parokya</strong><br>
      Saint Joseph Parish – Taguig<br>
      This is an automated email confirmation. Please do not reply.</p>
    </footer>
  </div>
`;

        await sendEmail({
            email: userEmail,
            subject: "Your Prayer Request Has Been Submitted!",
            message: htmlMessage,
        });

        // Find all Admins
        const admins = await User.find({ isAdmin: true }, '_id');
        const adminIds = admins.map(admin => admin._id.toString());

        // Save Notification for Each Admin
        const notifications = admins.map(admin => ({
            user: admin._id, // Admin who will receive it
            type: "prayer request",
            message: "A new prayer request has been submitted.",
            link: `/admin/prayerIntention/details/${newPrayerRequest._id}`,
            N_id: newPrayerRequest._id,
            isRead: false
        }));

        await Notification.insertMany(notifications);

        if (req.app.get("io")) {
            const io = req.app.get("io");
            io.emit("push-notification", {
                message: "A new prayer request has been submitted.",
                link: `/admin/prayerIntention/details/${newPrayerRequest._id}`,
                N_id: newPrayerRequest._id,
                adminIds
            });
        } else {
            console.error("Socket.io is not initialized");
        }

        res.status(201).json({
            message: 'Prayer submitted. This will be reviewed shortly.',
            data: newPrayerRequest,
        });
    } catch (err) {
        console.error("Server Error:", err.message);
        res.status(500).json({ message: err.message });
    }
};


exports.getAllPrayerRequestIntention = async (req, res) => {
    try {
        const prayerRequests = await PrayerRequestIntention.find().populate('userId', 'name email');
        res.status(200).json(prayerRequests);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getPrayerRequestIntentionById = async (req, res) => {
    try {
        const prayerRequest = await PrayerRequestIntention.findById(req.params.prayerIntentionId).populate('userId', 'name email');
        if (!prayerRequest) {
            return res.status(404).json({ message: 'Prayer request not found' });
        }
        res.status(200).json(prayerRequest);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.updatePrayerRequestIntention = async (req, res) => {
    try {
        const updatedPrayerRequest = await PrayerRequestIntention.findByIdAndUpdate(req.params.prayerIntentionId, req.body, { new: true });
        if (!updatedPrayerRequest) {
            return res.status(404).json({ message: 'Prayer request not found' });
        }
        res.status(200).json(updatedPrayerRequest);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// exports.markPrayerRequestIntentionAsDone = async (req, res) => {
//     try {
//         const updatedPrayerRequest = await PrayerRequestIntention.findByIdAndUpdate(req.params.prayerIntentionId, { isDone: true }, { new: true });
//         if (!updatedPrayerRequest) {
//             return res.status(404).json({ message: 'Prayer request not found' });
//         }
//         res.status(200).json(updatedPrayerRequest);
//     } catch (err) {
//         res.status(500).json({ message: err.message });
//     }
// };

exports.markPrayerRequestIntentionAsDone = async (req, res) => {
    try {
        const updatedPrayerRequest = await PrayerRequestIntention.findByIdAndUpdate(
            req.params.prayerIntentionId,
            { isDone: true },
            { new: true }
        );

        console.log("Updated Prayer Request:", updatedPrayerRequest);

        if (!updatedPrayerRequest) {
            return res.status(404).json({ message: "Prayer request not found" });
        }

        const userId = updatedPrayerRequest.userId;

        if (userId) {
            console.log("User ID for Notification:", userId);

            const newNotification = new Notification({
                user: userId,
                message: "Your prayer request has been marked as done by the admin.",
                type: "prayer request",
                link: `/prayerIntention/details/${updatedPrayerRequest._id}`,
                N_id: updatedPrayerRequest._id,
                isRead: false
            });

            await newNotification.save();
            console.log("Notification saved successfully!");

            if (req.app.get("io")) {
                req.app.get("io").to(userId.toString()).emit("push-notification-user", {
                    userId: userId.toString(),
                    message: "Your prayer request has been marked as done by the admin.",
                    link: `/prayerIntention/details/${updatedPrayerRequest._id}`,
                    N_id: updatedPrayerRequest._id,
                });
                console.log("Notification emitted to user:", userId.toString());
            } else {
                console.error("Socket.io is not initialized");
            }
        }

        res.status(200).json(updatedPrayerRequest);
    } catch (err) {
        console.error("Error marking prayer request as done:", err);
        res.status(500).json({ message: err.message });
    }
};



// exports.deletePrayerRequestIntention = async (req, res) => {
//     try {
//         const deletedPrayerRequest = await PrayerRequestIntention.findByIdAndDelete(req.params.prayerIntentionId);
//         if (!deletedPrayerRequest) {
//             return res.status(404).json({ message: 'Prayer request not found' });
//         }
//         res.status(200).json({ message: 'Prayer request deleted successfully' });
//     } catch (err) {
//         res.status(500).json({ message: err.message });
//     }
// };

exports.getUserNotifications = async (req, res) => {
    try {
        if (!req.user) return res.status(401).json({ message: "Unauthorized. Please log in." });

        const notifications = await notificationService.getUserNotifications(req.user._id);
        res.status(200).json({ notifications });
    } catch (error) {
        console.error("Error fetching notifications:", error);
        res.status(500).json({ message: "Server error" });
    }
};

exports.getUnreadNotifications = async (req, res) => {
    try {
        if (!req.user) return res.status(401).json({ message: "Unauthorized. Please log in." });

        const unreadCount = await notificationService.getUnreadNotifications(req.user._id);
        res.status(200).json({ unreadCount: unreadCount.length });
    } catch (error) {
        console.error("Error fetching unread notifications:", error);
        res.status(500).json({ message: "Server error" });
    }
};
// prayer history
exports.getPrayerRequestHistory = async (req, res) => {
    try {
        const { prayerType, page = 1, limit = 10, filter = "done" } = req.query;
        const skip = (page - 1) * limit;

        const match = { prayerType };

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (filter === "done") {
            match.prayerRequestDate = { $lt: today };
        } else if (filter === "upcoming") {
            match.prayerRequestDate = { $gte: today };
        } else if (filter === "notDone") {
            match.isDone = false;
        }

        const total = await PrayerRequestIntention.countDocuments(match);
        const data = await PrayerRequestIntention.find(match)
            .populate("userId", "name email")
            .sort({ "doneAt": -1 })
            .skip(skip)
            .limit(parseInt(limit));

        res.status(200).json({
            currentPage: parseInt(page),
            totalPages: Math.ceil(total / limit),
            totalItems: total,
            data,
        });
    } catch (error) {
        console.error("Error fetching prayer history:", error);
        res.status(500).json({ message: "Server error while fetching prayer history." });
    }
};


exports.archivePrayerRequest = async (req, res) => {
  try {
    const { prayerIntentionId } = req.params;
    const updated = await PrayerRequestIntention.findByIdAndUpdate(prayerIntentionId, { archived: true }, { new: true });
    if (!updated) return res.status(404).json({ message: "Prayer request not found." });
    res.status(200).json({ message: "Prayer request archived." });
  } catch (error) {
    console.error("Error archiving prayer request:", error);
    res.status(500).json({ message: "Server error while archiving." });
  }
};

exports.deletePrayerRequest = async (req, res) => {
  try {
    const { prayerIntentionId } = req.params;
    const deleted = await PrayerRequestIntention.findByIdAndDelete(prayerIntentionId);
    if (!deleted) return res.status(404).json({ message: "Prayer request not found." });
    res.status(200).json({ message: "Prayer request deleted." });
  } catch (error) {
    console.error("Error deleting prayer request:", error);
    res.status(500).json({ message: "Server error while deleting." });
  }
};

exports.deleteAllDonePrayerRequests = async (req, res) => {
  try {
    const result = await PrayerRequestIntention.deleteMany({ isDone: true });

    res.status(200).json({
      message: `${result.deletedCount} done prayer request(s) deleted.`,
    });
  } catch (error) {
    console.error("Error deleting done prayer requests:", error);
    res.status(500).json({ message: "Server error while deleting done prayers." });
  }
};




