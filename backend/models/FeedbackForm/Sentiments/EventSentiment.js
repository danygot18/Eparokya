const mongoose = require("mongoose");

const EventSentimentSchema = new mongoose.Schema(
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
    responses: {
      type: [
        {
          question: { type: String, required: true }, 
          emoji: { type: String, required: true }, 
          sentimentResult: { 
            score: { type: Number, required: true }, 
            comparative: { type: Number, required: true },
            magnitude: { type: Number, required: true },
            words: { type: [String], required: true },
            positive: { type: [String], required: true },
            negative: { type: [String], required: true },
          }, 
        },
      ],
      validate: [(val) => val.length === 5, "Must have exactly 5 responses."],
    },
    comment: {
      type: String, 
      required: true,
    },
    commentSentiment: { 
      label: { type: String, enum: ["1 star", "2 stars", "3 stars", "4 stars", "5 stars"], required: true }, 
      score: { type: Number, required: true },
      comparative: { type: Number, required: true },
      magnitude: { type: Number, required: true }, 
      words: { type: [String], required: true },
      positive: { type: [String] },
      negative: { type: [String]},
    },
    overallSentiment: {
      type: String, 
      enum: ["Very Positive", "Positive", "Neutral", "Negative", "Very Negative"], 
      required: true,
    },
    confidence: {
      type: Number, 
      required: true, 
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("EventSentiment", EventSentimentSchema);
