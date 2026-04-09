const express = require('express');
const router = express.Router();
const { generateQuestions, submitQuiz, submitRepo, generateTask, regenerateTask } = require('../controllers/assessmentController');
const auth = require('../middleware/auth');

router.post('/generate', auth, generateQuestions);
router.post('/submit', auth, submitQuiz);
router.post('/submit-repo', auth, submitRepo);
router.post('/generate-task', auth, generateTask);
router.post('/regenerate-task', auth, regenerateTask);

module.exports = router;
