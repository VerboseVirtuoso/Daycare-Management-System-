const mongoose = require("mongoose");

const childSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    age: {
      type: Number,
      required: true
    },
    gender: {
      type: String,
      enum: ["male", "female", "other"],
      required: true
    },
    parentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    caregiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    medicalNotes: {
      type: String,
      default: ""
    },
    admissionDate: {
      type: Date,
      required: true
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active"
    }
  },
  {
    timestamps: true
  }
);

const Child = mongoose.model("Child", childSchema);

module.exports = Child;