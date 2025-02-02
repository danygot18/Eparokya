const express = require('express');
const router = express.Router();
const memberYearBatchCategoryController = require('../../controllers/Members/MemberYearBatchController');

router.post('/create', memberYearBatchCategoryController.createCategory);
router.get('/', memberYearBatchCategoryController.getAllCategories);
router.get('/:id', memberYearBatchCategoryController.getCategoryById);
router.put('/edit/:id', memberYearBatchCategoryController.updateCategory);
router.delete('/delete/:id', memberYearBatchCategoryController.deleteCategory);

module.exports = router;
