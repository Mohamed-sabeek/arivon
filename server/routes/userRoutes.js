const express = require('express');
const router = express.Router();
const { updateCompanyProfile } = require('../controllers/userController');
const auth = require('../middleware/auth');

router.put('/company-profile', auth, updateCompanyProfile);

module.exports = router;
