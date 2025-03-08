const EventSentiment = require("../../../models/FeedbackForm/Sentiments/EventSentiment");
const EventType = require("../../../models/FeedbackForm/Types/EventType");
const analyzeSentiment = require("../../../utils/sentimentAnalyzer");

// Analyze and save sentiment response for an event
exports.analyzeSentiment = async (req, res) => {
  try {
    const { userId, eventTypeId, responses } = req.body;

    // Ensure the EventType exists
    const eventType = await EventType.findById(eventTypeId);
    if (!eventType) return res.status(404).json({ message: "Event type not found" });

    // Perform sentiment analysis
    const sentimentResults = responses.map(response => ({
      ...response,
      sentimentResult: analyzeSentiment(response.emoji, response.comment),
    }));

    // Calculate overall sentiment and confidence
    const sentimentScores = sentimentResults.map(r => r.sentimentResult.score);
    const overallSentiment = sentimentScores.reduce((a, b) => a + b, 0) / sentimentScores.length;
    const confidence = Math.abs(overallSentiment); 

    // Save to database
    const newSentiment = new EventSentiment({
      userId,
      eventTypeId,
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

// Get all event sentiment responses
exports.getAllSentiments = async (req, res) => {
  try {
    const sentiments = await EventSentiment.find().populate("userId", "name").populate("eventTypeId", "name");
    res.status(200).json(sentiments);
  } catch (error) {
    res.status(500).json({ message: "Error fetching sentiments", error });
  }
};

// Get event sentiments by event type
exports.getSentimentsByEventType = async (req, res) => {
  try {
    const { eventTypeId } = req.params;
    const sentiments = await EventSentiment.find({ eventTypeId }).populate("userId", "name");

    if (!sentiments.length) return res.status(404).json({ message: "No sentiments found for this event type" });

    res.status(200).json(sentiments);
  } catch (error) {
    res.status(500).json({ message: "Error fetching sentiments", error });
  }
};
