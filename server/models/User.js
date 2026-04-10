const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['student', 'recruiter'],
    default: 'student'
  },
  companyName: {
    type: String,
    default: ''
  },
  companyWebsite: {
    type: String,
    default: ''
  },
  companyLocation: {
    type: String,
    default: ''
  },
  industry: {
    type: String,
    default: ''
  },
  companySize: {
    type: String,
    default: ''
  },
  companyDescription: {
    type: String,
    default: ''
  },
  // Legacy fields (kept for backward compatibility)
  education: {
    type: String,
    default: ''
  },
  experience: {
    type: String,
    default: 'Beginner'
  },
  favoriteSubjects: {
    type: [String],
    default: []
  },
  strengths: {
    type: [String],
    default: []
  },
  
  // Onboarding fields
  isProfileComplete: {
    type: Boolean,
    default: false
  },
  companyProfileCompleted: {
    type: Boolean,
    default: false
  },
  level: {
    type: String,
    enum: ['2nd Year', '3rd Year', 'Final Year', 'PG', ''],
    default: ''
  },
  branch: {
    type: String,
    default: ''
  },
  cgpa: {
    type: String,
    default: ''
  },
  skills: {
    type: [String],
    default: []
  },
  interests: {
    type: [String],
    default: []
  },
  projects: {
    hasProjects: {
      type: Boolean,
      default: false
    },
    types: {
      type: [String],
      default: []
    },
    count: {
      type: String,
      default: ''
    }
  },
  resumeUrl: {
    type: String,
    default: ''
  },
  assessments: {
    type: Map,
    of: {
      level1: { 
        score: Number, 
        status: { type: String, enum: ['passed', 'failed', 'pending'], default: 'pending' },
        completedAt: Date
      },
      level2: { 
        repoLink: String, 
        aiScore: Number,
        status: { type: String, enum: ['passed', 'failed', 'pending', 'completed'], default: 'pending' },
        feedback: String,
        completedAt: Date
      },
      finalStatus: { type: String, enum: ['verified', 'pending'], default: 'pending' }
    },
    default: {}
  },
  screeningTasks: [
    {
      skill: String,
      task: Object
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
