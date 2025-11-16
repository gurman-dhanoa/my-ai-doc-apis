const express = require('express');
const { 
  getAllDoctors,
  getDoctorById 
} = require('../controllers/doctorController');

const router = express.Router();

// GET /api/doctors - Get all doctors
router.get('/', getAllDoctors);

// GET /api/doctors/:id - Get single doctor by ID
router.get('/:id', getDoctorById);

module.exports = router;