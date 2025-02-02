const express = require('express');
const router = express.Router();
const funeralController = require('../controllers/Funeral/FuneralController');
const { isAuthenticatedUser, isAuthorized } = require('../middleware/auth');
// const multer = require('multer');
// const upload = multer({ dest: 'uploads/' });
const upload = require('../utils/multer'); 
router.get('/getAllFunerals', funeralController.getFunerals);

router.post(
    '/funeralCreate', 
    upload.fields([
    { name: 'deathCertificate', maxCount: 1 },]),
    isAuthenticatedUser, funeralController.createFuneral);
router.get('/confirmed', funeralController.getConfirmedFunerals);
router.get('/mySubmittedForms', isAuthenticatedUser, funeralController.getMySubmittedForms);
router.get('/stats/funeralsPerMonth', isAuthenticatedUser, funeralController.getFuneralsPerMonth);
router.get('/stats/funeralStatusCount', isAuthenticatedUser, funeralController.getFuneralStatusCounts);


router.post('/comment/:funeralId', funeralController.createComment);
router.delete('/comment/:funeralId/:commentId', funeralController.deleteComment);
router.put('/comment/:funeralId/:commentId', funeralController.updateComment);

router.get('/getFuneral/:funeralId', funeralController.getFuneralById);
router.put('/update/:id', funeralController.updateFuneral);
router.delete('/delete/:id', funeralController.deleteFuneral);
router.put('/confirm/:id', funeralController.confirmFuneral);
router.put('/cancel/:id', funeralController.cancelFuneral);

module.exports = router;
