// const express = require('express');
// const Event = require('../controllers/Announcement/AnnouncementController');
// const upload = require('../utils/multer')

// const router = express.Router();
// const { isAuthenticatedUser, authorizeAdmin } = require('../middleware/auth');
// // Route for creating a post with multiple images
// // router.post('/admin/eventpost/create', isAuthenticatedUser,authorizeAdmin("admin"), upload.array('images', 10),Event.createEventPost); // Limit of 5 images per post
// router.get('/admin/eventpost', isAuthenticatedUser,authorizeAdmin("admin"), Event.getAllEventPosts);
// router.get('/admin/eventpost/:id', isAuthenticatedUser, authorizeAdmin("admin"), Event.getSingleEventPost)
// router.delete('/admin/eventpost/:id', isAuthenticatedUser,authorizeAdmin("admin"), Event.deleteEventPost);
// router.put('/admin/eventpost/:id', isAuthenticatedUser,authorizeAdmin("admin"), upload.array('images'), Event.updateEventPost)

// //guest
// // router.get('/eventpost', Event.getEvents);
// module.exports = router;