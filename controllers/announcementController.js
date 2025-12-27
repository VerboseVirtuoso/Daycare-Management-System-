const Announcement = require('../models/Announcement');

// Add a new announcement
const addAnnouncement = async (req, res) => {
  try {
    const { title, message, date } = req.body;
    if (!title || !message || !date) {
      return res.status(400).json({ error: 'Title, message, and date are required.' });
    }

    const announcement = new Announcement({
      title,
      message,
      date
    });

    await announcement.save();

    res.status(201).json(announcement);
  } catch (error) {
    res.status(500).json({ error: error.message || 'Failed to add announcement.' });
  }
};

// Get all announcements (sorted by newest first)
const getAnnouncements = async (req, res) => {
  try {
    const announcements = await Announcement.find().sort({ date: -1 });
    res.status(200).json(announcements);
  } catch (error) {
    res.status(500).json({ error: error.message || 'Failed to fetch announcements.' });
  }
};

module.exports = { addAnnouncement, getAnnouncements };
