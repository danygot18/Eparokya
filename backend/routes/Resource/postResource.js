const express = require('express');
const router = express.Router();
const { createPostResource, getPostResources, getPostResourceById, updatePostResource, deletePostResource } = require('../../controllers/Resource/postResourceController');
const upload = require('../../utils/multer');

// router.post(
//     '/create',
//     upload.fields([{ name: 'image', maxCount: 1 }, { name: 'file', maxCount: 1 }]),
//     createPostResource
// );

router.post('/create', upload.fields([{ name: 'image' }, { name: 'file' }]), createPostResource)

router.get('/', getPostResources);
router.get('/:id', getPostResourceById);
router.put('/:id', upload.fields([{ name: 'image', maxCount: 1 }, { name: 'file', maxCount: 1 }]), updatePostResource);
router.delete('/:id', deletePostResource);

module.exports = router;
