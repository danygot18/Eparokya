const express = require("express");
const router = express.Router();
const PriestSentimentController = require("../../../controllers/FeedbackForm/Sentiments/PriestSentimentController");
const { isAuthenticatedUser, isAuthorized } = require('../../../middleware/auth');

router.post("/analyzeEventSentiment", isAuthenticatedUser, PriestSentimentController.analyzeSentiment);

router.get("/getAllEventSentiment", PriestSentimentController.getAllPriestSentiments);

router.get("/sentimentEventType/:eventSentimentId", PriestSentimentController.getSentimentsByPriest);

module.exports = router;
