const Meal = require("../models/Meal");

const mealController = {
  async addMeal(req, res) {
    try {
      const { childId, date, mealType, menu, description, allergens } = req.body;
      const meal = new Meal({
        childId,
        date,
        mealType,
        menu: menu || description,
        description,
        allergens
      });
      const savedMeal = await meal.save();
      return res.status(201).json({ success: true, data: savedMeal });
    } catch (err) {
      return res.status(500).json({ success: false, message: "Failed to add meal.", error: err.message });
    }
  },

  async updateMeal(req, res) {
    try {
      const { id } = req.params;
      const updatedMeal = await Meal.findByIdAndUpdate(id, req.body, { new: true });
      if (!updatedMeal) {
        return res.status(404).json({ success: false, message: "Meal not found." });
      }
      return res.status(200).json({ success: true, data: updatedMeal });
    } catch (err) {
      return res.status(500).json({ success: false, message: "Failed to update meal.", error: err.message });
    }
  },

  async deleteMeal(req, res) {
    try {
      const { id } = req.params;
      const deletedMeal = await Meal.findByIdAndDelete(id);
      if (!deletedMeal) {
        return res.status(404).json({ success: false, message: "Meal not found." });
      }
      return res.status(200).json({ success: true, message: "Meal deleted." });
    } catch (err) {
      return res.status(500).json({ success: false, message: "Failed to delete meal.", error: err.message });
    }
  },

  async getMealsByChild(req, res) {
    try {
      const { childId } = req.params;
      const meals = await Meal.find({ childId }).sort({ date: -1 });
      return res.status(200).json({ success: true, data: meals });
    } catch (err) {
      return res.status(500).json({ success: false, message: "Failed to retrieve meals.", error: err.message });
    }
  },

  async getAllMeals(req, res) {
    try {
      const meals = await Meal.find().sort({ date: -1 });
      return res.status(200).json({ success: true, data: meals });
    } catch (err) {
      return res.status(500).json({ success: false, message: "Failed to retrieve all meals.", error: err.message });
    }
  }
};

module.exports = mealController;
