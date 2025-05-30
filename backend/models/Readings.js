const mongoose = require('mongoose');

const ReadingSchema = new mongoose.Schema(
  {
    date: { type: Date, required: true, unique: true },
    firstReading: { type: String, required: true },
    responsorialPsalm: { type: String, required: true },
    response: { type: String, required: true },
    secondReading: { type: String, required: true },
    gospel: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Reading', ReadingSchema);