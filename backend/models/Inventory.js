const mongoose = require('mongoose');

const borrowSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  borrowedAt: {
    type: Date,
    default: Date.now
  },
  returnedAt: Date,
  rejectedAt: Date,
  rejectionReason: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    enum: ['pending', 'borrowed', 'returned', 'rejected'],
    default: 'pending'
  }
});

const inventorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please enter item name'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Please enter description']
  },
  category: {
    type: String,
    required: [true, 'Please select category'],
    enum: [
      'Equipment',
      'Furniture',
      'Supplies',
      'Food',
      'Electronics',
      'Other'
    ]
  },
  quantity: {
    type: Number,
    required: [true, 'Please enter quantity'],
    min: 0
  },
  availableQuantity: {
    type: Number,
    default: function () { return this.quantity; }
  },
  unit: {
    type: String,
    required: [true, 'Please select unit'],
    enum: ['pcs', 'kg', 'g', 'l', 'ml', 'box', 'set']
  },
  price: {
    type: Number,
    required: [true, 'Please enter price'],
    min: 0
  },
  minStockLevel: {
    type: Number,
    required: [true, 'Please enter minimum stock level'],
    min: 0
  },
  location: {
    type: String,
    required: [true, 'Please enter location']
  },
  supplier: {
    type: String,
    required: [true, 'Please enter supplier']
  },
  borrowHistory: [borrowSchema],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Inventory', inventorySchema);