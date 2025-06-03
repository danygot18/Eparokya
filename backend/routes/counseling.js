const express = require('express');
const router = express.Router();
const counselingController = require('../controllers/Counseling/counselingController'); 
const { isAuthenticatedUser, isAuthorized } = require('../middleware/auth');

router.post('/counselingSubmit', counselingController.createCounseling);
router.get('/getAllcounseling', counselingController.getAllCounselingRequests);
router.get('/getCounseling/:counselingId', counselingController.getCounselingById);

router.post('/:counselingId/confirmCounseling', counselingController.confirmCounseling);
router.post('/declineCounseling/:counselingId', isAuthenticatedUser,counselingController.declineCounseling);

router.post('/:counselingId/commentCounseling', counselingController.addComment);

router.post('/counselingAddPriest/:counselingId', counselingController.createPriestComment);
router.get('/getCounselingPriest/:counselingId', counselingController.getCounselingWithPriest);

router.get('/getAllUserSubmittedCounseling', isAuthenticatedUser, counselingController.getMySubmittedForms);
router.get('/getCounselingForm/:formId', isAuthenticatedUser, counselingController.getCounselingFormById);

router.get('/stats/counselingPerMonth', isAuthenticatedUser, isAuthorized("admin"), counselingController.getCounselingPerMonth);
router.get('/stats/counselingStatusCount', isAuthenticatedUser, isAuthorized("admin"),  counselingController.getCounselingStatusCounts);

router.put('/:updateCounselingDate/:counselingId', counselingController.updateCounselingDate);

router.get('/counseling/user/:userId', counselingController.getUserCounselingRequests);
router.put('/counseling/:counselingId/status', counselingController.updateCounselingStatus);
router.post('/counseling/:counselingId/comment', counselingController.addCommentToCounseling);

module.exports = router;
