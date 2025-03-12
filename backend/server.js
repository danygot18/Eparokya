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
const { server, io } = require('./app'); // Use the existing server & io instance
const socket = require('./socket');

dotenv.config({ path: './config/config.env' });

// Connect to Database
connectDatabase();

// Cloudinary Config
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Server Port
const port = process.env.PORT || 8080;

server.listen(port, () => {
    console.log(`Server started on port ${port} in ${process.env.NODE_ENV} mode`);
});

// Use the existing io instance
io.on('connection', socket);

