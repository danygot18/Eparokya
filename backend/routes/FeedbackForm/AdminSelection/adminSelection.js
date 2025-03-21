const express = require("express");
const router = express.Router();
const adminSelectionController = require("../../../controllers/FeedbackForm/AdminSelection/AdminSelectionController");
const { isAuthenticatedUser, isAuthorized } = require('../../../middleware/auth');


router.post("/addSelection", adminSelectionController.addSelection);
router.get("/getSelections", isAuthenticatedUser, isAuthorized("admin"), adminSelectionController.getSelections);
router.get("/admin-selections/active", adminSelectionController.getActiveSelection);
router.put("/deactivateSelection/:adminSelectionId", adminSelectionController.deactivateSelection);

module.exports = router;
