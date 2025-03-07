const express = require("express");
const router = express.Router();
const activitySentimentController = require("../../../controllers/FeedbackForm/Sentiment/ActivitySentimentController");

// Route to analyze and save activity sentiment
router.post("/analyzeActivitySentiment", activitySentimentController.analyzeSentiment);

// Route to get all activity sentiment results
router.get("/getAllActivitySentiment", activitySentimentController.getAllSentiments);

// Route to get activity sentiment results by activity type
router.get("/sentimentActivityType/:activitySentimentId", activitySentimentController.getSentimentsByActivityType);

module.exports = router;
