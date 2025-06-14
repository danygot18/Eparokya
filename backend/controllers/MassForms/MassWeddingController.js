const { WeddingChecklist } = require("../../models/weddingChecklist");
const { massWedding } = require("../../models/MassForms/massWedding");
const AdminDate = require("../../models/adminDate");
const User = require("../../models/user");
const mongoose = require("mongoose");
const cloudinary = require("cloudinary").v2;
const adminDate = require("../../models/adminDate");

const uploadToCloudinary = async (file, folder) => {
  if (!file) throw new Error("File is required for upload.");
  const result = await cloudinary.uploader.upload(file.path, { folder });
  return { public_id: result.public_id, url: result.secure_url };
};

exports.submitWeddingForm = async (req, res) => {
  try {
    console.log("Received files:", req.files);
    console.log("Received body:", req.body);

    const user = await User.findById(req.user._id);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found." });
    }

    if (user.civilStatus === "Married") {
      return res.status(400).json({
        success: false,
        message: "Sorry, but a 'Married' user cannot submit an application.",
      });
    }

    const {
      weddingDateTime,
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
      brideMother,
    } = req.body;

    // Check required fields
    const requiredFields = [
      "weddingDateTime",
      "groomName",
      "groomAddress",
      "brideName",
      "brideAddress",
      "brideReligion",
      "brideOccupation",
      "brideBirthDate",
      "bridePhone",
      "groomReligion",
      "groomOccupation",
      "groomBirthDate",
      "groomPhone",
      "groomFather",
      "groomMother",
      "brideFather",
      "brideMother",
    ];

    for (const field of requiredFields) {
      if (!req.body[field]) {
        return res.status(400).json({
          success: false,
          message: `Missing required field: ${field}`,
        });
      }
    }

    // Check date availability (similar to baptism)
    const selectedDate = await AdminDate.findById(weddingDateTime.trim());
    if (!selectedDate || !selectedDate.isEnabled) {
      return res.status(400).json({
        success: false,
        message: "Selected wedding date is not available or has been disabled",
      });
    }

    if (!selectedDate.canAcceptParticipants()) {
      return res.status(400).json({
        success: false,
        message: "This wedding event is already full",
      });
    }

    // Handle file uploads
    const uploadToCloudinary = async (file, folder) => {
      if (!file) throw new Error("File is required for upload.");
      const result = await cloudinary.uploader.upload(file.path, { folder });
      return { public_id: result.public_id, url: result.secure_url };
    };

    const weddingDocs = {};
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

    try {
      console.log("Processing file uploads...");
      for (const field of requiredImageFields) {
        if (req.files[field] && req.files[field][0]) {
          weddingDocs[field] = await uploadToCloudinary(
            req.files[field][0],
            "eparokya/wedding/docs"
          );
        } else {
          return res.status(400).json({
            success: false,
            message: `Missing required document: ${field}`,
          });
        }
      }
    } catch (error) {
      console.error("File upload error:", error.message);
      return res.status(400).json({ success: false, message: error.message });
    }

    // Parse address and validate
    const groomAddressObject =
      typeof groomAddress === "string"
        ? JSON.parse(groomAddress)
        : groomAddress;
    const brideAddressObject =
      typeof brideAddress === "string"
        ? JSON.parse(brideAddress)
        : brideAddress;

    if (
      groomAddressObject.baranggay === "Others" &&
      !groomAddressObject.customBarangay
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide a custom barangay for the groom.",
      });
    }
    if (
      brideAddressObject.baranggay === "Others" &&
      !brideAddressObject.customBarangay
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide a custom barangay for the bride.",
      });
    }
    if (
      groomAddressObject.city === "Others" &&
      !groomAddressObject.customCity
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide a custom city for the groom.",
      });
    }
    if (
      brideAddressObject.city === "Others" &&
      !brideAddressObject.customCity
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide a custom city for the bride.",
      });
    }

    // Parse godparents
    const ninongArray = Ninong ? JSON.parse(Ninong) : [];
    const ninangArray = Ninang ? JSON.parse(Ninang) : [];

    console.log("Creating new wedding entry...");
    const newWedding = new massWedding({
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
      ...weddingDocs,
      userId: req.user._id,
      weddingStatus: "Pending",
    });

    console.log("Saving wedding entry...");
    await newWedding.save();
    await AdminDate.findByIdAndUpdate(weddingDateTime, {
      $inc: { submittedParticipants: 1 },
    });

    res.status(201).json({
      success: true,
      message: "Wedding registration created successfully",
      wedding: newWedding,
    });
  } catch (error) {
    console.error("Error creating wedding registration:", error);
    res.status(500).json({
      success: false,
      message: "Error creating wedding registration",
      error: error.message,
    });
  }
};

exports.getAllWeddings = async (req, res) => {
  try {
    const massWeddingList = await massWedding
      .find(
        {},
        "brideName groomName bridePhone groomPhone weddingStatus userId weddingDateTime"
      )
      .populate("userId", "name")
      .populate("weddingDateTime", "date time");

    if (!massWeddingList || massWeddingList.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "No weddings found." });
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

    const MassWedding = await massWedding
      .findById(massWeddingId)
      .populate("userId", "name email")
      .populate("weddingDateTime");

    if (!MassWedding) {
      return res.status(404).json({ message: "Wedding not found." });
    }

    res.status(200).json(MassWedding);
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
      return res.status(400).json({ message: "Invalid Mass Wedding ID format." });
    }

    const massWeddingDoc = await massWedding.findById(massWeddingId);

    if (!massWeddingDoc) {
      return res.status(404).json({ message: "Mass Wedding not found." });
    }

    // Prevent re-confirming
    if (massWeddingDoc.weddingStatus === "Confirmed") {
      return res.status(400).json({ message: "This wedding is already confirmed." });
    }

    const adminDateId = massWeddingDoc.weddingDateTime;

    if (!adminDateId) {
      return res.status(400).json({ message: "No adminDate linked to this wedding." });
    }

    const adminDateDoc = await adminDate.findById(adminDateId);

    if (!adminDateDoc) {
      return res.status(404).json({ message: "Admin date not found." });
    }

    // Optional: add a method to check if slot is still available
    if (
      typeof adminDateDoc.canAcceptParticipants === "function" &&
      !adminDateDoc.canAcceptParticipants()
    ) {
      return res.status(400).json({ message: "Maximum participants reached." });
    }

    // Update adminDate: increase confirmed participants
    adminDateDoc.confirmedParticipants += 1;
    await adminDateDoc.save();

    // Confirm wedding
    massWeddingDoc.weddingStatus = "Confirmed";
    massWeddingDoc.confirmedAt = new Date();
    await massWeddingDoc.save();

    res.status(200).json({
      message: "Mass Wedding confirmed and admin date updated.",
      massWedding: massWeddingDoc,
      adminDate: adminDateDoc,
    });
  } catch (error) {
    console.error("Error confirming Mass Wedding:", error);
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

    const updatedWedding = await massWedding.findByIdAndUpdate(
      req.params.massWeddingId,
      {
        weddingStatus: "Cancelled",
        cancellingReason: { user: cancellingUser, reason },
      },
      { new: true }
    );

    if (!updatedWedding) {
      return res.status(404).json({ message: "Mass Wedding not found." });
    }

    res.json({ message: "Wedding cancelled successfully", wedding: updatedWedding });
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

    const massWeddingDoc = await massWedding.findById(massWeddingId);
    if (!massWeddingDoc) {
      return res.status(404).json({ message: "Wedding not found." });
    }

    const newComment = {
      selectedComment: selectedComment || "",
      additionalComment: additionalComment || "",
      createdAt: new Date(),
    };

    massWeddingDoc.comments.push(newComment);
    await massWeddingDoc.save();

    res.status(200).json({ message: "Comment added.", comment: newComment });
  } catch (error) {
    console.error("Error adding comment:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};


exports.updateAdditionalReq = async (req, res) => {
  try {
    const { massWeddingId } = req.params;
    const { additionalReq } = req.body;
    if (!mongoose.Types.ObjectId.isValid(massWeddingId)) {
      return res.status(400).json({ message: "Invalid Mass Wedding ID format" });
    }
    const weddingDoc = await massWedding.findById(massWeddingId);
    if (!weddingDoc) {
      return res.status(404).json({ message: "Mass Wedding not found" });
    }
    weddingDoc.additionalReq = { ...additionalReq, createdAt: new Date() };
    await weddingDoc.save();

    res.json({
      message: "Additional requirements updated successfully",
      massWedding: weddingDoc,
    });
  } catch (err) {
    console.error("Error updating additional requirements:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// checklist for the wedding
exports.getWeddingChecklist = async (req, res) => {
  try {
    const { massWeddingId } = req.params;
    const wedding = await massWedding
      .findById(massWeddingId)
      .populate("checklistId");

    if (!wedding) {
      return res.status(404).json({ message: "Wedding not found" });
    }

    res.json({ checklist: wedding.checklistId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Update (or create) the checklist for a wedding
exports.updateWeddingChecklist = async (req, res) => {
  try {
    const { massWeddingId } = req.params;
    const checklistData = req.body;

    console.log("Received weddingId:", massWeddingId);
    console.log("Checklist Data:", checklistData);

    if (!mongoose.Types.ObjectId.isValid(massWeddingId)) {
      return res.status(400).json({ message: "Invalid Wedding ID" });
    }

    const wedding = await massWedding.findById(massWeddingId);
    if (!wedding) {
      return res.status(404).json({ message: "Wedding not found" });
    }

    let updatedChecklist;
    if (!wedding.checklistId) {
      console.log("No checklist found, creating a new one...");
      updatedChecklist = await WeddingChecklist.create(checklistData);
      wedding.checklistId = updatedChecklist._id;
      await wedding.save();
      return res.json({
        message: "Checklist created successfully",
        checklist: updatedChecklist,
      });
    } else {
      console.log("Updating existing checklist with ID:", wedding.checklistId);
      updatedChecklist = await WeddingChecklist.findByIdAndUpdate(
        wedding.checklistId,
        checklistData,
        { new: true }
      );
      return res.json({
        message: "Checklist updated successfully",
        checklist: updatedChecklist,
      });
    }
  } catch (err) {
    console.error("Error updating wedding checklist:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// For User
exports.getMySubmittedForms = async (req, res) => {
  try {
    const userId = req.user.id;
    console.log("Authenticated User ID:", userId);

    const forms = await massWedding
      .find({ userId: userId })
      .populate("weddingDateTime"); 

    if (!forms.length) {
      return res.status(404).json({ message: "No forms found for this user." });
    }

    res.status(200).json({ forms });
  } catch (error) {
    console.error("Error fetching submitted wedding forms:", error);
    res
      .status(500)
      .json({ message: "Failed to fetch submitted wedding forms." });
  }
};


exports.getMassWeddingFormById = async (req, res) => {
  try {
    const { massWeddingId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(massWeddingId)) {
      return res.status(400).json({ message: "Invalid wedding ID format." });
    }

    const wedding = await massWedding
      .findById(massWeddingId)
      .populate("userId", "name email")
      .populate("weddingDateTime");

    if (!wedding) {
      return res.status(404).json({ message: "Wedding not found." });
    }

    res.status(200).json(wedding);
  } catch (error) {
    console.error("Error fetching mass wedding by ID:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};