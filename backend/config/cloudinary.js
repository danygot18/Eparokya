const dotenv = require('dotenv');
dotenv.config({ path: './config/.env' });
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (req, file) => {
        const fileFormat = file.mimetype.split('/')[1];
        if (file.mimetype === 'application/pdf') {
            return {
                folder: 'EParokya_PDFs',  
                resource_type: 'raw',
                allowed_formats: ['pdf'], 
            };
        } 
        else if (['jpg', 'jpeg', 'png'].includes(fileFormat)) {
            return {
                folder: 'EParokya_Images',  
                resource_type: 'image',
                allowed_formats: ['jpg', 'jpeg', 'png'],
            };
        } else {
            throw new Error('Unsupported file type');
        }
    },
});
const weddingStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'WeddingDocuments',
        resource_type: 'auto',
    },
});


const upload = multer({ storage: storage });
const weddingUpload = multer({ storage: weddingStorage });

module.exports = {
    upload,         
    cloudinary,
    weddingUpload,   
};
