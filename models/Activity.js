const mongoose = require("mongoose");

const activitySchema = new mongoose.Schema(
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
    activityType: {
      type: String,
      required: true
    },
    title: {
      type: String
    },
    description: {
      type: String,
      required: true
    },
    duration: {
      type: Number,
      default: 30
    },
    notes: {
      type: String
    }
  },
  {
    timestamps: true
  }
);

const Activity = mongoose.model("Activity", activitySchema);

module.exports = Activity;
