const { BaptismChecklist } = require('../../models/baptismChecklist');
const Baptism = require("../../models/Binyag");
const mongoose = require("mongoose");
const cloudinary = require('cloudinary').v2;
const User = require('../../models/user');
const sendEmail = require('../../utils/sendEmail');

// Submit Baptism Form


exports.submitBaptismForm = async (req, res) => {
  try {
    console.log("Incoming body:", req.body);
    console.log("Incoming files:", req.files);

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const {
      baptismDate,
      baptismTime,
      phone,
      child,
      parents,
      ninong,
      ninang,
      NinongGodparents,
      NinangGodparents,
    } = req.body;

    // Validate required fields
    const requiredFields = [
      'baptismDate', 'baptismTime', 'phone', 'child', 'parents'
    ];

    for (const field of requiredFields) {
      if (!req.body[field]) {
        return res.status(400).json({ message: `Missing required field: ${field}` });
      }
    }

    const Docs = {};
    const additionalDocs = {};
    const requiredDocumentFields = [
      "birthCertificate",
      "marriageCertificate"
    ];

    // Upload all required documents to Cloudinary
    for (const field of requiredDocumentFields) {
      if (req.files?.[field]) {
        const file = req.files[field][0];
        const result = await cloudinary.uploader.upload(file.path, {
          folder: "eparokya/baptism/docs",
          resource_type: file.mimetype.startsWith('image') ? 'image' : 'raw'
        });
        Docs[field] = {
          public_id: result.public_id,
          url: result.secure_url
        };
      } else {
        return res.status(400).json({ message: `Missing required document: ${field}` });
      }
    }

    // Handle optional documents
    const optionalDocumentFields = [
      "baptismPermit",
      "certificateOfNoRecordBaptism"
    ];

    for (const field of optionalDocumentFields) {
      if (req.files?.[field]) {
        const file = req.files[field][0];
        const result = await cloudinary.uploader.upload(file.path, {
          folder: "eparokya/baptism/additionalDocs",
          resource_type: file.mimetype.startsWith('image') ? 'image' : 'raw'
        });
        additionalDocs[field] = {
          public_id: result.public_id,
          url: result.secure_url
        };
      }
    }

    // Parse JSON fields
    const childObject = typeof child === "string" ? JSON.parse(child) : child;
    const parentsObject = typeof parents === "string" ? JSON.parse(parents) : parents;
    const ninongArray = ninong ? JSON.parse(ninong) : [];
    const ninangArray = ninang ? JSON.parse(ninang) : [];
    const NinongGodparentsArray = NinongGodparents ? JSON.parse(NinongGodparents) : [];
    const NinangGodparentsArray = NinangGodparents ? JSON.parse(NinangGodparents) : [];

    // Validate child information


    // Validate parents information


    const newBaptismForm = new Baptism({
      baptismDate,
      baptismTime,
      phone,
      child: childObject,
      parents: parentsObject,
      ninong: ninongArray,
      ninang: ninangArray,
      NinongGodparents: NinongGodparentsArray,
      NinangGodparents: NinangGodparentsArray,
      Docs,
      additionalDocs: Object.keys(additionalDocs).length > 0 ? additionalDocs : null,
      userId: req.user._id,
    });

    await newBaptismForm.save();


    const userEmail = user.email;
    const htmlMessage = `
  <div style="font-family: Arial, sans-serif; padding: 24px; background-color: #f9f9f9; color: #333;">
    <!-- Greeting -->
    <p style="font-size: 16px;">Good Day!</p>

    <!-- Body -->
    <p style="font-size: 16px;">
      Thank you for submitting your baptism application to <strong>E:Parokya</strong>.<br>
      We have received your request and our team will review it shortly. You will be notified once your baptism schedule is confirmed.
    </p>

    <!-- Baptism Details Section -->
    <h3 style="margin-top: 20px;">Baptism Details</h3>
    <ul style="list-style: none; padding: 0;">
      <li><strong>Date:</strong> ${baptismDate}</li>
      <li><strong>Time:</strong> ${baptismTime}</li>
      <li><strong>Phone:</strong> ${phone}</li>
      <li><strong>Child:</strong> ${typeof child === "string" ? JSON.parse(child).name : child.name}</li>
      <li><strong>Parents:</strong> ${typeof parents === "string" ? JSON.parse(parents).father + " & " + JSON.parse(parents).mother : parents.father + " & " + parents.mother}</li>
    </ul>

    <!-- Closing -->
    <p style="margin-top: 20px; font-size: 16px;">
      Thank you for reaching out. We are here to support you.
    </p>
    
    <!-- Footer -->
    <hr style="margin: 30px 0; border: none; border-top: 1px solid #ccc;">
    <footer style="font-size: 14px; color: #777;">
      <p><strong>E:Parokya</strong><br>
      Saint Joseph Parish – Taguig<br>
      This is an automated email. Please do not reply.</p>
    </footer>
  </div>
`;

    await sendEmail({
      email: userEmail,
      subject: "Your Baptism Application Has Been Submitted!",
      message: htmlMessage,
    });

    res.status(201).json({
      message: "Baptism form submitted successfully!",
      baptismForm: newBaptismForm,
    });
  } catch (error) {
    console.error("Error submitting baptism form:", error);
    res.status(500).json({
      message: "An error occurred during submission.",
      error: error.message
    });
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

// Baptism Controls
exports.confirmBaptism = async (req, res) => {
  const baptismId = req.params.baptismId;

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

exports.declineBaptism = async (req, res) => {
  try {
    const baptism = await Baptism.findByIdAndUpdate(
      req.params.baptismId,
      { binyagStatus: 'Cancelled' },
      { new: true }
    );
    if (!baptism) return res.status(404).send('Baptism not found.');
    res.send(baptism);
  } catch (err) {
    res.status(500).send('Server error.');
  }
};

// reschedule
exports.updateBaptismDate = async (req, res) => {
  try {
    const { baptismId } = req.params;
    const { newDate, reason } = req.body;

    const baptism = await Baptism.findById(baptismId);
    if (!baptism) {
      return res.status(404).json({ message: "Baptism not found" });
    }

    baptism.baptismDate = newDate;
    baptism.adminRescheduled = { date: newDate, reason: reason };

    await baptism.save();

    return res.status(200).json({ message: "Baptism date updated successfully", baptism });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
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
  try {
    const { baptismId } = req.params;
    const { selectedComment, additionalComment } = req.body;

    if (!selectedComment && !additionalComment) {
      return res.status(400).json({ message: "Comment cannot be empty." });
    }

    if (!mongoose.Types.ObjectId.isValid(baptismId)) {
      return res.status(400).json({ message: "Invalid baptism ID format." });
    }

    const baptism = await Baptism.findById(baptismId);
    if (!baptism) {
      return res.status(404).json({ message: "Baptism not found." });
    }

    const newComment = {
      selectedComment: selectedComment || "",
      additionalComment: additionalComment || "",
      createdAt: new Date(),
    };

    baptism.comments.push(newComment);
    await baptism.save();

    res.status(200).json({ message: "Comment added.", comment: newComment });
  } catch (error) {
    console.error("Error adding comment:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getBaptismChecklist = async (req, res) => {
  try {
    const { baptismId } = req.params;

    // Ensure proper population of the checklistId
    const baptism = await Baptism.findById(baptismId)
      // .populate({
      //   path: 'checklistId',
      //   model: 'BaptismChecklist', // Ensure this matches your model name
      // });
      .populate('checklistId');

    if (!baptism) {
      return res.status(404).json({ message: 'Baptism not found' });
    }

    res.json({ checklist: baptism.checklistId });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// update Baptism Checklist
exports.updateBaptismChecklist = async (req, res) => {
  try {
    const { baptismId } = req.params;
    const checklistData = req.body;

    console.log("Received baptismId:", baptismId);
    console.log("Checklist Data:", checklistData);

    const baptism = await Baptism.findById(baptismId);
    if (!baptism) {
      return res.status(404).json({ message: 'Baptism not found' });
    }

    let updatedChecklist;
    if (!baptism.checklistId) {

      console.log("No checklist found, creating a new one...");
      updatedChecklist = await BaptismChecklist.create(checklistData);

      baptism.checklistId = updatedChecklist._id;

      await baptism.save();
      return res.json({ message: 'Checklist created successfully', checklist: updatedChecklist });
    } else {

      console.log("Updating existing checklist with ID:", baptism.checklistId);
      updatedChecklist = await BaptismChecklist.findByIdAndUpdate(
        baptism.checklistId,
        checklistData,
        { new: true }
      );
      return res.json({ message: 'Checklist updated successfully', checklist: updatedChecklist });
    }
  } catch (err) {
    console.error("Error updating baptism checklist:", err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.addAdminNotes = async (req, res) => {
  try {
    const { baptismId } = req.params;
    const { priest, recordedBy, bookNumber, pageNumber, lineNumber } = req.body;

    if (!priest && !recordedBy && !bookNumber && !pageNumber && !lineNumber) {
      return res.status(400).json({ message: "Comment cannot be empty." });
    }

    if (!mongoose.Types.ObjectId.isValid(baptismId)) {
      return res.status(400).json({ message: "Invalid baptism ID format." });
    }

    const baptism = await Baptism.findById(baptismId);
    if (!baptism) {
      return res.status(404).json({ message: "Baptism not found." });
    }

    const newadminNotes = {
      priest: priest || "",
      recordedBy: recordedBy || "",
      bookNumber: bookNumber || "",
      pageNumber: pageNumber || "",
      lineNumber: lineNumber || "",
      createdAt: new Date(),
    };

    baptism.adminNotes.push(newadminNotes);
    await baptism.save();

    res.status(200).json({ message: "Admin notes added.", adminNotes: newadminNotes });
  } catch (error) {
    console.error("Error adding admin notes:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// For user fetching
exports.getMySubmittedForms = async (req, res) => {
  try {
    const userId = req.user.id;
    console.log("Authenticated User ID:", userId);

    const forms = await Baptism.find({ userId: userId });

    if (!forms.length) {
      return res.status(404).json({ message: "No forms found for this user." });
    }

    res.status(200).json({ forms });
  } catch (error) {
    console.error("Error fetching submitted baptism forms:", error);
    res.status(500).json({ message: "Failed to fetch submitted baptism forms." });
  }
};

// details 
exports.getBaptismFormById = async (req, res) => {
  try {
    const { baptismId } = req.params;

    const baptismForm = await Baptism.findById(baptismId)
      .populate('adminNotes.priest')
      .populate('userId', 'name email')
      .lean();

    if (!baptismForm) {
      return res.status(404).json({ message: "Baptism form not found." });
    }

    res.status(200).json(baptismForm);
  } catch (error) {
    console.error("Error fetching baptism form by ID:", error);
    res.status(500).json({ message: "Server error", error: error.message });
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
