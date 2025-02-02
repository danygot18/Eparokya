const mongoose = require('mongoose');

// Reply Schema
const replySchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
    text: { type: String, required: true },
    likedBy: { type: [mongoose.Schema.Types.ObjectId], ref: 'User', default: [] },
    dateCreated: { type: Date, default: Date.now },
});

replySchema.virtual('id').get(function () {
    return this._id.toHexString();
});

replySchema.set('toJSON', {
    virtuals: true,
});

const Reply = mongoose.model('Reply', replySchema);

// Comment Schema
const commentSchema = new mongoose.Schema({
    announcement: { type: mongoose.Schema.Types.ObjectId, ref: 'Announcement', required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    text: { type: String, required: true },
    likedBy: { type: [mongoose.Schema.Types.ObjectId], ref: 'User', default: [] },
    replies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Reply' }],
    dateCreated: { type: Date, default: Date.now },

});

commentSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

commentSchema.set('toJSON', {
    virtuals: true,
});

const Comment = mongoose.model('Comment', commentSchema);

// Announcement Schema
const announcementSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    richDescription: { type: String, default: '', required: true },
    image: { type: String, default: '' },
    images: [
        {
            public_id: {
                type: String,
                required: true
            },
            url: {
                type: String,
                required: true
            },
        }
    ],    videos: [{ type: String }],
    announcementCategory: { type: mongoose.Schema.Types.ObjectId, ref: 'announcementCategory' },
    tags: [{ type: String, required: true }],
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
    commentsCount: { type: Number, default: 0 },
    likedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    isFeatured: { type: Boolean, default: false },
    dateCreated: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

announcementSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

announcementSchema.set('toJSON', {
    virtuals: true,
});

const Announcement = mongoose.model('Announcement', announcementSchema);

module.exports = { Announcement, Comment, Reply };