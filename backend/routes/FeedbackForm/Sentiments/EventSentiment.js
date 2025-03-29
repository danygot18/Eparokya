const express = require("express");
const router = express.Router();
const eventSentimentController = require("../../../controllers/FeedbackForm/Sentiments/EventSentimentController");
const { isAuthenticatedUser, isAuthorized } = require('../../../middleware/auth');

router.post("/analyzeEventSentiment", isAuthenticatedUser, eventSentimentController.analyzeSentiment);

router.get("/getAllEventSentiment", eventSentimentController.getAllSentiments);

router.get("/sentimentEventType/:eventSentimentId", eventSentimentController.getSentimentsByEventType);
router.get("/getEventSentimentById/:eventSentimentId", eventSentimentController.getSentimentById);
module.exports = router;
