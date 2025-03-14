const EventSentiment = require("../../../models/FeedbackForm/Sentiments/EventSentiment");
const EventType = require("../../../models/FeedbackForm/Types/EventType");
const AdminSelection = require("../../../models/FeedbackForm/AdminSelection/AdminSelection");
const Sentiment = require("sentiment");
const analyzeSentiment = require("../../../utils/sentimentAnalyzer");

const emojiSentimentMap = {
  "😡": -2, "😠": -2, "😞": -1, "😕": -1, "😐": 0,
  "😊": 1, "😃": 2, "😄": 2, "😍": 3, "👍": 2
};

const calculateEmojiSentiment = (responses) => {
  if (!responses || !Array.isArray(responses)) return {
    score: 0, comparative: 0, magnitude: 0, words: [], positive: [], negative: []
  };

  let total = 0, count = 0, magnitude = 0;
  let positiveWords = [], negativeWords = [];

  responses.forEach((r) => {
    if (r.emoji && emojiSentimentMap[r.emoji] !== undefined) {
      let sentimentValue = emojiSentimentMap[r.emoji];
      total += sentimentValue;
      magnitude += Math.abs(sentimentValue);
      count++;

      if (sentimentValue > 0) positiveWords.push(r.emoji);
      else if (sentimentValue < 0) negativeWords.push(r.emoji);
    }
  });

  let score = count > 0 ? total / count : 0;
  return {
    score,
    comparative: score,
    magnitude,
    words: [...positiveWords, ...negativeWords],
    positive: positiveWords,
    negative: negativeWords
  };
};

const determineOverallSentiment = (basicScore, advancedScore, advancedLabel, emojiScore) => {
  const weightedAvg = (0.3 * basicScore) + (0.5 * advancedScore) + (0.7 * emojiScore); // More weight to emoji & AI

  if (weightedAvg > 1.0) return "Very Positive";
  if (weightedAvg > 0.4) return "Positive";
  if (weightedAvg < -0.3) return "Negative";
  if (weightedAvg < -1.0) return "Very Negative";

  return "Neutral";
};


const confidenceScore = (basicScore, advancedScore, emojiScore) => {
  return Math.min(1.5, Math.abs((basicScore + advancedScore) / 2) + (Math.abs(emojiScore) / 5));
};

const sentimentToStars = (label, basicSentiment) => {
  if (basicSentiment.positive.length > 0 && basicSentiment.negative.length > 0) {
    return "4 stars";
  }

  const sentimentMapping = {
    "very positive": "5 stars",
    "positive": "4 stars",
    "neutral": "3 stars",
    "negative": "2 stars",
    "very negative": "1 star"
  };

  return sentimentMapping[label?.toLowerCase()] || "3 stars";
};
exports.analyzeSentiment = async (req, res) => {
  try {
    const { userId, eventTypeId, responses, comment } = req.body;

    if (!userId || !eventTypeId || !responses) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Check if the AdminSelection is active for this eventTypeId
    const activeSelection = await AdminSelection.findOne({ typeId: eventTypeId, isActive: true });

    if (!activeSelection) {
      return res.status(403).json({ error: "This event type is not currently active for feedback." });
    }

    let emojiSentiment = calculateEmojiSentiment(responses);

    let commentSentiment = comment
      ? await analyzeSentiment(emojiSentiment.score, comment)
      : {
        basic: { score: 0, comparative: 0, magnitude: 0, words: [], positive: [], negative: [], method: "basic" },
        advanced: { label: "neutral", score: 0, magnitude: 0, method: "huggingface" }
      };

    if (!commentSentiment.basic) {
      commentSentiment.basic = { score: 0, comparative: 0, magnitude: 0, words: [], positive: [], negative: [], method: "basic" };
    }

    if (commentSentiment.basic.positive.length > 0 && commentSentiment.basic.negative.length > 0) {
      emojiSentiment.score *= 0.7;
    }

    const overallSentiment = determineOverallSentiment(
      commentSentiment?.basic?.score || 0,
      commentSentiment?.advanced?.score || 0,
      commentSentiment?.advanced?.label || "Neutral", // Ensure label is correctly formatted
      emojiSentiment.score
    );
    


    const finalConfidence = confidenceScore(
      commentSentiment?.basic?.score || 0,
      commentSentiment?.advanced?.score || 0,
      emojiSentiment.score
    );

    const processedResponses = responses.map((r) => ({
      question: r.question,
      emoji: r.emoji,
      sentimentResult: calculateEmojiSentiment([r]) 
    }));

    const sentimentResult = new EventSentiment({
      userId,
      eventTypeId,
      responses: processedResponses, 
      comment: comment || null,
      commentSentiment: {
        ...commentSentiment,
        label: sentimentToStars(overallSentiment, commentSentiment.basic)
      },
      overallSentiment,
      confidence: finalConfidence
    });


    console.log("Submitting Sentiment:", {
      eventTypeId,
      responses,
      comment
    });

    await sentimentResult.save();

    res.status(200).json(sentimentResult);
  } catch (error) {
    console.error("Sentiment Analysis Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


exports.getAllSentiments = async (req, res) => {
  try {
    const sentiments = await EventSentiment.find()
      .populate("userId", "name")
      .populate("eventTypeId", "name");

    res.status(200).json(sentiments);
  } catch (error) {
    res.status(500).json({ message: "Error fetching sentiments", error });
  }
};

exports.getSentimentsByEventType = async (req, res) => {
  try {
    const { eventTypeId } = req.params;
    const sentiments = await EventSentiment.find({ eventTypeId })
      .populate("userId", "name");

    if (!sentiments.length) {
      return res.status(404).json({ message: "No sentiments found for this event type" });
    }

    res.status(200).json(sentiments);
  } catch (error) {
    res.status(500).json({ message: "Error fetching sentiments", error });
  }
};
