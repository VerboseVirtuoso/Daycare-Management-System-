const Activity = require("../models/Activity");

const activityController = {
  async addActivity(req, res) {
    try {
      const { childId, date, activityType, title, description, duration, notes } = req.body;
      const activity = new Activity({
        childId,
        date,
        activityType: activityType || title,
        title: title || activityType,
        description,
        duration,
        notes
      });
      const savedActivity = await activity.save();
      return res.status(201).json({ success: true, data: savedActivity });
    } catch (err) {
      return res
        .status(500)
        .json({ success: false, message: "Failed to add activity.", error: err.message });
    }
  },

  async updateActivity(req, res) {
    try {
      const { id } = req.params;
      const updatedActivity = await Activity.findByIdAndUpdate(id, req.body, { new: true });
      if (!updatedActivity) {
        return res.status(404).json({ success: false, message: "Activity not found." });
      }
      return res.status(200).json({ success: true, data: updatedActivity });
    } catch (err) {
      return res
        .status(500)
        .json({ success: false, message: "Failed to update activity.", error: err.message });
    }
  },

  async deleteActivity(req, res) {
    try {
      const { id } = req.params;
      const deletedActivity = await Activity.findByIdAndDelete(id);
      if (!deletedActivity) {
        return res.status(404).json({ success: false, message: "Activity not found." });
      }
      return res.status(200).json({ success: true, message: "Activity deleted." });
    } catch (err) {
      return res
        .status(500)
        .json({ success: false, message: "Failed to delete activity.", error: err.message });
    }
  },

  async getActivitiesByChild(req, res) {
    try {
      const { childId } = req.params;
      const activities = await Activity.find({ childId }).sort({ date: -1 });
      return res.status(200).json({ success: true, data: activities });
    } catch (err) {
      return res
        .status(500)
        .json({ success: false, message: "Failed to retrieve activities.", error: err.message });
    }
  },

  async getAllActivities(req, res) {
    try {
      const activities = await Activity.find().sort({ date: -1 });
      return res.status(200).json({ success: true, data: activities });
    } catch (err) {
      return res
        .status(500)
        .json({ success: false, message: "Failed to retrieve all activities.", error: err.message });
    }
  }
};

module.exports = activityController;
