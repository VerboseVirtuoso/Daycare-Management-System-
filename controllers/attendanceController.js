const Attendance = require("../models/Attendance");

// Controller to mark attendance for a child
const markAttendance = async (req, res) => {
  try {
    const { childId, date, checkInTime, checkOutTime, status } = req.body;

    // Basic validation
    if (!childId || !date || !status) {
      return res.status(400).json({ message: "childId, date, and status are required." });
    }

    // Upsert: update if record for childId+date exists, otherwise create new
    const attendance = await Attendance.findOneAndUpdate(
      { childId, date: new Date(date).setHours(0,0,0,0) },
      {
        $set: {
          checkInTime,
          checkOutTime,
          status
        }
      },
      {
        new: true,
        upsert: true,
        setDefaultsOnInsert: true
      }
    );

    res.status(200).json({ attendance });
  } catch (error) {
    res.status(500).json({ message: "Server error. Could not mark attendance.", error: error.message });
  }
};

// Controller to get attendance records for a specific child
const getAttendanceByChild = async (req, res) => {
  try {
    const { childId } = req.params;

    if (!childId) {
      return res.status(400).json({ message: "childId parameter is required." });
    }

    const attendanceRecords = await Attendance.find({ childId }).sort({ date: -1 });

    res.status(200).json({ records: attendanceRecords });
  } catch (error) {
    res.status(500).json({ message: "Server error. Could not fetch attendance records.", error: error.message });
  }
};

module.exports = {
  markAttendance,
  getAttendanceByChild
};
