const mongoose = require('mongoose');

const FuneralSchema = new mongoose.Schema({

  name: { type: String, required: true },

  dateOfDeath: { type: Date, required: true },
  personStatus: { type: String, enum: ['Dalaga/Binata', 'May Asawa, Biyuda'], required: false },
  age: { type: String, required: true },

  contactPerson: { type: String, required: true },
  relationship: { type: String, required: true },
  phone: { type: String, required: true },

  address: {
    state: { type: String, required: true },
    zip: { type: String, required: true },
    country: { type: String, required: true },

     //BldgNameTower: { type: String, required: true },
        // LotBlockPhaseHouseNo: { type: String, required: false },
        // SubdivisionVillageZone: { type: String, required: false },
        // Street: { type: String, required: true },
        // District: { type: String, required: true },
      //   baranggay: {
      //     type: String,
      //     enum: [
      //         'Bagumbayan', 'Bambang', 'Calzada', 'Cembo', 'Central Bicutan',
      //         'Central Signal Village', 'Comembo', 'East Rembo', 'Fort Bonifacio', 'Hagonoy',
      //         'Ibayo-Tipas', 'Katuparan', 'Ligid-Tipas', 'Lower Bicutan', 'Maharlika Village',
      //         'Napindan', 'New Lower Bicutan', 'North Daang Hari', 'North Signal Village', 'Palingon',
      //         'Pembo', 'Pinagsama', 'Pitogo', 'Post Proper Northside', 'Post Proper Southside',
      //         'Rizal', 'San Miguel', 'Santa Ana', 'South Cembo', 'South Daang Hari', 'South Signal Village',
      //         'Tanyag', 'Tuktukan', 'Upper Bicutan', 'Ususan', 'Wawa', 'West Rembo', 'Western Bicutan', 
      //         'Others'
      //     ],
      //     required: true
      // },
      // customBarangay: {
      //     type: String,
      //     required: function() {
      //         return this.address.baranggay === 'Others'; 
      //     }
      // },
      // city: { type: String, enum:['Taguig', 'Others'],  required: true },
      // customCity: {
      //     type: String,
      //     required: function() {
      //         return this.address.city === 'Others'; 
      //     }
      // },
      
  },

  priestVisit: { type: String, enum: ['Oo/Yes', 'Hindi/No'], required: true },
  reasonOfDeath: { type: String, required: true },

  funeralDate: {
    type: Date,
    required: true,
  },
  funeraltime: {
    type: String,
    required: true
  },

  placeOfDeath: { type: String, required: true },
  serviceType: {
    type: String,
    enum: ['Misa', 'Blessing'],
    required: true
  },

  placingOfPall: {
    by: { type: String, enum: ['Priest', 'Family Member'], required: true },
    familyMembers: { type: [String], required: function () { return this.placingOfPall.by === 'Family Member'; } }
  },

  funeralMassDate: {
    type: Date,
    required: true,
  },
  funeralMasstime: {
    type: String,
    required: true
  },
  funeralMass: {
    type: String,
    required: true
  },

  deathCertificate: {
    public_id: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
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

  adminRescheduled: {
    date: { type: Date },
    reason: { type: String },
  },

  Priest: {
    name: { type: mongoose.Schema.Types.ObjectId, ref: 'priest' },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },

  confirmedAt: {
    type: Date,
  },
  funeralStatus: {
    type: String,
    default: 'Pending',
    enum: ['Pending', 'Confirmed', 'Cancelled'],
  },

  cancellingReason: {
    user: { type: String, enum: ['Admin, User'] },
    reason: { type: String },
  },

  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  termsAndConditionsId: { type: mongoose.Schema.Types.ObjectId, ref: 'TermsAndConditions' }
},
  { timestamps: true }
);

module.exports = mongoose.model('Funeral', FuneralSchema);