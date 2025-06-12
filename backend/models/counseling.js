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
        relationship: { type: String, enum: [
            'Mother/Nanay', 
            'Father/Tatay', 
            'Child/Anak', 
            'Sibling/Kapatid', 
            'Spouse/Asawa', 
            'Stepparent', 
            'Stepchild', 
            'In-law',
            'Godparent',
            'Godchild', 
            'Relative/Kamag-anak', 
            'Guardian', 
            'Friend/Kaibigan'], required: true },
    },

    contactNumber: { type: String, required: true },
    address: {
        BldgNameTower: { type: String, required: false },
        LotBlockPhaseHouseNo: { type: String, required: false },
        SubdivisionVillageZone: { type: String, required: false },
        Street: { type: String, required: true },
        District: { type: String, required: true },
        barangay: {
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
      city: { type: String, enum:['Taguig City', 'Others'],  required: true },
      customCity: {
          type: String,
          required: function() {
              return this.address.city === 'Others'; 
          }
      },
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

      cancellingReason: {
        user: { type: String, enum: ['Admin, User'] },
        reason: { type: String },
      },

    Priest: {
        name: { type: mongoose.Schema.Types.ObjectId, ref: 'Priest' },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },    
      termsAndConditionsId: { type: mongoose.Schema.Types.ObjectId, ref: 'TermsAndConditions' }
});

module.exports = mongoose.model('counseling', counselingSchema);