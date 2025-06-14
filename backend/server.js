// const dotenv = require('dotenv');
// const { Server } = require('socket.io');
// const cloudinary = require('cloudinary');
// const connectDatabase = require('./config/database');
// const http = require('http');
// const app = require('./app');
// const { server } = require('./app');

// dotenv.config({ path: './config/config.env' });

// connectDatabase();

// cloudinary.config({
//     cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//     api_key: process.env.CLOUDINARY_API_KEY,
//     api_secret: process.env.CLOUDINARY_API_SECRET
// });

// const port = process.env.PORT || 8080;

// server.listen(port, () => {
//     console.log(`Server started on port ${port} in ${process.env.NODE_ENV} mode`);
// });

// // const port = process.env.PORT || 8080;
// // const server = app.listen(port, () => {
// //     console.log(`Server started on port ${port} in ${process.env.NODE_ENV} mode`);
// // });

// // Initialize Socket.IO for real-time communication (Mobile)
// const io = new Server(server, {
//     cors: {
//         origin: "*", 
//         methods: ["GET", "POST"]
//     }
// });
// // const allowedOrigins = [
// //     "https://eparokya.vercel.app",  // Web frontend (Production)
// //     "http://localhost:3000",  // Web (Development)
// //     null,  // Mobile app (since built apps may send requests with null origin)
// //   ];

// //   const io = new Server(server, {
// //     cors: {
// //       origin: function (origin, callback) {
// //         if (!origin || allowedOrigins.includes(origin)) {
// //           callback(null, true);
// //         } else {
// //           callback(new Error("Not allowed by CORS"));
// //         }
// //       },
// //       credentials: true,
// //     },
// //   });

// // Store connected users
// const USERS = new Map();
// const socket = require('./socket');

// io.on('connection', socket);

const dotenv = require('dotenv');
const cloudinary = require('cloudinary');
const connectDatabase = require('./config/database');
const { app, server, io } = require('./app'); // Import from your app.js
const socketHandler = require('./socket');

// Load environment variables
dotenv.config({ path: './config/config.env' });
console.log("✅ DB_URI:", process.env.DB_URI || "NOT FOUND");
console.log("🔐 Hugging Face API Key:", process.env.HUGGING_FACE_API_KEY || "NOT FOUND");

// Connect to the database
connectDatabase();

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Start server
const port = process.env.PORT || 8080;
server.listen(port, '0.0.0.0', () => {
    console.log(`🚀 Server running on port ${port} in ${process.env.NODE_ENV} mode`);
});

// Attach socket handler
io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);
    socketHandler(socket);

    socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
    });
});

// Optionally: Load sentiment analysis model here (if global)
let sentimentAnalyzer;
(async () => {
    try {
        const { pipeline } = await import('@xenova/transformers');
        sentimentAnalyzer = await pipeline('sentiment-analysis', 'Xenova/bert-base-multilingual-uncased-sentiment');
        console.log('🧠 Sentiment model loaded successfully!');
    } catch (error) {
        console.error("❌ Error loading sentiment model:", error);
    }
})();



//new

// const dotenv = require('dotenv');
// const cloudinary = require('cloudinary');
// const connectDatabase = require('./config/database');
// const { app, io, server } = require('./app'); // Import from app.js
// const socket = require('./socket'); // Import socket event handlers

// dotenv.config({ path: './config/config.env' });
// console.log("DB_URI:", process.env.DB_URI || "NOT FOUND");
// console.log("Hugging Face API Key:", process.env.HUGGING_FACE_API_KEY || "NOT FOUND");

// // Connect to Database
// connectDatabase();

// // Cloudinary Configuration
// cloudinary.config({
//     cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//     api_key: process.env.CLOUDINARY_API_KEY,
//     api_secret: process.env.CLOUDINARY_API_SECRET
// });

// // Start the server
// const port = process.env.PORT || 8080;
// server.listen(port, '0.0.0.0', () => {
//     console.log(`Server started on port ${port} in ${process.env.NODE_ENV} mode`);
// });

// // Use the existing io instance for socket handling
// io.on('connection', socket);

// // ---------------------- SENTIMENT ANALYSIS ---------------------- //
// let sentimentAnalyzer;

// (async () => {
//     try {
//         const { pipeline } = await import('@xenova/transformers'); // ✅ Dynamic Import
//         sentimentAnalyzer = await pipeline('sentiment-analysis', 'Xenova/bert-base-multilingual-uncased-sentiment');
//         console.log('✅ Sentiment model loaded successfully!');
//     } catch (error) {
//         console.error("❌ Error loading sentiment model:", error);
//     }
// })();