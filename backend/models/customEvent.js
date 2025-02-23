const mongoose = require('mongoose');

const customEventSchema = new mongoose.Schema({

    title: { type: String, required: true },
    description: { type: String, required: false },
    customeventDate: { type: Date, required: true },
    ministryCategory: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'ministryCategory',
                required: true,
            }
        ],

});

module.exports = mongoose.model('customEvent', customEventSchema);