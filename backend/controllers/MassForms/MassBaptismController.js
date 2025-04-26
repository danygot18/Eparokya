const MassBaptism = require('../../models/MassForms/massBinyag');
const AdminDate = require('../../models/adminDate');
const cloudinary = require('cloudinary').v2;

exports.getActiveBaptismDates = async (req, res) => {
    try {
        const activeDates = await AdminDate.find({ category: 'Baptism', isEnabled: true });
        res.status(200).json(activeDates);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching baptism dates', error });
    }
};

exports.createBaptism = async (req, res) => {
    try {
        console.log("Received files:", req.files);
        console.log("Received body:", req.body);

        const { baptismDateTime, child, parents, ninong, ninang, NinongGodparents, NinangGodparents } = req.body;
        const userId = req.user._id;

        if (!baptismDateTime) {
            return res.status(400).json({ message: 'Baptism date is required' });
        }

        const selectedDate = await AdminDate.findById(baptismDateTime.trim());
        if (!selectedDate || !selectedDate.isEnabled) {
            return res.status(400).json({ message: 'Selected baptism date is not available or has been disabled' });
        }

        if (!selectedDate.canAcceptParticipants()) {
            return res.status(400).json({ message: 'This baptism event is already full' });
        }

        const Docs = { additionalDocs: {} };
        let additionalDocs = {};

        const uploadToCloudinary = async (file, folder) => {
            if (!file) throw new Error('File is required for upload.');
            const result = await cloudinary.uploader.upload(file.path, { folder });
            return { public_id: result.public_id, url: result.secure_url };
        };

        try {
            console.log("Checking file uploads...");

            if (req.files?.birthCertificate && req.files.birthCertificate[0]) {
                Docs.birthCertificate = await uploadToCloudinary(req.files.birthCertificate[0], 'eparokya/baptism/docs');
            } else {
                return res.status(400).json({ success: false, message: 'Birth Certificate is required.' });
            }

            if (req.files?.marriageCertificate && req.files.marriageCertificate[0]) {
                Docs.marriageCertificate = await uploadToCloudinary(req.files.marriageCertificate[0], 'eparokya/baptism/docs');
            } else {
                return res.status(400).json({ success: false, message: 'Marriage Certificate is required.' });
            }

            if (req.files?.baptismPermit) {
                const uploadedBaptismPermit = await Promise.all(
                    req.files.baptismPermit.map(file => uploadToCloudinary(file, 'eparokya/baptism/additionalDocs'))
                );
                additionalDocs.baptismPermit = uploadedBaptismPermit[0];
            }

            if (req.files?.certificateOfNoRecordBaptism) {
                const uploadedCertificate = await Promise.all(
                    req.files.certificateOfNoRecordBaptism.map(file => uploadToCloudinary(file, 'eparokya/baptism/additionalDocs'))
                );
                additionalDocs.certificateOfNoRecordBaptism = uploadedCertificate[0];
            }
        } catch (error) {
            console.error("File upload error:", error.message);
            return res.status(400).json({ success: false, message: error.message });
        }

        if (Object.keys(additionalDocs).length === 0) {
            additionalDocs = null;
        }

        console.log("Parsing JSON fields...");
        const newBaptism = new Baptism({
            baptismDateTime,
            userId,
            child: child ? JSON.parse(child) : null,
            parents: parents ? JSON.parse(parents) : null,
            ninong: ninong ? JSON.parse(ninong) : [],
            ninang: ninang ? JSON.parse(ninang) : [],
            NinongGodparents: NinongGodparents ? JSON.parse(NinongGodparents) : [],
            NinangGodparents: NinangGodparents ? JSON.parse(NinangGodparents) : [],
            Docs,
            additionalDocs,
            binyagStatus: 'Pending',
        });

        console.log("Saving baptism entry...");
        await newBaptism.save();
        await AdminDate.findByIdAndUpdate(baptismDateTime, { $inc: { submittedParticipants: 1 } });

        res.status(201).json({ success: true, message: 'Baptism registration created successfully', baptism: newBaptism });
    } catch (error) {
        console.error('Error creating baptism:', error);
        res.status(500).json({ success: false, message: 'Error creating baptism', error: error.message });
    }
};

exports.getAllBaptisms = async (req, res) => {
    try {
      const baptisms = await MassBaptism.find()
        .populate('userId')
        .populate('baptismDateTime'); 
  
      res.status(200).json({ massBaptismForms: baptisms });
    } catch (error) {
      res.status(500).json({ message: 'Error fetching baptisms', error });
    }
  };
  
  exports.getBaptismById = async (req, res) => {
    try {
      const baptism = await MassBaptism.findById(req.params.massBaptismId)
        .populate('userId')
        .populate('baptismDateTime'); 
  
      if (!baptism) {
        return res.status(404).json({ message: 'Baptism not found' });
      }
      res.status(200).json(baptism);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching baptism', error });
    }
  };
  

exports.confirmBaptism = async (req, res) => {
    try {
        const { id } = req.params;
        const baptism = await MassBaptism.findById(id);

        if (!baptism) {
            return res.status(404).json({ message: 'Baptism not found' });
        }

        const event = await AdminDate.findById(baptism.baptismDateTime);
        if (!event || !event.canAcceptParticipants()) {
            return res.status(400).json({ message: 'Baptism event is full or unavailable' });
        }

        baptism.binyagStatus = 'Confirmed';
        baptism.confirmedAt = new Date();
        await baptism.save();

        await AdminDate.findByIdAndUpdate(baptism.baptismDateTime, { $inc: { confirmedParticipants: 1 } });

        res.status(200).json({ message: 'Baptism confirmed', baptism });
    } catch (error) {
        res.status(500).json({ message: 'Error confirming baptism', error });
    }
};

// exports.rescheduleBaptism = async (req, res) => {
//     try {
//         const { id } = req.params;
//         const { newDate, reason } = req.body;

//         const baptism = await Baptism.findById(id);
//         if (!baptism) {
//             return res.status(404).json({ message: 'Baptism not found' });
//         }

//         const newAdminDate = await AdminDate.findById(newDate);
//         if (!newAdminDate || !newAdminDate.isEnabled) {
//             return res.status(400).json({ message: 'New baptism date is not available' });
//         }

//         baptism.adminRescheduled = { date: newDate, reason };
//         baptism.baptismDateTime = newDate;
//         await baptism.save();

//         res.status(200).json({ message: 'Baptism rescheduled successfully', baptism });
//     } catch (error) {
//         res.status(500).json({ message: 'Error rescheduling baptism', error });
//     }
// };

exports.cancelBaptism = async (req, res) => {
    try {
        const { id } = req.params;
        const { user, reason } = req.body;

        const baptism = await MassBaptism.findById(id);
        if (!baptism) {
            return res.status(404).json({ message: 'Baptism not found' });
        }

        baptism.binyagStatus = 'Cancelled';
        baptism.cancellingReason = { user, reason };
        await baptism.save();

        await AdminDate.findByIdAndUpdate(baptism.baptismDateTime, { $inc: { submittedParticipants: -1 } });

        res.status(200).json({ message: 'Baptism cancelled successfully', baptism });
    } catch (error) {
        res.status(500).json({ message: 'Error cancelling baptism', error });
    }
};

// exports.deleteBaptism = async (req, res) => {
//     try {
//         const { id } = req.params;

//         const baptism = await Baptism.findById(id);
//         if (!baptism) {
//             return res.status(404).json({ message: 'Baptism not found' });
//         }

//         await Baptism.findByIdAndDelete(id);
//         res.status(200).json({ message: 'Baptism deleted successfully' });
//     } catch (error) {
//         res.status(500).json({ message: 'Error deleting baptism', error });
//     }
// };
