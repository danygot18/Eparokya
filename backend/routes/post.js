// routes/postRoutes.js
const express = require('express');
const Post = require('../controllers/PostController');
const upload = require('../utils/multer')

const router = express.Router();
const { isAuthenticatedUser, isAuthorized } = require('../middleware/auth');
// Route for creating a post with multiple images
router.post('/admin/post/create', isAuthenticatedUser, upload.array('images', 10),isAuthorized("admin"), Post.createPost); // Limit of 5 images per post
router.get('/admin/posts', isAuthenticatedUser,isAuthorized("admin"), Post.getAllPosts);
router.get('/admin/post/:id', isAuthenticatedUser, isAuthorized("admin"), Post.getSinglePost)
router.delete('/admin/post/:id', isAuthenticatedUser,isAuthorized("admin"), Post.deletePost);
router.put('/admin/post/:id', isAuthenticatedUser,isAuthorized("admin"), upload.array('images'), Post.updatePost)

//guest
router.get('/posts', Post.getPosts);
module.exports = router;
