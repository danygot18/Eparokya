const express = require('express');
const router = express.Router();
const WeddingFormController = require('../controllers/Wedding/WeddingController');
const { isAuthenticatedUser, isAuthorized } = require('../middleware/auth');
// const multer = require('multer');
// const upload = multer({ dest: 'uploads/' });
const upload = require('../utils/multer'); 


router.post(
  '/submitWeddingForm',
  upload.fields([
    { name: 'GroomNewBaptismalCertificate', maxCount: 1 },
    { name: 'GroomNewConfirmationCertificate', maxCount: 1 },
    { name: 'GroomMarriageLicense', maxCount: 1 },
    { name: 'GroomMarriageBans', maxCount: 1 },
    { name: 'GroomOrigCeNoMar', maxCount: 1 },
    { name: 'GroomOrigPSA', maxCount: 1 },
    { name: 'BrideNewBaptismalCertificate', maxCount: 1 },
    { name: 'BrideNewConfirmationCertificate', maxCount: 1 },
    { name: 'BrideMarriageLicense', maxCount: 1 },
    { name: 'BrideMarriageBans', maxCount: 1 },
    { name: 'BrideOrigCeNoMar', maxCount: 1 },
    { name: 'BrideOrigPSA', maxCount: 1 },
    { name: 'PermitFromtheParishOftheBride', maxCount: 1 },
    { name: 'ChildBirthCertificate', maxCount: 1 } 
  ]),
  WeddingFormController.submitWeddingForm
);


//FormSubmission
// router.post(
//     '/submitWeddingForm', upload.single('image'),  WeddingFormController.submitWeddingForm
//   );

router.get('/getAllWeddings', isAuthenticatedUser, isAuthorized("admin"), WeddingFormController.getAllWeddings);
router.get('/confirmedWedding',  WeddingFormController.getConfirmedWeddings);
router.get('/stats/weddingsPerMonth', isAuthenticatedUser, WeddingFormController.getWeddingsPerMonth);
router.get('/stats/weddingStatusCount', isAuthenticatedUser, WeddingFormController.getWeddingStatusCounts);

router.get('/weddingDate',  WeddingFormController.getAvailableDates);
router.post('/book/date',  WeddingFormController.bookDate);
router.post('/admin/available-dates', isAuthenticatedUser, isAuthorized, WeddingFormController.addAvailableDate);

router.get('/getWeddingById/:weddingId', isAuthenticatedUser, isAuthorized("admin"), WeddingFormController.getWeddingById);
router.post('/:weddingId/confirm',  WeddingFormController.confirmWedding);
router.post('/:weddingId/decline', WeddingFormController.declineWedding);
router.delete('/admin/available-dates/:weddingId', isAuthenticatedUser, isAuthorized, WeddingFormController.removeAvailableDate);

//wedding dates
// router.get('/weddingdates', WeddingFormController.getWeddingSummary)
// router.put('/:id', WeddingFormController.updateWedding);

module.exports = router;