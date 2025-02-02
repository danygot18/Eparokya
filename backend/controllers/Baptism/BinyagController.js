const Baptism = require("../../models/Binyag");
const mongoose = require("mongoose");
const cloudinary = require('cloudinary').v2;
// Submit Baptism Form

exports.submitBaptismForm = async (req, res) => {
  try {
    const {
      baptismDate,
      baptismTime,
      child,
      parents,
      ninong,
      ninang,
      NinongGodparents,
      NinangGodparents,
    } = req.body;

    const Docs = {};

    const uploadToCloudinary = async (file, folder) => {
      if (!file) throw new Error('File is required for upload.');
      const result = await cloudinary.uploader.upload(file.path, { folder });
      return { public_id: result.public_id, url: result.secure_url };
    };

    try {
      if (req.files && req.files.birthCertificate) {
        Docs.birthCertificate = await uploadToCloudinary(req.files.birthCertificate[0], 'eparokya/baptism/docs');
      } else {
        throw new Error('Birth Certificate is required.');
      }

      if (req.files && req.files.marriageCertificate) {
        Docs.marriageCertificate = await uploadToCloudinary(req.files.marriageCertificate[0], 'eparokya/baptism/docs');
      } else {
        throw new Error('Marriage Certificate is required.');
      }

      if (req.files && req.files.baptismPermit) {
        Docs.baptismPermit = await uploadToCloudinary(req.files.baptismPermit[0], 'eparokya/baptism/docs');
      } else {
        throw new Error('Baptism Permit is required.');
      }
    } catch (error) {
      return res.status(400).json({ success: false, message: error.message });
    }

    // Extract userId from req (assumes authentication middleware adds user info to req)
    const userId = req.user._id;

    const baptism = new Baptism({
      baptismDate,
      baptismTime,
      child: child ? JSON.parse(child) : null,
      parents: parents ? JSON.parse(parents) : null,
      ninong: ninong ? JSON.parse(ninong) : [],
      ninang: ninang ? JSON.parse(ninang) : [],
      NinongGodparents: NinongGodparents ? JSON.parse(NinongGodparents) : [],
      NinangGodparents: NinangGodparents ? JSON.parse(NinangGodparents) : [],
      Docs,
      userId, // Associate the baptism record with the user
    });

    const savedBaptism = await baptism.save();

    res.status(201).json({ success: true, baptism: savedBaptism });
  } catch (error) {
    console.error('Error creating baptism:', error);
    res.status(500).json({ success: false, message: 'Error creating baptism', error: error.message });
  }
};


exports.listBaptismForms = async (req, res) => {
  try {
    const baptismForms = await Baptism.find()
      .sort({ createdAt: -1 })
      .populate('userId', 'id name'); 

    if (baptismForms.length === 0) {
      return res.status(404).json({ message: "No baptism forms found." });
    }

    return res.status(200).json({
      message: "Baptism forms retrieved successfully.",
      baptismForms,
    });
  } catch (error) {
    console.error("Error retrieving baptism forms:", error);
    return res.status(500).json({
      message: "There was an error retrieving baptism forms.",
      error: error.message,
    });
  }
};


// Get Baptism By ID
exports.getBaptismById = async (req, res) => {
  console.log("Request ID:", req.params.id);

  try {
    const baptism = await Baptism.findById(req.params.id).populate('userId');

    if (!baptism) {
      return res.status(404).json({ message: "The baptism with the given ID was not found." });
    }

    res.status(200).json(baptism);
  } catch (error) {
    console.error("Error fetching baptism by ID:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// Confirm Baptism
exports.confirmBaptism = async (req, res) => {
  const baptismId = req.params.id;

  try {
    const baptism = await Baptism.findById(baptismId);
    if (!baptism) {
      return res.status(404).json({ message: "Baptism not found" });
    }

    baptism.binyagStatus = "Confirmed";
    await baptism.save();

    res.status(200).json({ message: "Baptism confirmed" });
  } catch (error) {
    console.error("Error confirming baptism:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// Decline Baptism
exports.declineBaptism = async (req, res) => {
  try {
    const baptism = await Baptism.findByIdAndUpdate(
      req.params.id,
      { binyagStatus: 'Cancelled' },
      { new: true }
    );
    if (!baptism) return res.status(404).send('Baptism not found.');
    res.send(baptism);
  } catch (err) {
    res.status(500).send('Server error.');
  }
};

// Get Confirmed Baptisms
exports.getConfirmedBaptisms = async (req, res) => {
  try {
    console.log("Fetching confirmed baptisms...");
    const confirmedBaptisms = await Baptism.find({ binyagStatus: "Confirmed" });
    console.log("Query result:", confirmedBaptisms);

    res.status(200).json(confirmedBaptisms);
  } catch (error) {
    console.error("Error fetching confirmed baptisms:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// Add Comment to Baptism
exports.addBaptismComment = async (req, res) => {
  const baptismId = req.params.id;

  try {
    const baptism = await Baptism.findById(baptismId);
    if (!baptism) {
      return res.status(404).json({ message: "Baptism not found" });
    }

    const newComment = {
      priest: req.body.priest,
      scheduledDate: req.body.scheduledDate,
      selectedComment: req.body.selectedComment,
      additionalComment: req.body.additionalComment,
    };

    baptism.comments = baptism.comments || []; // Initialize comments array if not existing
    baptism.comments.push(newComment);
    await baptism.save();

    res.status(201).json(baptism.comments);
  } catch (error) {
    console.error("Error adding comment to baptism:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get My Submitted Forms
exports.getMySubmittedForms = async (req, res) => {
  try {
    const userId = req.user.id;
    console.log("Authenticated User ID:", userId);

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid User ID" });
    }

    const forms = await Baptism.find({ userId });

    if (!forms.length) {
      return res.status(404).json({ message: "No forms found for this user." });
    }

    res.status(200).json({ forms });
  } catch (error) {
    console.error("Error fetching submitted baptism forms:", error);
    res.status(500).json({ message: "Failed to fetch submitted baptism forms." });
  }
};

// Reports
exports.getBaptismPerMonth = async (req, res) => {
  const data = await Baptism.aggregate([
    {
      $group: {
        _id: { $month: "$baptismDate" },
        count: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);
  const result = Array(12).fill(0);
  data.forEach(({ _id, count }) => {
    result[_id - 1] = count;
  });
  res.json(result);
};

exports.getBaptismStatusCounts = async (req, res) => {
  try {
    const counts = await Baptism.aggregate([
      { $group: { _id: "$binyagStatus", count: { $sum: 1 } } },
    ]);
    res.status(200).json(counts);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch baptism status counts", error });
  }
};
