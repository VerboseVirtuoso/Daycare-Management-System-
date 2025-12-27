const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema(
  {
    childId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Child",
      required: true
    },
    caregiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    food: {
      type: String
    },
    nap: {
      type: String
    },
    activities: {
      type: String
    },
    healthNotes: {
      type: String
    },
    reportDate: {
      type: Date,
      required: true
    }
  },
  {
    timestamps: true
  }
);

const Report = mongoose.model("Report", reportSchema);

module.exports = Report;
