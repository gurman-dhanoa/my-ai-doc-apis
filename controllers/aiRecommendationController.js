const Doctor = require('../models/doctor');
const ApiResponse = require('../utils/ApiResponse');

// @desc    Get AI-based doctor recommendations
// @route   POST /api/ai-recommendations
// @access  Public
const getAIRecommendations = async (req, res) => {
  try {
    const { symptoms, duration, severity, medicalHistory, age, gender } = req.body;

    if (!symptoms) {
      return res.status(400).json(
        new ApiResponse(400, null, "Symptoms description is required")
      );
    }

    // Simple AI matching logic - you can enhance this with more sophisticated algorithms
    const recommendedDoctors = await findMatchingDoctors({
      symptoms: symptoms.toLowerCase(),
      severity,
      duration
    });

    return res.status(200).json(
      new ApiResponse(200, recommendedDoctors, "Recommendations generated successfully")
    );

  } catch (error) {
    console.error('AI recommendation error:', error);
    return res.status(500).json(
      new ApiResponse(500, null, "Server error while generating recommendations")
    );
  }
};

// AI matching algorithm
const findMatchingDoctors = async (userInput) => {
  const { symptoms, severity, duration } = userInput;
  
  // Get all active doctors
  const allDoctors = await Doctor.find({ isActive: true }).sort({ rating: -1 });
  
  // Define symptom to specialty mapping
  const symptomSpecialtyMap = {
    // Cardiology symptoms
    'chest pain': 'cardiology',
    'heart': 'cardiology',
    'blood pressure': 'cardiology',
    'cholesterol': 'cardiology',
    'palpitations': 'cardiology',
    
    // Neurology symptoms
    'headache': 'neurology',
    'migraine': 'neurology',
    'stroke': 'neurology',
    'seizure': 'neurology',
    'dizziness': 'neurology',
    'memory': 'neurology',
    
    // Dermatology symptoms
    'skin': 'dermatology',
    'rash': 'dermatology',
    'acne': 'dermatology',
    'eczema': 'dermatology',
    'psoriasis': 'dermatology',
    
    // Pediatrics symptoms
    'child': 'pediatrics',
    'baby': 'pediatrics',
    'kids': 'pediatrics',
    'vaccine': 'pediatrics',
    'development': 'pediatrics',
    
    // Oncology symptoms
    'cancer': 'oncology',
    'tumor': 'oncology',
    'chemotherapy': 'oncology',
    
    // Orthopedics symptoms
    'bone': 'orthopedics',
    'joint': 'orthopedics',
    'fracture': 'orthopedics',
    'arthritis': 'orthopedics',
    'back pain': 'orthopedics'
  };

  // Calculate match score for each doctor
  const doctorsWithScores = allDoctors.map(doctor => {
    let score = 0;
    
    // Specialty matching based on symptoms
    for (const [symptomKeyword, specialty] of Object.entries(symptomSpecialtyMap)) {
      if (symptoms.includes(symptomKeyword) && 
          doctor.specialty.toLowerCase().includes(specialty)) {
        score += 3;
      }
    }
    
    // Expertise matching
    doctor.expertise?.forEach(skill => {
      if (symptoms.toLowerCase().includes(skill.toLowerCase())) {
        score += 2;
      }
    });
    
    // Rating bonus
    score += (doctor.rating - 4) * 0.5; // Bonus for higher ratings
    
    // Experience bonus for severe conditions
    if (severity === 'severe' || severity === 'emergency') {
      const experienceYears = parseInt(doctor.experience) || 0;
      score += experienceYears * 0.1;
    }
    
    return { ...doctor.toObject(), matchScore: score };
  });

  // Filter and sort by match score
  const matchedDoctors = doctorsWithScores
    .filter(doctor => doctor.matchScore > 0)
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, 5) // Return top 5 matches
    .map(doctor => {
      // Remove matchScore from final response
      const { matchScore, ...doctorData } = doctor;
      return doctorData;
    });

  // If no specific matches, return top-rated doctors
  if (matchedDoctors.length === 0) {
    return allDoctors.slice(0, 3);
  }

  return matchedDoctors;
};

module.exports = {
  getAIRecommendations
};