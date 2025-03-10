require("dotenv").config();
const Sentiment = require("sentiment");
const natural = require("natural");
const axios = require("axios");

const sentiment = new Sentiment();
const tokenizer = new natural.WordTokenizer();

const HUGGING_FACE_API_URL = process.env.HUGGING_FACE_API_URL;
const HUGGING_FACE_API_KEY = process.env.HUGGING_FACE_API_KEY;

const analyzeBasicSentiment = (emoji, comment) => {
    const text = `${emoji} ${comment}`.trim();
    const tokens = tokenizer.tokenize(text);
    const result = sentiment.analyze(tokens.join(" "));

    return {
        score: result.score, // Negative = -ve, Neutral = 0, Positive = +ve
        comparative: result.comparative, // Strength per word
        magnitude: Math.abs(result.score), // Sentiment intensity
        words: result.words, // Words contributing to sentiment
        positive: result.positive, // List of positive words
        negative: result.negative, // List of negative words
        method: "basic", // Indicates this is from the 'sentiment' package
    };
};

const analyzeAdvancedSentiment = async (comment) => {
  const API_KEY = process.env.HUGGING_FACE_API_KEY;
  const API_URL = process.env.HUGGING_FACE_API_URL;

  console.log("API Key inside analyzeAdvancedSentiment (before request):", API_KEY || "NOT FOUND");
  console.log("Hugging Face API URL:", API_URL);

  
  if (!API_URL || !API_KEY) {
      console.error("Hugging Face API credentials are missing.");
      return { error: "Hugging Face API credentials are not set." };

  }

  try {
    const response = await axios.post(API_URL, { inputs: comment }, {
        headers: {
            "Authorization": `Bearer ${API_KEY}`,
            "Content-Type": "application/json",
        }
    });

    console.log("Hugging Face API Response:", response.data);
    const result = response.data;

    if (!Array.isArray(result) || !result[0]) {
        throw new Error("Unexpected Hugging Face API response format.");
    }

    const topSentiment = result[0].reduce((prev, curr) =>
        prev.score > curr.score ? prev : curr
    );

    return {
        label: topSentiment.label,
        score: topSentiment.score,
        magnitude: Math.abs(topSentiment.score),
        method: "huggingface",
    };
} catch (error) {
    console.error("Sentiment Analysis Error:", error.response?.data || error.message);
    return { error: "Failed to analyze comment sentiment." };
}

};


/**
 * Main function to decide which sentiment analysis to use.
 */
const analyzeSentiment = async (emoji, comment) => {
    const basicResult = analyzeBasicSentiment(emoji, comment);

    // If the comment is short, just return basic analysis
    if (comment.length < 10) {
        return basicResult;
    }

    // Otherwise, try Hugging Face analysis
    const advancedResult = await analyzeAdvancedSentiment(comment);

    return {
        basic: basicResult,
        advanced: advancedResult,
    };
};

module.exports = analyzeSentiment;
