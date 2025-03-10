const mongoose = require("mongoose");

const AdminSelectionSchema = new mongoose.Schema({
  category: { type: String, required: true, enum: ["event", "activities"] },
  typeId: { 
    type: mongoose.Schema.Types.ObjectId, 
    refPath: "typeModel" 
  }, 
  typeModel: {
    type: String,
    required: true,
    enum: ["eventType", "activityType"],
  },
  date: String,
  time: String,
  isActive: { type: Boolean, default: true },
});

const AdminSelection = mongoose.model("AdminSelection", AdminSelectionSchema);
module.exports = AdminSelection;
