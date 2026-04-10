const express = require('express');
const router = express.Router();
const { 
  getDashboardData, 
  searchAdzunaJobs,
  createJob,
  getRecruiterJobs,
  updateJobStatus,
  getJobById,
  updateJob,
  deleteJob,
  searchInternalJobs
} = require('../controllers/jobController');
const auth = require('../middleware/auth');

// Student Routes
router.get('/dashboard', auth, getDashboardData);
router.get('/search', auth, searchAdzunaJobs);
router.get('/search/internal', auth, searchInternalJobs);

// Recruiter Routes
router.post('/', auth, createJob);
router.get('/my-jobs', auth, getRecruiterJobs);
router.get('/:id', auth, getJobById);
router.put('/:id', auth, updateJob);
router.delete('/:id', auth, deleteJob);
router.patch('/:id/status', auth, updateJobStatus);

module.exports = router;
