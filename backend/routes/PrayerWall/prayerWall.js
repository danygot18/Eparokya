const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../../middleware/auth");
const { isAuthenticatedUser, isAuthorized } = require('../../middleware/auth');
const PrayerWallController = require("../../controllers/Prayers/prayerWallController");

router.post("/submitPrayer", isAuthenticatedUser, PrayerWallController.submitPrayerRequest);
router.get("/getAllPrayers", isAuthenticatedUser, PrayerWallController.getAllPrayers);
router.get("/prayer-wall", PrayerWallController.getConfirmedPrayers);

router.get("/pending", isAuthenticatedUser, PrayerWallController.getPendingPrayers);
router.put("/confirmPrayer/:prayerId", isAuthenticatedUser, PrayerWallController.approvePrayer);
router.put("/toggleInclude/:prayerId", isAuthenticatedUser, PrayerWallController.toggleInclude); 
router.put("/toggle-like/:prayerId", isAuthenticatedUser, PrayerWallController.toggleLike);
router.put("/:prayerId/approve", isAuthenticatedUser, PrayerWallController.approvePrayer);
router.put("/:prayerId/reject", isAuthenticatedUser, PrayerWallController.rejectPrayer);

module.exports = router;
