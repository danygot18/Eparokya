const mongoose = require('mongoose');

const prayerRequestIntentionSchema = new mongoose.Schema({
    offerrorsName: { type: String, required: true },
    prayerType: { type: String, 
        enum: [
            'For the sick and suffering (Para sa mga may sakit at nagdurusa)', 
            'For those who have died (Para sa mga namatay na)', 
            'Special Intentions(Natatanging Kahilingan)',
            'For family and friends (Para sa pamilya at mga kaibigan)', 
            'For those who are struggling (Para sa mga nahihirapan/naghihirap)', 
            'For peace and justice (Para sa kapayapaan at katarungan)',
            'For the Church (Para sa Simbahan)', 
            'For vocations (Para sa mga bokasyon)', 
            'For forgiveness of sins (Para sa kapatawaran ng mga kasalanan)',
            'For guidance and wisdom (Para sa gabay at karunungan)', 
            'For strength and courage (Para sa lakas at tapang)', 
            'For deeper faith and love (Para sa mas malalim na pananampalataya at pag-ibig)',
            'For perseverance (Para sa pagtitiyaga/pagtitiis)', 
            'Others (Iba pa)'
        ], 
    required: true,
    addPrayer: {
        type: String,
        required: function() {
            return this.prayerType === 'Others'; 
        }
    },
},
    prayerDescription: { type: String, required: false },
    prayerRequestDate: { type: Date, required: true },
    prayerRequestTime: { type: String, required: true },
    Intentions: [
        {
          name: { 
          type: String, 
          required: false
        },
        },
      ],

    isDone: { type: Boolean, default: false },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    createdAt: {
        type: Date,
        default: Date.now,
    },

});

module.exports = mongoose.model('prayerRequestIntention', prayerRequestIntentionSchema);