const mongoose = require("mongoose");

const ActivitySentimentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    activityTypeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ActivityType",
      required: true,
    },
    responses: {
        type: [
          {
            question: { type: String, required: true }, 
            emoji: { type: String, required: true }, 
            comment: { type: String, required: true }, 
            sentimentResult: { type: String, required: true }, 
          },
        ],
        validate: [(val) => val.length === 5, "Must have exactly 5 responses."],
      },
    overallSentiment: {
      type: String, 
    },
    confidence: {
      type: Number, 
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ActivitySentiment", ActivitySentimentSchema);
