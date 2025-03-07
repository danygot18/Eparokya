const express = require("express");
const router = express.Router();
const sentimentController = require("../../controllers/FeedbackForm/SentimentAnalysisController");

// Route to analyze sentiment and save it
router.post("/analyzeSentiment", sentimentController.analyzeSentiment);

// Route to get all sentiment results
router.get("/getAllSentiment", sentimentController.getAllSentiments);

// Route to get sentiment results by category
router.get("/sentimentCategory/:category", sentimentController.getSentimentsByCategory);

module.exports = router;
