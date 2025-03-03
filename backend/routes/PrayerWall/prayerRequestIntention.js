// const express = require('express');
// const router = express.Router();
// const prayerRequestIntentionController = require('../../controllers/Prayers/PrayerRequestIntentionController');
// const { isAuthenticatedUser, authorizeAdmin } = require('../../middleware/auth');+

// router.post('/prayerRequestIntention/submit', isAuthenticatedUser, prayerRequestIntentionController.createPrayerRequestIntention);

// router.get('/getAllPrayerRequestIntention', prayerRequestIntentionController.getAllPrayerRequestIntention);
// router.get('/getPrayerRequestIntentionById/:prayerIntentionId', prayerRequestIntentionController.getPrayerRequestIntentionById);
// router.put('/updatePrayerRequestIntention/:prayerIntentionId', prayerRequestIntentionController.updatePrayerRequestIntention);
// router.post('/markPrayerRequestIntentionAsDone/:prayerIntentionId', prayerRequestIntentionController.markPrayerRequestIntentionAsDone);
// router.delete('/deletePrayerRequestIntention/:prayerIntentionId', prayerRequestIntentionController.deletePrayerRequestIntention);

// module.exports = router;

module.exports = (io) => {
    const express = require('express');
    const router = express.Router();
    const prayerRequestIntentionController = require('../../controllers/Prayers/PrayerRequestIntentionController');
    const { isAuthenticatedUser } = require('../../middleware/auth');

    router.use((req, res, next) => {
        req.app.set("io", io);  
        next();
    });

    router.post('/prayerRequestIntention/submit', isAuthenticatedUser, prayerRequestIntentionController.createPrayerRequestIntention);

    router.get('/getAllPrayerRequestIntention', prayerRequestIntentionController.getAllPrayerRequestIntention);
    router.get('/getPrayerRequestIntentionById/:prayerIntentionId', prayerRequestIntentionController.getPrayerRequestIntentionById);
    router.put('/updatePrayerRequestIntention/:prayerIntentionId', prayerRequestIntentionController.updatePrayerRequestIntention);
    router.post('/markPrayerRequestIntentionAsDone/:prayerIntentionId', prayerRequestIntentionController.markPrayerRequestIntentionAsDone);
    router.delete('/deletePrayerRequestIntention/:prayerIntentionId', prayerRequestIntentionController.deletePrayerRequestIntention);

    return router;
};

