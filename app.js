const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());


app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.get("/", (req, res) => {
  res.send("Backend API running");
});

module.exports = app;
const authRoutes = require("./routes/authRoutes");
app.use("/api/auth", authRoutes);
const childRoutes = require("./routes/childRoutes");
app.use("/api/children", childRoutes);
const attendanceRoutes = require("./routes/attendanceRoutes");
app.use("/api/attendance", attendanceRoutes);
const reportRoutes = require("./routes/reportRoutes");
app.use("/api/reports", reportRoutes);
const mealRoutes = require("./routes/mealRoutes");
app.use("/api/meals", mealRoutes);
const activityRoutes = require("./routes/activityRoutes");
app.use("/api/activities", activityRoutes);
const staffRoutes = require("./routes/staffRoutes");
app.use("/api/staff", staffRoutes);
const announcementRoutes = require("./routes/announcementRoutes");
app.use("/api/announcements", announcementRoutes);