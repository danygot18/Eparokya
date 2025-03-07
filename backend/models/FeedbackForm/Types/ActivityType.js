const mongoose = require('mongoose');

const ActivityTypeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
      },
});

const ActivityType = mongoose.model('ActivityType', ActivityTypeSchema);
module.exports = { ActivityType };
