const Application = require('../models/Application');
const Job = require('../models/Job');
const User = require('../models/User');

const applyToJob = async (req, res) => {
  try {
    const { jobId } = req.params;
    const studentId = req.user.id;

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    const student = await User.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Check if already applied
    let application = await Application.findOne({ jobId, studentId });
    
    if (application) {
      if (application.status !== 'Rejected') {
        return res.status(400).json({ message: 'You have already applied for this position and it is currently ' + application.status });
      }
      
      // If status is 'Rejected', we allow re-application by resetting the existing record
      // This satisfies the unique index requirement
      const jobSkills = job.skillsRequired.map(s => s.toLowerCase());
      const studentSkills = (student.skills || []).map(s => s.toLowerCase());
      
      let matchCount = 0;
      jobSkills.forEach(skill => {
        if (studentSkills.includes(skill)) matchCount++;
      });

      const matchScore = jobSkills.length > 0 
        ? Math.round((matchCount / jobSkills.length) * 100) 
        : 0;

      if (matchScore < 50) {
        return res.status(400).json({ message: 'Application blocked: Your technical alignment (match score) is below the minimum threshold of 50%' });
      }

      application.status = 'Pending';
      application.matchScore = matchScore;
      application.appliedAt = Date.now();
      application.resumeUrl = student.resumeUrl || '';
      
      await application.save();
      return res.json({ success: true, message: 'Re-application submitted successfully', application });
    }

    // New Application
    const jobSkills = job.skillsRequired.map(s => s.toLowerCase());
    const studentSkills = (student.skills || []).map(s => s.toLowerCase());
    
    let matchCount = 0;
    jobSkills.forEach(skill => {
      if (studentSkills.includes(skill)) matchCount++;
    });

    const matchScore = jobSkills.length > 0 
      ? Math.round((matchCount / jobSkills.length) * 100) 
      : 0;

    if (matchScore < 50) {
      return res.status(400).json({ message: 'Application blocked: Your technical alignment (match score) is below the minimum threshold of 50%' });
    }

    application = new Application({
      jobId,
      studentId,
      matchScore,
      resumeUrl: student.resumeUrl || ''
    });

    await application.save();

    // Increment applicant count on job
    job.applicantsCount = (job.applicantsCount || 0) + 1;
    await job.save();

    res.status(201).json({ success: true, message: 'Application submitted successfully', application });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getApplicationStatus = async (req, res) => {
  try {
    const { jobId } = req.params;
    const studentId = req.user.id;

    const application = await Application.findOne({ jobId, studentId });
    
    if (!application) {
      return res.json({ applied: false });
    }

    res.json({ 
      applied: true, 
      status: application.status, 
      appliedAt: application.appliedAt 
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getRecruiterApplications = async (req, res) => {
  try {
    const recruiterId = req.user.id;

    // Find all jobs by this recruiter
    const jobs = await Job.find({ recruiterId }).select('_id title');
    const jobIds = jobs.map(j => j._id);

    // Find applications for these jobs
    const applications = await Application.find({ jobId: { $in: jobIds } })
      .populate('studentId', 'name email skills assessments resumeUrl')
      .populate('jobId', 'title')
      .sort({ createdAt: -1 });

    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const updateApplicationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['Shortlisted', 'Rejected', 'Pending'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const application = await Application.findById(id);
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    // Verify recruiter owns the job (optional but good for security)
    const job = await Job.findById(application.jobId);
    if (!job) {
       return res.status(404).json({ message: 'Job not found for this application' });
    }
    
    if (job.recruiterId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    application.status = status;
    await application.save();

    res.json({ success: true, message: `Application ${status}`, application });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getStudentApplications = async (req, res) => {
  try {
    const studentId = req.user.id;

    const applications = await Application.find({ studentId })
      .populate('jobId', 'title companyName location')
      .sort({ createdAt: -1 });

    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  applyToJob,
  getApplicationStatus,
  getStudentApplications,
  getRecruiterApplications,
  updateApplicationStatus
};
