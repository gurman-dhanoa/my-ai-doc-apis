const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Doctor name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  specialty: {
    type: String,
    required: [true, 'Specialty is required'],
    trim: true,
    maxlength: [100, 'Specialty cannot exceed 100 characters']
  },
  experience: {
    type: String,
    required: [true, 'Experience is required'],
    trim: true
  },
  rating: {
    type: Number,
    required: [true, 'Rating is required'],
    min: [0, 'Rating cannot be less than 0'],
    max: [5, 'Rating cannot exceed 5'],
    default: 0
  },
  consultations: {
    type: String,
    required: [true, 'Consultations count is required'],
    trim: true
  },
  responseTime: {
    type: String,
    required: [true, 'Response time is required'],
    trim: true
  },
  status: {
    type: String,
    enum: {
      values: ['online', 'offline', 'busy', 'away'],
      message: 'Status must be online, offline, busy, or away'
    },
    default: 'online'
  },
  avatar: {
    type: String,
    required: [true, 'Avatar URL is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  expertise: [{
    type: String,
    trim: true
  }],
  education: [{
    degree: String,
    university: String,
    year: Number
  }],
  languages: [{
    type: String,
    trim: true
  }],
  availability: {
    timezone: {
      type: String,
      default: 'UTC'
    },
    workingHours: {
      start: String, // Format: "09:00"
      end: String    // Format: "17:00"
    },
    workingDays: [{
      type: String,
      enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
    }]
  },
  consultationFee: {
    type: Number,
    required: [true, 'Consultation fee is required'],
    min: [0, 'Fee cannot be negative']
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  featured: {
    type: Boolean,
    default: false
  },
  metadata: {
    views: {
      type: Number,
      default: 0
    },
    likes: {
      type: Number,
      default: 0
    },
    successRate: {
      type: Number,
      min: 0,
      max: 100,
      default: 0
    }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for formatted experience in years
doctorSchema.virtual('experienceYears').get(function() {
  const match = this.experience.match(/(\d+)/);
  return match ? parseInt(match[1]) : 0;
});

// Virtual for consultation count as number
doctorSchema.virtual('consultationCount').get(function() {
  const match = this.consultations.match(/(\d+\.?\d*)/);
  return match ? parseFloat(match[1]) * 1000 : 0;
});

// Indexes for better query performance
doctorSchema.index({ specialty: 1, rating: -1 });
doctorSchema.index({ status: 1, isActive: 1 });
doctorSchema.index({ 'expertise': 1 });
doctorSchema.index({ featured: 1, rating: -1 });
doctorSchema.index({ name: 'text', specialty: 'text', description: 'text' });

// Static method to find online doctors
doctorSchema.statics.findOnline = function() {
  return this.find({ status: 'online', isActive: true });
};

// Static method to find by specialty
doctorSchema.statics.findBySpecialty = function(specialty) {
  return this.find({ 
    specialty: new RegExp(specialty, 'i'), 
    isActive: true 
  }).sort({ rating: -1 });
};

// Static method to find featured doctors
doctorSchema.statics.findFeatured = function() {
  return this.find({ 
    featured: true, 
    isActive: true 
  }).sort({ rating: -1 }).limit(10);
};

// Instance method to update rating
doctorSchema.methods.updateRating = async function(newRating) {
  // In a real scenario, you might want to calculate average from all ratings
  this.rating = newRating;
  return this.save();
};

// Instance method to increment consultations
doctorSchema.methods.incrementConsultations = async function() {
  const currentCount = this.consultationCount;
  const newCount = currentCount + 1;
  
  if (newCount >= 1000) {
    this.consultations = `${(newCount / 1000).toFixed(1)}k+`;
  } else {
    this.consultations = `${newCount}+`;
  }
  
  return this.save();
};

// Middleware to validate avatar URL
doctorSchema.pre('save', function(next) {
  if (this.avatar && !this.avatar.startsWith('http')) {
    next(new Error('Avatar must be a valid URL'));
  }
  next();
});

module.exports = mongoose.model('Doctor', doctorSchema);