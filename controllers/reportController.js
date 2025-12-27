const Report = require('../models/Report');

// Controller to add a daily report
const addReport = async (req, res) => {
  try {
    const {
      childId,
      caregiverId,
      food,
      nap,
      activities,
      healthNotes,
      reportDate
    } = req.body;

    // Basic validation
    if (!childId || !caregiverId || !reportDate) {
      return res.status(400).json({ message: 'childId, caregiverId, and reportDate are required.' });
    }

    // Optionally: prevent duplicate reports for same child and date
    const dateOnly = new Date(reportDate);
    dateOnly.setHours(0, 0, 0, 0);

    const existingReport = await Report.findOne({
      childId,
      reportDate: { $gte: dateOnly, $lt: new Date(dateOnly.getTime() + 24 * 60 * 60 * 1000) }
    });

    if (existingReport) {
      return res.status(409).json({ message: 'A report for this child and date already exists.' });
    }

    const newReport = new Report({
      childId,
      caregiverId,
      food,
      nap,
      activities,
      healthNotes,
      reportDate: dateOnly
    });

    await newReport.save();

    res.status(201).json({ report: newReport });
  } catch (error) {
    res.status(500).json({ message: 'Server error. Could not add report.', error: error.message });
  }
};

// Controller to get reports by childId
const getReportsByChild = async (req, res) => {
  try {
    const { childId } = req.params;

    if (!childId) {
      return res.status(400).json({ message: 'childId parameter is required.' });
    }

    const reports = await Report.find({ childId }).sort({ reportDate: -1 });

    res.status(200).json({ reports });
  } catch (error) {
    res.status(500).json({ message: 'Server error. Could not fetch reports.', error: error.message });
  }
};

module.exports = {
  addReport,
  getReportsByChild
};
