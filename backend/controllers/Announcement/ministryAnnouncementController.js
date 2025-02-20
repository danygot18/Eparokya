const AnnouncementMinistry = require('../../models/Announcement/ministryAnnouncement');
// const ministryCategory  = require('../models/ministryCategory'); 
const cloudinary = require('cloudinary').v2;

exports.createAnnouncement = async (req, res) => {
    try {
        const { ministryCategoryId } = req.params;
        let imagesLinks = [];

        // Upload images to Cloudinary directly
        const uploadToCloudinary = async (file, folder) => {
            if (!file) throw new Error('File is required for upload.');
            const result = await cloudinary.uploader.upload(file.path, { folder });
            return { public_id: result.public_id, url: result.secure_url };
        };

        // Upload images if present
        try {
            if (req.files && req.files.length > 0) {
                imagesLinks = await Promise.all(
                    req.files.map(file => uploadToCloudinary(file, 'eparokya/announcements'))
                );
            }
        } catch (uploadError) {
            return res.status(400).json({ success: false, message: uploadError.message });
        }

        // Prepare announcement data
        const announcementData = {
            ...req.body,
            tags: Array.isArray(req.body.tags)
                ? req.body.tags
                : req.body.tags
                    ? req.body.tags.split(',').map(tag => tag.trim())
                    : [],
            notedBy: Array.isArray(req.body.notedBy)
                ? req.body.notedBy
                : req.body.notedBy
                    ? req.body.notedBy.split(',').map(name => name.trim())
                    : [],
            images: imagesLinks.length ? imagesLinks : [],
            ministryCategory: ministryCategoryId,
        };

        // Validate required fields
        if (!announcementData.title || !announcementData.description || !announcementData.tags.length || !announcementData.notedBy.length) {
            return res.status(400).json({ message: 'All required fields must be filled.' });
        }

        // Create and save the announcement
        const newAnnouncement = new AnnouncementMinistry(announcementData);
        const savedAnnouncement = await newAnnouncement.save();

        // Respond with properly formatted announcement data
        res.status(201).json({
            success: true,
            message: 'Announcement created successfully.',
            announcement: savedAnnouncement.toJSON(), // Correctly convert Mongoose object
        });
    } catch (error) {
        console.error('Detailed Error:', error); // Log the raw error object
        console.error('Error as JSON:', JSON.stringify(error, Object.getOwnPropertyNames(error), 2)); // Log full error details
    
        res.status(500).json({
            success: false,
            message: 'Failed to create announcement.',
            error: error.message,
            stack: error.stack, // This will give you the full stack trace
        });
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
