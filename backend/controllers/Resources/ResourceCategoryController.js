const ResourceCategory = require('../../models/Resources/resourceCategory'); 

exports.createResourceCategory = async (req, res) => {
    try {
        const { name } = req.body;

        const newCategory = new ResourceCategory({ name });

        const savedCategory = await newCategory.save();
        res.status(201).json({ success: true, data: savedCategory });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error creating resource category: ' + error.message });
    }
};

exports.getAllResourceCategories = async (req, res) => {
    try {
        const categories = await ResourceCategory.find();
        res.status(200).json({ success: true, data: categories });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error fetching resource categories: ' + error.message });
    }
};

exports.getResourceCategoryById = async (req, res) => {
    try {
        const category = await ResourceCategory.findById(req.params.resourceCategoryId);
        if (!category) {
            return res.status(404).json({ success: false, message: 'Resource category not found' });
        }
        res.status(200).json({ success: true, data: category });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error fetching resource category: ' + error.message });
    }
};

exports.deleteResourceCategory = async (req, res) => {
    try {
        const category = await ResourceCategory.findByIdAndDelete(req.params.resourceCategoryId);
        if (!category) {
            return res.status(404).json({ success: false, message: 'Resource category not found' });
        }
        res.status(200).json({ success: true, message: 'Resource category deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error deleting resource category: ' + error.message });
    }
};