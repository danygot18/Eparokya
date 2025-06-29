const mongoose = require('mongoose');
const { Schema } = mongoose;

const MissionSchema = new Schema({
  Title: {
    type: String,
    required: true,
  },
    Budget: {
    type: String,
    required: false,
  },
    BudgetFrom: {
    type: String,
    required: false,
  },
  Description: {
    type: String,
    required: true,
  },
  Location: {
    type: String,
    required: true,
  },
  Image: {
    single: {
      type: String,
      required: false,
    },
    multiple: [{
      type: String,
      required: false,
    }],
  },
  Facilitators: [{
    type: String,
    required: true,
  }],
  Volunteers: [{
    type: String,
    required: true,
  }],
  Ministry: [{
    type: Schema.Types.ObjectId,
    ref: 'ministryCategory',
    required: false,
  }],
  Author: {
    type: String,
    set: v => `<i>${v}</i>`, 
    required: true,
  },
  Date: {
    type: Date,
    required: true,
  },
  Time: {
    type: String,
    required: true,
  },
}, {
  timestamps: true 
});

module.exports = mongoose.model('Mission', MissionSchema);
