const express = require("express");
const router = express.Router();
const { setLiveVideo, getLiveVideo, stopLiveVideo } = require("../controllers/liveVideoController");

router.post("/live", setLiveVideo);  // Admin sets live video link
router.get("/live", getLiveVideo);   // User fetches live video link
router.delete("/live", stopLiveVideo); // Admin stops the live stream

module.exports = router;
