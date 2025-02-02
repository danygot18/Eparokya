const express = require('express');
const router = express.Router();
const houseBlessingController = require('../../controllers/PrivateScheduling/houseBlessingController');

router.post('/houseBlessingSubmit', houseBlessingController.createHouseBlessing);
router.get('/user/:userId', houseBlessingController.getUserHouseBlessingRequests);
router.get('/getAllhouseBlessing', houseBlessingController.getAllHouseBlessingRequests);
router.put('/blessingStatus/:blessingId', houseBlessingController.updateHouseBlessingStatus);
router.post('/comment/:blessingId', houseBlessingController.addCommentToHouseBlessing);

module.exports = router;
