const ActivitySentiment = require("../../models/ActivitySentiment");
const ActivityType = require("../../models/ActivityType");
const analyzeSentiment = require("../../../utils/sentimentAnalyzer");

// Analyze and save sentiment response for an activity
exports.analyzeSentiment = async (req, res) => {
  try {
    const { userId, activityTypeId, responses } = req.body;

    const activityType = await ActivityType.findById(activityTypeId);
    if (!activityType) return res.status(404).json({ message: "Activity type not found" });

    const sentimentResults = responses.map(response => ({
      ...response,
      sentimentResult: analyzeSentiment(response.emoji, response.comment),
    }));

    const sentimentScores = sentimentResults.map(r => r.sentimentResult.score);
    const overallSentiment = sentimentScores.reduce((a, b) => a + b, 0) / sentimentScores.length;
    const confidence = Math.abs(overallSentiment); 

    // Save to database
    const newSentiment = new ActivitySentiment({
      userId,
      activityTypeId,
      responses: sentimentResults,
      overallSentiment: overallSentiment >= 0 ? "Positive" : "Negative",
      confidence,
    });

    await newSentiment.save();
    res.status(201).json(newSentiment);
  } catch (error) {
    res.status(500).json({ message: "Error analyzing sentiment", error });
  }
};

// Get all activity sentiment responses
exports.getAllSentiments = async (req, res) => {
  try {
    const sentiments = await ActivitySentiment.find().populate("userId", "name").populate("activityTypeId", "name");
    res.status(200).json(sentiments);
  } catch (error) {
    res.status(500).json({ message: "Error fetching sentiments", error });
  }
};

// Get activity sentiments by activity type
exports.getSentimentsByActivityType = async (req, res) => {
  try {
    const { activityTypeId } = req.params;
    const sentiments = await ActivitySentiment.find({ activityTypeId }).populate("userId", "name");

    if (!sentiments.length) return res.status(404).json({ message: "No sentiments found for this activity type" });

    res.status(200).json(sentiments);
  } catch (error) {
    res.status(500).json({ message: "Error fetching sentiments", error });
  }
};
