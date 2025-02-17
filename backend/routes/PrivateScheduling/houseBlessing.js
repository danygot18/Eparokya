const express = require('express');
const router = express.Router();
const houseBlessingController = require('../../controllers/PrivateScheduling/houseBlessingController');
const { isAuthenticatedUser, authorizeAdmin } = require('../../middleware/auth');

router.post('/houseBlessingSubmit', houseBlessingController.createHouseBlessing);
router.get('/getAllhouseBlessing', houseBlessingController.getAllHouseBlessingRequests);

router.get('/getHouseBlessing/:blessingId', houseBlessingController.getHouseBlessingById);

router.put('/updateHouseBlessingDate/:blessingId', houseBlessingController.updateBlessingDate);
router.post('/:blessingId/commentBlessing',  houseBlessingController.addComment);

router.post('/addPriestBlessing/:blessingId', houseBlessingController.createPriestComment);

router.post('/:blessingId/confirmBlessing',  houseBlessingController.confirmBlessing);
router.post('/declineBlessing/:blessingId', isAuthenticatedUser, houseBlessingController.declineBlessing);

router.get('/getAllUserSubmittedHouseBlessing', isAuthenticatedUser, houseBlessingController.getMySubmittedForms);
router.get('/getHouseBlessingForm/:formId', isAuthenticatedUser, houseBlessingController.getHouseBlessingFormById);

// router.post('/updateAdditionalReq/:blessingId',  houseBlessingController.updateAdditionalReq);

router.get('/user/:userId', houseBlessingController.getUserHouseBlessingRequests);
router.put('/blessingStatus/:blessingId', houseBlessingController.updateHouseBlessingStatus);
// router.post('/comment/:blessingId', houseBlessingController.addCommentToHouseBlessing);

module.exports = router;
