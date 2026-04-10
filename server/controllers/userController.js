const User = require('../models/User');

const updateCompanyProfile = async (req, res) => {
  try {
    const { 
      companyName, 
      companyWebsite, 
      companyLocation, 
      industry, 
      companyDescription, 
      companySize 
    } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.role !== 'recruiter') {
      return res.status(403).json({ message: 'Only recruiters can update company profiles' });
    }

    // Update fields
    user.companyName = companyName || user.companyName;
    user.companyWebsite = companyWebsite;
    user.companyLocation = companyLocation;
    user.industry = industry;
    user.companyDescription = companyDescription;
    user.companySize = companySize;
    user.companyProfileCompleted = true;

    await user.save();

    const result = user.toObject();
    delete result.password;

    res.json({ success: true, message: 'Company profile updated successfully', user: result });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

module.exports = { updateCompanyProfile };
