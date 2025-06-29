const express = require('express');
const router = express.Router();
const upload = require('../utils/multer'); 
const missionsController = require('../controllers/missionsController');
const { isAuthenticatedUser, isAuthorized } = require('../middleware/auth');


router.get('/getAllMissions', missionsController.getAllMissions);

router.get('/getMissionById/:missionsId', isAuthenticatedUser, isAuthorized("admin"), missionsController.getMissionById);

router.post(
    '/createMission',
    upload.fields([
        { name: 'Image[single]', maxCount: 1 },
        { name: 'Image[multiple]' },
    ]),
    missionsController.createMission
);
router.put('/updateMission/:missionsId', missionsController.updateMission);

router.delete('/deleteMission/:missionsId', missionsController.deleteMission);

module.exports = router;