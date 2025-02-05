const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    link: { type: String, required: true },
    file: {
      public_id: { type: String, default: null },
      url: { type: String, default: null },
    },
    image: {
      public_id: { type: String, default: null },
      url: { type: String, default: null },
    },
    images: {
      type: [
        {
          public_id: { type: String, default: null },
          url: { type: String, default: null },
        },
      ],
      default: [],
    },
    videos: {
      type: [
        {
          public_id: { type: String, default: null },
          url: { type: String, default: null },
        },
      ],
      default: [],
    },
    ratings: [
      {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        rating: { type: Number, min: 1, max: 5 },
      },
    ],
    bookmarks: [
      { userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' } }
    ],
    resourceCategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ResourceCategory',
      required: true,
    },
  },
  { timestamps: true }
);

const Resource = mongoose.model('resource', resourceSchema);
module.exports = Resource;
