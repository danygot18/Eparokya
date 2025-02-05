const Counseling = require('../../models/counseling'); // Adjust path based on project structure
const mongoose = require('mongoose');

exports.createCounseling = async (req, res) => {
    try {
        const {
            person,
            purpose,
            contactPerson,
            contactNumber,
            address,
            counselingDate,
            counselingTime,
            userId,
        } = req.body;

        if (!userId) {
            return res.status(400).json({ error: 'User ID is required' });
        }
        const newCounseling = new Counseling({
            person,
            purpose,
            contactPerson,
            contactNumber,
            address,
            counselingDate,
            counselingTime,
            userId,
        });

        const savedCounseling = await newCounseling.save();
        res.status(201).json({ message: 'Counseling request created successfully', counseling: savedCounseling });
    } catch (error) {
        console.error('Error creating counseling request:', error);
        res.status(500).json({ error: 'Failed to create counseling request' });
    }
};

// Fetch all counseling requests for a user
exports.getUserCounselingRequests = async (req, res) => {
    try {
        const { userId } = req.params;
        const counselingRequests = await Counseling.find({ userId });
        res.status(200).json({ counselingRequests });
    } catch (error) {
        console.error('Error fetching counseling requests:', error);
        res.status(500).json({ error: 'Failed to fetch counseling requests' });
    }
};

// Fetch all counseling requests (Admin)
exports.getAllCounselingRequests = async (req, res) => {
    try {
        const counselingRequests = await Counseling.find().populate('userId', 'name email'); 
        res.status(200).json({ counselingRequests });
    } catch (error) {
        console.error('Error fetching all counseling requests:', error);
        res.status(500).json({ error: 'Failed to fetch counseling requests' });
    }
};

exports.getCounselingById = async (req, res) => {
    try {
        const { counselingId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(counselingId)) {
            return res.status(400).json({ message: "Invalid counseling ID format." });
        }

        const counseling = await Counseling.findById(counselingId).populate('userId', 'name email'); 

        if (!counseling) {
            return res.status(404).json({ message: "Counseling not found." });
        }

        res.status(200).json({ counseling });
    } catch (error) {
        console.error('Error fetching counseling by ID:', error);
        res.status(500).json({ error: 'Failed to fetch counseling by ID' });
    }
};

exports.confirmCounseling = async (req, res) => {
    try {
      const { counselingId } = req.params;
  
      if (!mongoose.Types.ObjectId.isValid(counselingId)) {
        return res.status(400).json({ message: "Invalid counseling ID format." });
      }
  
      const counseling = await Counseling.findById(counselingId);
  
      if (!counseling) {
        return res.status(404).json({ message: "Counseling not found." });
      }
  
      counseling.counselingStatus = "Confirmed";
      counseling.confirmedAt = new Date();
  
      await counseling.save();
  
      res.status(200).json({ message: "Counseling confirmed.", counseling });
    } catch (error) {
      console.error("Error confirming counseling:", error);
      res.status(500).json({ success: false, error: error.message });
    }
  };
  
  exports.declineCounseling = async (req, res) => {
    try {
      const { counselingId } = req.params;
  
      if (!mongoose.Types.ObjectId.isValid(counselingId)) {
        return res.status(400).json({ message: "Invalid counseling ID format." });
      }
  
      const counseling = await Counseling.findById(counselingId);
  
      if (!counseling) {
        return res.status(404).json({ message: "Counseling not found." });
      }
  
      counseling.counselingStatus = "Declined";
      await counseling.save();
  
      res.status(200).json({ message: "Counseling declined." });
    } catch (error) {
      console.error("Error declining counseling:", error);
      res.status(500).json({ success: false, error: error.message });
    }
  };
  
  exports.updateCounselingDate = async (req, res) => {
    try {
      const { counselingId } = req.params;
      const { newDate, reason } = req.body;
  
      const counseling = await Counseling.findById(counselingId);
      if (!counseling) {
        return res.status(404).json({ message: "Counseling not found" });
      }
  
      counseling.counselingDate = newDate;
      counseling.adminRescheduled = { date: newDate, reason: reason };
  
      await counseling.save();
  
      return res.status(200).json({ message: "Counseling date updated successfully", counseling });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  };
  
  // Comments for the admin
  exports.addComment = async (req, res) => {
    try {
      const { counselingId } = req.params;
      const { selectedComment, additionalComment } = req.body;
  
      if (!selectedComment && !additionalComment) {
        return res.status(400).json({ message: "Comment cannot be empty." });
      }
  
      if (!mongoose.Types.ObjectId.isValid(counselingId)) {
        return res.status(400).json({ message: "Invalid counsing ID format." });
      }
  
      const counseling = await Counseling.findById(counselingId);
      if (!counseling) {
        return res.status(404).json({ message: "Counseling not found." });
      }
  
      // Ensure correct field names based on your schema
      const newComment = {
        selectedComment: selectedComment || "",
        additionalComment: additionalComment || "",
        createdAt: new Date(),
      };
  
      counseling.comments.push(newComment);
      await counseling.save();
  
      res.status(200).json({ message: "Comment added.", comment: newComment });
    } catch (error) {
      console.error("Error adding comment:", error);
      res.status(500).json({ success: false, error: error.message });
    }
  };

  exports.createPriestComment = async (req, res) => {
    try {
        const { counselingId } = req.params;
        const { name } = req.body; 

        if (!name) {
            return res.status(400).json({ message: "Priest name is required." });
        }

        if (!mongoose.Types.ObjectId.isValid(counselingId)) {
            return res.status(400).json({ message: "Invalid counseling ID format." });
        }

        const counseling = await Counseling.findById(counselingId);
        if (!counseling) {
            return res.status(404).json({ message: "Counseling not found." });
        }

        // Set the priest subdocument
        counseling.priest = {
            name,
            createdAt: new Date()
        };

        await counseling.save();

        res.status(200).json({ message: "Priest comment added.", priest: counseling.priest });
    } catch (error) {
        console.error("Error adding priest comment:", error);
        res.status(500).json({ success: false, error: error.message });
    }
};

// For user fetching
exports.getMySubmittedForms = async (req, res) => {
  try {
    const userId = req.user.id;
    console.log("Authenticated User ID:", userId);

    const forms = await Counseling.find({ userId: userId });

    if (!forms.length) {
      return res.status(404).json({ message: "No forms found for this user." });
    }

    res.status(200).json({ forms });
  } catch (error) {
    console.error("Error fetching submitted counseling forms:", error);
    res.status(500).json({ message: "Failed to fetch submitted counseling forms." });
  }
};

// details 
exports.getCounselingFormById = async (req, res) => {
  try {
      const { formId } = req.params; 

      const counselingForm = await Counseling.findById(formId)
          .populate('userId', 'name email') 
          .lean();

      if (!counselingForm) {
          return res.status(404).json({ message: "Counseling form not found." });
      }

      res.status(200).json(counselingForm);
  } catch (error) {
      console.error("Error fetching counseling form by ID:", error);
      res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Update counseling status (Approve/Cancel)
exports.updateCounselingStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { counselingStatus, confirmedAt, priest } = req.body;

        const updatedCounseling = await Counseling.findByIdAndUpdate(
            id,
            { counselingStatus, confirmedAt, priest },
            { new: true }
        );

        if (!updatedCounseling) {
            return res.status(404).json({ error: 'Counseling request not found' });
        }

        res.status(200).json({ message: 'Counseling status updated', counseling: updatedCounseling });
    } catch (error) {
        console.error('Error updating counseling status:', error);
        res.status(500).json({ error: 'Failed to update counseling status' });
    }
};

// Add a priest's comment to a counseling request
exports.addCommentToCounseling = async (req, res) => {
    try {
        const { id } = req.params;
        const { priest, scheduledDate, selectedComment, additionalComment } = req.body;

        const counseling = await Counseling.findById(id);
        if (!counseling) {
            return res.status(404).json({ error: 'Counseling request not found' });
        }

        counseling.comments.push({
            priest,
            scheduledDate,
            selectedComment,
            additionalComment,
        });

        await counseling.save();
        res.status(200).json({ message: 'Comment added successfully', counseling });
    } catch (error) {
        console.error('Error adding comment:', error);
        res.status(500).json({ error: 'Failed to add comment' });
    }
};

