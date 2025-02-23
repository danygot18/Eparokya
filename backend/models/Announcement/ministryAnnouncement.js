const mongoose = require('mongoose');

const announcementMinistrySchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    images: [
        {
            public_id: {
                type: String,
                required: false
            },
            url: {
                type: String,
                required: false
            },
        }
    ],   
    tags: [{ type: String, required: true }],
    ministryCategory: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ministryCategory',
        required: true,
    },
    acknowledgeCount: { type: Number, default: 0 },
    acknowledgedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    notedBy: [{ type: String, required: true }],
    isPinned: { type: Boolean, default: false },
    dateCreated: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

announcementMinistrySchema.virtual('id').get(function () {
    return this._id.toHexString();
});

announcementMinistrySchema.set('toJSON', {
    virtuals: true,
});

module.exports = mongoose.model('AnnouncementMinistry', announcementMinistrySchema);
