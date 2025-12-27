const express = require("express");
const router = express.Router();
const activityController = require("../controllers/activityController");

router.post("/add", activityController.addActivity);
router.get("/all", activityController.getAllActivities);
router.get("/:childId", activityController.getActivitiesByChild);
router.put("/:id", activityController.updateActivity);
router.delete("/:id", activityController.deleteActivity);

module.exports = router;
