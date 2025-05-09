const express = require('express');
const router = express.Router();
const adminDateController = require('../controllers/adminDateController');

router.get('/getAllDates', adminDateController.getAllDates);
router.post('/createDate', adminDateController.createDate);

router.get('/getActiveDatesByCategory/:category', adminDateController.getActiveDatesByCategory);

router.put('/:adminDateId/update', adminDateController.updateSubmitted);
router.put('/:adminDateId/editMax', adminDateController.editMaxParticipants);

router.post('/:adminDateId/confirm', adminDateController.confirmParticipant);
router.put('/:adminDateId/switchDate', adminDateController.toggleDate);

router.delete('/:adminDateId/delete', adminDateController.deleteDate);


module.exports = router;