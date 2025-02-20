const express = require('express');
const router = express.Router();
const prayerRequestIntentionController = require('../../controllers/Prayers/PrayerRequestIntentionController');
const { isAuthenticatedUser, authorizeAdmin } = require('../../middleware/auth');+

router.post('/prayerRequestIntention/submit', isAuthenticatedUser, prayerRequestIntentionController.createPrayerRequestIntention);

router.get('/getAllPrayerRequestIntention', prayerRequestIntentionController.getAllPrayerRequestIntention);
router.get('/getPrayerRequestIntentionById/:prayerIntentionId', prayerRequestIntentionController.getPrayerRequestIntentionById);
router.put('/updatePrayerRequestIntention/:prayerIntentionId', prayerRequestIntentionController.updatePrayerRequestIntention);
router.patch('/markPrayerRequestIntentionAsDone/:prayerIntentionId', prayerRequestIntentionController.markPrayerRequestIntentionAsDone);
router.delete('/deletePrayerRequestIntention/:prayerIntentionId', prayerRequestIntentionController.deletePrayerRequestIntention);

module.exports = router;