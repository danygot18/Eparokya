const MassBaptism = require("../../models/MassForms/massBinyag");
const AdminDate = require("../../models/adminDate");
const cloudinary = require("cloudinary").v2;
const mongoose = require("mongoose");
const Priest = require("../../models/Priest/priest");
const { BaptismChecklist } = require("../../models/baptismChecklist");

exports.getActiveBaptismDates = async (req, res) => {
  try {
    const activeDates = await AdminDate.find({
      category: "Baptism",
      isEnabled: true,
    });
    res.status(200).json(activeDates);
  } catch (error) {
    res.status(500).json({ message: "Error fetching baptism dates", error });
  }
};

exports.createBaptism = async (req, res) => {
  try {
    console.log("Received files:", req.files);
    console.log("Received body:", req.body);

    const {
      baptismDateTime,
      child,
      parents,
      ninong,
      ninang,
      NinongGodparents,
      NinangGodparents,
    } = req.body;
    const userId = req.user._id;

    if (!baptismDateTime) {
      return res.status(400).json({ message: "Baptism date is required" });
    }

    const selectedDate = await AdminDate.findById(baptismDateTime.trim());
    if (!selectedDate || !selectedDate.isEnabled) {
      return res.status(400).json({
        message: "Selected baptism date is not available or has been disabled",
      });
    }

    if (!selectedDate.canAcceptParticipants()) {
      return res
        .status(400)
        .json({ message: "This baptism event is already full" });
    }

    const Docs = { additionalDocs: {} };
    let additionalDocs = {};

    const uploadToCloudinary = async (file, folder) => {
      if (!file) throw new Error("File is required for upload.");
      const result = await cloudinary.uploader.upload(file.path, { folder });
      return { public_id: result.public_id, url: result.secure_url };
    };

    try {
      console.log("Checking file uploads...");

      if (req.files?.birthCertificate && req.files.birthCertificate[0]) {
        Docs.birthCertificate = await uploadToCloudinary(
          req.files.birthCertificate[0],
          "eparokya/baptism/docs"
        );
      } else {
        return res
          .status(400)
          .json({ success: false, message: "Birth Certificate is required." });
      }

      if (req.files?.marriageCertificate && req.files.marriageCertificate[0]) {
        Docs.marriageCertificate = await uploadToCloudinary(
          req.files.marriageCertificate[0],
          "eparokya/baptism/docs"
        );
      } else {
        return res.status(400).json({
          success: false,
          message: "Marriage Certificate is required.",
        });
      }

      if (req.files?.baptismPermit) {
        const uploadedBaptismPermit = await Promise.all(
          req.files.baptismPermit.map((file) =>
            uploadToCloudinary(file, "eparokya/baptism/additionalDocs")
          )
        );
        additionalDocs.baptismPermit = uploadedBaptismPermit[0];
      }

      if (req.files?.certificateOfNoRecordBaptism) {
        const uploadedCertificate = await Promise.all(
          req.files.certificateOfNoRecordBaptism.map((file) =>
            uploadToCloudinary(file, "eparokya/baptism/additionalDocs")
          )
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
    const newBaptism = new MassBaptism({
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
      binyagStatus: "Pending",
    });

    console.log("Saving baptism entry...");
    await newBaptism.save();
    await AdminDate.findByIdAndUpdate(baptismDateTime, {
      $inc: { submittedParticipants: 1 },
    });

    res.status(201).json({
      success: true,
      message: "Baptism registration created successfully",
      baptism: newBaptism,
    });
  } catch (error) {
    console.error("Error creating baptism:", error);
    res.status(500).json({
      success: false,
      message: "Error creating baptism",
      error: error.message,
    });
  }
};
// For ADMIN
exports.getAllBaptisms = async (req, res) => {
  try {
    const baptisms = await MassBaptism.find()
      .populate("userId")
      .populate("baptismDateTime")
      .populate('adminNotes.priest');

    res.status(200).json({ massBaptismForms: baptisms });
  } catch (error) {
    res.status(500).json({ message: "Error fetching baptisms", error });
  }
};

exports.getBaptismById = async (req, res) => {
  try {
    const baptism = await MassBaptism.findById(req.params.massBaptismId)
      .populate("userId")
      .populate("baptismDateTime")
      .populate('adminNotes.priest');

    if (!baptism) {
      return res.status(404).json({ message: "Baptism not found" });
    }
    res.status(200).json(baptism);
  } catch (error) {
    res.status(500).json({ message: "Error fetching baptism", error });
  }
};

// for user
exports.getMySubmittedForms = async (req, res) => {
  try {
    const userId = req.user.id;

    const forms = await MassBaptism.find({ userId: userId })
      .populate("baptismDateTime")
      .populate('adminNotes.priest');

    if (!forms.length) {
      return res.status(404).json({ message: "No forms found for this user." });
    }

    res.status(200).json({ forms });
  } catch (error) {
    console.error("Error fetching submitted baptism forms:", error);
    res
      .status(500)
      .json({ message: "Failed to fetch submitted baptism forms." });
  }
};

exports.getMassBaptismFormById = async (req, res) => {
  try {
    const { massBaptismId } = req.params;
    console.log("Looking for massBaptismId:", massBaptismId);

    const massBaptismForm = await MassBaptism.findById(massBaptismId)
      .populate('adminNotes.priest')
      .populate("userId", "name email")
      .populate("baptismDateTime")
      .lean();

    if (!massBaptismForm) {
      console.warn("Form not found for ID:", massBaptismId);
      return res.status(404).json({ message: "Mass baptism form not found." });
    }

    res.status(200).json(massBaptismForm);
  } catch (error) {
    console.error("Error fetching mass baptism form by ID:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.confirmBaptism = async (req, res) => {
  try {
    const { massBaptismId } = req.params;
    const baptism = await MassBaptism.findById(massBaptismId);

    if (!baptism) {
      return res.status(404).json({ message: "Baptism not found" });
    }

    const event = await AdminDate.findById(baptism.baptismDateTime);
    if (!event || !event.canAcceptParticipants()) {
      return res
        .status(400)
        .json({ message: "Baptism event is full or unavailable" });
    }

    baptism.binyagStatus = "Confirmed";
    baptism.confirmedAt = new Date();
    await baptism.save();

    await AdminDate.findByIdAndUpdate(baptism.baptismDateTime, {
      $inc: { confirmedParticipants: 1 },
    });

    res.status(200).json({ message: "Baptism confirmed", baptism });
  } catch (error) {
    res.status(500).json({ message: "Error confirming baptism", error });
  }
};

exports.cancelBaptism = async (req, res) => {
  try {
    const { id } = req.params;
    const { user, reason } = req.body;

    const baptism = await MassBaptism.findById(id);
    if (!baptism) {
      return res.status(404).json({ message: "Baptism not found" });
    }

    baptism.binyagStatus = "Cancelled";
    baptism.cancellingReason = { user, reason };
    await baptism.save();

    await AdminDate.findByIdAndUpdate(baptism.baptismDateTime, {
      $inc: { submittedParticipants: -1 },
    });

    res
      .status(200)
      .json({ message: "Baptism cancelled successfully", baptism });
  } catch (error) {
    res.status(500).json({ message: "Error cancelling baptism", error });
  }
};

// add comment
exports.addMassBaptismComment = async (req, res) => {
  try {
    const { massBaptismId } = req.params;
    const { selectedComment, additionalComment } = req.body;

    if (!selectedComment && !additionalComment) {
      return res.status(400).json({ message: "Comment cannot be empty." });
    }

    if (!mongoose.Types.ObjectId.isValid(massBaptismId)) {
      return res.status(400).json({ message: "Invalid baptism ID format." });
    }

    const baptism = await MassBaptism.findById(massBaptismId);
    if (!baptism) {
      return res.status(404).json({ message: "Mass Baptism not found." });
    }

    const newComment = {
      selectedComment: selectedComment || "",
      additionalComment: additionalComment || "",
      createdAt: new Date(),
    };

    baptism.comments = baptism.comments || [];
    baptism.comments.push(newComment);
    await baptism.save();

    res.status(200).json({ message: "Comment added.", comment: newComment });
  } catch (error) {
    console.error("Error adding comment:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// mass baptism checklist
exports.getMassBaptismChecklist = async (req, res) => {
  try {
    const { massBaptismId } = req.params;

    const massBaptism = await MassBaptism.findById(massBaptismId).populate(
      "checklistId"
    );

    if (!massBaptism) {
      return res.status(404).json({ message: "Mass Baptism not found" });
    }

    res.json({ checklist: massBaptism.checklistId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// update mass baptism checklist
exports.updateMassBaptismChecklist = async (req, res) => {
  try {
    const { massBaptismId } = req.params;
    const checklistData = req.body;

    console.log("Received massBaptismId:", massBaptismId);
    console.log("Checklist Data:", checklistData);

    const massBaptism = await MassBaptism.findById(massBaptismId);
    if (!massBaptism) {
      return res.status(404).json({ message: "Mass Baptism not found" });
    }

    let updatedChecklist;

    // ✅ Create new checklist if none exists
    if (!massBaptism.checklistId) {
      console.log("No checklist found, creating a new one...");
      updatedChecklist = await BaptismChecklist.create(checklistData); // 👈 FIXED HERE

      massBaptism.checklistId = updatedChecklist._id;
      await massBaptism.save();

      return res.json({
        message: "Checklist created successfully",
        checklist: updatedChecklist,
      });
    } else {
      // ✅ Update existing checklist
      console.log(
        "Updating existing checklist with ID:",
        massBaptism.checklistId
      );
      updatedChecklist = await BaptismChecklist.findByIdAndUpdate(
        massBaptism.checklistId,
        checklistData,
        { new: true }
      );

      return res.json({
        message: "Checklist updated successfully",
        checklist: updatedChecklist,
      });
    }
  } catch (err) {
    console.error("Error updating mass baptism checklist:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Additional Notes
exports.addMassBaptismAdminNotes = async (req, res) => {
  try {
    const { massBaptismId } = req.params;
    const { priest, recordedBy, bookNumber, pageNumber, lineNumber } = req.body;

    if (!priest && !recordedBy && !bookNumber && !pageNumber && !lineNumber) {
      return res.status(400).json({ message: "Admin notes cannot be empty." });
    }

    if (!mongoose.Types.ObjectId.isValid(massBaptismId)) {
      return res
        .status(400)
        .json({ message: "Invalid mass baptism ID format." });
    }

    if (priest && !mongoose.Types.ObjectId.isValid(priest)) {
      return res.status(400).json({ message: "Invalid priest ID format." });
    }

    const massBaptism = await MassBaptism.findById(massBaptismId);
    if (!massBaptism) {
      return res.status(404).json({ message: "Mass Baptism not found." });
    }

    const newAdminNotes = {
      priest: priest || null,
      recordedBy: recordedBy || "",
      bookNumber: bookNumber || "",
      pageNumber: pageNumber || "",
      lineNumber: lineNumber || "",
      createdAt: new Date(),
    };

    massBaptism.adminNotes = massBaptism.adminNotes || [];
    massBaptism.adminNotes.push(newAdminNotes);
    await massBaptism.save();

    // let populatedPriest = null;
    // if (priest) {
    //   populatedPriest = await Priest.findById(priest).select(
    //     "title fullName"
    //   );
    // }

    // const latestNote =
    //   massBaptism.adminNotes[massBaptism.adminNotes.length - 1];

    // const populatedNote = await MassBaptism.populate(latestNote, {
    //   path: "priest",
    //   select: "title fullName nickName",
    // });

    res
      .status(200)
      .json({ message: "Admin notes added.", adminNotes: newAdminNotes });
  } catch (error) {
    console.error("Error adding admin notes:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};
