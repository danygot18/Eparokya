const adminDate = require('../models/adminDate');

exports.getAllDates = async (req, res) => {
    try {
        const dates = await adminDate.find();
        //calculateAvailable sa model
        const updatedDates = dates.map(date => ({
            ...date.toObject(), // Convert Mongoose to plain JavaScript 
            availableParticipants: date.calculateAvailable(), // Call 
        }));

        res.status(200).json(updatedDates);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch dates', error });
    }
};

exports.createDate = async (req, res) => {
    const { category, date, time, maxParticipants } = req.body;

    try {
        const newDate = new adminDate({
            category,
            date,
            time,
            maxParticipants,
        });

        await newDate.save();
        res.status(201).json({ message: 'Date created successfully', newDate });
    } catch (error) {
        res.status(500).json({ message: 'Failed to create date', error });
    }
};

exports.toggleDate = async (req, res) => {
    const { adminDateId } = req.params;
    console.log('adminDateId from params:', adminDateId);

    try {
        const adminDateDoc = await adminDate.findById(adminDateId);  

        if (!adminDateDoc) {
            return res.status(404).json({ message: 'Date not found' });
        }

        console.log('Before toggle:', adminDateDoc.isEnabled);
        adminDateDoc.isEnabled = !adminDateDoc.isEnabled;
        console.log('After toggle:', adminDateDoc.isEnabled);

        await adminDateDoc.save();
        res.status(200).json({ message: 'Status updated', adminDate: adminDateDoc });
    } catch (error) {
        console.error('Error:', error); 
        res.status(500).json({ message: 'Failed to update status', error });
    }
};


exports.confirmParticipant = async (req, res) => {
    const { adminDateId } = req.params;

    try {
        const adminDate = await adminDate.findById(adminDateId);

        if (!adminDate) {
            return res.status(404).json({ message: 'Date not found' });
        }

        if (!adminDate.canAcceptParticipants()) {
            return res.status(400).json({ message: 'Maximum participants reached' });
        }

        adminDate.confirmedParticipants += 1;
        await adminDate.save();

        res.status(200).json({ message: 'Participant confirmed', adminDate });
    } catch (error) {
        res.status(500).json({ message: 'Failed to confirm participant', error });
    }
};

exports.deleteDate = async (req, res) => {
    const { adminDateId } = req.params;

    try {
        const deletedDate = await adminDate.findByIdAndDelete(adminDateId);

        if (!deletedDate) {
            return res.status(404).json({ message: 'Date not found' });
        }

        res.status(200).json({ message: 'Date deleted successfully', deletedDate });
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete date', error });
    }
};

exports.updateSubmitted = async (req, res) => {
    const { adminDateId } = req.params;

    try {
        const date = await adminDate.findById(adminDateId);
        if (!date) {
            return res.status(404).json({ message: 'Date not found' });
        }

        date.submittedParticipants += 1;
        await date.save();

        res.status(200).json({ message: 'Participant submitted', date });
    } catch (error) {
        res.status(500).json({ message: 'Failed to update submission count', error });
    }
};

exports.editMaxParticipants = async (req, res) => {
    const { adminDateId } = req.params;
    const { maxParticipants } = req.body;

    try {
        const date = await adminDate.findById(adminDateId);
        if (!date) {
            return res.status(404).json({ message: 'Date not found' });
        }

        date.maxParticipants = maxParticipants;
        await date.save();

        res.status(200).json({ message: 'Max participants updated', date });
    } catch (error) {
        res.status(500).json({ message: 'Failed to update max participants', error });
    }
};

