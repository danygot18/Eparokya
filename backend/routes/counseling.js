const express = require('express');
const router = express.Router();
const counselingController = require('../controllers/Counseling/counselingController'); 

router.post('/counselingSubmit', counselingController.createCounseling);
router.get('/counseling/user/:userId', counselingController.getUserCounselingRequests);
router.get('/getAllcounseling', counselingController.getAllCounselingRequests);
router.put('/counseling/:counselingId/status', counselingController.updateCounselingStatus);
router.post('/counseling/:counselingId/comment', counselingController.addCommentToCounseling);

module.exports = router;
