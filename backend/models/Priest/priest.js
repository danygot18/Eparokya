const mongoose = require('mongoose');

const priestSchema = new mongoose.Schema({
    title : { type: String, required: true },
    position : { type: String, required: true },
    fullName: { type: String, required: true },
    nickName: { type: String, required: false },
    birthDate: { type: Date, required: true },
    Seminary: { type: String, required: true },
    ordinationDate: { type: Date, required: true },
    parishDurationYear: { type: String, required: true },
    isActive: { type: Boolean, required: true, default: false },
    isAvailable: { type: Boolean, required: true, default: false },
    isRetired: { type: Boolean, required: true, default: false },
    image: {
        public_id: {
            type: String,
            required: false,
        },
        url: {
            type: String,
            required: false,
        },
    },

    createdAt: {
        type: Date,
        default: Date.now,
    },
    // contributions: [{
    //     title: { type: String, required: true },
    //     decription: { type: String, required: false },
    //     year: { type: String, required: true },
    // }],


});

module.exports = mongoose.model('priest', priestSchema);