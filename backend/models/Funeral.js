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
      priest: String,
      scheduledDate: Date,
      selectedComment: String,
      additionalComment: String,
      adminRescheduled: {
        date: { type: Date },
        reason: { type: String },
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  confirmedAt: {
    type: Date,
  },
  funeralStatus: {
    type: String,
    default: 'Pending',
    enum: ['Pending', 'Confirmed', 'Cancelled'],
  },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
},
  { timestamps: true }
);

module.exports = mongoose.model('Funeral', FuneralSchema);