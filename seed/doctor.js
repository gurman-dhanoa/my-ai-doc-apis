const mongoose = require('mongoose');
const Doctor = require('../models/doctor');
const connectDB = require('../db');

const sampleDoctors = [
  {
    name: "Dr. Sophia Chen",
    specialty: "Cardiology AI Specialist",
    experience: "8 years",
    rating: 4.9,
    consultations: "2.4k+",
    responseTime: "< 2 min",
    status: "online",
    avatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2",
    description: "Specialized in heart-related conditions and cardiovascular health monitoring",
    expertise: ["Heart Disease", "Blood Pressure", "Cholesterol"],
    education: [
      {
        degree: "MD Cardiology",
        university: "Harvard Medical School",
        year: 2015
      }
    ],
    languages: ["English", "Mandarin"],
    consultationFee: 79.99,
    isVerified: true,
    featured: true,
    availability: {
      timezone: "EST",
      workingHours: {
        start: "09:00",
        end: "17:00"
      },
      workingDays: ["monday", "tuesday", "wednesday", "thursday", "friday"]
    }
  },
  {
    name: "Dr. Marcus Johnson",
    specialty: "Neurology AI Expert",
    experience: "12 years",
    rating: 4.8,
    consultations: "3.1k+",
    responseTime: "< 1 min",
    status: "online",
    avatar: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d",
    description: "Expert in neurological disorders and brain health assessment",
    expertise: ["Migraines", "Stroke", "Epilepsy"],
    education: [
      {
        degree: "MD Neurology",
        university: "Johns Hopkins University",
        year: 2011
      }
    ],
    languages: ["English", "Spanish"],
    consultationFee: 89.99,
    isVerified: true,
    featured: true,
    availability: {
      timezone: "PST",
      workingHours: {
        start: "08:00",
        end: "16:00"
      },
      workingDays: ["monday", "tuesday", "wednesday", "thursday", "friday"]
    }
  },
  {
    name: "Dr. Elena Rodriguez",
    specialty: "Pediatrics AI Consultant",
    experience: "6 years",
    rating: 4.9,
    consultations: "1.8k+",
    responseTime: "< 3 min",
    status: "busy",
    avatar: "https://images.unsplash.com/photo-1594824947933-d0501ba2fe65",
    description: "Dedicated to children's health and developmental monitoring",
    expertise: ["Child Development", "Vaccinations", "Common Illnesses"],
    education: [
      {
        degree: "MD Pediatrics",
        university: "Stanford University",
        year: 2017
      }
    ],
    languages: ["English", "Spanish", "French"],
    consultationFee: 69.99,
    isVerified: true,
    featured: false,
    availability: {
      timezone: "CST",
      workingHours: {
        start: "10:00",
        end: "18:00"
      },
      workingDays: ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday"]
    }
  },
  {
    name: "Dr. James Wilson",
    specialty: "Dermatology AI Specialist",
    experience: "10 years",
    rating: 4.7,
    consultations: "2.7k+",
    responseTime: "< 2 min",
    status: "online",
    avatar: "https://images.unsplash.com/photo-1582750433449-648ed127bb54",
    description: "Skin condition analysis and treatment recommendations",
    expertise: ["Acne", "Eczema", "Skin Cancer"],
    education: [
      {
        degree: "MD Dermatology",
        university: "Mayo Medical School",
        year: 2013
      }
    ],
    languages: ["English"],
    consultationFee: 74.99,
    isVerified: true,
    featured: true,
    availability: {
      timezone: "EST",
      workingHours: {
        start: "08:30",
        end: "16:30"
      },
      workingDays: ["monday", "tuesday", "wednesday", "thursday", "friday"]
    }
  },
  {
    name: "Dr. Sarah Thompson",
    specialty: "Oncology AI Specialist",
    experience: "9 years",
    rating: 4.9,
    consultations: "2.1k+",
    responseTime: "< 3 min",
    status: "online",
    avatar: "https://images.unsplash.com/photo-1551601651-2a8555f1a136",
    description: "Cancer diagnosis and treatment planning specialist",
    expertise: ["Cancer Screening", "Treatment Plans", "Follow-up Care"],
    education: [
      {
        degree: "MD Oncology",
        university: "MD Anderson Cancer Center",
        year: 2014
      }
    ],
    languages: ["English", "German"],
    consultationFee: 99.99,
    isVerified: true,
    featured: true,
    availability: {
      timezone: "CST",
      workingHours: {
        start: "07:00",
        end: "15:00"
      },
      workingDays: ["monday", "tuesday", "wednesday", "thursday", "friday"]
    }
  }
];

async function seedDatabase() {
  try {
    await connectDB();
    console.log('Connected to MongoDB');

    // Clear existing doctors
    await Doctor.deleteMany({});
    console.log('Cleared existing doctors');

    // Insert sample doctors
    const doctors = await Doctor.insertMany(sampleDoctors);
    console.log(`Inserted ${doctors.length} doctors`);

    console.log('Database seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();