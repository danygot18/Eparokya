const mongoose = require('mongoose');

const weddingChecklistSchema = new mongoose.Schema({
  // Groom Fields
  GroomNewBaptismalCertificate: { type: Boolean, default: false },
  GroomNewConfirmationCertificate: { type: Boolean, default: false },
  GroomMarriageLicense: { type: Boolean, default: false },
  GroomMarriageBans: { type: Boolean, default: false },
  GroomOrigCeNoMar: { type: Boolean, default: false },
  GroomOrigPSA: { type: Boolean, default: false },
  GroomOnebyOne: { type: Boolean, default: false },
  GroomTwobyTwo: { type: Boolean, default: false },

  // Bride Fields
  BrideNewBaptismalCertificate: { type: Boolean, default: false },
  BrideNewConfirmationCertificate: { type: Boolean, default: false },
  BrideMarriageLicense: { type: Boolean, default: false },
  BrideMarriageBans: { type: Boolean, default: false },
  BrideOrigCeNoMar: { type: Boolean, default: false },
  BrideOrigPSA: { type: Boolean, default: false },
  BrideOnebyOne: { type: Boolean, default: false },
  BrideTwobyTwo: { type: Boolean, default: false },

  // Other Checklist Fields
  PermitFromtheParishOftheBride: { type: Boolean, default: false },
  ChildBirthCertificate: { type: Boolean, default: false },

  // Seminar / Additional
  PreMarriageSeminar: { type: Boolean, default: false },
  CanonicalInterview: { type: Boolean, default: false },
  Confession: { type: Boolean, default: false },
}, { timestamps: true });

weddingChecklistSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

weddingChecklistSchema.set('toJSON', {
  virtuals: true,
});

module.exports.WeddingChecklist = mongoose.model('WeddingChecklist', weddingChecklistSchema);
