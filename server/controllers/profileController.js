const User = require('../models/User');
const path = require('path');
const fs = require('fs');

const getProfile = async (req, res) => {
  try {
    console.log('=== Get Profile Request ===');
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    // Self-healing or parsing
    if (typeof user.skills === 'string') {
      try { user.skills = JSON.parse(user.skills); } catch (e) { user.skills = []; }
    }
    if (typeof user.interests === 'string') {
      try { user.interests = JSON.parse(user.interests); } catch (e) { user.interests = []; }
    }
    user.skills = Array.isArray(user.skills) ? user.skills : [];
    user.interests = Array.isArray(user.interests) ? user.interests : [];
    
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const updateProfile = async (req, res) => {
  try {
    console.log('=== Profile Update Request ===');
    console.log('BODY:', req.body);
    console.log('FILE:', req.file);
    
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Helper for safe JSON parsing fallback to empty array
    const safeParse = (data) => {
      if (!data) return [];
      if (Array.isArray(data)) return data;
      try {
        const parsed = JSON.parse(data);
        return Array.isArray(parsed) ? parsed : [];
      } catch (e) {
        console.error('JSON Parse Error:', e.message);
        return [];
      }
    };

    // Correctly parse array fields from multipart strings
    const skillsParsed = req.body.skills ? safeParse(req.body.skills) : user.skills;
    const interestsParsed = req.body.interests ? safeParse(req.body.interests) : user.interests;

    // Handle resume file if uploaded
    if (req.file) {
      user.resumeUrl = `/uploads/resumes/${req.file.filename}`;
      console.log('New resume stored:', user.resumeUrl);
    } else if (req.body.resumeUrl !== undefined) {
      // Preserve existing if not provided, or update if provided as string
      user.resumeUrl = req.body.resumeUrl;
    }

    // Update defined string fields
    const fields = ['name', 'education', 'experience', 'level', 'branch', 'cgpa'];
    fields.forEach(field => {
      if (req.body[field] !== undefined) {
        user[field] = req.body[field];
      }
    });

    // Handle boolean conversion from string (standard for FormData)
    if (req.body.isProfileComplete !== undefined) {
      user.isProfileComplete = req.body.isProfileComplete === 'true' || req.body.isProfileComplete === true;
    }

    user.skills = skillsParsed;
    user.interests = interestsParsed;

    console.log('Finalizing profile update for User:', user._id);
    await user.save();
    
    const userToReturn = user.toObject();
    delete userToReturn.password;

    console.log('Update successful');
    res.json(userToReturn);
  } catch (error) {
    console.error('=== Profile Update Error ===');
    console.error('Error Message:', error.message);
    res.status(500).json({ 
      message: 'Profile update failed', 
      error: error.message 
    });
  }
};

const completeOnboarding = async (req, res) => {
  try {
    console.log('=== Complete Onboarding Request ===');
    const { level, branch, cgpa, skills, interests, projects } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const safeParse = (data) => {
      if (!data) return [];
      if (Array.isArray(data)) return data;
      try { return JSON.parse(data); } catch (e) { return []; }
    };

    if (req.file) {
      user.resumeUrl = `/uploads/resumes/${req.file.filename}`;
    }

    user.level = level || user.level;
    user.branch = branch || user.branch;
    user.cgpa = cgpa || user.cgpa;
    user.skills = safeParse(skills);
    user.interests = safeParse(interests);
    
    if (projects) {
      try {
        user.projects = typeof projects === 'string' ? JSON.parse(projects) : projects;
      } catch (e) {
        console.error('Projects parse error');
      }
    }

    user.isProfileComplete = true;
    await user.save();

    const result = user.toObject();
    delete result.password;
    res.json({ message: 'Onboarding completed', user: result });
  } catch (error) {
    res.status(500).json({ message: 'Onboarding failed', error: error.message });
  }
};

module.exports = { getProfile, updateProfile, completeOnboarding };
