const mongoose = require('mongoose');

const dateSchema = new mongoose.Schema({
    category: {
        type: String,
        enum: ['Wedding', 'Funeral', 'Christening', 'Counseling'],
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
    time: {
        type: String,
        required: true,
    },
    isEnabled: {
        type: Boolean,
        default: true,
    },
    maxParticipants: {
        type: Number,
        required: true,
    },
    confirmedParticipants: {
        type: Number,
        default: 0,
    },
    submittedParticipants: {
        type: Number,
        default: 0, // total submissions
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

dateSchema.methods.calculateAvailable = function() {
    return this.maxParticipants - this.confirmedParticipants;
};

dateSchema.methods.canAcceptParticipants = function () {
    return this.confirmedParticipants < this.maxParticipants;
};

const adminDate = mongoose.model('adminDate', dateSchema);

module.exports = adminDate;