const multer = require('multer');
const mongoose = require('mongoose');
const cloudinary = require('cloudinary').v2;  
const { Announcement, Comment, Reply } = require('../../models/Announcement/announcement');

// Create a new event post
exports.createAnnouncement = async (req, res) => {
    try {
        let imagesLinks = [];
        let videoLink = '';

        // Handle image upload (multiple images or single image)
        if (req.files && req.files.images) {
            for (let file of req.files.images) {
                const result = await cloudinary.uploader.upload(file.path, {
                    folder: "eparokya/announcement",
                    width: 150,
                    crop: "scale",
                });
                imagesLinks.push({
                    public_id: result.public_id,
                    url: result.secure_url,
                });
            }
        }

        // Handle video upload (if any)
        if (req.files && req.files.video) {
            if (Array.isArray(req.files.video) && req.files.video.length > 0) {
                const result = await cloudinary.uploader.upload(req.files.video[0].path, {
                    folder: "eparokya/announcement",
                    resource_type: "video", // Video upload
                });
                videoLink = result.secure_url;
            } else if (req.files.video) {
                const result = await cloudinary.uploader.upload(req.files.video.path, {
                    folder: "eparokya/announcement",
                    resource_type: "video",
                });
                videoLink = result.secure_url;
            }
        }

        const { name, description, richDescription, tags, announcementCategory } = req.body;
        
        const newAnnouncement = new Announcement({
            name,
            description,
            richDescription,
            tags,
            announcementCategory,
            images: imagesLinks, 
            videos: videoLink ? [videoLink] : [], 
            image: imagesLinks.length > 0 ? imagesLinks[0].url : "", 
        });

        const savedAnnouncement = await newAnnouncement.save();
        res.status(201).json({ success: true, announcement: savedAnnouncement });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Error creating announcement', error: error.message });
    }
};

// Get all announcements
exports.getAllAnnouncements = async (req, res) => {
    try {
        const announcements = await Announcement.find()
            .populate('announcementCategory', 'name description') 
            .exec();

        res.status(200).json({
            success: true,
            count: announcements.length,
            announcements,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Failed to retrieve announcements',
            error: error.message,
        });
    }
};

// Delete announcement
exports.deleteAnnouncement = async (req, res) => {
    try {
        const announcement = await Announcement.findById(req.params.id);
        if (!announcement) {
            return res.status(404).json({
                success: false,
                message: 'Announcement not found',
            });
        }

        // Delete images from Cloudinary
        if (announcement.images && announcement.images.length > 0) {
            for (const image of announcement.images) {
                await cloudinary.uploader.destroy(image.public_id);
            }
        }

        await Announcement.findByIdAndDelete(req.params.id);

        res.status(200).json({
            success: true,
            message: 'Announcement and images deleted successfully',
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Server Error',
        });
    }
};

// Update announcement
exports.updateAnnouncement = async (req, res) => {
    try {
        const announcementId = req.params.id;

        const announcement = await Announcement.findById(announcementId);
        if (!announcement) {
            return res.status(404).json({
                success: false,
                message: 'Announcement not found',
            });
        }

        let imagesLinks = [];

        // Handling image update
        if (req.files || req.file || req.body.images) {

            // Delete existing images from Cloudinary
            if (announcement.images && announcement.images.length > 0) {
                for (const image of announcement.images) {
                    await cloudinary.uploader.destroy(image.public_id);
                }
            }

            // Process new images
            if (req.files) {
                for (let file of req.files) {
                    const result = await cloudinary.uploader.upload(file.path, {
                        folder: 'eparokya/announcement',
                        width: 150,
                        crop: "scale",
                    });
                    imagesLinks.push({
                        public_id: result.public_id,
                        url: result.secure_url,
                    });
                }
            }

            // Single image upload (if any)
            if (req.file) {
                const result = await cloudinary.uploader.upload(req.file.path, {
                    folder: 'eparokya/announcement',
                    width: 150,
                    crop: "scale",
                });
                imagesLinks.push({
                    public_id: result.public_id,
                    url: result.secure_url,
                });
            }

            // Process images from the body (if any)
            if (req.body.images) {
                if (typeof req.body.images === 'string') {
                    imagesLinks.push({
                        public_id: req.body.images,
                        url: req.body.images,
                    });
                } else {
                    req.body.images.forEach(image => {
                        imagesLinks.push({
                            public_id: image.public_id,
                            url: image.url,
                        });
                    });
                }
            }
        } else {
            imagesLinks = announcement.images;
        }

        announcement.name = req.body.name || announcement.name;
        announcement.description = req.body.description || announcement.description;
        announcement.richDescription = req.body.richDescription || announcement.richDescription;
        announcement.tags = req.body.tags || announcement.tags;
        announcement.announcementCategory = req.body.announcementCategory || announcement.announcementCategory;
        announcement.images = imagesLinks;
        announcement.image = imagesLinks.length > 0 ? imagesLinks[0].url : announcement.image; // Updating single image URL

        const updatedAnnouncement = await announcement.save();

        res.status(200).json({
            success: true,
            message: 'Announcement updated successfully',
            announcement: updatedAnnouncement,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Server Error',
        });
    }
};

// Get announcement by ID
exports.getAnnouncementById = async (req, res) => {
    try {
        const announcementId = req.params.announcementId;
        const announcement = await Announcement.findById(announcementId)
            .populate('comments')
            .populate('likedBy', 'name avatar');

        if (!announcement) {
            return res.status(404).json({ success: false, message: 'Announcement not found' });
        }

        res.status(200).json({ success: true, announcement });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

exports.likeAnnouncement = async (req, res) => {
    const { announcementId } = req.params;
    const userId = req.user.id;  // This should now be available from middleware

    try {
        const announcement = await Announcement.findById(announcementId);
        if (!announcement) {
            return res.status(404).json({ message: 'Announcement not found' });
        }

        const alreadyLiked = announcement.likedBy.includes(userId);

        if (alreadyLiked) {
            announcement.likedBy = announcement.likedBy.filter(uid => uid.toString() !== userId);
        } else {
            announcement.likedBy.push(userId);
        }

        await announcement.save();
        res.status(200).json({ liked: !alreadyLiked });
    } catch (error) {
        console.error('Error liking announcement:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.unlikeAnnouncement = async (req, res) => {
    try {
        const { announcementId, userId } = req.body;
        const announcement = await Announcement.findById(announcementId);
        if (!announcement) {
            return res.status(404).json({ message: "Announcement not found" });
        }
        const index = announcement.likes.indexOf(userId);
        if (index === -1) {
            return res.status(400).json({ message: "You have not liked this announcement" });
        }
        announcement.likes.splice(index, 1);
        await announcement.save();
        return res.json({ likes: announcement.likes.length });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "An error occurred while unliking the announcement" });
    }
};

// Get paginated events
// exports.getEvents = async (req, res) => {
//     try {
//         const resPerPage = 4;
//         const page = Number(req.query.page) || 1;
//         const eventsCount = await Event.countDocuments();

//         const events = await Event.find()
//             .skip(resPerPage * (page - 1))
//             .limit(resPerPage);

//         res.status(200).json({
//             success: true,
//             count: events.length,
//             eventsCount,
//             events,
//             resPerPage,
//             currentPage: page,
//             totalPages: Math.ceil(eventsCount / resPerPage)
//         });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({
//             success: false,
//             message: 'Failed to retrieve events',
//             error: error.message,
//         });
//     }
// };

exports.addCommentToEvent = async (req, res) => {
    try {
        const { eventId } = req.params;
        const { userId, text } = req.body;

        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).json({ success: false, message: 'Event not found' });
        }

        const newComment = new Comment({ announcement: eventId, user: userId, text });
        const savedComment = await newComment.save();

        event.comments.push(savedComment._id);
        event.commentsCount = event.comments.length;
        await event.save();

        res.status(201).json({ success: true, comment: savedComment });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to add comment', error: error.message });
    }
};

exports.replyToComment = async (req, res) => {
    try {
        const { commentId } = req.params;
        const { userId, text } = req.body;

        const comment = await Comment.findById(commentId);
        if (!comment) {
            return res.status(404).json({ success: false, message: 'Comment not found' });
        }

        const newReply = new Reply({ user: userId, text });
        const savedReply = await newReply.save();

        comment.replies.push(savedReply._id);
        await comment.save();

        res.status(201).json({ success: true, reply: savedReply });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to reply to comment', error: error.message });
    }
};
