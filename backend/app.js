const express = require("express");
const app = express();
const cors = require("cors");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const errorHandler = require("./helpers/error-handler");

// Load environment variables
require("dotenv/config");

// Enable CORS for both Web & Mobile
app.use(
  cors({  
    origin: ["http://localhost:3000"],
    credentials: true,
  })
);
app.options("*", cors());

// Middleware
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(cookieParser());
app.use(morgan("tiny"));
app.use(errorHandler);
app.use("/public/uploads", express.static(__dirname + "/public/uploads"));

// === ROUTES ===
// User & Authentication
app.use("/api/v1", require("./routes/user"));
app.use("/api/v1/chat", require("./routes/chat"));
// Prayer Wall
app.use("/api/v1/", require("./routes/PrayerWall/prayerWall"));
app.use("/api/v1", require("./routes/PrayerWall/prayerRequest"));

// Ministry & Members
app.use("/api/v1/ministryCategory", require("./routes/ministryCategory"));

// Announcements & Posts
app.use("/api/v1", require("./routes/Announcement/announcement"));
app.use("/api/v1", require("./routes/Announcement/announcementCategory"));

// Sacramental Services
app.use("/api/v1", require("./routes/wedding"));
app.use("/api/v1", require("./routes/Binyag"));
app.use("/api/v1", require("./routes/Funeral"));
app.use("/api/v1", require("./routes/counseling"));



app.use("/api/v1", require("./routes/Announcement/AnnouncementComment"));

app.use("/api/v1", require("./routes/post"));


// Events & Scheduling
app.use("/api/v1", require("./routes/adminDate"));
app.use("/api/v1", require("./routes/customEvent"));
app.use("/api/v1", require("./routes/PrivateScheduling/houseBlessing"));

// Resources
app.use("/api/v1", require("./routes/Resources/resourceCategory"));
app.use("/api/v1", require("./routes/Resources/resource"));



app.use("/api/v1", require("./routes/Members/memberYearBatchCategory"));
app.use("/api/v1", require("./routes/Members/members"));


// Resources
// app.use("/api/v1", require("./routes/Resource/resourceCategory"));
// app.use("/api/v1", require("./routes/Resource/resource"));

// app.use("/api/v1/resourceCategory", require("./routes/Resources/resourceCategory"));
// app.use("/api/v1/resource", require("./routes/Resources/resource"));

// Chat Feature








module.exports = app;
