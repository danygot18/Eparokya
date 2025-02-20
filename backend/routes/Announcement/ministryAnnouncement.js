const express = require('express');
const router = express.Router();
const ministryAnnouncementController = require('../../controllers/Announcement/ministryAnnouncementController');
const upload = require('../../utils/multer'); 

router.post('/ministryAnnouncementCreate/:ministryCategoryId', upload.array('images', 10), ministryAnnouncementController.createAnnouncement);
router.get('/getAllMinistryAnnouncement', ministryAnnouncementController.getAllAnnouncements);

router.get('/getMinistryAnnouncementById/:ministryAnnouncementId', ministryAnnouncementController.getAnnouncementById);
router.put('/updateMinistryAnnouncement/:ministryAnnouncementId', ministryAnnouncementController.updateAnnouncement);

router.delete('/deleteMinistryAnnouncement/:ministryAnnouncementId', ministryAnnouncementController.deleteAnnouncement);
router.post('/acknowledgeMinistryAnnouncement/:ministryAnnouncementId', ministryAnnouncementController.acknowledgeAnnouncement);

module.exports = router;
