const express = require("express");
const router = express.Router();
const PriestSentimentController = require("../../../controllers/FeedbackForm/Sentiments/PriestSentimentController");
const { isAuthenticatedUser, isAuthorized } = require('../../../middleware/auth');

router.post("/analyzePriestSentiment", isAuthenticatedUser, PriestSentimentController.analyzeSentiment);

router.get("/getAllPriestSentiment", PriestSentimentController.getAllPriestSentiments);

router.get("/sentimentPriestType/:priestSentimentId", PriestSentimentController.getSentimentsByPriest);

module.exports = router;
