const Priest = require('../../models/Priest/priest');
const mongoose = require('mongoose');
const cloudinary = require('cloudinary').v2;  

exports.getAllPriests = async (req, res) => {
    try {
        const priests = await Priest.find();
        res.status(200).json(priests);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getPriestById = async (req, res) => {
    try {
        const priest = await Priest.findById(req.params.priestId);
        if (!priest) {
            return res.status(404).json({ message: 'Priest not found' });
        }
        res.status(200).json(priest);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.createPriest = async (req, res) => {
    try {
        console.log("Incoming Request Data:", { body: req.body, file: req.file });

        if (!req.file) {
            return res.status(400).json({ success: false, message: 'No image provided.' });
        }

        const result = await cloudinary.uploader.upload(req.file.path, {
            folder: 'priests',
            width: 150,
            crop: 'scale',
        });

        const { title, position, fullName, nickName, birthDate, Seminary, ordinationDate, parishDurationYear, isActive, isAvailable, isRetired, isTransfered } = req.body;
        if (!title || !position || !fullName || !birthDate || !Seminary || !ordinationDate || !parishDurationYear) {
            return res.status(400).json({ success: false, message: 'All required fields must be filled.' });
        }

        const newPriest = new Priest({
            title,
            position,
            fullName,
            nickName,
            birthDate,
            Seminary,
            ordinationDate,
            parishDurationYear,
            isActive,
            isAvailable,
            isRetired,
            isTransfered,
            image: {
                public_id: result.public_id,
                url: result.secure_url,
            },
        });

        const savedPriest = await newPriest.save();
        res.status(201).json({ success: true, priest: savedPriest });
    } catch (error) {
        console.error("Error creating priest:", error.message);
        res.status(500).json({ success: false, message: 'Error creating priest', error: error.message });
    }
};

exports.updatePriestStatus = async (req, res) => {
try {
    const { field, value } = req.body;
    const validFields = ['isActive', 'isAvailable', 'isRetired', 'isTransfered'];
    
    if (!validFields.includes(field)) {
        return res.status(400).json({ message: 'Invalid field update' });
    }

    const updatedPriest = await Priest.findByIdAndUpdate(
        req.params.priestId,
        { [field]: value },
        { new: true }
    );

    if (!updatedPriest) {
        return res.status(404).json({ message: 'Priest not found' });
    }

    res.json({ message: `${field} updated successfully`, [field]: updatedPriest[field] });
} catch (error) {
    console.error('Error updating priest:', error);
    res.status(500).json({ message: 'Server error' });
}
};

exports.getAvailablePriest = async (req, res) => {
    try {
        const availablePriests = await Priest.find({ isAvailable: true });
        res.json({ priests: availablePriests });
    } catch (error) {
        console.error('Error fetching available priests:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.updatePriest = async (req, res) => {
    try {
        const priest = await Priest.findByIdAndUpdate(req.params.priestId, req.body, { new: true, runValidators: true });
        if (!priest) {
            return res.status(404).json({ message: 'Priest not found' });
        }
        res.status(200).json(priest);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.deletePriest = async (req, res) => {
    try {
        const priest = await Priest.findByIdAndDelete(req.params.priestId);
        if (!priest) {
            return res.status(404).json({ message: 'Priest not found' });
        }
        res.status(200).json({ message: 'Priest deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
