const AnnouncementMinistry = require('../../models/Announcement/ministryAnnouncement');
// const ministryCategory  = require('../models/ministryCategory'); 

exports.createAnnouncement = async (req, res) => {
    try {
        const { ministryCategoryId } = req.params;

        // Extra logging for better debugging
        console.log("Incoming Ministry Category ID:", ministryCategoryId);
        console.log("Incoming Data:", JSON.stringify(req.body, null, 2));

        const announcementData = {
            ...req.body,
            ministryCategory: ministryCategoryId, // Attach ministryCategory from the URL
        };

        // Check required fields before saving
        if (!announcementData.title || !announcementData.description) {
            return res.status(400).json({ message: 'Title and Description are required.' });
        }

        const newAnnouncement = new AnnouncementMinistry(announcementData);
        await newAnnouncement.save();

        res.status(201).json({
            message: 'Announcement created successfully.',
            announcement: newAnnouncement,
        });
    } catch (error) {
        console.error('Error creating announcement:', error);
        res.status(500).json({ message: 'Failed to create announcement.' });
    }
};



exports.getAllAnnouncements = async (req, res) => {
    try {
        const announcements = await AnnouncementMinistry.find().populate('ministryCategory', 'name');
        res.status(200).json(announcements);
    } catch (error) {
        console.error('Error fetching announcements:', error);
        res.status(500).json({ message: 'Failed to retrieve announcements.' });
    }
};

exports.getAnnouncementById = async (req, res) => {
    try {
        const announcement = await AnnouncementMinistry.findById(req.params.minsitryAnnouncementId).populate('ministryCategory', 'name');
        if (!announcement) return res.status(404).json({ message: 'Announcement not found.' });
        res.status(200).json(announcement);
    } catch (error) {
        console.error('Error fetching announcement:', error);
        res.status(500).json({ message: 'Failed to retrieve announcement.' });
    }
};

exports.updateAnnouncement = async (req, res) => {
    try {
        const updatedAnnouncement = await AnnouncementMinistry.findByIdAndUpdate(req.params.minsitryAnnouncementId, req.body, { new: true });
        if (!updatedAnnouncement) return res.status(404).json({ message: 'Announcement not found.' });
        res.status(200).json({ message: 'Announcement updated successfully.', updatedAnnouncement });
    } catch (error) {
        console.error('Error updating announcement:', error);
        res.status(500).json({ message: 'Failed to update announcement.' });
    }
};

exports.deleteAnnouncement = async (req, res) => {
    try {
        const deletedAnnouncement = await AnnouncementMinistry.findByIdAndDelete(req.params.minsitryAnnouncementId);
        if (!deletedAnnouncement) return res.status(404).json({ message: 'Announcement not found.' });
        res.status(200).json({ message: 'Announcement deleted successfully.' });
    } catch (error) {
        console.error('Error deleting announcement:', error);
        res.status(500).json({ message: 'Failed to delete announcement.' });
    }
};

exports.acknowledgeAnnouncement = async (req, res) => {
    try {
        const { userId } = req.body;
        const announcement = await AnnouncementMinistry.findById(req.params.minsitryAnnouncementId);

        if (!announcement) return res.status(404).json({ message: 'Announcement not found.' });
        if (announcement.acknowledgedBy.includes(userId)) return res.status(400).json({ message: 'User already acknowledged this announcement.' });

        announcement.acknowledgedBy.push(userId);
        announcement.acknowledgeCount += 1;
        await announcement.save();

        res.status(200).json({ message: 'Acknowledged successfully.', announcement });
    } catch (error) {
        console.error('Error acknowledging announcement:', error);
        res.status(500).json({ message: 'Failed to acknowledge announcement.' });
    }
};
