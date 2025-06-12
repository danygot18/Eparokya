const Funeral = require('../../models/Funeral');
const mongoose = require('mongoose');
const cloudinary = require('cloudinary').v2;
const User = require('../../models/user');
const Priest = require('../../models/Priest/priest');
const sendEmail = require('../../utils/sendEmail');

// const validatePlacingOfPall = (placingOfPall) => {
//     if (placingOfPall && placingOfPall.by === "Family Member" && (!placingOfPall.familyMembers || placingOfPall.familyMembers.length === 0)) {
//         return { valid: false, message: "Family members must be provided if placingOfPall is done by Family Member." };
//     }
//     return { valid: true };
// };


const validatePlacingOfPall = (placingOfPall) => {
    if (placingOfPall && placingOfPall.by === "Family Member" && (!placingOfPall.familyMembers || placingOfPall.familyMembers.length === 0)) {
        return { valid: false, message: "Family members must be provided if placingOfPall is done by Family Member." };
    }
    return { valid: true };
};

exports.createFuneral = async (req, res) => {
    try {
        console.log('Funeral Create API hit');
        console.log('Request body:', JSON.stringify(req.body, null, 2));
        console.log('Request files:', req.files);

        const {
            name,
            dateOfDeath,
            personStatus,
            age,
            contactPerson,
            relationship,
            phone,
            address: addressString,
            priestVisit,
            reasonOfDeath,
            funeralDate,
            funeraltime,
            placeOfDeath,
            serviceType,
            placingOfPall: placingOfPallString,
            funeralMassDate,
            funeralMasstime,
            funeralMass,
            funeralStatus,
            userId,
        } = req.body;

        let address = {}, placingOfPall = {};

        try {
            console.log('Raw Address:', req.body.address);
            console.log('Raw Placing of Pall:', req.body.placingOfPall);

            address = typeof req.body.address === 'string' ? JSON.parse(req.body.address) : req.body.address || {};
            placingOfPall = typeof req.body.placingOfPall === 'string' ? JSON.parse(req.body.placingOfPall) : req.body.placingOfPall || {};

            console.log('Parsed Address:', JSON.stringify(address, null, 2));
            console.log('Parsed Placing of Pall:', JSON.stringify(placingOfPall, null, 2));
        } catch (parseError) {
            console.error('Error parsing address or placingOfPall:', parseError);
            return res.status(400).json({ message: 'Invalid address or placingOfPall format.' });
        }

        const placingValidation = validatePlacingOfPall(placingOfPall);
        if (!placingValidation.valid) {
            return res.status(400).json({ message: placingValidation.message });
        }

        const uploadToCloudinary = async (file, folder) => {
            try {
                if (!file) throw new Error('No file received for upload.');
                console.log(`Uploading ${file.originalname} to Cloudinary`);
                const result = await cloudinary.uploader.upload(file.path, { folder });
                console.log(`Uploaded: ${result.secure_url}`);
                return { public_id: result.public_id, url: result.secure_url };
            } catch (err) {
                console.error('Cloudinary Upload Error:', JSON.stringify(err, null, 2));
                throw err;
            }
        };

        console.log('Checking for deathCertificate file...');
        let deathCertificate;

        try {
            if (req.file) {
                console.log('Single file upload detected.');
                deathCertificate = await uploadToCloudinary(req.file, 'eparokya/funeral/docs');
            } else if (req.files && req.files.deathCertificate) {
                console.log('Multiple file upload detected.');
                deathCertificate = await uploadToCloudinary(req.files.deathCertificate[0], 'eparokya/funeral/docs');
            } else {
                throw new Error('Death Certificate is required.');
            }
        } catch (uploadError) {
            console.error('Error uploading death certificate:', JSON.stringify(uploadError, null, 2));
            return res.status(400).json({ success: false, message: uploadError.message });
        }

        if (new Date(funeralDate) < new Date()) {
            return res.status(400).json({ message: "Funeral date cannot be in the past." });
        }

        const newFuneral = new Funeral({
            name,
            dateOfDeath,
            personStatus,
            age,
            contactPerson,
            relationship,
            phone,
            address: {
                ...address,
                customBarangay: address.barangay === 'Others' ? address.customBarangay : undefined,
                customCity: address.city === 'Others' ? address.customCity : undefined,
            },
            priestVisit,
            reasonOfDeath,
            funeralDate,
            funeraltime,
            placeOfDeath,
            serviceType,
            placingOfPall,
            funeralMassDate,
            funeralMasstime,
            funeralMass,
            deathCertificate,
            funeralStatus,
            userId,
        });

        console.log('Funeral object created:', JSON.stringify(newFuneral, null, 2));

        await newFuneral.save();
        console.log('Funeral record saved successfully');

        // const user = await User.findById(userId);
        //         if (user && user.email) {
        //             const userEmail = user.email;
        //             const htmlMessage = `
        //   <div style="font-family: Arial, sans-serif; padding: 24px; background-color: #f9f9f9; color: #333;">
        //     <!-- Greeting -->
        //     <p style="font-size: 16px;">Good Day!</p>

        //     <!-- Body -->
        //     <p style="font-size: 16px;">
        //       Thank you for submitting your funeral service request to <strong>E:Parokya</strong>.<br>
        //       We have received your request and our team will review it shortly. You will be notified once your funeral schedule is confirmed.
        //     </p>

        //     <!-- Funeral Details Section -->
        //     <h3 style="margin-top: 20px;">Funeral Details</h3>
        //     <ul style="list-style: none; padding: 0;">
        //       <li><strong>Name of Deceased:</strong> ${name}</li>
        //       <li><strong>Contact Person:</strong> ${contactPerson}</li>
        //       <li><strong>Phone:</strong> ${phone}</li>
        //       <li><strong>Funeral Date:</strong> ${funeralDate}</li>
        //       <li><strong>Funeral Time:</strong> ${funeraltime}</li>
        //     </ul>

        //     <!-- Closing -->
        //     <p style="margin-top: 20px; font-size: 16px;">
        //       Thank you for reaching out. We are here to support you.
        //     </p>

        //     <!-- Footer -->
        //     <hr style="margin: 30px 0; border: none; border-top: 1px solid #ccc;">
        //     <footer style="font-size: 14px; color: #777;">
        //       <p><strong>E:Parokya</strong><br>
        //       Saint Joseph Parish – Taguig<br>
        //       This is an automated email. Please do not reply.</p>
        //     </footer>
        //   </div>
        // `;

        //             await sendEmail({
        //                 email: userEmail,
        //                 subject: "Your Funeral Service Request Has Been Submitted!",
        //                 message: htmlMessage,
        //             });
        //         }

        res.status(201).json({ message: 'Funeral record created successfully', funeral: newFuneral });

    } catch (error) {
        console.error('Error creating funeral record:', JSON.stringify(error, null, 2));
        console.error('Error keys:', Object.keys(error));

        res.status(500).json({
            success: false,
            message: error.message || 'Unknown error',
            errorDetails: JSON.stringify(error, null, 2) || 'No error details',
            stack: error.stack || 'No stack trace'
        });
    }
};

exports.getFunerals = async (req, res) => {
    try {
        const funerals = await Funeral.find().populate('userId', 'name');
        res.status(200).json(funerals);
    } catch (err) {
        console.error('Error fetching funeral entries:', err);
        res.status(500).json({ message: "Error fetching funeral entries.", error: err.message });
    }
};

exports.getFuneralById = async (req, res) => {
    try {
        const funeralId = req.params.funeralId;
        const funeral = await Funeral.findById(funeralId)
            .populate('userId', 'name email')
            .populate('Priest', 'fullName')

        if (!funeral) {
            return res.status(404).json({ message: "Funeral entry not found." });
        }

        res.status(200).json(funeral);
    } catch (err) {
        console.error('Error fetching funeral entry:', err);
        res.status(500).json({ message: "Error fetching funeral entry.", error: err.message });
    }
};

exports.updateFuneral = async (req, res) => {
    try {
        const funeralId = req.params.id;
        const updates = req.body;

        if (updates.funeralDate && new Date(updates.funeralDate) < new Date()) {
            return res.status(400).json({ message: "Funeral date cannot be in the past." });
        }

        const placingValidation = validatePlacingOfPall(updates.placingOfPall);
        if (!placingValidation.valid) {
            return res.status(400).json({ message: placingValidation.message });
        }

        const updatedFuneral = await Funeral.findByIdAndUpdate(funeralId, updates, { new: true });

        if (!updatedFuneral) {
            return res.status(404).json({ message: "Funeral entry not found." });
        }

        res.status(200).json(updatedFuneral);
    } catch (err) {
        console.error('Error updating funeral entry:', err);
        res.status(500).json({ message: "Error updating funeral entry.", error: err.message });
    }
};

exports.deleteFuneral = async (req, res) => {
    try {
        const funeralId = req.params.id;
        const deletedFuneral = await Funeral.findByIdAndDelete(funeralId);

        if (!deletedFuneral) {
            return res.status(404).json({ message: "Funeral entry not found." });
        }

        res.status(200).json({ message: "Funeral entry deleted successfully." });
    } catch (err) {
        console.error('Error deleting funeral entry:', err);
        res.status(500).json({ message: "Error deleting funeral entry.", error: err.message });
    }
};

exports.confirmFuneral = async (req, res) => {
    try {
        const { funeralId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(funeralId)) {
            return res.status(400).json({ message: "Invalid funeral ID format." });
        }
        const funeral = await Funeral.findById(funeralId);
        if (!funeral) {
            return res.status(404).json({ message: "Funeral not found." });
        }
        funeral.funeralStatus = "Confirmed";
        funeral.confirmedAt = new Date();

        await funeral.save();

        res.status(200).json({ message: "Funeral confirmed.", funeral });
    } catch (err) {
        res.status(500).send('Server error.');
    }
};

// exports.confirmFuneral = async (req, res) => {
//     try {
//         const funeral = await Funeral.findByIdAndUpdate(
//             req.params.id,
//             { funeralStatus: 'Confirmed', confirmedAt: new Date() },
//             { new: true }
//         );
//         if (!funeral) return res.status(404).send('Funeral not found.');
//         res.send(funeral);
//     } catch (err) {
//         res.status(500).send('Server error.');
//     }
// };

// decline funeral with comment
exports.declineFuneral = async (req, res) => {
    try {
        const { reason } = req.body;
        const userId = req.user._id;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }
        const cancellingUser = user.isAdmin ? "Admin" : user.name;

        const funeral = await Funeral.findByIdAndUpdate(
            req.params.funeralId,
            {
                funeralStatus: "Cancelled",
                cancellingReason: { user: cancellingUser, reason },
            },
            { new: true }
        );
        if (!funeral) {
            return res.status(404).json({ message: "Funeral not found." });
        }

        res.json({ message: "Funeral cancelled successfully", funeral });
    } catch (err) {
        console.error("Error cancelling funeral:", err);
        res.status(500).json({ message: "Server error." });
    }
};

// exports.createComment = async (req, res) => {
//     try {
//         const { funeralId } = req.params;
//         console.log('Received funeralId:', funeralId);

//         const { selectedComment, additionalComment, priestName } = req.body; 

//         if (!selectedComment || !priestName) {
//             return res.status(400).json({ message: "Priest name and selected comment are required." });
//         }

//         const funeral = await Funeral.findById(funeralId);
//         if (!funeral) {
//             return res.status(404).json({ message: "Funeral entry not found." });
//         }
//         const newComment = {
//             priest: priestName,
//             scheduledDate: funeral.funeralDate,
//             selectedComment,
//             additionalComment,
//             createdAt: new Date() 
//         };
//         funeral.comments.push(newComment);
//         await funeral.save();

//         res.status(201).json({ message: 'Comment added successfully', comment: newComment });
//     } catch (err) {
//         console.error('Error creating comment:', err);
//         res.status(500).json({ message: "Error creating comment.", error: err.message });
//     }
// };

// AdminComment
exports.createComment = async (req, res) => {
    try {
        const { funeralId } = req.params;
        const { selectedComment, additionalComment } = req.body;

        if (!selectedComment && !additionalComment) {
            return res.status(400).json({ message: "Comment cannot be empty." });
        }

        if (!mongoose.Types.ObjectId.isValid(funeralId)) {
            return res.status(400).json({ message: "Invalid funeral ID format." });
        }

        const funeral = await Funeral.findById(funeralId);
        if (!funeral) {
            return res.status(404).json({ message: "Funeral not found." });
        }

        const newComment = {
            selectedComment: selectedComment || "",
            additionalComment: additionalComment || "",
            createdAt: new Date(),
        };

        funeral.comments.push(newComment);
        await funeral.save();

        res.status(200).json({ message: "Comment added.", comment: newComment });
    } catch (error) {
        console.error("Error adding comment:", error);
        res.status(500).json({ success: false, error: error.message });
    }
};

// exports.createPriestComment = async (req, res) => {
//     try {
//         const { funeralId } = req.params;
//         const { name } = req.body; 

//         if (!name) {
//             return res.status(400).json({ message: "Priest name is required." });
//         }

//         if (!mongoose.Types.ObjectId.isValid(funeralId)) {
//             return res.status(400).json({ message: "Invalid funeral ID format." });
//         }

//         const funeral = await Funeral.findById(funeralId);
//         if (!funeral) {
//             return res.status(404).json({ message: "Funeral not found." });
//         }

//         // Set the priest subdocument
//         funeral.Priest = {
//             name,
//             createdAt: new Date()
//         };

//         await funeral.save();

//         res.status(200).json({ message: "Priest comment added.", priest: funeral.Priest });
//     } catch (error) {
//         console.error("Error adding priest comment:", error);
//         res.status(500).json({ success: false, error: error.message });
//     }
// };


// exports.addPriest = async (req, res) => {
//     try {
//         const { funeralId } = req.params;
//         const { priest } = req.body;

//         if (!priest) {
//             return res.status(400).json({ message: "Priest cannot be empty." });
//         }

//         if (!mongoose.Types.ObjectId.isValid(funeralId)) {
//             return res.status(400).json({ message: "Invalid funeral ID format." });
//         }

//         const funeral = await Funeral.findById(funeralId);
//         if (!funeral) {
//             return res.status(404).json({ message: "Funeral not found." });
//         }

//         const addComment = {
//             priest: priest || "",
//             createdAt: new Date(),
//         };

//         funeral.priest.push(addComment);
//         await funeral.save();

//         res.status(200).json({ message: "Comment added.", comment: addComment });
//     } catch (error) {
//         console.error("Error adding comment:", error);
//         res.status(500).json({ success: false, error: error.message });
//     }
// };

//  reschedule 

exports.addAdminNotes = async (req, res) => {
    try {
        const { funeralId } = req.params;
        const { priest, recordedBy, bookNumber, pageNumber, lineNumber } = req.body;

        if (!priest && !recordedBy && !bookNumber && !pageNumber && !lineNumber) {
            return res.status(400).json({ message: "Comment cannot be empty." });
        }

        if (!mongoose.Types.ObjectId.isValid(funeralId)) {
            return res.status(400).json({ message: "Invalid funeral ID format." });
        }

        const funeral = await Funeral.findById(funeralId);
        if (!funeral) {
            return res.status(404).json({ message: "Funeral not found." });
        }

        const newadminNotes = {
            priest: priest || "",
            recordedBy: recordedBy || "",
            bookNumber: bookNumber || "",
            pageNumber: pageNumber || "",
            lineNumber: lineNumber || "",
            createdAt: new Date(),
        };

        funeral.adminNotes.push(newadminNotes);
        await funeral.save();

        res.status(200).json({ message: "Admin notes added.", adminNotes: newadminNotes });
    } catch (error) {
        console.error("Error adding admin notes:", error);
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.createPriestComment = async (req, res) => {
    try {
        const { funeralId } = req.params;
        const { priestId } = req.body;

        if (!priestId) {
            return res.status(400).json({ message: "Priest ID is required." });
        }
        if (!mongoose.Types.ObjectId.isValid(funeralId) || !mongoose.Types.ObjectId.isValid(priestId)) {
            return res.status(400).json({ message: "Invalid ID format." });
        }
        const funeral = await Funeral.findById(funeralId);
        if (!funeral) {
            return res.status(404).json({ message: "Funeral not found." });
        }
        const priest = await Priest.findById(priestId);
        if (!priest) {
            return res.status(404).json({ message: "Priest not found." });
        }
        funeral.Priest = priest._id;
        await funeral.save();

        res.status(200).json({ message: "Priest assigned successfully.", priest });
    } catch (error) {
        console.error("Error assigning priest:", error);
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.updateFuneralDate = async (req, res) => {
    try {
        const { funeralId } = req.params;
        const { newDate, reason } = req.body;

        const funeral = await Funeral.findById(funeralId);
        if (!funeral) {
            return res.status(404).json({ message: "Funeral not found" });
        }

        funeral.funeralDate = newDate;
        funeral.adminRescheduled = { date: newDate, reason: reason };

        await funeral.save();

        return res.status(200).json({ message: "Funeral date updated successfully", funeral });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

exports.deleteComment = async (req, res) => {
    try {
        const { funeralId, commentId } = req.params;
        const funeral = await Funeral.findById(funeralId);

        if (!funeral) {
            return res.status(404).json({ message: "Funeral not found." });
        }

        const updatedComments = funeral.comments.filter(
            (comment) => comment._id.toString() !== commentId
        );

        funeral.comments = updatedComments;
        await funeral.save();

        res.status(200).json({ message: "Comment deleted successfully.", comments: funeral.comments });
    } catch (err) {
        console.error('Error deleting comment:', err);
        res.status(500).json({ message: "Error deleting comment.", error: err.message });
    }
};

exports.updateComment = async (req, res) => {
    try {
        const { funeralId, commentId } = req.params;
        const updates = req.body;
        const funeral = await Funeral.findById(funeralId);
        if (!funeral) {
            return res.status(404).json({ message: "Funeral not found." });
        }

        const comment = funeral.comments.id(commentId);
        if (!comment) {
            return res.status(404).json({ message: "Comment not found." });
        }
        Object.keys(updates).forEach((key) => {
            comment[key] = updates[key];
        });
        await funeral.save();
        res.status(200).json({ message: "Comment updated successfully.", comment });
    } catch (err) {
        console.error('Error updating comment:', err);
        res.status(500).json({ message: "Error updating comment.", error: err.message });
    }
};

exports.getConfirmedFunerals = async (req, res) => {
    try {
        const confirmedFunerals = await Funeral.find({ funeralStatus: 'Confirmed' });
        res.status(200).json(confirmedFunerals);
    } catch (error) {
        console.error('Error fetching confirmed funerals:', error);
        res.status(500).json({ error: 'Failed to fetch confirmed funerals' });
    }
};

// For user fetching
exports.getMySubmittedForms = async (req, res) => {
    try {
        const userId = req.user.id;
        console.log("Authenticated User ID:", userId);

        const forms = await Funeral.find({ userId: userId });

        if (!forms.length) {
            return res.status(404).json({ message: "No forms found for this user." });
        }

        res.status(200).json({ forms });
    } catch (error) {
        console.error("Error fetching submitted funeral forms:", error);
        res.status(500).json({ message: "Failed to fetch submitted funeral forms." });
    }
};

// details 
exports.getFuneralFormById = async (req, res) => {
    try {
        const { formId } = req.params; // Extract formId from URL

        const funeralForm = await Funeral.findById(formId)
            .populate('userId', 'name email') // Populate user info
            .populate('Priest', 'fullName') // Populate priest info
            .lean();

        if (!funeralForm) {
            return res.status(404).json({ message: "Funeral form not found." });
        }

        res.status(200).json(funeralForm);
    } catch (error) {
        console.error("Error fetching funeral form by ID:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};


exports.getFuneralsPerMonth = async (req, res) => {
    const data = await Funeral.aggregate([
        {
            $group: {
                _id: { $month: "$funeralDate" },
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

exports.getFuneralStatusCounts = async (req, res) => {
    try {
        const counts = await Funeral.aggregate([
            { $group: { _id: "$funeralStatus", count: { $sum: 1 } } }
        ]);
        res.status(200).json(counts);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch funeral status counts", error });
    }
};







