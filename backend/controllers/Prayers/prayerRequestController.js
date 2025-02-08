const PrayerRequest = require('../../models/PrayerWall/prayerRequest');
const mongoose = require('mongoose');

exports.createPrayerRequest = async (req, res) => {
    try {
        const {
            offerrorsName,
            prayerType,
            prayerRequestDate,
            Intentions,
            userId,
        } = req.body;

        const newPrayerRequest = new PrayerRequest({
            offerrorsName,
            prayerType,
            prayerRequestDate,
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

        prayerRequest.Intentions = prayerRequest.Intentions.filter((intention) => intention._id.toString() !== intentionId);
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
