const mongoose = require('mongoose');

const postResourceSchema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        description: { type: String, required: true },
        richDescription: { type: String, required: true },
        file: { type: String, default: null, required: false }, // URL of uploaded PDF
        image: { type: String, default: null, required: false }, // URL of uploaded image
        ratings: [
            {
                userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
                rating: { type: Number, min: 1, max: 5 },
            },
        ],
        bookmarks: [{ userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' } }],
        resourceCategory: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'ResourceCategory',
            required: true,
        },
    },
    { timestamps: true }
);

const PostResource = mongoose.model('PostResource', postResourceSchema);
module.exports = PostResource;
