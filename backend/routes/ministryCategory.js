const express = require('express');
const router = express.Router();
const ministryCategoryController = require('../controllers/ministryCategoryController');
const { isAuthenticated, isAuthorized } = require('../middleware/auth');

router.get('/getAllMinistryCategories', ministryCategoryController.getAllMinistryCategories);
router.get('/getMinistry/:ministryId', ministryCategoryController.getMinistryId );
router.post('/ministryCategory/create', ministryCategoryController.createMinistry );

router.get('/ministryEvents/:ministryId', ministryCategoryController.getMinistryEvents);
router.delete('/deleteMinistryCategory/:ministryId', ministryCategoryController.deleteMinistry );
router.put('/updateMinistryCategory/:ministryId', ministryCategoryController.updateMinistryCategory );
router.get("/:ministryCategoryId/users", ministryCategoryController.getUsersByMinistryCategory);

module.exports = router;