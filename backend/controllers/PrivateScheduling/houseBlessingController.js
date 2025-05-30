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
            blessingDate, 
            blessingTime,
            userId,
        } = req.body;

        if (!fullName || !contactNumber || !address || !blessingDate || !blessingTime || !userId) {
            return res.status(400).json({ error: 'All fields are required.' });
        }

        const newHouseBlessing = new HouseBlessing({
            fullName,
            contactNumber,
            address: {
                ...address,
                customBarangay: address.barangay === 'Others' ? address.customBarangay : undefined,
                customCity: address.city === 'Others' ? address.customCity : undefined,
            },
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
        const { name } = req.body; 

        if (!name) {
            return res.status(400).json({ message: "Priest name is required." });
        }

        if (!mongoose.Types.ObjectId.isValid(blessingId)) {
            return res.status(400).json({ message: "Invalid house blessing ID format." });
        }

        const houseBlessing = await HouseBlessing.findById(blessingId);
        if (!houseBlessing) {
            return res.status(404).json({ message: "House blessing not found." });
        }

        houseBlessing.priest = name;

        await houseBlessing.save();

        res.status(200).json({ message: "Priest added successfully.", priest: houseBlessing.priest });
    } catch (error) {
        console.error("Error adding priest:", error);
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

        houseBlessing.blessingStatus = "Confirmed"; // Use instance, not model
        houseBlessing.confirmedAt = new Date();

        await houseBlessing.save();

        res.status(200).json({ message: "Blessing confirmed.", houseBlessing });
    } catch (error) {
        console.error("Error confirming blessing:", error);
        res.status(500).json({ success: false, error: error.message });
    }
};

// Decline Blessing
// exports.declineBlessing = async (req, res) => {
//     try {
//         const { blessingId } = req.params;

//         if (!mongoose.Types.ObjectId.isValid(blessingId)) {
//             return res.status(400).json({ message: "Invalid wedding ID format." });
//         }

//         const houseBlessing = await HouseBlessing.findById(blessingId);

//         if (!houseBlessing) {
//             return res.status(404).json({ message: "House Blessing not found." });
//         }

//         houseBlessing.blessingStatus = "Declined";
//         await houseBlessing.save();

//         res.status(200).json({ message: "Blessing declined." });
//     } catch (error) {
//         console.error("Error declining blessing:", error);
//         res.status(500).json({ success: false, error: error.message });
//     }
// };


// Decline Counseling w/Reason
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
exports.updateBlessingDate = async (req, res) => {
  try {
    const { blessingId } = req.params;
    const { newDate, reason } = req.body;

    const houseBlessing = await HouseBlessing.findById(blessingId);
    if (!houseBlessing) {
      return res.status(404).json({ message: "Blessing not found" });
    }

    houseBlessing.blessingDate = newDate;
    houseBlessing.adminRescheduled = { date: newDate, reason: reason };

    await houseBlessing.save();

    return res.status(200).json({ message: "Blessing date updated successfully", houseBlessing });
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
      console.log("Authenticated User ID:", userId);
  
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
  
  // details 
  exports.getHouseBlessingFormById = async (req, res) => {
    try {
        const { formId } = req.params; 

        const houseBlessingForm = await HouseBlessing.findById(formId)
            .populate('userId', 'name email') 
            .lean();

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

        const houseBlessing = await HouseBlessing.findById(blessingId).populate('userId', 'name email'); // Populate user info if needed

        if (!houseBlessing) {
            return res.status(404).json({ message: "House Blessing not found." });
        }

        res.status(200).json({ houseBlessing });
    } catch (error) {
        console.error('Error fetching house blessing by ID:', error);
        res.status(500).json({ error: 'Failed to fetch house blessing by ID' });
    }
};
