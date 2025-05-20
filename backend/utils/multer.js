// const multer = require("multer");
// const path = require("path");

// module.exports = multer({
//     limits: { fieldSize: 50 * 1024 * 1024 },
//     storage: multer.diskStorage({}),
//     fileFilter: (req, file, cb) => {
//         let ext = path.extname(file.originalname).toLowerCase();
//         if (ext !== ".jpg" && ext !== ".jpeg" && ext !== ".png") {
//             cb(new Error("Unsupported file type!"), false);
//             return;
//         }
//         cb(null, true);
//     },
// });

//updated:
// const multer = require("multer");
// const path = require("path");

// module.exports = multer({
//     limits: { fieldSize: 50 * 1024 * 1024 }, 
    
//     storage: multer.diskStorage({}),
//     fileFilter: (req, file, cb) => {
//         const ext = path.extname(file.originalname).toLowerCase();
//         if (![".jpg", ".jpeg", ".png", ".pdf", ".mp4", ".mov"].includes(ext)) {
//             cb(new Error("Unsupported file type!"), false);
//             return;
//         }
//         cb(null, true);
//     },
// });


// const multer = require("multer");
// const path = require("path");
// const os = require("os");

// module.exports = multer({
//     limits: { fieldSize: 50 * 1024 * 1024 }, 
//     storage: multer.diskStorage({
//         destination: (req, file, cb) => {
//             cb(null, os.tmpdir()); // Use system's temp directory
//         },
//         filename: (req, file, cb) => {
//             cb(null, Date.now() + '-' + file.originalname); // Unique filename
//         },
//     }),
//     fileFilter: (req, file, cb) => {
//         const ext = path.extname(file.originalname).toLowerCase();
//         if (![".jpg", ".jpeg", ".png", ".pdf", ".mp4", ".mov"].includes(ext)) {
//             cb(new Error("Unsupported file type!"), false);
//         } else {
//             cb(null, true);
//         }
//     },
// });

// const multer = require("multer");
// const path = require("path");
// const os = require("os");
// const { CloudinaryStorage } = require("multer-storage-cloudinary");
// const cloudinary = require("cloudinary").v2;

// const storage = new CloudinaryStorage({
//     cloudinary: cloudinary,
//     params: {
//         folder: "eparokya/announcement",
//         allowed_formats: ["jpg", "jpeg", "png", "mp4", "mov"],
//     },
// });

// const upload = multer({
//     limits: { fieldSize: 50 * 1024 * 1024 },
//     storage: storage,
//     fileFilter: (req, file, cb) => {
//         const ext = path.extname(file.originalname).toLowerCase();
//         if (![".jpg", ".jpeg", ".png", ".mp4", ".mov"].includes(ext)) {
//             cb(new Error("Unsupported file type!"), false);
//         } else {
//             cb(null, true);
//         }
//     },
// });

// const uploadAnnouncement = upload.fields([
//     { name: 'images', maxCount: 5 },  
//     { name: 'video', maxCount: 1 },   
// ]);

// module.exports = uploadAnnouncement;


// module.exports = upload;

    const multer = require("multer");
    const path = require("path");
    const { CloudinaryStorage } = require("multer-storage-cloudinary");
    const cloudinary = require("cloudinary").v2;

    const cloudinaryStorage = new CloudinaryStorage({
        cloudinary: cloudinary,
        params: {
            folder: "eparokya/uploads",
            allowed_formats: ["jpg", "jpeg", "png", "mp4", "mov", "pdf", "docx"],
        },
    });

    const upload = multer({
        storage: cloudinaryStorage,
        limits: { fileSize: 50 * 1024 * 1024 },
        fileFilter: (req, file, cb) => {
            const ext = path.extname(file.originalname).toLowerCase();
            if (![".jpg", ".jpeg", ".png", ".mp4", ".mov", ".pdf", ".docx"].includes(ext)) {
                cb(new Error("Unsupported file type!"), false);
            } else {
                cb(null, true);
            }
        },
    });

    module.exports = upload;



