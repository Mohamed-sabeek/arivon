const jobs = require('../data/jobs.json');
const User = require('../models/User');

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

module.exports = { getDashboardData };
