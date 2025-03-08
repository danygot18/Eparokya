const express = require("express");
const router = express.Router();
const eventSentimentController = require("../../../controllers/FeedbackForm/Sentiments/EventSentimentController");

router.post("/analyzeEventSentiment", eventSentimentController.analyzeSentiment);

router.get("/getAllEventSentiment", eventSentimentController.getAllSentiments);

router.get("/sentimentEventType/:eventSentimentId", eventSentimentController.getSentimentsByEventType);

module.exports = router;
