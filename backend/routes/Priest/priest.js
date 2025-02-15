const express = require('express');
const router = express.Router();
const priestController = require('../../controllers/Priest/priestController');
const upload = require('../../utils/multer'); 
const { isAuthenticatedUser, isAuthorized } = require('../../middleware/auth');

router.get('/getAllPriest', priestController.getAllPriests);
router.get('/getAvailablePriest', priestController.getAvailablePriest);
router.get('/getPriestById/:priestId', priestController.getPriestById);

router.post('/createPriest', upload.single('image'), priestController.createPriest);

router.put('/updatePriest/:priestId', priestController.updatePriest);
router.delete('/deletePriest/:priestId', priestController.deletePriest);

router.put('/updatePriestStatus/:priestId', priestController.updatePriestStatus);


module.exports = router;
