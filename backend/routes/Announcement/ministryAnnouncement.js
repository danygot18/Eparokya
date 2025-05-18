const express = require('express');
const router = express.Router();
const ministryAnnouncementController = require('../../controllers/Announcement/ministryAnnouncementController');
const upload = require('../../utils/multer'); 
const { isAuthenticatedUser, authorizeAdmin } = require('../../middleware/auth');

router.post('/ministryAnnouncementCreate/:ministryCategoryId', upload.array('images', 10), ministryAnnouncementController.createAnnouncement);
// router.get('/getAllMinistryAnnouncement', ministryAnnouncementController.getAllAnnouncements);

router.post("/:announcementId/togglePin", ministryAnnouncementController.togglePinAnnouncement);
router.get('/getMinistryAnnouncements/:ministryCategoryId', ministryAnnouncementController.getAnnouncementsByMinistryCategory);

router.get('/pinnedMinistryAnnouncement/:ministryCategoryId', ministryAnnouncementController.getPinnedAnnouncementsByMinistryCategory);

router.get('/getMinistryAnnouncementById/:ministryAnnouncementId', ministryAnnouncementController.getAnnouncementById);
router.put('/updateMinistryAnnouncement/:ministryAnnouncementId', upload.array('images'), ministryAnnouncementController.updateAnnouncement);

router.delete('/deleteMinistryAnnouncement/:ministryAnnouncementId', ministryAnnouncementController.deleteAnnouncement);
router.post('/acknowledgeMinistryAnnouncement/:ministryAnnouncementId', isAuthenticatedUser, ministryAnnouncementController.acknowledgeAnnouncement);

module.exports = router;
