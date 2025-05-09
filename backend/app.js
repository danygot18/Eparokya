const express = require("express");
const app = express();
const cors = require("cors");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const errorHandler = require("./helpers/error-handler");


// For natification:
const { Server } = require("socket.io");
const http = require("http");

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: [
      // "*",
      "https://eparokya.vercel.app", 
      "http://localhost:3000"],
    credentials: true,
  },
});


// const allowedOrigins = ["https://eparokya.vercel.app","*", null];

// Load environment variables
// require("dotenv/config");

// app.use(
//   cors({
//     origin: function (origin, callback) {
//       if (allowedOrigins.includes(origin)) {
//         callback(null, true);
//       } else {
//         callback(new Error("Not allowed by CORS"));
//       }
//     },
//     credentials: true,
//   })
// );
// Enable CORS for both Web & Mobile
// app.use(
//   cors({
//     origin: ["*", "https://eparokya.vercel.app", null, "http://localhost:3000"],
//     // origin: "*",
//     credentials: true,
//   })
// );
// app.use(cors());
// app.options("*", cors());

// app.use(cors());
// app.options("*", cors());
app.use(express.json());

//new
app.use(
  cors({
    origin: [
      "*",
      // "https://eparokya.vercel.app", 
      "http://localhost:3000"], // Allowed domains
    credentials: true, // Allow sending cookies
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Middleware
// app.use(express.json({ limit: "50mb" }));
// app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(cookieParser());
app.use(morgan("tiny"));
app.use(errorHandler);
app.use("/public/uploads", express.static(__dirname + "/public/uploads"));

// const express = require("express");
// const app = express();
// const cors = require("cors");
// const morgan = require("morgan");
// const cookieParser = require("cookie-parser");
// const errorHandler = require("./helpers/error-handler");

// // For real-time communication (Socket.IO)
// const { Server } = require("socket.io");
// const http = require("http");

// // Initialize server and Socket.IO
// const server = http.createServer(app);
// const io = new Server(server, {
//   cors: {
//     origin: [
//       "https://eparokya.vercel.app", 
//       "http://localhost:3000"
//     ],
//     credentials: true,
//   },
// });

// // Middleware
// app.use(express.json());
// app.use(cookieParser());
// app.use(morgan("tiny"));
// app.use(errorHandler);
// app.use("/public/uploads", express.static(__dirname + "/public/uploads"));

// // CORS Configuration
// app.use(
//   cors({
//     origin: [
//       "https://eparokya.vercel.app", 
//       "http://localhost:3000"
//     ], // Allowed domains
//     credentials: true, // Allow sending cookies
//     methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
//     allowedHeaders: ["Content-Type", "Authorization"],
//   })
// );


// === ROUTES ===
// User & Authentication
app.use("/api/v1", require("./routes/user"));
app.use("/api/v1/chat", require("./routes/chat"));

// Prayer Wall


app.use("/api/v1", require("./routes/Notification/notification"));

// Sentiment Analysis
app.use("/api/v1/", require("./routes/FeedbackForm/sentimentAnalysis"));
app.use("/api/v1/", require("./routes/FeedbackForm/Types/eventType"));
app.use("/api/v1/", require("./routes/FeedbackForm/Types/activityType"));

app.use("/api/v1/", require("./routes/FeedbackForm/Sentiments/EventSentiment"));
app.use("/api/v1/", require("./routes/FeedbackForm/Sentiments/ActivitySentiment"));
app.use("/api/v1/", require("./routes/FeedbackForm/Sentiments/PriestSentiment"));

app.use("/api/v1/", require("./routes/FeedbackForm/AdminSelection/adminSelection"));


// Ministry & Members
app.use("/api/v1/ministryCategory", require("./routes/ministryCategory"));

app.use("/api/v1/", require("./routes/PrayerWall/prayerWall"));
app.use("/api/v1", require("./routes/PrayerWall/prayerRequest"));
// app.use("/api/v1", require("./routes/PrayerWall/prayerRequestIntention"));

const prayerRequestRoutes = require("./routes/PrayerWall/prayerRequestIntention")(io);
app.use("/api/v1", prayerRequestRoutes);

// Announcements & Posts
app.use("/api/v1", require("./routes/Announcement/announcement"));
app.use("/api/v1", require("./routes/Announcement/announcementCategory"));

// may conflict sa counseling kaya inangat muna

app.use("/api/v1", require("./routes/Inventory"));
app.use("/api/v1", require("./routes/adminDate"));

// Priest
app.use("/api/v1", require("./routes/Priest/priest"));

// Sacramental Services
app.use("/api/v1", require("./routes/wedding"));
app.use("/api/v1", require("./routes/Binyag"));
app.use("/api/v1", require("./routes/Funeral"));
app.use("/api/v1", require("./routes/counseling"));


// MassForms
app.use("/api/v1", require("./routes/MassForms/massBaptism"));
app.use("/api/v1", require("./routes/MassForms/massWedding"));

app.use("/api/v1", require("./routes/Announcement/AnnouncementComment"));
app.use("/api/v1", require("./routes/Announcement/ministryAnnouncement"));
app.use("/api/v1", require("./routes/post"));

// Events & Scheduling

app.use("/api/v1", require("./routes/customEvent"));
app.use("/api/v1", require("./routes/PrivateScheduling/houseBlessing"));

// Resources
app.use("/api/v1", require("./routes/Resources/resourceCategory"));
app.use("/api/v1", require("./routes/Resources/resource"));

app.use("/api/v1", require("./routes/Members/memberYearBatchCategory"));
app.use("/api/v1", require("./routes/Members/members"));

app.use("/api/v1", require("./routes/liveVideo"))



// Resources
// app.use("/api/v1", require("./routes/Resource/resourceCategory"));
// app.use("/api/v1", require("./routes/Resource/resource"));

// app.use("/api/v1/resourceCategory", require("./routes/Resources/resourceCategory"));
// app.use("/api/v1/resource", require("./routes/Resources/resource"));

// Chat Feature


module.exports = { app, server, io };
// module.exports = app;
