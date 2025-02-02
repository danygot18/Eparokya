const mongoose = require('mongoose');

const announcementCategorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    image: { 
        public_id: {
            type: String,
            required: true,
        },
        url: {
            type: String,
            required: true,
        },
    },
});

const announcementCategory = mongoose.model('announcementCategory', announcementCategorySchema);
module.exports = { announcementCategory };
