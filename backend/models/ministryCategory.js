const mongoose = require('mongoose');

const ministryCategorySchema = new mongoose.Schema({
    name: { 
      type: String, 
      required: true 
    },
    description: { 
      type: String, 
      required: true 
    },
});

const ministryCategory = mongoose.model('ministryCategory', ministryCategorySchema);
module.exports = ministryCategory;