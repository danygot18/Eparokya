const mongoose = require('mongoose');

const counselingSchema = new mongoose.Schema({
    person: {
        fullName: { type: String, required: true },
        dateOfBirth: { type: Date, required: true },
    },

    purpose: { type: String, required: true },
    contactPerson: {
        fullName: { type: String, required: false },
        contactNumber: { type: String, required: false },
        relationship: { type: String, required: false },
    },

    contactNumber: { type: String, required: true },
    address: {
        block: { type: String, required: false },
        lot: { type: String, required: false },
        street: { type: String, required: false },
        phase: { type: String, required: false },
        baranggay: { type: String, required: false },
    },

    counselingDate: { type: Date, required: false },
    counselingTime: { type: String, required: false, },

    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    confirmedAt: {
        type: Date,
    },

    counselingStatus: {
        type: String,
        required: false,
        default: 'Pending',
        enum: ['Pending', 'Confirmed', 'Cancelled'],
    },

    createdAt: {
        type: Date,
        default: Date.now,
    },

    comments: [
        {
            priest: String,
            scheduledDate: Date,
            selectedComment: String,
            additionalComment: String,
            createdAt: {
                type: Date,
                default: Date.now,
            },
        },
    ],

    adminRescheduled: {
        date: { type: Date },
        reason: { type: String },
      },

    priest: {
        name: { type: String, required: false },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },    
      termsAndConditionsId: { type: mongoose.Schema.Types.ObjectId, ref: 'TermsAndConditions' }
});

module.exports = mongoose.model('counseling', counselingSchema);