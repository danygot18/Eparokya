const Mission = require('../models/missions');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;

exports.getAllMissions = async (req, res) => {
    try {
        const missions = await Mission.find().populate('Ministry');
        res.json(missions);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getMissionById = async (req, res) => {
    try {
        const mission = await Mission.findById(req.params.id).populate('Ministry');
        if (!mission) return res.status(404).json({ message: 'Mission not found' });
        res.json(mission);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.createMission = async (req, res) => {
    try {
        let singleImageLink = '';
        let multipleImagesLinks = [];

        // Handle single image upload
        if (req.files && req.files['Image[single]']) {
            const singleFile = req.files['Image[single]'][0];
            const result = await cloudinary.uploader.upload(singleFile.path, {
                folder: "eparokya/missions",
            });
            singleImageLink = result.secure_url;
        }

        // Handle multiple images upload
        if (req.files && req.files['Image[multiple]']) {
            for (let file of req.files['Image[multiple]']) {
                const result = await cloudinary.uploader.upload(file.path, {
                    folder: "eparokya/missions",
                });
                multipleImagesLinks.push(result.secure_url);
            }
        }

        const {
            Title,
            Description,
            Location,
            Budget,
            BudgetFrom,
            Facilitators,
            Volunteers,
            Ministry,
            Author,
            Date,
            Time
        } = req.body;

        const newMission = new Mission({
            Title,
            Description,
            Location,
            Budget,
            BudgetFrom,
            Image: {
                single: singleImageLink,
                multiple: multipleImagesLinks,
            },
            Facilitators: Array.isArray(Facilitators) ? Facilitators : [Facilitators],
            Volunteers: Array.isArray(Volunteers) ? Volunteers : [Volunteers],
            Ministry,
            Author,
            Date,
            Time,
        });
        const savedMission = await newMission.save();
        res.status(201).json({ success: true, mission: savedMission });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Error creating mission', error: err.message });
    }
};

exports.updateMission = async (req, res) => {
    try {
        const mission = await Mission.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!mission) return res.status(404).json({ message: 'Mission not found' });
        res.json(mission);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.deleteMission = async (req, res) => {
    try {
        const mission = await Mission.findByIdAndDelete(req.params.id);
        if (!mission) return res.status(404).json({ message: 'Mission not found' });
        res.json({ message: 'Mission deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};