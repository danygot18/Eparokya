const express = require('express');
const router = express.Router();
const announcementController = require('../../controllers/Announcement/AnnouncementController');
const { isAuthenticatedUser, authorizeAdmin } = require('../../middleware/auth');
// const multer = require('multer');
// const upload = multer({ dest: 'uploads/' });
const upload = require('../../utils/multer'); 


// router.post('/create', upload.single('media'), announcementController.createAnnouncement);
router.post('/create/announcement', upload.fields([
    { name: 'images', maxCount: 5 },
    { name: 'video', maxCount: 5 },
  ]), announcementController.createAnnouncement);
  

router.get('/getAllAnnouncements', announcementController.getAllAnnouncements);

router.get('/getAnnouncement/:announcementId', announcementController.getAnnouncementById );
//router.get('/announcement/comments/:announcementId', announcementController.getCommentsByAnnouncementId);
router.put('/updateAnnouncement/:announcementId', announcementController.updateAnnouncement );
router.delete('/deleteAnnouncement/:announcementId', announcementController.deleteAnnouncement);

//router.put('/likeAnnouncement/:announcementId', isAuthenticated, announcementController.likeAnnouncement);
//router.post('/unlikeAnnouncement/announcementId', announcementController.unlikeAnnouncement);

module.exports = router;