const mongoose = require("mongoose");

const InventorySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    eventTypeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "EventType",
      required: true,
    },
    itemName: {
        type: String,
        required: true,
      },
   
    
    
  },
  { timestamps: true }
);

module.exports = mongoose.model('Inventory', InventorySchema);
