const express = require('express');
const router = express.Router();
const MassBaptismController = require('../../controllers/MassForms/MassBaptismController');
const { isAuthenticatedUser, isAuthorized } = require('../../middleware/auth');
// const multer = require('multer');
// const upload = multer({ dest: 'uploads/' });
const upload = require('../../utils/multer'); 

router.get('/getAllMassBaptism', MassBaptismController.getAllBaptisms);

router.post(
  '/massBaptismCreate',
  upload.fields([
    { name: 'birthCertificate', maxCount: 1 },
    { name: 'marriageCertificate', maxCount: 1 },
    { name: 'baptismPermit', maxCount: 1 },
    { name: 'certificateOfNoRecordBaptism', maxCount: 1 }, 
  ]),
  isAuthenticatedUser,
  MassBaptismController.createBaptism
);

// router.get('/mySubmittedForms', isAuthenticatedUser, MassBaptismController.getMySubmittedForms);
// router.get('/confirmedBaptism', MassBaptismController.getConfirmedBaptisms);
router.get('/getMassBaptismChecklist/:massBaptismId', MassBaptismController.getMassBaptismChecklist);

router.post('/commentMassBaptism/:massBaptismId', isAuthenticatedUser, MassBaptismController.addMassBaptismComment);
router.post('/adminMassAdditionalNotes/:massBaptismId', MassBaptismController.addMassBaptismAdminNotes);

// router.post('/baptismAddPriest/:baptismId', BaptismController.createPriestComment);

router.get('/activeDates/massBaptism', MassBaptismController.getActiveBaptismDates);
// router.get('/stats/baptsimsPerMonth', isAuthenticatedUser, isAuthorized("admin"), MassBaptismController.getBaptismPerMonth);
// router.get('/stats/baptismStatusCount', isAuthenticatedUser, isAuthorized("admin"),  MassBaptismController.getBaptismStatusCounts);
router.put('/updateMassBaptismChecklist/:massBaptismId', MassBaptismController.updateMassBaptismChecklist);

router.get('/getAllUserMassSubmittedBaptism', isAuthenticatedUser, MassBaptismController.getMySubmittedForms);
router.get('/getUserMassBaptismForm/:massBaptismId', isAuthenticatedUser, MassBaptismController.getMassBaptismFormById);

router.put('/declineBaptism/:massBaptismId/', isAuthenticatedUser, MassBaptismController.cancelBaptism);

router.get('/getMassBaptism/:massBaptismId', MassBaptismController.getBaptismById);
router.post('/:massBaptismId/confirmMassBaptism', MassBaptismController.confirmBaptism);

module.exports = router;
