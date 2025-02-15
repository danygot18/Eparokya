const mongoose = require('mongoose');

const membersSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        trim: true,
    },
    middleName: {
        type: String,
        trim: false,
    },
    lastName: {
        type: String,
        required: true,
        trim: true,
    },
    age: {
        type: Number,
        required: false,
    },
    birthday: {
        type: Date,
        required: false,
    },
    address: {
        baranggay: String,
        zip: String,
        city: String,
    },
    position: {
        type: String, 
        enum: ['Coordinator', 'Assistant Coordinator'],
        default: 'Member',
        required: true,
        others: {type: String, required: false},
    },
    contributions: [
        {
            title: {type: String, default: '', required: false},
            description: {type: String, default: '', required: false},
            
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
});

module.exports = mongoose.model('Members', membersSchema);
