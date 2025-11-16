const express = require('express');
const { fetchAllUsers } = require('../controllers/userController');

const router = express.Router();

// Protected routes
router.get('/', fetchAllUsers);

module.exports = router;