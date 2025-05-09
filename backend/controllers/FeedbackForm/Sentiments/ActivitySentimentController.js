const ActivitySentiment = require("../../../models/FeedbackForm/Sentiments/ActivitySentiment");
const ActivityType = require("../../../models/FeedbackForm/Types/ActivityType");
const AdminSelection = require("../../../models/FeedbackForm/AdminSelection/adminSelection");
const Sentiment = require("sentiment");
const analyzeSentiment = require("../../../utils/SentimentAnalyzer");

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
  const weightedAvg = (0.3 * basicScore) + (0.5 * advancedScore) + (0.7 * emojiScore);

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
    const { userId, activityTypeId, responses, comment } = req.body;

    if (!userId || !activityTypeId || !responses) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const activeSelection = await AdminSelection.findOne({ typeId: activityTypeId, isActive: true });

    if (!activeSelection) {
      return res.status(403).json({ error: "This activity type is not currently active for feedback." });
    }

    let emojiSentiment = calculateEmojiSentiment(responses);

    let commentSentiment = comment
      ? await analyzeSentiment(emojiSentiment.score, comment)
      : {
          basic: { score: 0, comparative: 0, magnitude: 0, words: [], positive: [], negative: [], method: "basic" },
          advanced: { label: "neutral", score: 0, magnitude: 0, method: "huggingface" },
        };

    commentSentiment = {
      basic: {
        score: commentSentiment?.basic?.score || 0,
        comparative: commentSentiment?.basic?.comparative || 0,
        magnitude: commentSentiment?.basic?.magnitude || 0, 
        words: commentSentiment?.basic?.words || [],
        positive: commentSentiment?.basic?.positive || [],
        negative: commentSentiment?.basic?.negative || [],
        method: commentSentiment?.basic?.method || "basic",
      },
      advanced: {
        label: commentSentiment?.advanced?.label || "neutral",
        score: commentSentiment?.advanced?.score || 0,
        magnitude: commentSentiment?.advanced?.magnitude || 0, 
        method: commentSentiment?.advanced?.method || "huggingface",
      },
    };

    if (commentSentiment.basic.positive.length > 0 && commentSentiment.basic.negative.length > 0) {
      emojiSentiment.score *= 0.7;
    }

    const commentSentimentScore =
      (commentSentiment.basic.score + commentSentiment.advanced.score) / 2;

    const overallSentiment = determineOverallSentiment(
      commentSentiment.basic.score,
      commentSentiment.advanced.score,
      commentSentiment.advanced.label,
      emojiSentiment.score
    );

    const finalConfidence = confidenceScore(
      commentSentiment.basic.score,
      commentSentiment.advanced.score,
      emojiSentiment.score
    );

    // Process responses
    const processedResponses = responses.map((r) => ({
      question: r.question,
      emoji: r.emoji,
      sentimentResult: calculateEmojiSentiment([r]),
    }));

    // Create and save the sentiment result
    const sentimentResult = new ActivitySentiment({
      userId,
      activityTypeId,
      responses: processedResponses,
      comment: comment || null,
      commentSentiment: {
        basic: commentSentiment.basic,
        advanced: commentSentiment.advanced,
        score: commentSentimentScore, // Use the calculated score here
        comparative: commentSentiment.basic.comparative, // Ensure comparative is included
        magnitude: commentSentiment.basic.magnitude, // Ensure magnitude is included
        label: sentimentToStars(overallSentiment, commentSentiment.basic),
      },
      overallSentiment,
      confidence: finalConfidence,
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
    const sentiments = await ActivitySentiment.find()
      .populate("userId", "name")
      .populate("activityTypeId", "name");

    res.status(200).json(sentiments);
  } catch (error) {
    res.status(500).json({ message: "Error fetching sentiments", error });
  }
};

exports.getSentimentsByActivityType = async (req, res) => {
  try {
    const { activityTypeId } = req.params;
    const sentiments = await ActivitySentiment.find({ activityTypeId })
      .populate("userId", "name");

    if (!sentiments.length) {
      return res.status(404).json({ message: "No sentiments found for this activity type" });
    }

    res.status(200).json(sentiments);
  } catch (error) {
    res.status(500).json({ message: "Error fetching sentiments", error });
  }
};

exports.getSentimentById = async (req, res) => {
  try {
    const { activitySentimentId } = req.params;

    const sentiment = await ActivitySentiment.findById(activitySentimentId)
      .populate("userId", "name")
      .populate("activityTypeId", "name");

    if (!sentiment) {
      return res.status(404).json({ message: "Sentiment not found" });
    }

    res.status(200).json(sentiment);
  } catch (error) {
    console.error("Error fetching sentiment by ID:", error);
    res.status(500).json({ message: "Error fetching sentiment", error });
  }
};


