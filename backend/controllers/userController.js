const User = require('../models/user');
const sendToken = require('../utils/jwtToken');
const cloudinary = require('cloudinary')
const crypto = require('crypto')
const sendEmail = require('../utils/sendEmail');
const MinistryCategory = require("../models/ministryCategory");
const {Wedding} = require("../models/weddings");
const Binyag = require("../models/Binyag");
const Counseling = require("../models/counseling");
const HouseBlessing = require("../models/PrivateScheduling/houseBlessing");
const mongoose = require('mongoose');

// exports.registerUser = async (req, res, next) => {
//     const result = await cloudinary.v2.uploader.upload(req.body.avatar, {
//         folder: 'baghub/avatar',
//         width: 150,
//         crop: "scale"
//     }, (err, res) => {
//         console.log(err, res);
//     });
//     const { name, email, password, role } = req.body;
//     const user = await User.create({
//         name,
//         email,
//         password,
//         avatar: {
//             public_id: result.public_id,
//             url: result.secure_url
//         },

//         // role,
//     })

//     // const token = user.getJwtToken();
//     if (!user) {
//         return res.status(500).json({
//             success: false,
//             message: 'user not created'
//         })
//     }
//     sendToken(user, 200, res)

// }

// exports.registerUser = async (req, res, next) => {
//     try {
//         console.log('Received ministryCategory:', req.body.ministryCategory);

//         // Upload avatar
//         const result = await cloudinary.v2.uploader.upload(req.body.avatar, {
//             folder: 'baghub/avatar',
//             width: 150,
//             crop: "scale"
//         });

//         // Extract fields
//         const { name, email, password, age, preference, phone, barangay, zip, city, country, ministryCategory } = req.body;

//         let ministryCategoryArray = [];

//         // Ensure ministryCategory is processed correctly
//         if (ministryCategory) {
//             let categoryArray = Array.isArray(ministryCategory) ? ministryCategory : [ministryCategory];

//             // Log the data before processing
//             console.log('Raw request body:', req.body);

//             // Process the categories if they are valid
//             ministryCategoryArray = categoryArray
//                 .map(item => {
//                     // Check if it's an object and try to extract the ID
//                     if (typeof item === "string") {
//                         return item; // It's already an ID
//                     } else if (item && item._id) {
//                         return item._id; // Extract _id if it's an object
//                     } else {
//                         return null;
//                     }
//                 })
//                 .filter(id => mongoose.Types.ObjectId.isValid(id)) // Ensure valid ObjectId
//                 .map(id => new mongoose.Types.ObjectId(id)); // Convert to ObjectId

//             // Log the processed ministry categories
//             console.log('Processed ministryCategory:', ministryCategoryArray);
//         }

//         // Create user
//         const user = await User.create({
//             name,
//             email,
//             password,
//             avatar: {
//                 public_id: result.public_id,
//                 url: result.secure_url
//             },
//             age,
//             preference,
//             phone,
//             barangay,
//             zip,
//             city,
//             country,
//             ministryCategory: ministryCategoryArray, // Save the processed category IDs
//         });

//         if (!user) {
//             return res.status(500).json({
//                 success: false,
//                 message: 'User not created'
//             });
//         }

//         sendToken(user, 200, res);
//     } catch (error) {
//         console.error('Error registering user:', error);
//         res.status(500).json({ success: false, message: 'Internal Server Error' });
//     }
// };

exports.registerUser = async (req, res, next) => {
    try {
        console.log('Received ministryRoles:', req.body.ministryRoles);
        console.log('Received address:', req.body.address);

        const result = await cloudinary.v2.uploader.upload(req.body.avatar, {
            folder: 'baghub/avatar',
            width: 150,
            crop: "scale"
        });

        const { name, email, password, age, civilStatus, preference, phone, address, ministryRoles } = req.body;

        let parsedAddress = {};
        try {
            parsedAddress = JSON.parse(address);
        } catch (error) {
            console.error("Error parsing address:", error);
            return res.status(400).json({ success: false, message: "Invalid address format" });
        }

        let ministryRolesArray = [];
        if (ministryRoles) {
            try {
                const parsedRoles = JSON.parse(ministryRoles);
                console.log("Parsed ministryRoles:", parsedRoles);
        
                let startYear, endYear;
                if (parsedRoles.length > 0) {
                    startYear = parsedRoles[0].startYear;
                    endYear = parsedRoles[0].endYear;
                }
        
                ministryRolesArray = parsedRoles.map(item => ({
                    ministry: new mongoose.Types.ObjectId(item.ministry),
                    role: item.role,
                    customRole: item.role === 'Others' ? item.customRole || '' : undefined,
                    startYear: startYear,
                    endYear: endYear
                }));
        
            } catch (error) {
                console.error('Error parsing ministryRoles:', error);
                return res.status(400).json({ success: false, message: "Invalid ministryRoles format" });
            }
        }
        

        const user = await User.create({
            name,
            email,
            password,
            avatar: {
                public_id: result.public_id,
                url: result.secure_url
            },
            age,
            civilStatus,
            preference,
            phone,
            address: {
                ...parsedAddress, 
                customBarangay: parsedAddress.barangay === 'Others' ? parsedAddress.customBarangay : undefined,
                customCity: parsedAddress.city === 'Others' ? parsedAddress.customCity : undefined,
            },
            ministryRoles: ministryRolesArray
        });

        if (!user) {
            return res.status(500).json({
                success: false,
                message: 'User not created'
            });
        }

        sendToken(user, 200, res);
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

exports.Profile = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id)
            .populate({
                path: "ministryRoles",
                populate: { path: "ministry", select: "name" } 
            })
            .select("-password"); 

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        res.status(200).json({
            success: true,
            user,
        });
    } catch (error) {
        console.error("Error fetching user profile:", error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};

exports.LoginUser = async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Please enter email & password' })
    }
    // if (!email || !password) {
    //     return next(new ErrorHandler('Please enter email & password', 400))
    // }

    // Finding user in database
    const user = await User.findOne({ email }).select('+password')

    if (!user) {
        return res.status(401).json({ message: 'Invalid Email or Password' })
    }
    // if (!user) {
    //     return next(new ErrorHandler('Invalid Email or Password', 401));
    // }

    // Checks if password is correct or not
    const isPasswordMatched = await user.comparePassword(password);

    // if (!isPasswordMatched) {
    //     return next(new ErrorHandler('Invalid Email or Password', 401));
    // }
    if (!isPasswordMatched) {
        return res.status(401).json({ message: 'Invalid Email or Password' })
    }
    // const token = user.getJwtToken();

    //  res.status(201).json({
    //  	success:true,

    //  	token
    //  });
    sendToken(user, 200, res)
}

// exports.Logout = async (req, res, next) => {
//     try {
//         res.cookie('token', null, {
//             expires: new Date(Date.now()),
//             httpOnly: true
//         });

//         res.status(200).json({
//             success: true,
//             message: 'Logged out'
//         });
//     } catch (error) {
//         console.error('Error logging out:', error);
//         res.status(500).json({
//             success: false,
//             message: 'Internal Server Error'
//         });
//     }
// }
exports.Logout = async (req, res, next) => {
    try {
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production", // Secure in production
            sameSite: "None", // Important for cross-origin cookies
        });

        res.status(200).json({
            success: true,
            message: 'Logged out',
        });
    } catch (error) {
        console.error('Error logging out:', error);
        res.status(500).json({
            success: false,
            message: 'Internal Server Error',
        });
    }
};

exports.ForgotPassword = async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
        return res.status(404).json({ error: 'User not found with this email' })
        // return next(new ErrorHandler('User not found with this email', 404));
    }
    const resetToken = user.getResetPasswordToken();
    await user.save({ validateBeforeSave: false });
    const resetUrl = `${req.protocol}://localhost:3000/password/reset/${resetToken}`;
    const message = `Your password reset token is as follow:\n\n${resetUrl}\n\nIf you have not requested this email, then ignore it.`
    try {
        await sendEmail({
            email: user.email,
            subject: 'Baghub Password Recover',
            message
        })

        res.status(200).json({
            success: true,
            message: `Email sent to: ${user.email}`
        })

    } catch (error) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save({ validateBeforeSave: false });
        return res.status(500).json({ error: error.message })
        // return next(new ErrorHandler(error.message, 500))
    }
}

exports.ResetPassword = async (req, res, next) => {
    const resetPasswordToken = crypto.createHash('sha256').update(req.params.token).digest('hex')
    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() }
    })

    if (!user) {
        return res.status(400).json({ message: 'Password reset token is invalid or has been expired' })
        // return next(new ErrorHandler('Password reset token is invalid or has been expired', 400))
    }

    if (req.body.password !== req.body.confirmPassword) {
        return res.status(400).json({ message: 'Password does not match' })
        // return next(new ErrorHandler('Password does not match', 400))
    }

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();
    sendToken(user, 200, res);
}

exports.updatePassword = async (req, res, next) => {
    const user = await User.findById(req.user.id).select('password');
    // Check previous user password
    const isMatched = await user.comparePassword(req.body.oldPassword)
    if (!isMatched) {
        return res.status(400).json({ message: 'Old password is incorrect' })
    }
    user.password = req.body.password;
    await user.save();
    sendToken(user, 200, res)

}

// exports.Profile = async (req, res, next) => {
//     // console.log(req.header('authorization'))
//     const user = await User.findById(req.user.id);

//     res.status(200).json({
//         success: true,
//         user
//     })
// }

exports.UpdateProfile = async (req, res, next) => {
    console.log(req.body)
    const newUserData = {
        name: req.body.name,
        email: req.body.email
    };

    if (req.body.avatar !== '') {
        const user = await User.findById(req.body.id);

        // const image_id = user.avatar.public_id;
        const result = await cloudinary.v2.uploader.upload(req.body.avatar, {
            folder: 'avatars',
            width: 150,
            crop: "scale"
        });

        newUserData.avatar = {
            public_id: result.public_id,
            url: result.secure_url
        };
    }

    const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
        new: true,
        runValidators: true,
    });

    if (!user) {
        return res.status(401).json({ message: 'User Not Updated' });
    }

    res.status(200).json({
        success: true
    });
};

exports.AllUsers = async (req, res, next) => {
    const users = await User.find()
    .populate("ministryRoles.ministry", "name");
    res.status(200).json({
        success: true,
        users
    })
}

// exports.AllUsers = async (req, res, next) => {
//     try {
//         const { search, category } = req.query;
//         let query = {};

//         if (search) {
//             query.$or = [
//                 { name: { $regex: search, $options: "i" } }, 
//                 { email: { $regex: search, $options: "i" } }
//             ];
//         }
//         if (category) {
//             query.ministryCategory = category;
//         }
//         const users = await User.find(query).populate("ministryCategory");
//         res.status(200).json({
//             success: true,
//             users
//         });
//     } catch (error) {
//         res.status(500).json({
//             success: false,
//             message: "Failed to retrieve users",
//             error: error.message
//         });
//     }
// };


exports.getUserDetails = async (req, res, next) => {
    const user = await User.findById(req.params.id);

    if (!user) {
        return res.status(400).json({ message: `User does not found with id: ${req.params.id}` })
        // return next(new ErrorHandler(`User does not found with id: ${req.params.id}`))
    }

    res.status(200).json({
        success: true,
        user
    })
}

exports.deleteUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: `User not found with id: ${req.params.id}`,
            });
        }
        if (user.avatar && user.avatar.public_id) {
            try {
                await cloudinary.v2.uploader.destroy(user.avatar.public_id);
            } catch (cloudinaryError) {
                console.error("Error deleting avatar from Cloudinary:", cloudinaryError);
                return res.status(500).json({
                    success: false,
                    message: 'Error deleting avatar from Cloudinary',
                    error: cloudinaryError.message,
                });
            }
        }

        await User.findByIdAndDelete(req.params.id);

        return res.status(200).json({
            success: true,
            message: 'User deleted successfully',
        });
    } catch (error) {
        console.error("Server error:", error);
        return res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message,
        });
    }
};

exports.updateUser = async (req, res, next) => {
    const newUserData = {
        name: req.body.name,
        email: req.body.email,
        isAdmin: req.body.isAdmin, 
    };

    try {
        const user = await User.findByIdAndUpdate(req.params.id, newUserData, {
            new: true,
            runValidators: true,
        });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found',
            });
        }

        return res.status(200).json({
            success: true,
            data: user,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message,
        });
    }
};

// exports.getUsersGroupedByMinistryCategory = async (req, res) => {
//     try {
//         const { ministryId } = req.params;

//         // Check if ministry exists
//         const ministry = await MinistryCategory.findById(ministryId);
//         if (!ministry) {
//             return res.status(404).json({ message: 'Ministry not found' });
//         }

//         // Find users belonging to this ministry
//         const users = await User.find({ ministryCategory: ministryId }).select('-password'); // Exclude password for security

//         res.status(200).json(users);
//     } catch (error) {
//         res.status(500).json({ message: 'Server error', error: error.message });
//     }
// };



// exports.deleteUser = async (req, res, next) => {
//     const user = await User.findById(req.params.id);

//     if (!user) {
//         return res.status(401).json({ message: `User does not found with id: ${req.params.id}` })
//         // return next(new ErrorHandler(`User does not found with id: ${req.params.id}`))
//     }

//     // Remove avatar from cloudinary
//     const image_id = user.avatar.public_id;
//     await cloudinary.v2.uploader.destroy(image_id);
//     await User.findByIdAndRemove(req.params.id);
//     return res.status(200).json({
//         success: true,
//     })
// }

// exports.getUsersByMinistryCategory = async (req, res) => {
//     try {
//         const { ministryCategoryId } = req.params;
//         console.log("Received ministryId:", ministryCategoryId); // Log the received ID

//         const ministry = await MinistryCategory.findById(ministryCategoryId);
//         console.log("Ministry found:", ministry); 

//         if (!ministry) {
//             return res.status(404).json({ message: 'Ministry category not found' });
//         }

//         const users = await User.find({ ministryCategory: ministryCategoryId }).select('-password');
//         res.status(200).json(users);
//     } catch (error) {
//         res.status(500).json({ message: 'Server error', error: error.message });
//     }
// };

// report
exports.getUsersGroupedByMinistryCategory = async (req, res) => {
    try {
        // Fetch all ministry categories
        const ministryCategories = await MinistryCategory.find();

        if (!ministryCategories.length) {
            return res.status(404).json({ message: "No ministry categories found" });
        }
        const results = await Promise.all(
            ministryCategories.map(async (category) => {
                const users = await User.find({
                    "ministryRoles.ministry": category._id, 
                }).populate("ministryRoles.ministry"); 

                return {
                    ministryCategory: category.name,
                    userCount: users.length,
                    users,
                };
            })
        );

        res.status(200).json({
            success: true,
            data: results,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server error", error });
    }
};

exports.getUsersByMinistryCategory = async (req, res) => {
    try {
        const { ministryCategoryId } = req.params;
        console.log("Received ministryId:", ministryCategoryId);

        const ministry = await MinistryCategory.findById(ministryCategoryId);
        console.log("Ministry found:", ministry);

        if (!ministry) {
            return res.status(404).json({ message: 'Ministry category not found' });
        }

        const users = await User.find({ 
            "ministryRoles.ministryName": ministry.name  
        }).select('-password');

        res.status(200).json({ users });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// exports.getUsersGroupedByMinistryCategory = async (req, res) => {
//     try {
//         // Fetch all ministry categories
//         const ministryCategories = await MinistryCategory.find();

//         if (!ministryCategories.length) {
//             return res.status(404).json({ message: "No ministry categories found" });
//         }

//         // Prepare an array to store category-wise user data
//         const results = await Promise.all(
//             ministryCategories.map(async (category) => {
//                 const users = await User.find({ ministryCategory: category._id })
//                     .populate("ministryCategory");

//                 return {
//                     ministryCategory: category.name,
//                     userCount: users.length,
//                     users,
//                 };
//             })
//         );

//         res.status(200).json({
//             success: true,
//             data: results,
//         });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ success: false, message: "Server error", error });
//     }
// };



// Fetching user ministry:

// exports.getUsersGroupedByMinistryCategory = async (req, res) => {
//     try {
//         const ministryCategories = await MinistryCategory.find();

//         if (!ministryCategories.length) {
//             return res.status(404).json({ message: "No ministry categories found" });
//         }

//         const results = await Promise.all(
//             ministryCategories.map(async (category) => {
//                 const users = await User.find({
//                     "ministryRoles.ministry": category._id, 
//                 }).populate("ministryRoles.ministry"); 

//                 return {
//                     ministryCategory: category.name,
//                     userCount: users.length,
//                     users,
//                 };
//             })
//         );

//         res.status(200).json({
//             success: true,
//             data: results,
//         });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ success: false, message: "Server error", error });
//     }
// };


// exports.getUserMinistries = async (req, res) => {
//     try {
//         const userId = req.user.id;

//         // Populate user's ministry categories
//         const user = await User.findById(userId).populate("ministryCategory", "name");

//         if (!user) {
//             return res.status(404).json({ message: "User not found" });
//         }

//         res.status(200).json(user.ministryCategory); // Corrected path
//     } catch (error) {
//         console.error("Error fetching user ministries:", error);
//         res.status(500).json({ message: "Server error", error: error.message });
//     }
// };


// exports.updateUser = async (req, res, next) => {
//     const newUserData = {
//         name: req.body.name,
//         email: req.body.email,
//         role: req.body.role
//     }

//     const user = await User.findByIdAndUpdate(req.params.id, newUserData, {
//         new: true,
//         runValidators: true,
//         // useFindAndModify: false
//     })

//     return res.status(200).json({
//         success: true
//     })
// }



//Reports

//getting user ministry 
exports.getUserMinistries = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId).populate("ministryRoles.ministry", "name");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const ministries = user.ministryRoles.map(role => ({
            ministryId: role.ministry._id,
            ministryName: role.ministry.name,
            role: role.role, 
            customRole: role.customRole || null 
        }));

        res.status(200).json(ministries);
    } catch (error) {
        console.error("Error fetching user ministries:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

exports.getRegisteredUsersCount = async (req, res, next) => {
    try {
      const count = await User.countDocuments();
      res.status(200).json({ success: true, count });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to fetch user count", error });
    }
  };

exports.getUsersByMinistryCategory = async (req, res) => {
    try {
        const { ministryCategoryId } = req.params;
        const { search, category } = req.query; 

        const ministryCategory = await MinistryCategory.findById(ministryCategoryId);
        if (!ministryCategory) {
            return res.status(404).json({ message: "Ministry category not found" });
        }

        let filter = { "ministryRoles.ministry": ministryCategoryId }; 

        if (search) {
            filter.$or = [
                { name: { $regex: search, $options: "i" } }, 
                { email: { $regex: search, $options: "i" } } 
            ];
        }

        if (category) {
            filter["ministryRoles.ministry"] = category; 
        }

        const users = await User.find(filter)
            .populate("ministryRoles.ministry") 
            .sort({ createdAt: -1 }); 

        if (!users.length) {
            return res.status(404).json({ message: "No users found for this ministry category" });
        }

        res.status(200).json({
            ministryCategory: ministryCategory.name,
            users: users.map(user => ({
                _id: user._id,
                name: user.name,
                email: user.email,
                avatar: user.avatar?.url || "",
                joined: user.createdAt, 
                ministryRoles: user.ministryRoles
                    .filter(role => role.ministry?._id.toString() === ministryCategoryId) 
                    .map(role => ({
                        ministryName: role.ministry?.name || "",
                        role: role.role,
                        customRole: role.customRole || null
                    }))
            })),
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error", error });
    }
};

exports.getUserFormCounts = async (req, res) => {
    try {
        console.log("Wedding model:", !!Wedding);
        console.log("Binyag model:", !!Binyag);
        console.log("Counseling model:", !!Counseling);
        console.log("HouseBlessing model:", !!HouseBlessing);

        const users = await User.find({}, "_id name email");

        const userFormData = await Promise.all(
            users.map(async (user) => {
                const weddingCount = Wedding ? await Wedding.countDocuments({ userId: user._id }) : 0;
                const baptismCount = Binyag ? await Binyag.countDocuments({ userId: user._id }) : 0;
                const counselingCount = Counseling ? await Counseling.countDocuments({ userId: user._id }) : 0;
                const houseBlessingCount = HouseBlessing ? await HouseBlessing.countDocuments({ userId: user._id }) : 0;

                return {
                    userId: user._id,
                    name: user.name,
                    email: user.email,
                    wedding: weddingCount,
                    baptism: baptismCount,
                    counseling: counselingCount,
                    houseBlessing: houseBlessingCount,
                };
            })
        );

        res.status(200).json(userFormData);
    } catch (error) {
        console.error("Error fetching user form counts:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

exports.getMemberStatuses = async (req, res) => {
    try {
        const currentYear = new Date().getFullYear();
        const users = await User.find({}, "_id name email ministryRoles").populate("ministryRoles.ministry", "name");

        const memberStatuses = users.map((user) => {
            let isActive = false;

            user.ministryRoles.forEach((role) => {
                if (!role.endYear || role.endYear >= currentYear) {
                    isActive = true; // If any ministry role is still valid in the current year, the user is active
                }
            });

            return {
                userId: user._id,
                name: user.name,
                email: user.email,
                isActive,
                ministries: user.ministryRoles.map((role) => ({
                    ministry: role.ministry?.name || "Unknown",
                    role: role.role,
                    startYear: role.startYear,
                    endYear: role.endYear || "Ongoing"
                })),
            };
        });

        res.status(200).json(memberStatuses);
    } catch (error) {
        console.error("Error fetching member statuses:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// exports.updateUser = async (req, res) => {
//     try {
//         const { isAdmin } = req.body;

//         // Ensure isAdmin is a Boolean
//         const adminStatus = isAdmin === 'true' || isAdmin === true;

//         const user = await User.findByIdAndUpdate(req.params.id, { 
//             name: req.body.name, 
//             email: req.body.email, 
//             isAdmin: adminStatus 
//         }, { new: true, runValidators: true });

//         if (!user) {
//             return res.status(404).json({ success: false, message: 'User not found' });
//         }

//         res.status(200).json({ success: true, user });
//     } catch (error) {
//         res.status(500).json({ success: false, message: 'Server error', error: error.message });
//     }
// };

// exports.getUsersByMinistryCategory = async (req, res) => {
//     try {
//         const { ministryCategoryId } = req.params;
//         const { search, category } = req.query; 

//         const ministryCategory = await MinistryCategory.findById(ministryCategoryId);
//         if (!ministryCategory) {
//             return res.status(404).json({ message: "Ministry category not found" });
//         }

//         let filter = { ministryCategory: ministryCategoryId };

//         if (search) {
//             filter.$or = [
//                 { name: { $regex: search, $options: "i" } }, 
//                 { email: { $regex: search, $options: "i" } } 
//             ];
//         }

//         if (category) {
//             filter.ministryCategory = category;
//         }
//         const users = await User.find(filter)
//             .populate("ministryCategory")
//             .sort({ createdAt: -1 }); 

//         if (!users.length) {
//             return res.status(404).json({ message: "No users found for this ministry category" });
//         }

//         res.status(200).json({
//             ministryCategory: ministryCategory.name,
//             users: users.map(user => ({
//                 _id: user._id,
//                 name: user.name,
//                 email: user.email,
//                 avatar: user.avatar?.url || "",
//                 joined: user.createdAt, 
//                 ministryCategory: user.ministryCategory.map(cat => cat.name).join(", ") 
//             })),
//         });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: "Server error", error });
//     }
// };

