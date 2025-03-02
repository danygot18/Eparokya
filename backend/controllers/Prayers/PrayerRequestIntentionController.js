const express = require('express');
const router = express.Router();
const PrayerRequestIntention = require('../../models/PrayerWall/prayerRequestIntention');
const Notification = require('../../models/Notification/notification');
const User = require('../../models/user');
const { body, validationResult } = require('express-validator');
const mongoose = require('mongoose');
const leoProfanity = require('leo-profanity');

exports.createPrayerRequestIntention = async (req, res, io) => { 
    console.log("Received Data:", req.body);
    console.log("Authenticated User:", req.user); 

    if (!req.user) {
        return res.status(401).json({ message: "User is not defined. Please authenticate." });
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { prayerType, addPrayer, prayerDescription, Intentions } = req.body;

        if (prayerType === 'Others' && !addPrayer) {
            return res.status(400).json({ message: 'Please specify your prayer when selecting Others.' });
        }

        if (leoProfanity.check(addPrayer) || leoProfanity.check(prayerDescription)) {
            return res.status(400).json({ message: 'Your submission contains inappropriate language.' });
        }

        const newPrayerRequest = new PrayerRequestIntention({
            ...req.body,
            userId: req.user._id, 
            Intentions: Array.isArray(Intentions) ? Intentions : [],
        });

        await newPrayerRequest.save();

        //  Find all Admins
        const admins = await User.find({ isAdmin: true }, '_id');
        const adminIds = admins.map(admin => admin._id.toString());

        // Save Notification to Database
        const notification = new Notification({
            user: req.user._id,
            type: "prayer request",
            message: "A new prayer request has been submitted.",
            link: `/admin/prayer-requests`,
            isRead: false
        });

        await notification.save();

        //  Emit Notification to Connected Admins
        if (io) {
            io.emit("send-notification", { adminIds, message: notification.message, link: notification.link });
            io.emit("push-notification", {
                message: notification.message,
                link: notification.link,
                adminIds: adminIds,
            });
        } else {
            console.error("Socket.io is not initialized");
        }

        res.status(201).json({
            message: 'Prayer submitted. This will be reviewed shortly.',
            data: newPrayerRequest,
        });
    } catch (err) {
        console.error("Server Error:", err.message);
        res.status(500).json({ message: err.message });
    }
};

exports.getAllPrayerRequestIntention = async (req, res) => {
    try {
        const prayerRequests = await PrayerRequestIntention.find().populate('userId', 'name email');
        res.status(200).json(prayerRequests);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getPrayerRequestIntentionById = async (req, res) => {
    try {
        const prayerRequest = await PrayerRequestIntention.findById(req.params.prayerIntentionId).populate('userId', 'name email');
        if (!prayerRequest) {
            return res.status(404).json({ message: 'Prayer request not found' });
        }
        res.status(200).json(prayerRequest);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.updatePrayerRequestIntention = async (req, res) => {
    try {
        const updatedPrayerRequest = await PrayerRequestIntention.findByIdAndUpdate(req.params.prayerIntentionId, req.body, { new: true });
        if (!updatedPrayerRequest) {
            return res.status(404).json({ message: 'Prayer request not found' });
        }
        res.status(200).json(updatedPrayerRequest);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.markPrayerRequestIntentionAsDone = async (req, res) => {
    try {
        const updatedPrayerRequest = await PrayerRequestIntention.findByIdAndUpdate(req.params.prayerIntentionId, { isDone: true }, { new: true });
        if (!updatedPrayerRequest) {
            return res.status(404).json({ message: 'Prayer request not found' });
        }
        res.status(200).json(updatedPrayerRequest);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.deletePrayerRequestIntention = async (req, res) => {
    try {
        const deletedPrayerRequest = await PrayerRequestIntention.findByIdAndDelete(req.params.prayerIntentionId);
        if (!deletedPrayerRequest) {
            return res.status(404).json({ message: 'Prayer request not found' });
        }
        res.status(200).json({ message: 'Prayer request deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};