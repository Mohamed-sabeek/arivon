const User = require('../models/User');

const authorizeRoles = (...roles) => {
  return async (req, res, next) => {
    try {
      // req.user only has the ID from the auth middleware
      const user = await User.findById(req.user.id);
      
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      if (!roles.includes(user.role)) {
        return res.status(403).json({ 
          message: `Role (${user.role}) is not authorized to access this resource` 
        });
      }

      next();
    } catch (error) {
      res.status(500).json({ message: 'Authorization error', error: error.message });
    }
  };
};

module.exports = authorizeRoles;
