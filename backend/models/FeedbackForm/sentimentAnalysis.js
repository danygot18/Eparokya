const mongoose = require("mongoose");

const SentimentAnalysisSchema = new mongoose.Schema({
  category: {
    type: String,
    enum: ["Event", "Activities", "Priests"],
    required: true,
  },
  submittedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  responses: [
    {
      question: String,
      emoji: String,
      comment: String,
      sentimentResult: String,
    }
  ],
  overallSentiment: {
    type: String,
  },
  confidence: {
    type: Number,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("SentimentAnalysis", SentimentAnalysisSchema);
