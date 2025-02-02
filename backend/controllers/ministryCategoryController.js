const ministryCategory  = require('../models/ministryCategory'); 
const mongoose = require('mongoose');

exports.createMinistry = async (req, res) => {
    try {
        const ministry = new ministryCategory({ 
            name: req.body.name,
            description: req.body.description,
        });

        const savedMinistry = await ministry.save();
        res.status(201).json({ success: true, data: savedMinistry });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Failed to create ministry: ' + error.message });
    }
};

exports.getAllMinistryCategories = async (req, res) => {
    try {
        const categories = await ministryCategory.find();
        res.status(200).json(categories);
    } catch (error) {
        console.error('Error fetching ministry categories:', error);
        res.status(500).json({ error: 'Error fetching ministry categories', details: error.message });
    }
};

exports.getMinistryId = async (req, res) => {
    try {
        const ministry = await ministryCategory.findById(req.params.ministryId);
        if (!ministry) {
            return res.status(404).json({ success: false, message: 'The ministry with the given ID was not found.' });
        }
        res.status(200).json({ success: true, data: ministry });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Failed to retrieve ministry: ' + error.message });
    }
};

exports.deleteMinistry = async (req, res) => {
    try {
        const ministry = await ministryCategory.findByIdAndRemove(req.params.ministryId);
        if (!ministry) {
            return res.status(404).json({ success: false, message: "Ministry not found!" });
        }
        res.status(200).json({ success: true, message: 'Ministry deleted successfully!' });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Failed to delete ministry: ' + error.message });
    }
};

exports.updateMinistryCategory = async (req, res) => {
    const { ministryId } = req.params; 
    const { name, description } = req.body; 
    try {
      const updatedCategory = await ministryCategory.findByIdAndUpdate(
        ministryId,
        { name, description },
        { new: true, runValidators: true } 
      );
  
      if (!updatedCategory) {
        return res.status(404).json({ message: "Ministry category not found." });
      }
  
      res.status(200).json(updatedCategory); 
    } catch (error) {
      console.error("Error updating ministry category:", error);
      res.status(500).json({ message: "Error updating ministry category." });
    }
  };