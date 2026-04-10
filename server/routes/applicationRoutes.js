const express = require('express');
const router = express.Router();
const { 
  applyToJob, 
  getApplicationStatus,
  getStudentApplications,
  getRecruiterApplications, 
  updateApplicationStatus 
} = require('../controllers/applicationController');
const auth = require('../middleware/auth');

// @route   POST api/applications/apply/:jobId
// @desc    Apply for a job (Student only)
// @access  Private
router.post('/apply/:jobId', auth, applyToJob);

// @route   GET api/applications/student
// @desc    Get current student's applications
// @access  Private (Student only)
router.get('/student', auth, getStudentApplications);

// @route   GET api/applications/status/:jobId
// @desc    Check application status for a job
// @access  Private (Student only)
router.get('/status/:jobId', auth, getApplicationStatus);

// @route   GET api/applications/recruiter
// @desc    Get all applications for recruiter jobs
// @access  Private (Recruiter only)
router.get('/recruiter', auth, getRecruiterApplications);

// @route   PATCH api/applications/:id/status
// @desc    Update application status
// @access  Private (Recruiter only)
router.patch('/:id/status', auth, updateApplicationStatus);

module.exports = router;
