const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, 
    type: { type: String, enum: ["form_submission", "message", "prayer wall", "prayer request"], required: true },
    N_id: {type: mongoose.Schema.Types.ObjectId, required: true},
    message: { type: String, required: true },
    link: { type: String }, 
    isRead: { type: Boolean, default: false }, 
  },
  { timestamps: true }
);

module.exports = mongoose.model("Notification", notificationSchema);
