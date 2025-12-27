const mongoose = require("mongoose");

const mealSchema = new mongoose.Schema(
  {
    childId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Child",
      required: false
    },
    date: {
      type: Date,
      required: true
    },
    mealType: {
      type: String,
      required: true
    },
    menu: {
      type: String,
      required: true
    },
    description: {
      type: String
    },
    allergens: {
      type: [String],
      default: []
    }
  },
  {
    timestamps: true
  }
);

const Meal = mongoose.model("Meal", mealSchema);

module.exports = Meal;
