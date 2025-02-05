const mongoose = require('mongoose');

const membersSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        trim: true,
    },
    middleName: {
        type: String,
        trim: true,
    },
    lastName: {
        type: String,
        required: true,
        trim: true,
    },
    age: {
        type: Number,
        required: true,
    },
    birthday: {
        type: Date,
        required: true,
    },
    address: {
        baranggay: String,
        zip: String,
        city: String,
        country: String,
    },
    position: {
        type: String,
        required: true,
    },
    contributions: [
        {
            title: {type: String, default: ''},
            description: {type: String, default: ''},
            image: {type: String, default: ''}, 
            
        },
    ],
    memberYearBatch: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'memberYearBatchCategory',
        required: true,
    },
    // ministryCategory: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'ministryCategory',
    //     required: true,
    // },
    image: {
        type: String, 
        default: '',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Members', membersSchema);
