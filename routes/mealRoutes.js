const express = require("express");
const router = express.Router();
const mealController = require("../controllers/mealController");

router.post("/add", mealController.addMeal);
router.get("/all", mealController.getAllMeals);
router.get("/:childId", mealController.getMealsByChild);
router.put("/:id", mealController.updateMeal);
router.delete("/:id", mealController.deleteMeal);

module.exports = router;
