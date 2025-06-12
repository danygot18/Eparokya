const Counseling = require("../../models/counseling");
const mongoose = require("mongoose");
const Priest = require("../../models/Priest/priest");
const User = require("../../models/user");
const sendEmail = require("../../utils/sendEmail");

exports.createCounseling = async (req, res) => {
  try {
    const {
      person,
      purpose,
      contactPerson,
      contactNumber,
      address,
      counselingDate,
      counselingTime,
      userId,
    } = req.body;

    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }
    const newCounseling = new Counseling({
      person,
      purpose,
      contactPerson,
      contactNumber,
      address: {
        ...address,
        customBarangay:
          address.baranggay === "Others" ? address.customBarangay : undefined,
        customCity: address.city === "Others" ? address.customCity : undefined,
      },
      counselingDate,
      counselingTime,
      userId,
    });

    const savedCounseling = await newCounseling.save();

    const userEmail = req.user.email;
    const htmlMessage = `
  <div style="font-family: Arial, sans-serif; padding: 24px; background-color: #f9f9f9; color: #333;">
    <!-- Greeting -->
    <p style="font-size: 16px;">Good Day!</p>

    <!-- Body -->
    <p style="font-size: 16px;">
      Thank you for submitting your counseling request to <strong>E:Parokya</strong>.<br>
      We have received your request and our team will review it shortly. You will be notified once your counseling session is confirmed or if further information is needed.
    </p>

    <!-- Counseling Details Section -->
    <h3 style="margin-top: 20px;">Counseling Request Details</h3>
    <ul style="list-style: none; padding: 0;">
      <li><strong>Person:</strong> ${person}</li>
      <li><strong>Purpose:</strong> ${purpose}</li>
      <li><strong>Contact Person:</strong> ${contactPerson}</li>
      <li><strong>Contact Number:</strong> ${contactNumber}</li>
      <li><strong>Address:</strong> ${address?.street || ""}, ${
      address?.baranggay || ""
    }, ${address?.city || ""}</li>
      <li><strong>Date:</strong> ${counselingDate}</li>
      <li><strong>Time:</strong> ${counselingTime}</li>
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
      subject: "Your Counseling Request Has Been Submitted!",
      message: htmlMessage,
    });

    res
      .status(201)
      .json({
        message: "Counseling request created successfully",
        counseling: savedCounseling,
      });
  } catch (error) {
    console.error("Error creating counseling request:", error);
    res.status(500).json({ error: "Failed to create counseling request" });
  }
};

exports.getUserCounselingRequests = async (req, res) => {
  try {
    const { userId } = req.params;
    const counselingRequests = await Counseling.find({ userId });
    res.status(200).json({ counselingRequests });
  } catch (error) {
    console.error("Error fetching counseling requests:", error);
    res.status(500).json({ error: "Failed to fetch counseling requests" });
  }
};

exports.getAllCounselingRequests = async (req, res) => {
  try {
    const counselingRequests = await Counseling.find().populate(
      "userId",
      "name email"
    );
    res.status(200).json({ counselingRequests });
  } catch (error) {
    console.error("Error fetching all counseling requests:", error);
    res.status(500).json({ error: "Failed to fetch counseling requests" });
  }
};

exports.getCounselingById = async (req, res) => {
  try {
    const { counselingId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(counselingId)) {
      return res.status(400).json({ message: "Invalid counseling ID format." });
    }

    const counseling = await Counseling.findById(counselingId)
      .populate("userId", "name email")
      .populate("Priest", "fullName");

    if (!counseling) {
      return res.status(404).json({ message: "Counseling not found." });
    }

    res.status(200).json({ counseling });
  } catch (error) {
    console.error("Error fetching counseling by ID:", error);
    res.status(500).json({ error: "Failed to fetch counseling by ID" });
  }
};

exports.confirmCounseling = async (req, res) => {
  try {
    const { counselingId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(counselingId)) {
      return res.status(400).json({ message: "Invalid counseling ID format." });
    }

    const counseling = await Counseling.findById(counselingId);

    if (!counseling) {
      return res.status(404).json({ message: "Counseling not found." });
    }

    counseling.counselingStatus = "Confirmed";
    counseling.confirmedAt = new Date();

    await counseling.save();

    res.status(200).json({ message: "Counseling confirmed.", counseling });
  } catch (error) {
    console.error("Error confirming counseling:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// exports.declineCounseling = async (req, res) => {
//   try {
//     const { counselingId } = req.params;

//     if (!mongoose.Types.ObjectId.isValid(counselingId)) {
//       return res.status(400).json({ message: "Invalid counseling ID format." });
//     }

//     const counseling = await Counseling.findById(counselingId);

//     if (!counseling) {
//       return res.status(404).json({ message: "Counseling not found." });
//     }

//     counseling.counselingStatus = "Declined";
//     await counseling.save();

//     res.status(200).json({ message: "Counseling declined." });
//   } catch (error) {
//     console.error("Error declining counseling:", error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// };
// exports.declineCounseling = async (req, res) => {
//   try {
//     const counseling = await Counseling.findByIdAndUpdate(
//       req.params.counselingId,
//       { counselingStatus: 'Cancelled' },
//       { new: true }
//     );
//     if (!counseling) return res.status(404).send('Counseling not found.');
//     res.send(counseling);
//   } catch (err) {
//     res.status(500).send('Server error.');
//   }
// };

// decline counseling with reason
exports.declineCounseling = async (req, res) => {
  try {
    const { reason } = req.body;
    const userId = req.user._id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
    const cancellingUser = user.isAdmin ? "Admin" : user.name;

    const counseling = await Counseling.findByIdAndUpdate(
      req.params.counselingId,
      {
        counselingStatus: "Cancelled",
        cancellingReason: { user: cancellingUser, reason },
      },
      { new: true }
    );
    if (!counseling) {
      return res.status(404).json({ message: "Counseling not found." });
    }

    res.json({ message: "Counseling cancelled successfully", counseling });
  } catch (err) {
    console.error("Error cancelling counseling:", err);
    res.status(500).json({ message: "Server error." });
  }
};

exports.updateCounselingDate = async (req, res) => {
  try {
    const { counselingId } = req.params;
    const { newDate, reason } = req.body;

    const counseling = await Counseling.findById(counselingId);
    if (!counseling) {
      return res.status(404).json({ message: "Counseling not found" });
    }

    counseling.counselingDate = newDate;
    counseling.adminRescheduled = { date: newDate, reason: reason };

    await counseling.save();

    return res
      .status(200)
      .json({ message: "Counseling date updated successfully", counseling });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// Comments for the admin
exports.addComment = async (req, res) => {
  try {
    const { counselingId } = req.params;
    const { selectedComment, additionalComment } = req.body;

    if (!selectedComment && !additionalComment) {
      return res.status(400).json({ message: "Comment cannot be empty." });
    }

    if (!mongoose.Types.ObjectId.isValid(counselingId)) {
      return res.status(400).json({ message: "Invalid counsing ID format." });
    }

    const counseling = await Counseling.findById(counselingId);
    if (!counseling) {
      return res.status(404).json({ message: "Counseling not found." });
    }

    // Ensure correct field names based on your schema
    const newComment = {
      selectedComment: selectedComment || "",
      additionalComment: additionalComment || "",
      createdAt: new Date(),
    };

    counseling.comments.push(newComment);
    await counseling.save();

    res.status(200).json({ message: "Comment added.", comment: newComment });
  } catch (error) {
    console.error("Error adding comment:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// Getting and Adding of Priest (modified priest)
exports.createPriestComment = async (req, res) => {
  try {
    const { counselingId } = req.params;
    const { priestId } = req.body;

    if (!priestId) {
      return res.status(400).json({ message: "Priest ID is required." });
    }
    if (
      !mongoose.Types.ObjectId.isValid(counselingId) ||
      !mongoose.Types.ObjectId.isValid(priestId)
    ) {
      return res.status(400).json({ message: "Invalid ID format." });
    }
    const counseling = await Counseling.findById(counselingId);
    if (!counseling) {
      return res.status(404).json({ message: "Counseling not found." });
    }
    const priest = await Priest.findById(priestId);
    if (!priest) {
      return res.status(404).json({ message: "Priest not found." });
    }
    counseling.priest = priest._id;
    await counseling.save();

    res.status(200).json({ message: "Priest assigned successfully.", priest });
  } catch (error) {
    console.error("Error assigning priest:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getCounselingWithPriest = async (req, res) => {
  try {
    const { counselingId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(counselingId)) {
      return res.status(400).json({ message: "Invalid counseling ID format." });
    }
    const counseling = await Counseling.findById(counselingId).populate(
      "priest"
    );
    if (!counseling) {
      return res.status(404).json({ message: "Counseling not found." });
    }
    res.status(200).json({ success: true, counseling });
  } catch (error) {
    console.error("Error fetching counseling:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// For user fetching
exports.getMySubmittedForms = async (req, res) => {
  try {
    const userId = req.user.id;
    console.log("Authenticated User ID:", userId);

    const forms = await Counseling.find({ userId: userId });

    if (!forms.length) {
      return res.status(404).json({ message: "No forms found for this user." });
    }

    res.status(200).json({ forms });
  } catch (error) {
    console.error("Error fetching submitted counseling forms:", error);
    res
      .status(500)
      .json({ message: "Failed to fetch submitted counseling forms." });
  }
};

// details
exports.getCounselingFormById = async (req, res) => {
  try {
    const { formId } = req.params;

    const counselingForm = await Counseling.findById(formId)
      .populate("userId", "name email")
      .lean();

    if (!counselingForm) {
      return res.status(404).json({ message: "Counseling form not found." });
    }

    res.status(200).json(counselingForm);
  } catch (error) {
    console.error("Error fetching counseling form by ID:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Confirmed Counseling:
exports.getConfirmedCounseling = async (req, res) => {
  try {
    const confirmedCounseling = await Counseling.find({
      counselingStatus: "Confirmed",
    });
    res.status(200).json(confirmedCounseling);
  } catch (error) {
    console.error("Error fetching confirmed counseling:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// Update counseling status (Approve/Cancel)
exports.updateCounselingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { counselingStatus, confirmedAt, priest } = req.body;

    const updatedCounseling = await Counseling.findByIdAndUpdate(
      id,
      { counselingStatus, confirmedAt, priest },
      { new: true }
    );

    if (!updatedCounseling) {
      return res.status(404).json({ error: "Counseling request not found" });
    }

    res
      .status(200)
      .json({
        message: "Counseling status updated",
        counseling: updatedCounseling,
      });
  } catch (error) {
    console.error("Error updating counseling status:", error);
    res.status(500).json({ error: "Failed to update counseling status" });
  }
};

// Add a priest's comment to a counseling request
exports.addCommentToCounseling = async (req, res) => {
  try {
    const { id } = req.params;
    const { priest, scheduledDate, selectedComment, additionalComment } =
      req.body;

    const counseling = await Counseling.findById(id);
    if (!counseling) {
      return res.status(404).json({ error: "Counseling request not found" });
    }

    counseling.comments.push({
      priest,
      scheduledDate,
      selectedComment,
      additionalComment,
    });

    await counseling.save();
    res.status(200).json({ message: "Comment added successfully", counseling });
  } catch (error) {
    console.error("Error adding comment:", error);
    res.status(500).json({ error: "Failed to add comment" });
  }
};

// For Reports
exports.getCounselingPerMonth = async (req, res) => {
  const data = await Counseling.aggregate([
    {
      $group: {
        _id: { $month: "$counselingDate" },
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

exports.getCounselingStatusCounts = async (req, res) => {
  try {
    const counts = await Counseling.aggregate([
      { $group: { _id: "$counselingStatus", count: { $sum: 1 } } },
    ]);
    res.status(200).json(counts);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch counseling status counts", error });
  }
};
