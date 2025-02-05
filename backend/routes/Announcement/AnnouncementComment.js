const express = require('express');
const router = express.Router();
const AnnouncementCommentController = require('../../controllers/Announcement/AnnouncementCommentController');
const { isAuthenticatedUser, authorizeAdmin } = require('../../middleware/auth');

router.post('/:announcementId/announcementComment', isAuthenticatedUser, AnnouncementCommentController.addComment);
router.put('/announcementId/comment/update/:commentId', isAuthenticatedUser, AnnouncementCommentController.updateCommentOrReply);
router.delete('/announcementId/comment/delete/:commentId', isAuthenticatedUser, AnnouncementCommentController.deleteCommentOrReply);

// router.get('/:announcementId/comments', AnnouncementCommentController.getCommentsWithReplies);
router.get('/comments/:announcementId', AnnouncementCommentController.getCommentsWithReplies);

router.put('/anouncementCommentLike/:commentId', isAuthenticatedUser, AnnouncementCommentController.likeComment);
router.put('/announcementCommentUnlike/:commentId', isAuthenticatedUser, AnnouncementCommentController.unlikeComment);
router.post('/announcementReply/:commentId', isAuthenticatedUser, AnnouncementCommentController.addReply);

module.exports = router;