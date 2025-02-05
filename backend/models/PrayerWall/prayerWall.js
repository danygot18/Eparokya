const mongoose = require('mongoose');

const prayerWallSchema = new mongoose.Schema({
    title: { type: String, required: false },
    prayerRequest: { type: String, required: true },
    contact: { type: String, required: false },
    prayerWallSharing: {
        type: String,
        required: true,
        enum: ['anonymous', 'myName'],
    },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    prayerWallStatus: {
        type: String,
        required: false,
        default: 'Pending',
        enum: ['Pending', 'Confirmed', 'Cancelled'],
    },
    likedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    includeBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    createdAt: { type: Date, default: Date.now },
    confirmedAt: { type: Date },
    
// softDelete
    isDeletedByUser: { type: Boolean, default: false }, 
});

module.exports = mongoose.model('PrayerWall', prayerWallSchema);
