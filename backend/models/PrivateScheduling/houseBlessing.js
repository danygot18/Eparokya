const mongoose = require('mongoose');

const houseBlessingSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    contactNumber: { type: String, required: true },
    address: {
        houseDetails: { type: String, required: true },
        block: { type: String, required: false },
        lot: { type: String, required: false },
        phase: { type: String, required: true },
        street: { type: String, required: true },
        baranggay: { type: String, required: true },
        district: { type: String, required: true },
        city: { type: String, required: true },
    },
    blessingDate: { type: Date, required: true },
    blessingTime: { type: String, required: true, },

    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    confirmedAt: {
        type: Date,
    },
    blessingStatus: {
        type: String,
        required: false,
        default: 'Pending',
        enum: ['Pending', 'Confirmed', 'Cancelled'],
    },

    createdAt: {
        type: Date,
        default: Date.now,
    },

    adminRescheduled: {
        date: { type: Date },
        reason: { type: String },
      },

    comments: [
        {
            selectedComment: String,
            additionalComment: String,
            createdAt: {
                type: Date,
                default: Date.now,
            },
        },
    ],

    priest: { type: mongoose.Schema.Types.ObjectId, ref: 'priest' },
    termsAndConditionsId: { type: mongoose.Schema.Types.ObjectId, ref: 'TermsAndConditions' }
});

module.exports = mongoose.model('houseBlessing', houseBlessingSchema);