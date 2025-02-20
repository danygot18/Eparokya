const mongoose = require("mongoose");

const LiveVideoSchema = new mongoose.Schema({
    url: 
    {
        type: String, required: true
    },
    description:
    {
        type: String
    },
    title:
    {
        type: String
    }
}, { timestamps: true });

module.exports = mongoose.model("LiveVideo", LiveVideoSchema);