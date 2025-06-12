const express = require("express");
const app = express();
const cors = require("cors");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const errorHandler = require("./helpers/error-handler");
const http = require("http");
const { Server } = require("socket.io");

const allowedOrigins = [
  "*",
  // "https://eparokya.vercel.app",
  "http://localhost:3000",
];

// Middleware
app.use(cors({
  origin: allowedOrigins,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

app.use(express.json());
app.use(cookieParser());
app.use(morgan("tiny"));
app.use("/public/uploads", express.static(__dirname + "/public/uploads"));
app.use("/api/v1", require("./routes/user"));
app.use(errorHandler);

// Create HTTP server and export
const server = http.createServer(app);

// Create Socket.IO server
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST",],
    credentials: true,
  }
});



app.use("/api/v1", require("./routes/user"));
app.use("/api/v1/chat", require("./routes/chat"));
app.use("/api/v1", require("./routes/Resources/resource"));
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
app.use("/api/v1", require("./routes/Announcement/ministryAnnouncement"));
app.use("/api/v1", require("./routes/Announcement/AnnouncementComment"));


// may conflict sa counseling kaya inangat muna

app.use("/api/v1", require("./routes/Inventory"));
app.use("/api/v1", require("./routes/adminDate"));

// Priest
app.use("/api/v1", require("./routes/Priest/priest"));
// Readings
app.use("/api/v1", require("./routes/readings"));


// Sacramental Services
app.use("/api/v1", require("./routes/wedding"));
app.use("/api/v1", require("./routes/Binyag"));
app.use("/api/v1", require("./routes/Funeral"));
app.use("/api/v1", require("./routes/counseling"));


// MassForms
app.use("/api/v1", require("./routes/MassForms/massBaptism"));
app.use("/api/v1", require("./routes/MassForms/massWedding"));

// app.use("/api/v1", require("./routes/Announcement/AnnouncementComment"));
// app.use("/api/v1", require("./routes/Announcement/ministryAnnouncement"));

// Events & Scheduling

app.use("/api/v1", require("./routes/customEvent"));
app.use("/api/v1", require("./routes/PrivateScheduling/houseBlessing"));

// Resources
app.use("/api/v1", require("./routes/Resources/resourceCategory"));


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
