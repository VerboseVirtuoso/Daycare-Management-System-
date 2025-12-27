const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema(
  {
    childId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Child",
      required: true
    },
    date: {
      type: Date,
      required: true
    },
    checkInTime: {
      type: Date
    },
    checkOutTime: {
      type: Date
    },
    status: {
      type: String,
      enum: ["Present", "Absent", "Late", "Excused"],
      required: true
    }
  },
  {
    timestamps: true
  }
);

const Attendance = mongoose.model("Attendance", attendanceSchema);

module.exports = Attendance;

