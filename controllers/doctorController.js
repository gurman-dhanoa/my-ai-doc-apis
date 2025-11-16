const Doctor = require('../models/doctor');
const ApiResponse = require('../utils/ApiResponse');

// @desc    Get all doctors with all information
// @route   GET /api/doctors
// @access  Public
const getAllDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find({ isActive: true })
      .sort({ rating: -1, createdAt: -1 });

    return res.status(200).json(
      new ApiResponse(200, doctors, "Doctors fetched successfully")
    );
  } catch (error) {
    console.error('Get doctors error:', error);
    return res.status(500).json(
      new ApiResponse(500, null, "Server error while fetching doctors")
    );
  }
};

// @desc    Get single doctor by ID
// @route   GET /api/doctors/:id
// @access  Public
const getDoctorById = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);

    if (!doctor) {
      return res.status(404).json(
        new ApiResponse(404, null, "Doctor not found")
      );
    }

    if (!doctor.isActive) {
      return res.status(404).json(
        new ApiResponse(404, null, "Doctor profile is not available")
      );
    }

    // Increment views
    doctor.metadata.views += 1;
    await doctor.save();

    return res.status(200).json(
      new ApiResponse(200, doctor, "Doctor details fetched successfully")
    );

  } catch (error) {
    console.error('Get doctor by ID error:', error);
    
    if (error.kind === 'ObjectId') {
      return res.status(400).json(
        new ApiResponse(400, null, "Invalid doctor ID format")
      );
    }

    return res.status(500).json(
      new ApiResponse(500, null, "Server error while fetching doctor details")
    );
  }
};

module.exports = {
  getAllDoctors,
  getDoctorById
};