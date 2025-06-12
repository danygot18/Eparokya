const express = require('express');
const router = express.Router();
const prayerRequestController = require('../../controllers/Prayers/prayerRequestController');
const { isAuthenticatedUser, authorizeAdmin } = require('../../middleware/auth');

router.post('/prayerRequestSubmit', prayerRequestController.createPrayerRequest);
router.get('/getMySubmittedPrayerRequestList', isAuthenticatedUser, prayerRequestController.getMySubmittedForms);

router.get('/user/:userId', prayerRequestController.getUserPrayerRequests);
router.get('/admin/getAllPrayerRequest', prayerRequestController.getAllPrayerRequests);
router.post('/intention/:prayerId', prayerRequestController.addIntentionToPrayerRequest);

// router.get('/stats/prayerRequestsPerMonth', prayerRequestController.getPrayerRequestStatusCounts);

module.exports = router;
