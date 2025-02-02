const express = require('express');
const router = express.Router();
const adminDateController = require('../controllers/adminDateController');

router.get('/getAllDates', adminDateController.getAllDates);
router.post('/createDate', adminDateController.createDate);

router.put('/:adminDateId/update', adminDateController.updateSubmitted);
router.put('/:adminDateId/editMax', adminDateController.editMaxParticipants);

router.patch('/:adminDateId/toggle', adminDateController.toggleDate);
router.post('/:adminDateId/confirm', adminDateController.confirmParticipant);
router.delete('/:adminDateId/delete', adminDateController.deleteDate);


module.exports = router;