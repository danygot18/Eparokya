const { WeddingChecklist } = require('../../models/weddingChecklist');
const { MassWedding } = require('../../models/MassForms/massWedding');
const User = require('../../models/user');
const mongoose = require('mongoose');
const cloudinary = require('cloudinary').v2;

const uploadToCloudinary = async (file, folder) => {
    if (!file) throw new Error("File is required for upload.");
    const result = await cloudinary.uploader.upload(file.path, { folder });
    return { public_id: result.public_id, url: result.secure_url };
};

exports.submitWeddingForm = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        if (user.civilStatus === "Married") {
            return res.status(400).json({ message: "Sorry, but a 'Married' user cannot submit an application." });
        }

        const {
            
            groomName,
            groomAddress,
            brideName,
            brideAddress,
            Ninong,
            Ninang,
            brideReligion,
            brideOccupation,
            brideBirthDate,
            bridePhone,
            groomReligion,
            groomOccupation,
            groomBirthDate,
            groomPhone,
            groomFather,
            groomMother,
            brideFather,
            brideMother
        } = req.body;

        const requiredFields = [
            'groomName', 'groomAddress',
            'brideName', 'brideAddress', 'brideReligion', 'brideOccupation', 'brideBirthDate',
            'bridePhone', 'groomReligion', 'groomOccupation', 'groomBirthDate', 'groomPhone',
            'groomFather', 'groomMother', 'brideFather', 'brideMother'
        ];

        for (const field of requiredFields) {
            if (!req.body[field]) {
                return res.status(400).json({ message: `Missing required field: ${field}` });
            }
        }

        const images = {};
        const requiredImageFields = [
            "GroomNewBaptismalCertificate",
            "GroomNewConfirmationCertificate",
            "BrideNewBaptismalCertificate",
            "GroomMarriageLicense",
            "GroomMarriageBans",
            "GroomOrigCeNoMar",
            "GroomOrigPSA",
            "GroomPermitFromtheParishOftheBride",
            "GroomChildBirthCertificate",
            "GroomOneByOne",
            "BrideNewBaptismalCertificate",
            "BrideNewConfirmationCertificate",
            "BrideMarriageLicense",
            "BrideMarriageBans",
            "BrideOrigCeNoMar",
            "BrideOrigPSA",
            "BridePermitFromtheParishOftheBride",
            "BrideChildBirthCertificate",
            "BrideOneByOne",
        ];

        for (const field of requiredImageFields) {
            if (req.files[field]) {
                const uploadedImage = await uploadToCloudinary(req.files[field][0], "massWedding/docs");
                images[field] = {
                    public_id: uploadedImage.public_id,
                    url: uploadedImage.url,
                };
            } else {
                return res.status(400).json({ message: `Missing required image: ${field}` });
            }
        }

        const groomAddressObject = typeof groomAddress === 'string' ? JSON.parse(groomAddress) : groomAddress;
        const brideAddressObject = typeof brideAddress === 'string' ? JSON.parse(brideAddress) : brideAddress;

        if (groomAddressObject.baranggay === "Others" && !groomAddressObject.customBarangay) {
            return res.status(400).json({ message: "Please provide a custom barangay for the groom." });
        }
        if (brideAddressObject.baranggay === "Others" && !brideAddressObject.customBarangay) {
            return res.status(400).json({ message: "Please provide a custom barangay for the bride." });
        }
        if (groomAddressObject.city === "Others" && !groomAddressObject.customCity) {
            return res.status(400).json({ message: "Please provide a custom city for the groom." });
        }
        if (brideAddressObject.city === "Others" && !brideAddressObject.customCity) {
            return res.status(400).json({ message: "Please provide a custom city for the bride." });
        }

        const ninongArray = Ninong ? JSON.parse(Ninong) : [];
        const ninangArray = Ninang ? JSON.parse(Ninang) : [];

        const userId = req.user._id;

        const newWeddingForm = new Wedding({
            weddingDateTime,
            groomName,
            groomAddress: groomAddressObject,
            brideName,
            brideAddress: brideAddressObject,
            Ninong: ninongArray,
            Ninang: ninangArray,
            brideReligion,
            brideOccupation,
            brideBirthDate,
            bridePhone,
            groomReligion,
            groomOccupation,
            groomBirthDate,
            groomPhone,
            groomFather,
            groomMother,
            brideFather,
            brideMother,
            ...images,
            userId,
        });

        await newWeddingForm.save();

        res.status(201).json({
            message: "Wedding form submitted successfully!",
            weddingForm: newWeddingForm,
        });
    } catch (error) {
        console.error("Error submitting wedding form:", error);
        res.status(500).json({ message: "An error occurred during submission.", error: error.message });
    }
};

exports.getAllWeddings = async (req, res) => {
  try {
    const massWeddingList = await MassWedding.find({}, 'brideName groomName bridePhone groomPhone weddingStatus userId')
      .populate('userId', 'name');


    if (!massWeddingList || massWeddingList.length === 0) {
      return res.status(404).json({ success: false, message: "No weddings found." });
    }

    res.status(200).json(massWeddingList);
  } catch (error) {
    console.error("Error fetching weddings:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getWeddingById = async (req, res) => {
  try {
    const { massWeddingId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(massWeddingId)) {
      return res.status(400).json({ message: "Invalid wedding ID format." });
    }
    const massWedding = await MassWedding.findById(massWeddingId).populate('userId', 'name email');
    if (!massWedding) {
      return res.status(404).json({ message: "Wedding not found." });
    }
    res.status(200).json(massWedding);
  } catch (error) {
    console.error("Error fetching wedding by ID:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// Controlles
exports.confirmWedding = async (req, res) => {
  try {
    const { massWeddingId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(massWeddingId)) {
      return res.status(400).json({ message: "Invalid wedding ID format." });
    }

    const massWedding = await Wedding.findById(massWeddingId);

    if (!massWedding) {
      return res.status(404).json({ message: "Wedding not found." });
    }

    massWedding.weddingStatus = "Confirmed";
    massWedding.confirmedAt = new Date();

    await massWedding.save();

    res.status(200).json({ message: "Wedding confirmed.", massWedding });
  } catch (error) {
    console.error("Error confirming wedding:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.declineWedding = async (req, res) => {
  try {
    const { reason } = req.body;
    const userId = req.user._id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
    const cancellingUser = user.isAdmin ? "Admin" : user.name;
    const massWedding = await MassWedding.findByIdAndUpdate(
      req.params.massWeddingId,
      {
        weddingStatus: "Cancelled",
        cancellingReason: { user: cancellingUser, reason },
      },
      { new: true }
    );
    if (!massWedding) {
      return res.status(404).json({ message: "Wedding not found." });
    }
    res.json({ message: "Wedding cancelled successfully", wedding });
  } catch (err) {
    console.error("Error cancelling wedding:", err);
    res.status(500).json({ message: "Server error." });
  }
};

// comment
exports.addComment = async (req, res) => {
  try {
    const { massWeddingId } = req.params;
    const { selectedComment, additionalComment } = req.body;
    if (!selectedComment && !additionalComment) {
      return res.status(400).json({ message: "Comment cannot be empty." });
    }
    if (!mongoose.Types.ObjectId.isValid(massWeddingId)) {
      return res.status(400).json({ message: "Invalid wedding ID format." });
    }
    const massWedding = await Wedding.findById(massWeddingId);
    if (!massWedding) {
      return res.status(404).json({ message: "Wedding not found." });
    }
    const newComment = {
      selectedComment: selectedComment || "",
      additionalComment: additionalComment || "",
      createdAt: new Date(),
    };

    massWedding.comments.push(newComment);
    await massWedding.save();

    res.status(200).json({ message: "Comment added.", comment: newComment });
  } catch (error) {
    console.error("Error adding comment:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.updateAdditionalReq = async (req, res) => {
  try {
    const { massWeddingId } = req.params;
    // Expect req.body to contain the additionalReq object
    // Example: { additionalReq: { PreMarriageSeminar1: { date, time }, ... } }
    const { additionalReq } = req.body;
    const massWedding = await MassWedding.findById(massWeddingId);
    if (!massWedding) {
      return res.status(404).json({ message: "Wedding not found" });
    }
    massWedding.additionalReq = { ...additionalReq, createdAt: new Date() };
    await massWedding.save();
    res.json({ message: "Additional requirements updated successfully", massWedding });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// checklist for the wedding
exports.getWeddingChecklist = async (req, res) => {
  try {
    const { massWeddingId } = req.params;
    const massWedding = await MassWedding.findById(massWeddingId).populate('checklistId');
    if (!massWedding) {
      return res.status(404).json({ message: 'Wedding not found' });
    }
    res.json({ checklist: massWedding.checklistId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update (or create) the checklist for a wedding
exports.updateWeddingChecklist = async (req, res) => {
  try {
    const { massWeddingId } = req.params;
    const checklistData = req.body;

    console.log("Received weddingId:", massWeddingId);
    console.log("Checklist Data:", checklistData);

    const massWedding = await MassWedding.findById(massWeddingId);
    if (!massWedding) {
      return res.status(404).json({ message: 'Wedding not found' });
    }
    let updatedChecklist;
    if (!massWedding.checklistId) {
      console.log("No checklist found, creating a new one...");
      updatedChecklist = await WeddingChecklist.create(checklistData);
      massWedding.checklistId = updatedChecklist._id;
      await massWedding.save();
      return res.json({ message: 'Checklist created successfully', checklist: updatedChecklist });
    } else {
      console.log("Updating existing checklist with ID:", massWedding.checklistId);
      updatedChecklist = await WeddingChecklist.findByIdAndUpdate(
        massWedding.checklistId,
        checklistData,
        { new: true }
      );
      return res.json({ message: 'Checklist updated successfully', checklist: updatedChecklist });
    }
  } catch (err) {
    console.error("Error updating wedding checklist:", err);
    res.status(500).json({ message: 'Server error' });
  }
};

// For User
exports.getMySubmittedForms = async (req, res) => {
  try {
    const userId = req.user.id;
    console.log("Authenticated User ID:", userId);
    const forms = await MassWedding.find({ userId: userId });
    if (!forms.length) {
      return res.status(404).json({ message: "No forms found for this user." });
    }
    res.status(200).json({ forms });
  } catch (error) {
    console.error("Error fetching submitted wedding forms:", error);
    res.status(500).json({ message: "Failed to fetch submitted wedding forms." });
  }
};