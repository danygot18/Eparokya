const dotenv = require('dotenv');
const { Server } = require('socket.io');
const cloudinary = require('cloudinary');
const connectDatabase = require('./config/database');
const app = require('./app');

// Load environment variables
dotenv.config({ path: './config/config.env' });

// Connect to the database
connectDatabase();

// Configure Cloudinary (for image uploads)
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Start the server
const port = process.env.PORT || 8080;
const server = app.listen(port, () => {
    console.log(`Server started on port ${port} in ${process.env.NODE_ENV} mode`);
});

// Initialize Socket.IO for real-time communication (Mobile)
const io = new Server(server, {
    cors: {
        origin: "*", // Adjust this to only allow your frontend domains
        // methods: ["GET", "POST"]
    }
});
// const allowedOrigins = [
//     "https://eparokya.vercel.app",  // Web frontend (Production)
//     "http://localhost:3000",  // Web (Development)
//     null,  // Mobile app (since built apps may send requests with null origin)
//   ];
  
//   const io = new Server(server, {
//     cors: {
//       origin: function (origin, callback) {
//         if (!origin || allowedOrigins.includes(origin)) {
//           callback(null, true);
//         } else {
//           callback(new Error("Not allowed by CORS"));
//         }
//       },
//       credentials: true,
//     },
//   });

// Store connected users
const USERS = new Map();
const socket = require('./socket');
// Handle WebSocket connections
io.on('connection', socket);

