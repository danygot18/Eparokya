const express = require('express');
const router = express.Router();
const BaptismController = require('../controllers/Baptism/BinyagController');
const { isAuthenticatedUser, authorizeAdmin } = require('../middleware/auth');
// const multer = require('multer');
// const upload = multer({ dest: 'uploads/' });
const upload = require('../utils/multer'); 

router.get('/baptismList', BaptismController.listBaptismForms);

router.post(
  '/baptismCreate',
  upload.fields([
    { name: 'birthCertificate', maxCount: 1 },
    { name: 'marriageCertificate', maxCount: 1 },
    { name: 'baptismPermit', maxCount: 1 },
  ]),
  isAuthenticatedUser, BaptismController.submitBaptismForm
);

router.get('/mySubmittedForms', isAuthenticatedUser, BaptismController.getMySubmittedForms);
router.get('/confirmedBaptism', BaptismController.getConfirmedBaptisms);
router.get('/getBaptismChecklist/:baptismId', BaptismController.getBaptismChecklist);

router.post('/commentBaptism/:baptismId', BaptismController.addBaptismComment);
router.post('/adminAdditionalNotes/:baptismId', BaptismController.addAdminNotes);

router.get('/stats/baptsimsPerMonth', BaptismController.getBaptismPerMonth);
router.get('/stats/baptismStatusCount', isAuthenticatedUser, BaptismController.getBaptismStatusCounts);
router.put('/updateBaptismChecklist/:baptismId', BaptismController.updateBaptismChecklist);

router.get('/getAllUserSubmittedBaptism', isAuthenticatedUser, BaptismController.getMySubmittedForms);
router.get('/getBaptismForm/:formId', isAuthenticatedUser, BaptismController.getBaptismFormById);


router.put('/declineBaptism/:baptismId/', BaptismController.declineBaptism);
router.post('/:baptismId/admin/addComment', BaptismController.addBaptismComment);
router.put('/:baptismId/updateBaptismDate', BaptismController.updateBaptismDate);


router.get('/getBaptism/:id', BaptismController.getBaptismById);
router.post('/:baptismId/confirmBaptism', BaptismController.confirmBaptism);

module.exports = router;
