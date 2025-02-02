const mongoose = require('mongoose');

const resourceCategorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true, 
        trim: true, 
    },
    description: {
        type: String,
        required: true,
    },
}, { 
    timestamps: true 
}); 

const ResourceCategory = mongoose.model('ResourceCategory', resourceCategorySchema);
module.exports = ResourceCategory;
