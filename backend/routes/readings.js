const express = require('express');
const router = express.Router();
const ReadingController = require('../controllers/ReadingsController');

router.post('/addReadings', ReadingController.createReading);
router.get('/getAllreadings', ReadingController.getAllReadings);

module.exports = router;
