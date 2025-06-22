const express = require('express');
const router = express.Router();
const prayerRequestController = require('../../controllers/Prayers/prayerRequestController');
const { isAuthenticatedUser, authorizeAdmin } = require('../../middleware/auth');

router.post('/prayerRequestSubmit', prayerRequestController.createPrayerRequest);
router.get('/getMySubmittedPrayerRequestList', isAuthenticatedUser, prayerRequestController.getMySubmittedForms);

router.get('/user/:userId', prayerRequestController.getUserPrayerRequests);
router.get('/admin/getAllPrayerRequest', prayerRequestController.getAllPrayerRequests);
router.get('/mass-intentions', prayerRequestController.getMassIntentions);

router.get("/history", prayerRequestController.getPrayerRequestHistory);
router.post('/intention/:prayerId', prayerRequestController.addIntentionToPrayerRequest);
router.put('/acceptPrayerRequest/:prayerId', prayerRequestController.acceptPrayerRequest);
router.put('/cancelPrayerRequest/:prayerId', prayerRequestController.cancelPrayerRequest);
router.put('/updatePrayerRequestTime/:prayerId', prayerRequestController.updatePrayerRequestTime);

router.post("/history/:prayerId/archive", prayerRequestController.archivePrayerRequest);
router.delete("/history/:prayerId", prayerRequestController.permanentlyDeletePrayerRequest);

// router.get('/stats/prayerRequestsPerMonth', prayerRequestController.getPrayerRequestStatusCounts);

module.exports = router;
