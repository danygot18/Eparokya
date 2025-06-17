    const HouseBlessing = require('../../models/PrivateScheduling/houseBlessing'); 
const mongoose = require('mongoose');
const Priest = require('../../models/Priest/priest'); 
const User = require('../../models/user');

// Create House Blessing Request
exports.createHouseBlessing = async (req, res) => {
    try {
        const {
            fullName,
            contactNumber,
            address,
            propertyType,
            customPropertyType,
            floors,
            rooms,
            propertySize,
            isNewConstruction,
            specialRequests,
            blessingDate, 
            blessingTime,
            userId,
        } = req.body;

        // Required fields validation
        if (!fullName || !contactNumber || !address || !blessingDate || !blessingTime || !userId || 
            !propertyType || !floors || !rooms || !propertySize || isNewConstruction === undefined) {
            return res.status(400).json({ error: 'All required fields must be provided.' });
        }

        // Validate custom property type if 'Others' is selected
        if (propertyType === 'Others' && !customPropertyType) {
            return res.status(400).json({ error: 'Custom property type is required when selecting "Others"' });
        }

        const newHouseBlessing = new HouseBlessing({
            fullName,
            contactNumber,
            address: {
                ...address,
                customBarangay: address.barangay === 'Others' ? address.customBarangay : undefined,
                customCity: address.city === 'Others' ? address.customCity : undefined,
            },
            propertyType,
            customPropertyType: propertyType === 'Others' ? customPropertyType : undefined,
            floors,
            rooms,
            propertySize,
            isNewConstruction,
            specialRequests,
            blessingDate, 
            blessingTime,
            userId,
        });

        const savedHouseBlessing = await newHouseBlessing.save();
        res.status(201).json({ 
            message: 'House blessing request created successfully', 
            houseBlessing: savedHouseBlessing 
        });
    } catch (error) {
        console.error('Error creating house blessing request:', error);
        res.status(500).json({ error: 'Failed to create house blessing request' });
    }
};

// [Rest of your existing controller functions remain the same...]
// Get House Blessing Requests for a User
exports.getUserHouseBlessingRequests = async (req, res) => {
    try {
        const { userId } = req.params;
        const houseBlessingRequests = await HouseBlessing.find({ userId });
        res.status(200).json({ houseBlessingRequests });
    } catch (error) {
        console.error('Error fetching house blessing requests:', error);
        res.status(500).json({ error: 'Failed to fetch house blessing requests' });
    }
};


exports.createPriestComment = async (req, res) => {
    try {
        const { blessingId } = req.params;
        const { priestId } = req.body;

        if (!priestId) {
            return res.status(400).json({ message: "Priest ID is required." });
        }

        if (!mongoose.Types.ObjectId.isValid(blessingId)) {
            return res.status(400).json({ message: "Invalid house blessing ID format." });
        }

        if (!mongoose.Types.ObjectId.isValid(priestId)) {
            return res.status(400).json({ message: "Invalid priest ID format." });
        }

        const houseBlessing = await HouseBlessing.findById(blessingId);
        if (!houseBlessing) {
            return res.status(404).json({ message: "House blessing not found." });
        }

        const priest = await Priest.findById(priestId);
        if (!priest) {
            return res.status(404).json({ message: "Priest not found." });
        }

        houseBlessing.priest = priest._id;

        await houseBlessing.save();

        res.status(200).json({
            message: "Priest assigned successfully.",
            priest: houseBlessing.priest
        });
    } catch (error) {
        console.error("Error assigning priest:", error);
        res.status(500).json({ success: false, error: error.message });
    }
};

// Get All House Blessing Requests
exports.getAllHouseBlessingRequests = async (req, res) => {
    try {
        const houseBlessingRequests = await HouseBlessing.find().populate('userId', 'name email'); 
        res.status(200).json({ houseBlessingRequests });
    } catch (error) {
        console.error('Error fetching house blessing requests:', error);
        res.status(500).json({ error: 'Failed to fetch house blessing requests' });
    }
};

// Update House Blessing Status
exports.updateHouseBlessingStatus = async (req, res) => {
    try {
        const { blessingId } = req.params;
        const { blessingStatus, confirmedAt, priest } = req.body;

        const updatedHouseBlessing = await HouseBlessing.findByIdAndUpdate(
            blessingId,
            { blessingStatus, confirmedAt, priest },
            { new: true }
        );

        if (!updatedHouseBlessing) {
            return res.status(404).json({ error: 'House blessing request not found' });
        }

        res.status(200).json({ message: 'House blessing status updated', houseBlessing: updatedHouseBlessing });
    } catch (error) {
        console.error('Error updating house blessing status:', error);
        res.status(500).json({ error: 'Failed to update house blessing status' });
    }
};

// Confirm Blessing
exports.confirmBlessing = async (req, res) => {
    try {
        const { blessingId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(blessingId)) {
            return res.status(400).json({ message: "Invalid blessing ID format." });
        }

        const houseBlessing = await HouseBlessing.findById(blessingId);

        if (!houseBlessing) {
            return res.status(404).json({ message: "Blessing not found." });
        }

        houseBlessing.blessingStatus = "Confirmed";
        houseBlessing.confirmedAt = new Date();

        await houseBlessing.save();

        res.status(200).json({ message: "Blessing confirmed.", houseBlessing });
    } catch (error) {
        console.error("Error confirming blessing:", error);
        res.status(500).json({ success: false, error: error.message });
    }
};

// Decline Blessing with Reason
exports.declineBlessing = async (req, res) => {
    try {
        const { reason } = req.body; 
        const userId = req.user._id; 
        const user = await User.findById(userId);
  
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }
        const cancellingUser = user.isAdmin ? "Admin" : user.name;
  
        const houseBlessing = await HouseBlessing.findByIdAndUpdate(
            req.params.blessingId,
            {
                blessingStatus: "Cancelled",
                cancellingReason: { user: cancellingUser, reason }, 
            },
            { new: true }
        );
        if (!houseBlessing) {
            return res.status(404).json({ message: "House Blessing not found." });
        }
  
        res.json({ message: "House Blessing cancelled successfully", houseBlessing });
    } catch (err) {
        console.error("Error cancelling house blessing:", err);
        res.status(500).json({ message: "Server error." });
    }
};

// Update Blessing Date
// exports.updateBlessingDate = async (req, res) => {
//   try {
//     const { blessingId } = req.params;
//     const { newDate, reason } = req.body;

//     const houseBlessing = await HouseBlessing.findById(blessingId);
//     if (!houseBlessing) {
//       return res.status(404).json({ message: "Blessing not found" });
//     }

//     // Just update the adminRescheduled field, not the original blessingDate
//     houseBlessing.adminRescheduled = {
//       date: newDate,
//       reason: reason,
//     };

//     await houseBlessing.save();

//     return res.status(200).json({
//       message: "Blessing reschedule recorded successfully",
//       houseBlessing,
//     });
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ message: "Internal Server Error" });
//   }
// };

exports.updateBlessingDate = async (req, res) => {
  try {
    const { blessingId } = req.params;
    const { newDate, reason } = req.body;

    const houseBlessing = await HouseBlessing.findById(blessingId);
    if (!houseBlessing) {
      return res.status(404).json({ message: "Blessing not found" });
    }

    houseBlessing.adminRescheduled = {
      date: newDate,
      reason: reason,
    };

    houseBlessing.blessingStatus = 'Rescheduled';

    houseBlessing.blessingDate = newDate;

    await houseBlessing.save();

    return res.status(200).json({
      message: "Blessing reschedule recorded successfully",
      houseBlessing,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};


// Add Comment for Admin
exports.addComment = async (req, res) => {
    try {
        const { blessingId } = req.params;
        const { selectedComment, additionalComment } = req.body;

        if (!selectedComment && !additionalComment) {
            return res.status(400).json({ message: "Comment cannot be empty." });
        }

        if (!mongoose.Types.ObjectId.isValid(blessingId)) {
            return res.status(400).json({ message: "Invalid blessing ID format." });
        }

        const houseBlessing = await HouseBlessing.findById(blessingId);
        if (!houseBlessing) {
            return res.status(404).json({ message: "House Blessing not found." });
        }

        const newComment = {
            selectedComment: selectedComment || "",
            additionalComment: additionalComment || "",
            createdAt: new Date(),
        };

        houseBlessing.comments.push(newComment);
        await houseBlessing.save();

        res.status(200).json({ message: "Comment added.", comment: newComment });
    } catch (error) {
        console.error("Error adding comment:", error);
        res.status(500).json({ success: false, error: error.message });
    }
};

// For user fetching
exports.getMySubmittedForms = async (req, res) => {
    try {
      const userId = req.user.id;
      const forms = await HouseBlessing.find({ userId: userId });
  
      if (!forms.length) {
        return res.status(404).json({ message: "No forms found for this user." });
      }
  
      res.status(200).json({ forms });
    } catch (error) {
      console.error("Error fetching submitted house blessing forms:", error);
      res.status(500).json({ message: "Failed to fetch submitted house blessing forms." });
    }
};
  
// Get House Blessing Form Details by ID
exports.getHouseBlessingFormById = async (req, res) => {
    try {
        const { formId } = req.params;

        const houseBlessingForm = await HouseBlessing.findById(formId)
            .populate('userId', 'name email')
            .populate('priest', 'title fullName');
            // .lean();

        if (!houseBlessingForm) {
            return res.status(404).json({ message: "House Blessing form not found." });
        }

        res.status(200).json(houseBlessingForm);
    } catch (error) {
        console.error("Error fetching house blessing form by ID:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};


// Get House Blessing by ID
exports.getHouseBlessingById = async (req, res) => {
    try {
        const { blessingId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(blessingId)) {
            return res.status(400).json({ message: "Invalid blessing ID format." });
        }

        const houseBlessing = await HouseBlessing.findById(blessingId)
            .populate('userId', 'name email')
            .populate('priest', 'title fullName'); // ✅ Add this line

        if (!houseBlessing) {
            return res.status(404).json({ message: "House Blessing not found." });
        }

        res.status(200).json({ houseBlessing });
    } catch (error) {
        console.error('Error fetching house blessing by ID:', error);
        res.status(500).json({ error: 'Failed to fetch house blessing by ID' });
    }
};


// Get Confirmed House Blessing Requests
exports.getConfirmedHouseBlessing = async (req, res) => {
  try {
    const confirmedHouseBlessing = await HouseBlessing.find({ blessingStatus: 'Confirmed' });
    res.status(200).json(confirmedHouseBlessing);
  } catch (error) {
    console.error("Error fetching confirmed house blessings:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// For Reports - Get House Blessings Per Month
exports.getHouseBlessingPerMonth = async (req, res) => {
  const data = await HouseBlessing.aggregate([
    {
      $group: {
        _id: { $month: "$blessingDate" },
        count: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);
  const result = Array(12).fill(0);
  data.forEach(({ _id, count }) => {
    result[_id - 1] = count;
  });
  res.json(result);
};

// Get House Blessing Status Counts
exports.getHouseBlessingStatusCounts = async (req, res) => {
  try {
    const counts = await HouseBlessing.aggregate([
      { $group: { _id: "$blessingStatus", count: { $sum: 1 } } },
    ]);
    res.status(200).json(counts);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch blessing status counts", error });
  }
};