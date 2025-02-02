const mongoose = require('mongoose');

const BaptismSchema = new mongoose.Schema({

  baptismDate: { type: Date, required: false },
  baptismTime: { type: String, required: false, },

  child: {
    fullName: { type: String, required: false },
    dateOfBirth: { type: Date, required: false },
    placeOfBirth: { type: String, required: false },
    gender: { type: String, enum: ['Male', 'Female'], required: false },
  },

  parents: {
    fatherFullName: { type: String, required: false },
    placeOfFathersBirth: {type: String, required: false},
    motherFullName: { type: String, required: false },
    placeOfMothersBirth: {type: String, required: false},
    address: { type: String, required: false },
    marriageStatus: {
      type: String,
      required: false,
      enum: ['Simbahan', 'Civil', 'Nat'],
    },
  },

  ninong: {
      name: { type: String, required: false },
      address: { type: String, required: false },
      religion: { type: String, required: false },  
  },

  ninang: {
      name: { type: String, required: false },
      address: { type: String, required: false },
      religion: { type: String, required: false },
  },

  NinongGodparents: [
    {
      name: { 
      type: String, 
      required: false
    },
    },

  ],

  NinangGodparents: [
    {
      name: { 
        type: String, 
        required: false 
      },
      
    },

  ],
  Docs: {
    birthCertificate: {
      public_id: {
        type: String,
        required: true,
      },
      url: {
        type: String,
        required: true,
      },
    },
    marriageCertificate: {
      public_id: {
        type: String,
        required: true,
      },
      url: {
        type: String,
        required: true,
      },
    },
    baptismPermit: {
      public_id: {
        type: String,
        required: true,
      },
      url: {
        type: String,
        required: true,
      },
    },
  },

  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  confirmedAt: {
    type: Date,
  },

  binyagStatus: {
    type: String,
    required: false,
    default: 'Pending',
    enum: ['Pending', 'Confirmed', 'Cancelled'],
  },

  additionalDocs: [
    {
      baptismPermit:[
        {
            public_id: {
                type: String,
                required: false
            },
            url: {
                type: String,
                required: false
            },
        }
    ],
      baptismPermitFrom: [
        {
            public_id: {
                type: String,
                required: false
            },
            url: {
                type: String,
                required: false
            },
        }
    ],
      certificateOfNoRecord: [
        {
            public_id: {
                type: String,
                required: false
            },
            url: {
                type: String,
                required: false
            },
        }
    ],
      certificateOfNoRecordBaptism: [
        {
            public_id: {
                type: String,
                required: false
            },
            url: {
                type: String,
                required: false
            },
        }
    ],
      createdAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],

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
});

module.exports = mongoose.model('Baptism', BaptismSchema);