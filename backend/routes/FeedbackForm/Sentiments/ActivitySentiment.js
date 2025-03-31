const express = require("express");
const router = express.Router();
const ActivitySentimentController = require("../../../controllers/FeedbackForm/Sentiments/ActivitySentimentController");
const { isAuthenticatedUser, isAuthorized } = require('../../../middleware/auth');

router.post("/analyzeActivitySentiment", isAuthenticatedUser, ActivitySentimentController.analyzeSentiment);

router.get("/getAllActivitySentiment", ActivitySentimentController.getAllSentiments);

router.get("/sentimentActivityType/:activitySentimentId", ActivitySentimentController.getSentimentsByActivityType);

router.get("/getActivitySentimentById/:activitySentimentId", ActivitySentimentController.getSentimentById);

module.exports = router;
