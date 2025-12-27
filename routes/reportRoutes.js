const express = require("express");
const router = express.Router();

const {
  addReport,
  getReportsByChild
} = require("../controllers/reportController");

// POST /api/reports - add a new daily report
router.post("/", addReport);

// GET /api/reports/:childId - get all reports for a specific child
router.get("/:childId", getReportsByChild);

module.exports = router;
