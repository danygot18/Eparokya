const express = require('express');
const router = express.Router();
const ministryCategoryController = require('../controllers/ministryCategoryController');
const { isAuthenticatedUser, authorizeAdmin } = require('../middleware/auth');

router.get('/getAllMinistryCategories', ministryCategoryController.getAllMinistryCategories);
router.get('/getMinistry/:ministryId', ministryCategoryController.getMinistryId );
router.post('/ministryCategory/create', ministryCategoryController.createMinistry );

router.delete('/deleteMinistryCategory/:ministryId', ministryCategoryController.deleteMinistry );
router.put('/updateMinistryCategory/:ministryId', ministryCategoryController.updateMinistryCategory );

module.exports = router;