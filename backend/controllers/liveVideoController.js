const LiveVideo = require("../models/liveVideo");

// Save or update live video link
exports.setLiveVideo = async (req, res) => {
    try {
        const { url, description, title } = req.body;
        let liveVideo = await LiveVideo.findOne();
        
        if (liveVideo) {
            liveVideo.url = url;
            liveVideo.description = description;
            liveVideo.title = title;
            await liveVideo.save();
        } else {
            liveVideo = new LiveVideo({ url, description, title });
            await liveVideo.save();
        }

        res.status(200).json({ message: "Live video link updated successfully" });
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
};

// Get live video
exports.getLiveVideo = async (req, res) => {
    try {
        const liveVideo = await LiveVideo.findOne();
        if (liveVideo) {
            res.status(200).json(liveVideo);
        } else {
            res.status(404).json({ message: "No live video found" });
        }
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
};

// Stop live video (delete from DB)
exports.stopLiveVideo = async (req, res) => {
    try {
        await LiveVideo.deleteOne();
        res.status(200).json({ message: "Live stream stopped" });
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
};