const mongoose = require('mongoose');

const prayerRequestSchema = new mongoose.Schema({
    offerrorsName: { type: String, required: true },
    prayerType: { type: String, enum: ['Eternal Repose(Patay)', 'Thanks Giving(Pasasalamat)', 'Special Intentions(Natatanging Kahilingan)'], required: true },
    prayerRequestDate: { type: Date, required: true },
    Intentions: [
        {
          name: { 
          type: String, 
          required: false
        },
        },
      ],

    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    createdAt: {
        type: Date,
        default: Date.now,
    },

});

module.exports = mongoose.model('prayerRequest', prayerRequestSchema);