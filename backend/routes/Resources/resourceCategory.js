const express = require('express');
const router = express.Router();
const resourceCategoryController = require('../../controllers/Resources/ResourceCategoryController');

router.post('/createResourceCategory', resourceCategoryController.createResourceCategory);
router.get('/getAllResourceCategory', resourceCategoryController.getAllResourceCategories);
router.get('/getResourceCategory/:resourceCategoryId', resourceCategoryController.getResourceCategoryById);
router.delete('/deleteResourceCategory/:resourceCategoryId', resourceCategoryController.deleteResourceCategory);

module.exports = router;