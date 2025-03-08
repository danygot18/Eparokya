const Sentiment = require("sentiment");
const natural = require("natural");

const sentiment = new Sentiment();
const tokenizer = new natural.WordTokenizer();

const analyzeSentiment = (emoji, comment) => {
  const text = `${emoji} ${comment}`.trim(); // Combine emoji & text

  // Tokenize words (optional, can improve analysis)
  const tokens = tokenizer.tokenize(text);

  // Analyze sentiment
  const result = sentiment.analyze(tokens.join(" "));

  return {
    score: result.score, // -ve = Negative, 0 = Neutral, +ve = Positive
    comparative: result.comparative, // Sentiment strength per word
    magnitude: Math.abs(result.score), // Overall sentiment intensity
    words: result.words, // Words contributing to sentiment
    positive: result.positive, // List of positive words
    negative: result.negative, // List of negative words
  };
};

module.exports = analyzeSentiment;
