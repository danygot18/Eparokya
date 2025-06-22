const PrayerRequest = require('../../models/PrayerWall/prayerRequest');
const mongoose = require('mongoose');

exports.createPrayerRequest = async (req, res) => {
    try {
        const {
            offerrorsName,
            prayerType,
            prayerRequestDate,
            prayerRequestTime,
            Intentions,
            userId,
        } = req.body;

        const newPrayerRequest = new PrayerRequest({
            offerrorsName,
            prayerType,
            prayerRequestDate,
            prayerRequestTime,
            Intentions,
            userId,
        });

        const savedPrayerRequest = await newPrayerRequest.save();
        res.status(201).json({ message: 'Prayer request created successfully', prayerRequest: savedPrayerRequest });
    } catch (error) {
        console.error('Error creating prayer request:', error);
        res.status(500).json({ error: 'Failed to create prayer request' });
    }
};


// Fetch all prayer requests for a user
exports.getUserPrayerRequests = async (req, res) => {
    try {
        const { userId } = req.params;
        const prayerRequests = await PrayerRequest.find({ userId });
        res.status(200).json({ prayerRequests });
    } catch (error) {
        console.error('Error fetching prayer requests:', error);
        res.status(500).json({ error: 'Failed to fetch prayer requests' });
    }
};


exports.getAllPrayerRequests = async (req, res) => {
    try {
        const prayerRequests = await PrayerRequest.find()
            .populate('userId', 'name email')
            .populate('Intentions');

        res.status(200).json({ prayerRequests });
    } catch (error) {
        console.error('Error fetching all prayer requests:', error);
        res.status(500).json({ error: 'Failed to fetch prayer requests' });
    }
};

exports.addIntentionToPrayerRequest = async (req, res) => {
    try {
        const { id } = req.params;
        const { name } = req.body;

        const prayerRequest = await PrayerRequest.findById(id);
        if (!prayerRequest) {
            return res.status(404).json({ error: 'Prayer request not found' });
        }

        prayerRequest.Intentions.push({ name });
        await prayerRequest.save();

        res.status(200).json({ message: 'Intention added successfully', prayerRequest });
    } catch (error) {
        console.error('Error adding intention:', error);
        res.status(500).json({ error: 'Failed to add intention' });
    }
};

// Delete a specific intention from a prayer request
exports.deleteIntentionFromPrayerRequest = async (req, res) => {
    try {
        const { id, intentionId } = req.params;

        const prayerRequest = await PrayerRequest.findById(id);
        if (!prayerRequest) {
            return res.status(404).json({ error: 'Prayer request not found' });
        }

        prayerRequest.Intentions = prayerRequest.Intentions.filter(
            (intention) => intention._id.toString() !== intentionId
        );
        await prayerRequest.save();

        res.status(200).json({ message: 'Intention deleted successfully', prayerRequest });
    } catch (error) {
        console.error('Error deleting intention:', error);
        res.status(500).json({ error: 'Failed to delete intention' });
    }
};


exports.getMySubmittedForms = async (req, res) => {
    try {
        const userId = req.user.id;
        console.log("Authenticated User ID:", userId);

        const forms = await PrayerRequest.find({ userId: userId });

        if (!forms.length) {
            return res.status(404).json({ message: "No forms found for this user." });
        }

        res.status(200).json({ forms });
    } catch (error) {
        console.error("Error fetching submitted prayer request forms:", error);
        res.status(500).json({ message: "Failed to fetch submitted prayer request forms." });
    }
};

exports.updatePrayerRequestTime = async (req, res) => {
    try {
        const { prayerId } = req.params;
        const { newTime } = req.body;

        const updatedRequest = await PrayerRequest.findByIdAndUpdate(
            prayerId,
            {
                prayerRequestTime: newTime,
                UpdateTime: newTime // ✅ Save this for display
            },
            { new: true }
        );

        if (!updatedRequest) {
            return res.status(404).json({ message: 'Prayer request not found' });
        }

        res.status(200).json({ message: 'Prayer request time updated', prayerRequest: updatedRequest });
    } catch (error) {
        console.error('Error updating prayer request time:', error);
        res.status(500).json({ error: 'Failed to update prayer request time' });
    }
};
exports.acceptPrayerRequest = async (req, res) => {
    try {
        const { prayerId } = req.params;
        const updated = await PrayerRequest.findByIdAndUpdate(
            prayerId,
            { prayerStatus: 'Accepted' },
            { new: true }
        );
        if (!updated) return res.status(404).json({ message: 'Prayer request not found.' });
        res.status(200).json({ message: 'Prayer request accepted.', prayerRequest: updated });
    } catch (error) {
        console.error('Error accepting prayer request:', error);
        res.status(500).json({ message: 'Failed to accept prayer request.' });
    }
};

// calling accepted prayer request
exports.getMassIntentions = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const nextWeek = new Date();
    nextWeek.setDate(today.getDate() + 7);
    nextWeek.setHours(23, 59, 59, 999);

    const intentions = await PrayerRequest.find({
      prayerStatus: 'Accepted',
      prayerRequestDate: {
        $gte: today,
        $lte: nextWeek,
      },
    }).select('offerrorsName prayerType prayerRequestDate prayerRequestTime Intentions');

    res.status(200).json({ intentions });
  } catch (err) {
    console.error('Error fetching mass intentions:', err);
    res.status(500).json({ message: 'Failed to fetch mass intentions.' });
  }
};

exports.cancelPrayerRequest = async (req, res) => {
    try {
        const { prayerId } = req.params;
        const updated = await PrayerRequest.findByIdAndUpdate(
            prayerId,
            { prayerStatus: 'Cancelled' },
            { new: true }
        );
        if (!updated) return res.status(404).json({ message: 'Prayer request not found.' });
        res.status(200).json({ message: 'Prayer request cancelled.', prayerRequest: updated });
    } catch (error) {
        console.error('Error cancelling prayer request:', error);
        res.status(500).json({ message: 'Failed to cancel prayer request.' });
    }
};

exports.getPrayerRequestHistory = async (req, res) => {
    try {
        const { status, page = 1, limit = 10, prayerType } = req.query;
        const skip = (page - 1) * limit;
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        let query = {};

        if (prayerType) {
            query.prayerType = prayerType;
        }

        if (status === "Accepted") {
            query.prayerStatus = "Accepted";
            query.UpdateTime = { $in: [null, "", undefined] };
        } else if (status === "Cancelled") {
            query.prayerStatus = "Cancelled";
        } else if (status === "Rescheduled") {
            query.UpdateTime = { $ne: null };
        } else if (status === "Upcoming") {
            query.prayerRequestDate = { $gt: today };
        } else if (status === "Done") {
            query.prayerRequestDate = { $lte: today };
            query.archived = { $ne: true };
        }

        const total = await PrayerRequest.countDocuments(query);
        const requests = await PrayerRequest.find(query)
            .sort({ prayerRequestDate: status === 'Upcoming' ? 1 : -1 })
            .skip(skip)
            .limit(Number(limit));

        res.status(200).json({
            requests,
            totalPages: Math.ceil(total / limit),
        });
    } catch (error) {
        console.error("Error fetching history:", error);
        res.status(500).json({ error: "Failed to fetch history." });
    }
};

// archive
exports.archivePrayerRequest = async (req, res) => {
  try {
    const { prayerId } = req.params;
    await PrayerRequest.findByIdAndUpdate(prayerId, { archived: true });
    res.status(200).json({ message: "Prayer request archived." });
  } catch (error) {
    res.status(500).json({ error: "Failed to archive prayer request." });
  }
};

exports.permanentlyDeletePrayerRequest = async (req, res) => {
  try {
    const { prayerId } = req.params;
    await PrayerRequest.findByIdAndDelete(prayerId);
    res.status(200).json({ message: "Prayer request permanently deleted." });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete prayer request." });
  }
};



// exports.getPrayerRequestStatusCounts = async (req, res) => {
//     try {
//         const counts = await PrayerRequest.aggregate([
//             { $group: { _id: "$prayerRequestStatus", count: { $sum: 1 } } }
//         ]);
//         res.status(200).json(counts);
//     } catch (error) {
//         res.status(500).json({ message: "Failed to fetch prayer request status counts", error });
//     }
// };
