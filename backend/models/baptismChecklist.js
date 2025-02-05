const mongoose = require('mongoose');

const baptismChecklistSchema = new mongoose.Schema({

PhotocopyOfBirthCertificate: { type: Boolean, default: false },
PhotocopyOfMarriageCertificate: { type: Boolean, default: false },

  //  Additional
  BaptismalPermit: { type: Boolean, default: false },
  CertificateOfNoRecordBaptism: { type: Boolean, default: false },

  PreBaptismSeminar1: { type: Boolean, default: false },
  PreMarriageSeminar2: { type: Boolean, default: false },
  
}, { timestamps: true });

baptismChecklistSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

baptismChecklistSchema.set('toJSON', {
  virtuals: true,
});

module.exports.BaptismChecklist = mongoose.model('BaptismChecklist', baptismChecklistSchema);
