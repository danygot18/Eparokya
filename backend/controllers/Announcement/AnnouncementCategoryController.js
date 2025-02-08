const {announcementCategory} = require('../../models/Announcement/announcementCategory'); 
const {Announcement} = require('../../models/Announcement/announcement'); 

const mongoose = require('mongoose');
const cloudinary = require('cloudinary').v2;  

exports.createAnnouncementCategory = async (req, res) => {
    try {
        console.log("Incoming Request Data:", { body: req.body, file: req.file });

        if (!req.file) {
            return res.status(400).json({ success: false, message: 'No image provided.' });
        }

        const result = await cloudinary.uploader.upload(req.file.path, {
            folder: 'announcement/category',
            width: 150,
            crop: 'scale',
        });

        const { name, description } = req.body;
        if (!name || !description) {
            return res.status(400).json({ success: false, message: 'Name and description are required.' });
        }

        // Create new announcement category
        const newAnnouncementCategory = new announcementCategory({
            name,
            description,
            image: {
                public_id: result.public_id,
                url: result.secure_url,
            },
        });

        const savedAnnouncementCategory = await newAnnouncementCategory.save();
        res.status(201).json({ success: true, announcementCategory: savedAnnouncementCategory });
    } catch (error) {
        console.error("Error creating announcementCategory:", error.message);
        res.status(500).json({ success: false, message: 'Error creating announcementCategory', error: error.message });
    }
};



exports.getAnnouncementCategory = async (req, res) => {
    try {
        const categories = await announcementCategory.find();
        res.status(200).json({ categories });
    } catch (error) {
        res.status(500).json({ error: 'Error fetching categories', details: error.message });
    }
};

exports.updateAnnouncementCategory = async (req, res) => {
    try {
        const { announcementCategoryId } = req.params;
        upload.single('image')(req, res, async (err) => {
            if (err) {
                return res.status(400).json({ error: 'Image upload failed', details: err.message });
            }
            const imageUrl = req.file ? req.file.path : req.body.image;
            const updatedCategory = await announcementCategory.findByIdAndUpdate(
                announcementCategoryId,
                {
                    name: req.body.name,
                    description: req.body.description,
                    image: imageUrl
                },
                { new: true }
            );
            if (!updatedCategory) {
                return res.status(404).json({ error: 'Announcement category not found' });
            }
            res.status(200).json(updatedCategory);
        });
    } catch (error) {
        res.status(500).json({ error: 'Error updating announcement category', details: error.message });
    }
};

exports.deleteAnnouncementCategory = async (req, res) => {
    try {
        const { announcementCatgeoryId } = req.params;
        const deletedCategory = await announcementCategory.findByIdAndDelete(announcementCatgeoryId);

        if (!deletedCategory) {
            return res.status(404).json({ error: 'Announcement category not found' });
        }

        res.status(200).json({ message: 'Announcement category deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error deleting announcement category', details: error.message });
    }
};
