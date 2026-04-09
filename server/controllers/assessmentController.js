const Groq = require('groq-sdk');
const User = require('../models/User');

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

const generateQuestions = async (req, res) => {
  console.log("=== Assessment Route Hit ===");
  const { skill } = req.body;

  if (!skill) {
    return res.status(400).json({ message: 'Skill is required' });
  }

  try {
    const prompt = `Generate 10 multiple choice questions for the skill: ${skill}. 
    Rules:
    - Include easy, medium, and hard questions
    - Each question must have 4 options
    - Provide correct answer
    - Questions should be job-oriented
    - Return strictly JSON format only: 
    [
      {
        "question": "...",
        "options": ["A", "B", "C", "D"],
        "correctAnswer": "A"
      }
    ]
    Do not include any other text in your response.`;

    const chatCompletion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'llama-3.3-70b-versatile',
      response_format: { type: 'json_object' }
    });

    let content = chatCompletion.choices[0].message.content;
    let questions = JSON.parse(content);
    if (questions.questions) questions = questions.questions;
    if (!Array.isArray(questions)) {
       try {
         const keys = Object.keys(questions);
         if (Array.isArray(questions[keys[0]])) questions = questions[keys[0]];
       } catch(e) {}
    }

    return res.json(questions);
  } catch (error) {
    console.error('Groq Generation Error:', error);
    return res.status(500).json({ message: 'Failed to generate assessment questions', error: error.message });
  }
};

const submitQuiz = async (req, res) => {
  const { skill, answers, questions } = req.body;
  const userId = req.user.id;

  if (!skill || !answers || !questions) {
    return res.status(400).json({ message: 'Missing submission data' });
  }

  try {
    let correct = 0;
    questions.forEach((q, index) => {
      if (q.correctAnswer === answers[index]) {
        correct++;
      }
    });

    const score = Math.round((correct / questions.length) * 100);
    // Updated threshold: 70%
    const status = score >= 70 ? 'passed' : 'failed';

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update nested assessment map
    const assessments = user.assessments || new Map();
    let current = assessments.get(skill) || { level1: {}, level2: {}, finalStatus: 'pending' };
    
    current.level1 = {
      score,
      status,
      completedAt: new Date()
    };

    assessments.set(skill, current);
    user.assessments = assessments;
    await user.save();

    return res.json({
      score,
      status,
      correct,
      total: questions.length
    });
  } catch (error) {
    console.error('Quiz Submission Error:', error);
    return res.status(500).json({ message: 'Failed to submit quiz', error: error.message });
  }
};

const submitRepo = async (req, res) => {
  const { skill, repoLink } = req.body;
  const userId = req.user.id;

  if (!skill || !repoLink) {
    return res.status(400).json({ message: 'Skill and repository link are required' });
  }

  try {
    const user = await User.findById(userId);
    const assessments = user.assessments || new Map();
    let current = assessments.get(skill);

    if (!current || current.level1?.status !== 'passed') {
      return res.status(403).json({ message: 'Knowledge Validation (Level 1) must be passed before Practical Screening.' });
    }

    // Call Groq for Repo Analysis Simulation
    const prompt = `Analyze the target GitHub repository for a ${skill} professional: ${repoLink}.
    Provide a professional assessment of the implied code quality, best practices, and architectural maturity.
    Return strictly JSON format:
    {
      "aiScore": <number 0-100>,
      "feedback": "A concise paragraph of technical feedback...",
      "status": "completed" or "failed"
    }
    Rules: 
    - Be strict. 
    - Use 70 as passing threshold for status.`;

    const chatCompletion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'llama-3.3-70b-versatile',
      response_format: { type: 'json_object' }
    });

    const result = JSON.parse(chatCompletion.choices[0].message.content);
    
    current.level2 = {
      repoLink,
      aiScore: result.aiScore,
      status: result.status,
      feedback: result.feedback,
      completedAt: new Date()
    };

    if (result.aiScore >= 70) {
      current.finalStatus = 'verified';
    }

    assessments.set(skill, current);
    user.assessments = assessments;
    await user.save();

    return res.json({
      skill,
      aiScore: result.aiScore,
      feedback: result.feedback,
      finalStatus: current.finalStatus
    });

  } catch (error) {
    console.error('Repo Analysis Error:', error);
    return res.status(500).json({ message: 'Failed to evaluate repository', error: error.message });
  }
};

module.exports = {
  generateQuestions,
  submitQuiz,
  submitRepo
};
