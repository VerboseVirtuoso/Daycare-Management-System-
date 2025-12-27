const express = require("express");
const router = express.Router();

const {
  markAttendance,
  getAttendanceByChild
} = require("../controllers/attendanceController");

// POST /api/attendance - mark attendance (expects childId, date, checkInTime, checkOutTime, status in body)
router.post("/", markAttendance);

// GET /api/attendance/:childId - get attendance records for specific child
router.get("/:childId", getAttendanceByChild);

module.exports = router;
