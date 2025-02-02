const PrayerWall = require("../../models/PrayerWall/prayerWall"); 
const mongoose = require("mongoose");
const profanity = require("leo-profanity");

exports.submitPrayerRequest = async (req, res) => {
  try {
    const { title, prayerRequest, contact, prayerWallSharing } = req.body;

    if (!prayerRequest) {
      return res.status(400).json({ message: "Prayer request is required." });
    }

    if (profanity.check(prayerRequest)) {
      return res.status(400).json({ message: "Prayer request contains inappropriate language." });
    }

    const userId = req.user._id;

    const prayer = new PrayerWall({
      title: title || "Untitled",
      prayerRequest,
      contact: contact || "No contact provided",
      prayerWallSharing,
      userId,
      prayerWallStatus: "Pending",
    });

    const savedPrayer = await prayer.save();

    res.status(201).json({ success: true, prayer: savedPrayer });
  } catch (error) {
    console.error("Error submitting prayer request:", error);
    res.status(500).json({ success: false, message: "Error submitting prayer request", error: error.message });
  }
};

exports.getPendingPrayers = async (req, res) => {
  try {
    const pendingPrayers = await PrayerWall.find({ prayerWallStatus: "Pending" }).populate("userId", "name");

    if (!pendingPrayers.length) {
      return res.status(404).json({ message: "No pending prayers found." });
    }

    res.status(200).json({ prayers: pendingPrayers });
  } catch (error) {
    console.error("Error fetching pending prayers:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};


//with pagination
exports.getConfirmedPrayers = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query; 
    const skip = (page - 1) * limit;

    const confirmedPrayers = await PrayerWall.find({ prayerWallStatus: "Confirmed" })
      .populate("userId", "name")
      .skip(skip)
      .limit(Number(limit));

    const total = await PrayerWall.countDocuments({ prayerWallStatus: "Confirmed" });

    res.status(200).json({ prayers: confirmedPrayers, total });
  } catch (error) {
    console.error("Error fetching confirmed prayers:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.toggleInclude = async (req, res) => {
  const prayerId = req.params.prayerId; 
  const userId = req.user._id;

  try {
    const prayer = await PrayerWall.findById(prayerId);

    if (!prayer) {
      return res.status(404).json({ message: "Prayer not found." });
    }

    if (!Array.isArray(prayer.includedBy)) {
      prayer.includedBy = [];
    }

    const includedIndex = prayer.includedBy.indexOf(userId);

    if (includedIndex === -1) {
      prayer.includedBy.push(userId);
      await prayer.save();
      return res.status(200).json({
        message: "Prayer include status updated.",
        includes: prayer.includedBy.length,
        includedByUser: true,
      });
    } else {
      return res.status(400).json({ message: "You have already included this prayer." });
    }
  } catch (error) {
    console.error("Error toggling include on prayer:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};



exports.toggleLike = async (req, res) => {
  const prayerId = req.params.id;
  const userId = req.user._id;

  try {
    const prayer = await PrayerWall.findById(prayerId);

    if (!prayer) {
      return res.status(404).json({ message: "Prayer not found." });
    }

    const likedIndex = prayer.likedBy.indexOf(userId);

    if (likedIndex === -1) {
      prayer.likedBy.push(userId);
    } else {
      prayer.likedBy.splice(likedIndex, 1);
    }

    await prayer.save();

    res.status(200).json({ message: "Prayer like status updated.", likes: prayer.likedBy.length });
  } catch (error) {
    console.error("Error toggling like on prayer:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getAllPrayers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const query = {};
    if (req.query.status) {
      query.prayerWallStatus = req.query.status; 
    }

    const prayers = await PrayerWall.find(query)
      .populate("userId", "name _id") 
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await PrayerWall.countDocuments(query);

    res.status(200).json({
      success: true,
      prayers,
      total,
      currentPage: page,
    });
  } catch (error) {
    console.error("Error fetching prayers:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};



exports.approvePrayer = async (req, res) => {
  const { prayerId } = req.params;

  try {
    const prayer = await PrayerWall.findById(prayerId);
    if (!prayer) {
      return res.status(404).json({ success: false, message: "Prayer request not found." });
    }
    prayer.prayerWallStatus = "Confirmed";
    prayer.confirmedAt = new Date();

    await prayer.save();

    res.status(200).json({
      success: true,
      message: "Prayer request approved successfully.",
      prayer,
    });
  } catch (error) {
    console.error("Error approving prayer request:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};


exports.rejectPrayer = async (req, res) => {
  try {
      const prayer = await PrayerWall.findByIdAndUpdate(
          req.params.id,
          { prayerWallStatus: 'Cancelled' },
          { new: true }
      );
      if (!prayer) return res.status(404).json({ success: false, message: "Prayer not found" });

      res.status(200).json({ success: true, message: "Prayer rejected", prayer });
  } catch (error) {
      console.error("Error rejecting prayer:", error);
      res.status(500).json({ success: false, error: error.message });
  }
};



