const express = require('express');
const router = express.Router();
const resourceCategoryController = require('../../controllers/Resource/ResourceCategoryController');

router.post('/create', resourceCategoryController.createResourceCategory);
router.get('/', resourceCategoryController.getAllResourceCategories);
router.get('/:id', resourceCategoryController.getResourceCategoryById);
router.put('/:id', resourceCategoryController.updateResourceCategory);
router.delete('/:id', resourceCategoryController.deleteResourceCategory);

module.exports = router;
