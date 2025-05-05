const express = require('express');
const router = express.Router();
const MassWeddingFormController = require('../../controllers/MassForms/MassWeddingController');
const { isAuthenticatedUser, isAuthorized } = require('../../middleware/auth');
// const multer = require('multer');
// const upload = multer({ dest: 'uploads/' });
const upload = require('../../utils/multer'); 


router.post(
  '/submitMassWeddingForm',
  upload.fields([
    { name: 'GroomNewBaptismalCertificate', maxCount: 1 },
    { name: 'GroomNewConfirmationCertificate', maxCount: 1 },
    { name: 'GroomMarriageLicense', maxCount: 1 },
    { name: 'GroomMarriageBans', maxCount: 1 },
    { name: 'GroomOrigCeNoMar', maxCount: 1 },
    { name: 'GroomOrigPSA', maxCount: 1 },
    { name: 'GroomChildBirthCertificate', maxCount: 1 },
    { name: 'GroomPermitFromtheParishOftheBride', maxCount: 1 },
    { name: 'GroomOneByOne', maxCount: 1 },

    { name: 'BrideNewBaptismalCertificate', maxCount: 1 },
    { name: 'BrideNewConfirmationCertificate', maxCount: 1 },
    { name: 'BrideMarriageLicense', maxCount: 1 },
    { name: 'BrideMarriageBans', maxCount: 1 },
    { name: 'BrideOrigCeNoMar', maxCount: 1 },
    { name: 'BrideOrigPSA', maxCount: 1 },
    { name: 'BrideChildBirthCertificate', maxCount: 1 },
    { name: 'BridePermitFromtheParishOftheBride', maxCount: 1 },
    { name: 'BrideOneByOne', maxCount: 1 },
  ]),
  isAuthenticatedUser, MassWeddingFormController.submitWeddingForm
);


//FormSubmission
// router.post(
//     '/submitWeddingForm', upload.single('image'),  WeddingFormController.submitWeddingForm
//   );

router.get('/getAllMassWeddings', MassWeddingFormController.getAllWeddings);
// router.get('/confirmedWedding',  MassWeddingFormController.getConfirmedWeddings);

// router.get('/stats/weddingsPerMonth', isAuthenticatedUser, isAuthorized("admin"), MassWeddingFormController.getWeddingsPerMonth);
// router.get('/stats/weddingStatusCount', isAuthenticatedUser, isAuthorized("admin"),  MassWeddingFormController.getWeddingStatusCounts);

router.get('/getWeddingChecklist/:massWeddingId', MassWeddingFormController.getWeddingChecklist);
router.put('/updateWeddingChecklist/:massWeddingId', MassWeddingFormController.updateWeddingChecklist);

router.post('/:massWeddingId/commentMassWedding',  MassWeddingFormController.addComment);
router.post('/updateAdditionalMassReq/:massWeddingId',  MassWeddingFormController.updateAdditionalReq);

router.get('/getAllUserSubmittedWedding', isAuthenticatedUser, MassWeddingFormController.getMySubmittedForms);
// router.get('/getWeddingForm/:formId', isAuthenticatedUser, MassWeddingFormController.getWeddingFormById);

// router.post('/admin/available-dates', isAuthenticatedUser, isAuthorized, MassWeddingFormController.addAvailableDate);
router.get('/getmassWeddingById/:massWeddingId',  MassWeddingFormController.getWeddingById);

router.post('/:massWeddingId/confirmMassWedding',  MassWeddingFormController.confirmWedding);
router.post('/declineMassWedding/:massWeddingId', isAuthenticatedUser, MassWeddingFormController.declineWedding);

//wedding dates
// router.get('/weddingdates', MassWeddingFormController.getWeddingSummary)
// router.put('/:id', MassWeddingFormController.updateWedding);

module.exports = router;