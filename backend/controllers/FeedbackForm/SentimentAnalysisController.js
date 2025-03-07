const SentimentAnalysis = require("../../models/FeedbackForm/sentimentAnalysis");
const Sentiment = require("sentiment");
const natural = require("natural");

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
  

// Function to Detect Language (English or Filipino)
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
