const express = require("express");
const router = express.Router();
const eventTypeController = require("../../../controllers/FeedbackForm/Types/EventTypeController");

router.post("/createEventType", eventTypeController.createEventType);
router.get("/getAllEventType", eventTypeController.getAllEventTypes);
router.get("/getEventTypeById/:eventTypeId", eventTypeController.getEventTypeById);
router.delete("/deleteEventType/:eventToDelete", eventTypeController.deleteEventType);

module.exports = router;
