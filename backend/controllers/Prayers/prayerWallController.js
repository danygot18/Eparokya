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

//with pagination -- without soft delete
// exports.getConfirmedPrayers = async (req, res) => {
//   try {
//     const { page = 1, limit = 10 } = req.query;
//     const skip = (page - 1) * limit;
//     const userId = req.user?._id;

//     const confirmedPrayers = await PrayerWall.find({ prayerWallStatus: "Confirmed" })
//       .populate("userId", "name avatar")
//       .skip(skip)
//       .limit(Number(limit))
//       .lean();

//     const prayersWithIncludeData = confirmedPrayers.map((prayer) => ({
//       ...prayer,
//       user: prayer.userId,
//       likes: prayer.likedBy?.length || 0,
//       likedByUser: userId ? prayer.likedBy?.includes(userId) : false,
//       includeCount: prayer.includeBy?.length || 0,
//       includedByUser: userId ? prayer.includeBy?.includes(userId) : false,
//     }));

//     const total = await PrayerWall.countDocuments({ prayerWallStatus: "Confirmed" });

//     res.status(200).json({ prayers: prayersWithIncludeData, total });
//   } catch (error) {
//     console.error("Error fetching confirmed prayers:", error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// };

// with soft delete
exports.getConfirmedPrayers = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;
    const userId = req.user?._id;

    const confirmedPrayers = await PrayerWall.find({
      prayerWallStatus: "Confirmed",
      isDeletedByUser: { $ne: true }
    })
      .populate("userId", "name avatar")
      .skip(skip)
      .limit(Number(limit))
      .lean();

    const prayersWithIncludeData = confirmedPrayers.map((prayer) => ({
      ...prayer,
      user: prayer.userId,
      likes: prayer.likedBy?.length || 0,
      likedByUser: userId ? prayer.likedBy?.includes(userId) : false,
      includeCount: prayer.includeBy?.length || 0,
      includedByUser: userId ? prayer.includeBy?.includes(userId) : false,
    }));

    const total = await PrayerWall.countDocuments({
      prayerWallStatus: "Confirmed",
      isDeletedByUser: { $ne: true }
    });

    res.status(200).json({ prayers: prayersWithIncludeData, total });
  } catch (error) {
    console.error("Error fetching confirmed prayers:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};


exports.toggleInclude = async (req, res) => {
  try {
    const userId = req.user._id;
    const { prayerId } = req.params;

    const prayer = await PrayerWall.findById(prayerId);

    if (!prayer) {
      return res.status(404).json({ message: "Prayer not found" });
    }

    const isIncluded = prayer.includeBy.includes(userId);

    if (isIncluded) {
      prayer.includeBy = prayer.includeBy.filter((id) => id.toString() !== userId);
    } else {
      prayer.includeBy.push(userId);
    }

    await prayer.save();

    res.status(200).json({
      includeCount: prayer.includeBy.length,
      includedByUser: !isIncluded, // Send updated status
    });
  } catch (error) {
    console.error("Error toggling include:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};




exports.toggleLike = async (req, res) => {
  const prayerId = req.params.prayerId;
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

    res.status(200).json({
      message: "Prayer like status updated.",
      likes: prayer.likedBy.length,
      likedByUser: prayer.likedBy.includes(userId), // This will return true/false
    });
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

// for user fetching 
exports.getMySubmittedPrayers = async (req, res) => {
  try {
    const userId = req.user.id;
    console.log("Authenticated User ID:", userId);

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const prayers = await PrayerWall.find({ userId: userId, isDeleted: false })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select("title prayerRequest prayerWallStatus createdAt");

    // const prayers = await PrayerWall.find({ userId: new mongoose.Types.ObjectId(userId)}) // Removed `isDeleted: false`
    //   .sort({ createdAt: -1 })
    //   .skip(skip)
    //   .limit(limit)
    //   .select("title prayerRequest prayerWallStatus createdAt");

    if (!prayers.length) {
      return res.status(404).json({ message: "No submitted prayers found." });
    }

    const formattedPrayers = prayers.map((prayer) => ({
      ...prayer.toObject(),
      prayerWallStatus:
        prayer.prayerWallStatus === "Confirmed"
          ? "Posted"
          : prayer.prayerWallStatus === "Cancelled"
            ? "Cancelled by the Admin"
            : "Pending",
    }));

    const totalPrayers = await PrayerWall.countDocuments({ userId: userId, isDeleted: false });

    res.status(200).json({
      prayers: formattedPrayers,
      total: totalPrayers,
      currentPage: page,
      totalPages: Math.ceil(totalPrayers / limit),
    });
  } catch (error) {
    console.error("Error fetching submitted prayers:", error);
    res.status(500).json({ message: "Failed to fetch submitted prayers." });
  }
};

// softDelete
exports.softDeletePrayer = async (req, res) => {
  try {
    const { prayerId } = req.params;
    const userId = req.user.id;

    const prayer = await PrayerWall.findOne({ _id: prayerId, userId });

    if (!prayer) {
      return res.status(404).json({ message: "Please request this action to the admin." });
    }

    prayer.isDeletedByUser = true;
    await prayer.save();

    res.status(200).json({ message: "Prayer deleted successfully." });
  } catch (error) {
    console.error("Error  deleting prayer:", error);
    res.status(500).json({ message: "Failed to delete prayer." });
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



