const HouseBlessing = require('../../models/PrivateScheduling/houseBlessing'); 
const mongoose = require('mongoose');

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
            address,
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

exports.getAllHouseBlessingRequests = async (req, res) => {
    try {
        const houseBlessingRequests = await HouseBlessing.find().populate('userId', 'name email'); 
        res.status(200).json({ houseBlessingRequests });
    } catch (error) {
        console.error('Error fetching house blessing requests:', error);
        res.status(500).json({ error: 'Failed to fetch house blessing requests' });
    }
};

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

// Add a priest's comment to a house blessing request
exports.addCommentToHouseBlessing = async (req, res) => {
    try {
        const { blessingId } = req.params;
        const { priest, scheduledDate, selectedComment, additionalComment } = req.body;

        const houseBlessing = await HouseBlessing.findById(blessingId);
        if (!houseBlessing) {
            return res.status(404).json({ error: 'House blessing request not found' });
        }

        houseBlessing.comments.push({
            priest,
            scheduledDate,
            selectedComment,
            additionalComment,
        });

        await houseBlessing.save();
        res.status(200).json({ message: 'Comment added successfully', houseBlessing });
    } catch (error) {
        console.error('Error adding comment:', error);
        res.status(500).json({ error: 'Failed to add comment' });
    }
};
