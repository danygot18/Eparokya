const mongoose = require('mongoose');


const chatSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    message: {
        type: String,
        required: true
    },
    last_message: {
        type: String,
    },
    last_message_delivered_at: {
        type: Date,
        default: Date.now,
    },
    readBy: [
        { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
    ],
    deletedAt: {
        type: Date,
        default: null,
    },


}, { timestamps: true })

module.exports = mongoose.model('chat', chatSchema)