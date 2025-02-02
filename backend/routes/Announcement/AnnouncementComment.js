const express = require('express');
const router = express.Router();
const AnnouncementCommentController = require('../../controllers/Announcement/AnnouncementCommentController');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const { isAuthenticatedUser, isAuthorized } = require('../../middleware/auth');

router.post('/comment/:announcementId', isAuthenticatedUser, AnnouncementCommentController.addComment);
router.put('/announcementId/comment/update/:commentId', isAuthenticatedUser, AnnouncementCommentController.updateCommentOrReply);
router.delete('/announcementId/comment/delete/:commentId', isAuthenticatedUser, AnnouncementCommentController.deleteCommentOrReply);

router.get('/:announcementId/comments', AnnouncementCommentController.getCommentsWithReplies);
router.get('/comments/:announcementId', AnnouncementCommentController.getCommentsWithReplies);

router.post('/comment/like/:commentId', isAuthenticatedUser, AnnouncementCommentController.likeComment);
router.post('/comment/unlike/:commentId', isAuthenticatedUser, AnnouncementCommentController.unlikeComment);

router.post('/comment/reply/:commentId', isAuthenticatedUser, AnnouncementCommentController.addReply);

module.exports = router;