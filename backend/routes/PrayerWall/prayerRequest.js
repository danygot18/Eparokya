const express = require('express');
const router = express.Router();
const prayerRequestController = require('../../controllers/Prayers/prayerRequestController');

router.post('/prayerRequestSubmit', prayerRequestController.createPrayerRequest);
router.get('/user/:userId', prayerRequestController.getUserPrayerRequests);
router.get('/admin/getAllPrayerRequest', prayerRequestController.getAllPrayerRequests);
router.post('/intention/:prayerId', prayerRequestController.addIntentionToPrayerRequest);

module.exports = router;
