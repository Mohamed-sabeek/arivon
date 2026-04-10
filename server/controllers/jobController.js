const axios = require('axios');
const jobs = require('../data/jobs.json');
const User = require('../models/User');
const Job = require('../models/Job');

const getMatches = async (userSkills) => {
  return jobs.map(job => {
    const requiredSkills = job.skills.map(s => s.toLowerCase());
    const matchedSkills = userSkills.filter(s => requiredSkills.includes(s.toLowerCase()));
    
    const matchPercentage = requiredSkills.length > 0 
      ? Math.round((matchedSkills.length / requiredSkills.length) * 100) 
      : 0;

    const missingSkills = job.skills.filter(s => !userSkills.map(us => us.toLowerCase()).includes(s.toLowerCase()));

    return {
      title: job.title,
      matchPercentage,
      matchedSkills,
      missingSkills
    };
  }).sort((a, b) => b.matchPercentage - a.matchPercentage);
};

const getDashboardData = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const matches = await getMatches(user.skills);
    
    // Calculate readiness score
    // Readiness = Average of top 3 match percentages + some base for having skills
    const topMatches = matches.slice(0, 3);
    const avgMatch = topMatches.reduce((acc, curr) => acc + curr.matchPercentage, 0) / (topMatches.length || 1);
    
    const readinessScore = Math.min(Math.round(avgMatch), 100);

    res.json({
      profile: {
        name: user.name,
        email: user.email,
        educationLevel: user.educationLevel,
        skills: user.skills,
        goal: user.goal
      },
      jobMatches: matches,
      readinessScore: `${readinessScore}% Ready`
    });
  } catch (error) {
    res.status(500).json({ message: 'Dashboard Error', error: error.message });
  }
};

const searchAdzunaJobs = async (req, res) => {
  try {
    const { role, location } = req.query;
    const appId = process.env.ADZUNA_APP_ID;
    const appKey = process.env.ADZUNA_APP_KEY;
    const country = 'in'; // Default to India as discussed

    if (!appId || !appKey) {
      console.error("Adzuna API keys missing in .env");
      return res.status(500).json({ message: "Job search service misconfigured" });
    }

    const what = encodeURIComponent(role || '');
    const where = encodeURIComponent(location || '');
    
    const url = `https://api.adzuna.com/v1/api/jobs/${country}/search/1?app_id=${appId}&app_key=${appKey}&what=${what}&where=${where}&content-type=application/json`;

    const response = await axios.get(url);
    
    const normalizedJobs = response.data.results.map(job => ({
      id: job.id,
      title: job.title.replace(/<\/?[^>]+(>|$)/g, ""), // Remove HTML tags if any
      company: job.company.display_name,
      location: job.location.display_name,
      description: job.description.replace(/<\/?[^>]+(>|$)/g, ""),
      redirect_url: job.redirect_url,
      extractedSkills: job.category.label ? [job.category.label] : [], // Adzuna doesn't provide granular skills easily
      postedDate: job.created
    }));

    res.json(normalizedJobs);
  } catch (error) {
    console.error("Adzuna API Error:", error.message);
    res.status(500).json({ message: "Failed to fetch jobs from Adzuna", error: error.message });
  }
};

// Recruiter Functions
const createJob = async (req, res) => {
  try {
    const { title, companyName, skillsRequired, description, salary, location } = req.body;
    
    const newJob = new Job({
      title,
      companyName,
      recruiterId: req.user.id,
      skillsRequired,
      description,
      salary,
      location
    });

    await newJob.save();
    res.status(201).json({ message: 'Job posted successfully', job: newJob });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create job', error: error.message });
  }
};

const getRecruiterJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ recruiterId: req.user.id }).sort({ createdAt: -1 });
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch jobs', error: error.message });
  }
};

const updateJobStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const job = await Job.findOneAndUpdate(
      { _id: req.params.id, recruiterId: req.user.id },
      { status },
      { new: true }
    );

    if (!job) return res.status(404).json({ message: 'Job not found' });
    res.json({ message: 'Job status updated', job });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update job status', error: error.message });
  }
};

const updateJob = async (req, res) => {
  try {
    const job = await Job.findOneAndUpdate(
      { _id: req.params.id, recruiterId: req.user.id },
      req.body,
      { new: true }
    );

    if (!job) return res.status(404).json({ message: 'Job not found' });
    res.json({ message: 'Job updated successfully', job });
  } catch (error) {
    console.error('Update Job Error:', error);
    res.status(500).json({ message: 'Failed to update job', error: error.message });
  }
};

const deleteJob = async (req, res) => {
  try {
    const job = await Job.findOneAndDelete({ _id: req.params.id, recruiterId: req.user.id });
    if (!job) return res.status(404).json({ message: 'Job not found' });
    res.json({ message: 'Job deleted successfully' });
  } catch (error) {
    console.error('Delete Job Error:', error);
    res.status(500).json({ message: 'Failed to delete job', error: error.message });
  }
};

const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: 'Job not found' });
    res.json(job);
  } catch (error) {
    console.error('Get Job Error:', error);
    res.status(500).json({ message: 'Failed to fetch job', error: error.message });
  }
};

const searchInternalJobs = async (req, res) => {
  try {
    const { keyword, location } = req.query;
    
    let query = { status: 'Active' };
    
    if (keyword) {
      query.$or = [
        { title: { $regex: keyword, $options: 'i' } },
        { description: { $regex: keyword, $options: 'i' } },
        { skillsRequired: { $elemMatch: { $regex: keyword, $options: 'i' } } }
      ];
    }
    
    if (location) {
      query.location = { $regex: location, $options: 'i' };
    }

    let internalJobs = await Job.find(query);

    if (keyword) {
      const lowerKeyword = keyword.toLowerCase();
      
      const scoredJobs = internalJobs.map(job => {
        let score = 0;
        const jobObj = job.toObject ? job.toObject() : job;

        if (jobObj.title && jobObj.title.toLowerCase().includes(lowerKeyword)) {
          score += 3;
        }
        if (jobObj.skillsRequired && jobObj.skillsRequired.some(s => s.toLowerCase().includes(lowerKeyword))) {
          score += 2;
        }
        if (jobObj.description && jobObj.description.toLowerCase().includes(lowerKeyword)) {
          score += 1;
        }

        return { ...jobObj, relevanceScore: score };
      });

      scoredJobs.sort((a, b) => {
        if (b.relevanceScore !== a.relevanceScore) {
          return b.relevanceScore - a.relevanceScore;
        }
        return new Date(b.createdAt) - new Date(a.createdAt);
      });

      internalJobs = scoredJobs;
    } else {
      internalJobs = internalJobs.map(job => (job.toObject ? job.toObject() : job));
      internalJobs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
    
    // Normalize for frontend consistency with Adzuna mappings
    const normalizedInternal = internalJobs.map(job => ({
      id: job._id,
      title: job.title,
      company: job.companyName,
      location: job.location,
      description: job.description,
      extractedSkills: job.skillsRequired,
      postedDate: job.createdAt,
      source: 'internal',
      salary: job.salary
    }));

    res.json(normalizedInternal);
  } catch (error) {
    console.error('Internal Search Error:', error);
    res.status(500).json({ message: 'Internal Job search failed', error: error.message });
  }
};

module.exports = { 
  getDashboardData, 
  searchAdzunaJobs,
  searchInternalJobs,
  createJob,
  getRecruiterJobs,
  updateJobStatus,
  getJobById,
  updateJob,
  deleteJob
};
