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
