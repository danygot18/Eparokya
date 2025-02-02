const mongoose = require('mongoose');

const weddingSchema = mongoose.Schema({
  dateOfApplication: {
    type: Date,
    required: true,
  },
  weddingDate: {
    type: Date,
    required: true,
  },
  weddingTime: {
    type: String,
    required: true,
  },

  groomName: { type: String, required: true },
  groomAddress: {
    street: { type: String, required: true },
    zip: { type: String, required: true },
    city: { type: String, required: true },
  },
  groomPhone: { type: String, required: true },
  groomBirthDate: { type: Date, required: true },
  groomOccupation: { type: String, required: true },
  groomReligion: { type: String, required: true },
  GroomFather: { type: String },
  GroomMother: { type: String },

  brideName: { type: String, required: true },
  brideAddress: {
    street: { type: String, required: true },
    zip: { type: String, required: true },
    city: { type: String, required: true },
  },
  bridePhone: { type: String, required: true },
  brideBirthDate: { type: Date, required: true },
  brideOccupation: { type: String, required: true },
  brideReligion: { type: String, required: true },
  BrideFather: { type: String },
  BrideMother: { type: String },

  Ninong: [
    {
      name: { type: String, required: true },
      address: {
        street: { type: String, required: true },
        zip: { type: String, required: true },
        city: { type: String, required: true },
      },
    },
  ],
  Ninang: [
    {
      name: { type: String, required: true },
      address: {
        street: { type: String, required: true },
        zip: { type: String, required: true },
        city: { type: String, required: true },
      },
    },
  ],

  // Image Fields Groom
  GroomNewBaptismalCertificate: {
    public_id: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
  },
  GroomNewConfirmationCertificate: {
    public_id: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
  },
  GroomMarriageLicense: {
    public_id: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
  },
  GroomMarriageBans: {
    public_id: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
  },
  GroomOrigCeNoMar: {
    public_id: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
  },
  GroomOrigPSA: {
    public_id: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
  },

  // Image Fields Bride
  BrideNewBaptismalCertificate: {
    public_id: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
  },
  BrideNewConfirmationCertificate: {
    public_id: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
  },
  BrideMarriageLicense: {
    public_id: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
  },
  BrideMarriageBans: {
    public_id: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
  },
  BrideOrigCeNoMar: {
    public_id: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
  },
  BrideOrigPSA: {
    public_id: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
  },

  PermitFromtheParishOftheBride: {
    public_id: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
  },

  ChildBirthCertificate: {
    public_id: {
      type: String,
      required: false,
    },
    url: {
      type: String,
      required: false,
    },
  },

  weddingStatus: {
    type: String,
    default: 'Pending',
    enum: ['Pending', 'Confirmed', 'Cancelled'],
  },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  confirmedAt: {
    type: Date,
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
}, { timestamps: true });

weddingSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

weddingSchema.set('toJSON', {
  virtuals: true,
});

exports.Wedding = mongoose.model('Wedding', weddingSchema);
