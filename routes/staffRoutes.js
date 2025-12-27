const express = require('express');
const router = express.Router();
const { addStaff, getStaff, updateStaff, deleteStaff } = require('../controllers/staffController');

router.post('/add', addStaff);
router.get('/', getStaff);
router.put('/:id', updateStaff);
router.delete('/:id', deleteStaff);

module.exports = router;
