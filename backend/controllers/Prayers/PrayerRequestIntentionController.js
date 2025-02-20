const express = require('express');
const router = express.Router();
const PrayerRequestIntention = require('../../models/PrayerWall/prayerRequestIntention');
const { body, validationResult } = require('express-validator');
const mongoose = require('mongoose');
const leoProfanity = require('leo-profanity');

exports.createPrayerRequestIntention = async (req, res) => {
    console.log("Received Data:", req.body);

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

        // console.log("Intentions before saving:", Intentions); 

        const newPrayerRequest = new PrayerRequestIntention({
            ...req.body,
            Intentions: Array.isArray(Intentions) ? Intentions : [], 
        });

        await newPrayerRequest.save();

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