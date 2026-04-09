const express = require('express');
const router = express.Router();
const { generateQuestions, submitQuiz, submitRepo } = require('../controllers/assessmentController');
const auth = require('../middleware/auth');

router.post('/generate', auth, generateQuestions);
router.post('/submit', auth, submitQuiz);
router.post('/submit-repo', auth, submitRepo);

module.exports = router;
