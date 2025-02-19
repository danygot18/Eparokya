const mongoose = require('mongoose');

const houseBlessingSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    contactNumber: { type: String, required: true },
    address: {
        // houseDetails: { type: String, required: true },
        // block: { type: String, required: false },
        // lot: { type: String, required: false },
        // phase: { type: String, required: true },
        // street: { type: String, required: true },

        BldgNameTower: { type: String, required: false },
        LotBlockPhaseHouseNo: { type: String, required: false },
        SubdivisionVillageZone: { type: String, required: false },
        Street: { type: String, required: true },
        District: { type: String, required: true },
        
        baranggay: {
            type: String,
            enum: [
                'Bagumbayan', 'Bambang', 'Calzada', 'Cembo', 'Central Bicutan',
                'Central Signal Village', 'Comembo', 'East Rembo', 'Fort Bonifacio', 'Hagonoy',
                'Ibayo-Tipas', 'Katuparan', 'Ligid-Tipas', 'Lower Bicutan', 'Maharlika Village',
                'Napindan', 'New Lower Bicutan', 'North Daang Hari', 'North Signal Village', 'Palingon',
                'Pembo', 'Pinagsama', 'Pitogo', 'Post Proper Northside', 'Post Proper Southside',
                'Rizal', 'San Miguel', 'Santa Ana', 'South Cembo', 'South Daang Hari', 'South Signal Village',
                'Tanyag', 'Tuktukan', 'Upper Bicutan', 'Ususan', 'Wawa', 'West Rembo', 'Western Bicutan', 
                'Others'
            ],
            required: true
        },
        customBarangay: {
            type: String,
            required: function() {
                return this.address.baranggay === 'Others'; 
            }
        },
        district: { type: String, required: true },
        city: { type: String, enum:['Taguig City', 'Others'],  required: true },
        customCity: {
            type: String,
            required: function() {
                return this.address.city === 'Others'; 
            }
        },
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

    cancellingReason: {
        user: { type: String, enum: ['Admin, User'] },
        reason: { type: String },
    },

    priest: { type: mongoose.Schema.Types.ObjectId, ref: 'priest' },
    termsAndConditionsId: { type: mongoose.Schema.Types.ObjectId, ref: 'TermsAndConditions' }
});

module.exports = mongoose.model('houseBlessing', houseBlessingSchema);