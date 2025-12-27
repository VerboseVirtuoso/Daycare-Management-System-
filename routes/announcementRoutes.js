const express = require('express');
const router = express.Router();

const { addAnnouncement, getAnnouncements } = require('../controllers/announcementController');

// POST /api/announcements/add - Add a new announcement
router.post('/add', addAnnouncement);

// GET /api/announcements/ - Get all announcements
router.get('/', getAnnouncements);

module.exports = router;
