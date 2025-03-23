const SentimentAnalysis = require("../../models/FeedbackForm/sentimentAnalysis");
const Sentiment = require("sentiment");
const natural = require("natural");

const ActivitySentiment = require("../../models/FeedbackForm/Sentiments/ActivitySentiment");
const PriestSentiment = require("../../models/FeedbackForm/Sentiments/PriestSentiment");
const EventSentiment = require("../../models/FeedbackForm/Sentiments/EventSentiment");


// Initialize Sentiment.js and Natural
const sentiment = new Sentiment();
const analyzer = new natural.SentimentAnalyzer("English", natural.PorterStemmer, "afinn");

const emojiMapping = {
    "😢": "needs major improvement",  
    "😞": "needs improvement",        
    "😐": "neutral",                  
    "😊": "satisfied",                
    "😍": "very satisfied"            
  };
  

const detectLanguage = (text) => {
  const filipinoWords = ["salamat", "mahal", "ganda", "masaya", "lungkot", "galit"];
  return filipinoWords.some((word) => text.toLowerCase().includes(word)) ? "tl" : "en";
};

exports.analyzeSentiment = async (req, res) => {
  const { category, submittedBy, responses } = req.body;

  try {
    let totalScore = 0;
    let totalQuestions = responses.length;
    let analyzedResponses = [];

    for (let response of responses) {
      const { question, emoji, comment } = response;

      // Convert emoji to sentiment
      const emojiText = emojiMapping[emoji] || "neutral";
      const textForAnalysis = `${emojiText}. ${comment}`;

      // Sentiment.js for emoji analysis
      const emojiSentiment = sentiment.analyze(emojiText);

      // Natural.js for text analysis
      const textTokens = comment.split(" ");
      const textSentimentScore = analyzer.getSentiment(textTokens);

      // Final score per question
      const finalScore = (emojiSentiment.score + textSentimentScore) / 2;
      totalScore += finalScore;

      // Determine sentiment result per question
      let sentimentResult = "Neutral";
      if (finalScore > 0) sentimentResult = "Positive";
      if (finalScore < 0) sentimentResult = "Negative";

      analyzedResponses.push({
        question,
        emoji,
        comment,
        sentimentResult,
      });
    }

    // Compute overall sentiment
    const avgScore = totalScore / totalQuestions;
    let overallSentiment = "Neutral";
    if (avgScore > 0) overallSentiment = "Positive";
    if (avgScore < 0) overallSentiment = "Negative";

    // Save to MongoDB
    const sentimentData = new SentimentAnalysis({
      category,
      submittedBy,
      responses: analyzedResponses,
      overallSentiment,
      confidence: Math.abs(avgScore) * 100,
    });

    await sentimentData.save();

    res.json({ message: "✅ Sentiment analyzed & saved!", data: sentimentData });
  } catch (error) {
    console.error("❌ Error in sentiment analysis:", error);
    res.status(500).json({ error: "Failed to analyze sentiment" });
  }
};

// Fetch All Sentiment Analysis Results
exports.getAllSentiments = async (req, res) => {
  try {
    const sentiments = await SentimentAnalysis.find().populate("submittedBy", "name email");
    res.json(sentiments);
  } catch (error) {
    console.error("❌ Error fetching sentiments:", error);
    res.status(500).json({ error: "Failed to fetch sentiment analysis results" });
  }
};

// Fetch Sentiments by Category (Event, Activities, Priests)
exports.getSentimentsByCategory = async (req, res) => {
  const { category } = req.params;
  try {
    const sentiments = await SentimentAnalysis.find({ category }).populate("submittedBy", "name email");
    res.json(sentiments);
  } catch (error) {
    console.error("❌ Error fetching category sentiments:", error);
    res.status(500).json({ error: "Failed to fetch sentiment analysis results" });
  }
};



exports.getSentimentPerMonth = async (req, res) => {
  try {
    // Initialize counts for each sentiment category
    const months = Array(12).fill(0);
    let sentimentCounts = {
      veryPositive: [...months],
      positive: [...months],
      neutral: [...months],
      negative: [...months],
      veryNegative: [...months],
    };

    const aggregateSentiments = async (Model) => {
      const sentiments = await Model.aggregate([
        {
          $group: {
            _id: {
              month: { $month: "$createdAt" },
              sentiment: "$overallSentiment",
            },
            count: { $sum: 1 },
          },
        },
      ]);

      sentiments.forEach(({ _id, count }) => {
        const index = _id.month - 1;
        if (_id.sentiment === "Very Positive") sentimentCounts.veryPositive[index] += count;
        if (_id.sentiment === "Positive") sentimentCounts.positive[index] += count;
        if (_id.sentiment === "Neutral") sentimentCounts.neutral[index] += count;
        if (_id.sentiment === "Negative") sentimentCounts.negative[index] += count;
        if (_id.sentiment === "Very Negative") sentimentCounts.veryNegative[index] += count;
      });
    };

    // Aggregate for all sentiment models
    await aggregateSentiments(ActivitySentiment);
    await aggregateSentiments(PriestSentiment);
    await aggregateSentiments(EventSentiment);

    res.status(200).json(sentimentCounts);
  } catch (error) {
    console.error("Error fetching sentiment data per month:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

