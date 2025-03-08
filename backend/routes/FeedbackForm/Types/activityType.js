const express = require("express");
const router = express.Router();
const activityTypeController = require("../../../controllers/FeedbackForm/Types/ActivityTypeController");

router.post("/createActivityType", activityTypeController.createActivityType);
router.get("/getAllActivityTypes", activityTypeController.getAllActivityTypes);
router.get("/getActivityTypeById/:activityTypeId", activityTypeController.getActivityTypeById);
router.delete("/deleteActivityType/:activityTypeId", activityTypeController.deleteActivityType);

module.exports = router;
