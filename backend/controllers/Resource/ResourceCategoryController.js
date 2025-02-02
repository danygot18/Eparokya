const ResourceCategory = require('../../models/Resource/ResourceCategory');

exports.createResourceCategory = async (req, res) => {
    try {
        const { name, description } = req.body;

        const newCategory = new ResourceCategory({ name, description });

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
        const category = await ResourceCategory.findById(req.params.id);
        if (!category) {
            return res.status(404).json({ success: false, message: 'Resource category not found' });
        }
        res.status(200).json({ success: true, data: category });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error fetching resource category: ' + error.message });
    }
};

exports.updateResourceCategory = async (req, res) => {
    try {
        const { name, description } = req.body;
        const updatedCategory = await ResourceCategory.findByIdAndUpdate(
            req.params.id,
            { name, description },
            { new: true, runValidators: true }
        );
        if (!updatedCategory) {
            return res.status(404).json({ success: false, message: 'Resource category not found' });
        }
        res.status(200).json({ success: true, data: updatedCategory });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error updating resource category: ' + error.message });
    }
};

exports.deleteResourceCategory = async (req, res) => {
    try {
        const category = await ResourceCategory.findByIdAndDelete(req.params.id);
        if (!category) {
            return res.status(404).json({ success: false, message: 'Resource category not found' });
        }
        res.status(200).json({ success: true, message: 'Resource category deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error deleting resource category: ' + error.message });
    }
};
