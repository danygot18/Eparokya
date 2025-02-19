const { WeddingChecklist } = require('../../models/weddingChecklist');
const { Wedding } = require('../../models/weddings');
const User = require('../../models/user');
const mongoose = require('mongoose');
const cloudinary = require('cloudinary').v2;

const uploadToCloudinary = async (file, folder) => {
  if (!file) throw new Error("File is required for upload.");
  const result = await cloudinary.uploader.upload(file.path, { folder });
  return { public_id: result.public_id, url: result.secure_url };
};

// exports.submitWeddingForm = async (req, res) => {
//   try {
//     const {
//       dateOfApplication,
//       weddingDate,
//       weddingTime,
//       groomName,
//       groomAddress,
//       brideName,
//       brideAddress,
//       Ninong,
//       Ninang,
//       brideReligion,
//       brideOccupation,
//       brideBirthDate,
//       bridePhone,
//       groomReligion,
//       groomOccupation,
//       groomBirthDate,
//       groomPhone,
//     } = req.body;
//     const images = {};
//     const requiredImageFields = [
//       "GroomNewBaptismalCertificate",
//       "GroomNewConfirmationCertificate",
//       "BrideNewBaptismalCertificate",
//       "GroomMarriageLicense",
//       "GroomMarriageBans",
//       "GroomOrigCeNoMar",
//       "GroomOrigPSA",
//       "BrideNewBaptismalCertificate",
//       "BrideNewConfirmationCertificate",
//       "BrideMarriageLicense",
//       "BrideMarriageBans",
//       "BrideOrigCeNoMar",
//       "BrideOrigPSA",
//       "PermitFromtheParishOftheBride",
//     ];
//     console.log('Received files:', req.files);
//     for (const field of requiredImageFields) {
//       if (req.files[field]) {
//         const uploadedImage = await uploadToCloudinary(req.files[field][0], "wedding/docs");
//         images[field] = {
//           public_id: uploadedImage.public_id, // Save public_id
//           url: uploadedImage.url, // Save URL
//         };
//       } else {
//         return res.status(400).json({ message: `Missing required image: ${field}` });
//       }
//     }
//     const groomAddressObject = groomAddress ? JSON.parse(groomAddress) : {};
//     const brideAddressObject = brideAddress ? JSON.parse(brideAddress) : {};
//     const ninongArray = Ninong ? JSON.parse(Ninong) : [];
//     const ninangArray = Ninang ? JSON.parse(Ninang) : [];

//     const userId = req.user._id;

//     const newWeddingForm = new Wedding({
//       dateOfApplication,
//       weddingDate,
//       weddingTime,
//       groomName,
//       groomAddress: groomAddressObject,
//       brideName,
//       brideAddress: brideAddressObject,
//       Ninong: ninongArray,
//       Ninang: ninangArray,
//       brideReligion,
//       brideOccupation,
//       brideBirthDate,
//       bridePhone,
//       groomReligion,
//       groomOccupation,
//       groomBirthDate,
//       groomPhone,
//       ...images,
//       userId,
//     });

//     await newWeddingForm.save();

//     res.status(201).json({
//       message: "Wedding form submitted successfully!",
//       weddingForm: newWeddingForm,
//     });
//   } catch (error) {
//     console.error("Error submitting wedding form:", error);
//     res.status(500).json({ message: "An error occurred during submission.", error: error.message });
//   }
// };

// exports.submitWeddingForm = async (req, res) => {
//   try {
//     const {
//       dateOfApplication,
//       weddingDate,
//       weddingTime,
//       groomName,
//       groomAddress,
//       brideName,
//       brideAddress,
//       Ninong,
//       Ninang,
//       brideReligion,
//       brideOccupation,
//       brideBirthDate,
//       bridePhone,
//       groomReligion,
//       groomOccupation,
//       groomBirthDate,
//       groomPhone,
//       groomFather, 
//       groomMother, 
//       brideFather, 
//       brideMother  
//     } = req.body;

//     // Process image uploads
//     const images = {};
//     const requiredImageFields = [
//       "GroomNewBaptismalCertificate",
//       "GroomNewConfirmationCertificate",
//       "BrideNewBaptismalCertificate",
//       "GroomMarriageLicense",
//       "GroomMarriageBans",
//       "GroomOrigCeNoMar",
//       "GroomOrigPSA",
//       "BrideNewBaptismalCertificate",
//       "BrideNewConfirmationCertificate",
//       "BrideMarriageLicense",
//       "BrideMarriageBans",
//       "BrideOrigCeNoMar",
//       "BrideOrigPSA",
//       "PermitFromtheParishOftheBride",
//     ];

//     console.log("Received files:", req.files);
//     for (const field of requiredImageFields) {
//       if (req.files[field]) {
//         const uploadedImage = await uploadToCloudinary(req.files[field][0], "wedding/docs");
//         images[field] = {
//           public_id: uploadedImage.public_id,
//           url: uploadedImage.url,
//         };
//       } else {
//         return res.status(400).json({ message: `Missing required image: ${field}` });
//       }
//     }

//     // Parse JSON fields
//     const groomAddressObject = groomAddress ? JSON.parse(groomAddress) : {};
//     const brideAddressObject = brideAddress ? JSON.parse(brideAddress) : {};
//     const ninongArray = Ninong ? JSON.parse(Ninong) : [];
//     const ninangArray = Ninang ? JSON.parse(Ninang) : [];

//     // Get authenticated user ID
//     const userId = req.user._id;

//     // Create new wedding form
//     const newWeddingForm = new Wedding({
//       dateOfApplication,
//       weddingDate,
//       weddingTime,
//       groomName,
//       groomAddress: groomAddressObject,
//       brideName,
//       brideAddress: brideAddressObject,
//       Ninong: ninongArray,
//       Ninang: ninangArray,
//       brideReligion,
//       brideOccupation,
//       brideBirthDate,
//       bridePhone,
//       groomReligion,
//       groomOccupation,
//       groomBirthDate,
//       groomPhone,
//       groomFather, // Convert camelCase to PascalCase
//       groomMother, // Convert camelCase to PascalCase
//       brideFather, // Convert camelCase to PascalCase
//       brideMother, // Convert camelCase to PascalCase
//       ...images,
//       userId,
//     });

//     await newWeddingForm.save();

//     res.status(201).json({
//       message: "Wedding form submitted successfully!",
//       weddingForm: newWeddingForm,
//     });
//   } catch (error) {
//     console.error("Error submitting wedding form:", error);
//     res.status(500).json({ message: "An error occurred during submission.", error: error.message });
//   }
// };


// getting the wedding

exports.submitWeddingForm = async (req, res) => {
  try {
    const {
      dateOfApplication,
      weddingDate,
      weddingTime,
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
      'dateOfApplication', 'weddingDate', 'weddingTime', 'groomName', 'groomAddress',
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

    console.log("Received files:", req.files);
    for (const field of requiredImageFields) {
      if (req.files[field]) {
        const uploadedImage = await uploadToCloudinary(req.files[field][0], "wedding/docs");
        images[field] = {
          public_id: uploadedImage.public_id,
          url: uploadedImage.url,
        };
      } else {
        return res.status(400).json({ message: `Missing required image: ${field}` });
      }
    }

    // Parse JSON fields
    // const groomAddressObject = groomAddress ? JSON.parse(groomAddress) : {};
    // const brideAddressObject = brideAddress ? JSON.parse(brideAddress) : {};

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
      dateOfApplication,
      weddingDate,
      weddingTime,
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

    console.log("Received body:", req.body);

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
    const weddingList = await Wedding.find({}, 'brideName groomName bridePhone groomPhone weddingDate weddingTime weddingStatus userId')
      .populate('userId', 'name');


    if (!weddingList || weddingList.length === 0) {
      return res.status(404).json({ success: false, message: "No weddings found." });
    }

    res.status(200).json(weddingList);
  } catch (error) {
    console.error("Error fetching weddings:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getWeddingById = async (req, res) => {
  try {
    const { weddingId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(weddingId)) {
      return res.status(400).json({ message: "Invalid wedding ID format." });
    }

    const wedding = await Wedding.findById(weddingId).populate('userId', 'name email');

    if (!wedding) {
      return res.status(404).json({ message: "Wedding not found." });
    }

    res.status(200).json(wedding);
  } catch (error) {
    console.error("Error fetching wedding by ID:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getConfirmedWeddings = async (req, res) => {
  try {
    const confirmedWeddings = await Wedding.find({ weddingStatus: 'Confirmed' });
    res.status(200).json(confirmedWeddings);
  } catch (error) {
    console.error("Error fetching confirmed weddings:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// controls for the wedding
exports.confirmWedding = async (req, res) => {
  try {
    const { weddingId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(weddingId)) {
      return res.status(400).json({ message: "Invalid wedding ID format." });
    }

    const wedding = await Wedding.findById(weddingId);

    if (!wedding) {
      return res.status(404).json({ message: "Wedding not found." });
    }

    wedding.weddingStatus = "Confirmed";
    wedding.confirmedAt = new Date();

    await wedding.save();

    res.status(200).json({ message: "Wedding confirmed.", wedding });
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

    const wedding = await Wedding.findByIdAndUpdate(
      req.params.weddingId,
      {
        weddingStatus: "Cancelled",
        cancellingReason: { user: cancellingUser, reason },
      },
      { new: true }
    );
    if (!wedding) {
      return res.status(404).json({ message: "Wedding not found." });
    }

    res.json({ message: "Wedding cancelled successfully", wedding });
  } catch (err) {
    console.error("Error cancelling wedding:", err);
    res.status(500).json({ message: "Server error." });
  }
};

exports.updateWeddingDate = async (req, res) => {
  try {
    const { weddingId } = req.params;
    const { newDate, reason } = req.body;

    const wedding = await Wedding.findById(weddingId);
    if (!wedding) {
      return res.status(404).json({ message: "Wedding not found" });
    }

    wedding.weddingDate = newDate;
    wedding.adminRescheduled = { date: newDate, reason: reason };

    await wedding.save();

    return res.status(200).json({ message: "Wedding date updated successfully", wedding });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// Comments for the admin
exports.addComment = async (req, res) => {
  try {
    const { weddingId } = req.params;
    const { selectedComment, additionalComment } = req.body;

    if (!selectedComment && !additionalComment) {
      return res.status(400).json({ message: "Comment cannot be empty." });
    }

    if (!mongoose.Types.ObjectId.isValid(weddingId)) {
      return res.status(400).json({ message: "Invalid wedding ID format." });
    }

    const wedding = await Wedding.findById(weddingId);
    if (!wedding) {
      return res.status(404).json({ message: "Wedding not found." });
    }

    // Ensure correct field names based on your schema
    const newComment = {
      selectedComment: selectedComment || "",
      additionalComment: additionalComment || "",
      createdAt: new Date(),
    };

    wedding.comments.push(newComment);
    await wedding.save();

    res.status(200).json({ message: "Comment added.", comment: newComment });
  } catch (error) {
    console.error("Error adding comment:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.updateAdditionalReq = async (req, res) => {
  try {
    const { weddingId } = req.params;
    // Expect req.body to contain the additionalReq object
    // Example: { additionalReq: { PreMarriageSeminar1: { date, time }, ... } }
    const { additionalReq } = req.body;

    const wedding = await Wedding.findById(weddingId);
    if (!wedding) {
      return res.status(404).json({ message: "Wedding not found" });
    }

    // Update the entire additionalReq object (plus update createdAt if needed)
    wedding.additionalReq = { ...additionalReq, createdAt: new Date() };

    await wedding.save();

    res.json({ message: "Additional requirements updated successfully", wedding });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// checklist for the wedding
exports.getWeddingChecklist = async (req, res) => {
  try {
    const { weddingId } = req.params;
    const wedding = await Wedding.findById(weddingId).populate('checklistId');
    if (!wedding) {
      return res.status(404).json({ message: 'Wedding not found' });
    }
    res.json({ checklist: wedding.checklistId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update (or create) the checklist for a wedding
exports.updateWeddingChecklist = async (req, res) => {
  try {
    const { weddingId } = req.params;
    const checklistData = req.body;

    console.log("Received weddingId:", weddingId);
    console.log("Checklist Data:", checklistData);

    const wedding = await Wedding.findById(weddingId);
    if (!wedding) {
      return res.status(404).json({ message: 'Wedding not found' });
    }

    let updatedChecklist;
    if (!wedding.checklistId) {
      console.log("No checklist found, creating a new one...");
      updatedChecklist = await WeddingChecklist.create(checklistData);
      wedding.checklistId = updatedChecklist._id;
      await wedding.save();
      return res.json({ message: 'Checklist created successfully', checklist: updatedChecklist });
    } else {
      console.log("Updating existing checklist with ID:", wedding.checklistId);
      updatedChecklist = await WeddingChecklist.findByIdAndUpdate(
        wedding.checklistId,
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

//Dates
exports.getAvailableDates = async (req, res) => {
  try {
    const bookedDates = await Wedding.find({ isBooked: true }).select('date');
    res.status(200).json(bookedDates);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.bookDate = async (req, res) => {
  const { date, userId } = req.body;
  try {
    const weddingDate = await Wedding.findOneAndUpdate(
      { date },
      { isBooked: true, userId: mongoose.Types.ObjectId(userId) },
      { new: true, upsert: true } // Creates the document if it doesn't exist
    );
    res.status(200).json({ message: 'Date booked successfully', weddingDate });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

//AdminDates
exports.addAvailableDate = async (req, res) => {
  const { weddingDate } = req.body;
  try {
    const newDate = new Wedding({ weddingDate });
    await newDate.save();
    res.status(201).json({ message: 'Date added successfully', weddingDate: newDate });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.removeAvailableDate = async (req, res) => {
  const { id } = req.params;
  try {
    await Wedding.findByIdAndDelete(id);
    res.json({ message: 'Date removed successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// For user:
exports.getMySubmittedForms = async (req, res) => {
  try {
    const userId = req.user.id;
    console.log("Authenticated User ID:", userId);

    const forms = await Wedding.find({ userId: userId });

    if (!forms.length) {
      return res.status(404).json({ message: "No forms found for this user." });
    }

    res.status(200).json({ forms });
  } catch (error) {
    console.error("Error fetching submitted wedding forms:", error);
    res.status(500).json({ message: "Failed to fetch submitted wedding forms." });
  }
};

exports.getFuneralFormById = async (req, res) => {
  try {
    const { formId } = req.params;

    const weddingForm = await Wedding.findById(formId)
      .populate('userId', 'name email')
      .lean();

    if (!weddingForm) {
      return res.status(404).json({ message: "Wedding form not found." });
    }

    res.status(200).json(weddingForm);
  } catch (error) {
    console.error("Error fetching wedding form by ID:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


//For Reports
exports.getWeddingsPerMonth = async (req, res) => {
  const data = await Wedding.aggregate([
    {
      $group: {
        _id: { $month: "$weddingDate" },
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
exports.getWeddingStatusCounts = async (req, res) => {
  try {
    const counts = await Wedding.aggregate([
      { $group: { _id: "$weddingStatus", count: { $sum: 1 } } }
    ]);
    res.status(200).json(counts);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch wedding status counts", error });
  }
};







