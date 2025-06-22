const express = require('express');
const {
    getAllCustomEvents,
    addCustomEvent,
    deleteCustomEvent,
    getCustomEventById,
 } = require('../controllers/CustomEvent/customEventController');
const router = express.Router();
const { isAuthenticatedUser, authorizeAdmin } = require('../middleware/auth');

router.get('/getAllCustomEvents', getAllCustomEvents);
router.post('/addEvent', isAuthenticatedUser, addCustomEvent);

router.get('/getCustomeventById/:customEventId', isAuthenticatedUser, getCustomEventById);
router.delete('/deleteEvent/:eventId', isAuthenticatedUser, deleteCustomEvent);


module.exports = router;
