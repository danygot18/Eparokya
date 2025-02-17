const express = require('express');
const router = express.Router();
const memberYearBatchCategoryController = require('../../controllers/Members/MemberYearBatchController');

router.post('/createMemberYear', memberYearBatchCategoryController.createCategory);
router.get('/getAllMemberYear', memberYearBatchCategoryController.getAllCategories);

router.get('/getCategory/:memberYearId', memberYearBatchCategoryController.getCategoryById);
router.put('/editMemberYear/:memberYearId', memberYearBatchCategoryController.updateCategory);
router.delete('/deleteMemberYear/:memberYearId', memberYearBatchCategoryController.deleteCategory);

module.exports = router;
