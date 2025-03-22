const express = require('express');
const router = express.Router();
const resourceController = require('../../controllers/Resources/resourceController');
const upload = require('../../utils/multer'); 

router.post(
  '/createResource', 
  upload.fields([
    { name: 'image', maxCount: 1 },  
    { name: 'images' },             
    { name: 'file', maxCount: 1 },
    { name: 'videos' }    
  ]), 
  resourceController.createResource
);

router.get('/getAllResource', resourceController.getAllResources);

router.get('/getResourceById/:resourceId', resourceController.getResourceById);

router.put(
  '/updateResource/:resourceId', 
  upload.fields([
    { name: 'image', maxCount: 1 }, 
    { name: 'images' },
    { name: 'file', maxCount: 1 },
    { name: 'video', maxCount: 1 }  
  ]), 
  resourceController.updateResource
);
router.post('/toggleBookmark/:resourceId', resourceController.toggleBookmark);
router.get("/userBookmarks/:userId", resourceController.getUserBookmarks);
router.delete('/deleteResource/:resourceId', resourceController.deleteResource);

module.exports = router;
