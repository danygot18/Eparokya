const mongoose = require('mongoose');

const EventTypeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
      },
});

const EventType = mongoose.model('EventType', EventTypeSchema);
module.exports = { EventType };
