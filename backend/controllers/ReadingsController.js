const Reading = require('../models/Readings');

exports.createReading = async (req, res) => {
  try {
    const { date } = req.body;

    const existing = await Reading.findOne({ date });
    if (existing) {
      return res.status(400).json({ message: 'Reading already exists for this date' });
    }

    const reading = new Reading(req.body);
    await reading.save();
    res.status(201).json(reading);
  } catch (error) {
    console.error('Create Reading Error:', error);
    res.status(500).json({ message: 'Failed to create reading', error });
  }
};


exports.getAllReadings = async (req, res) => {
  try {
    const readings = await Reading.find();
    res.status(200).json({ readings }); 
  } catch (error) {
    res.status(500).json({ message: 'Error fetching readings', error });
  }
};
