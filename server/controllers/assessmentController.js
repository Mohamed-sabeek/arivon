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
  const { skill, repoLink, isSimulation } = req.body;
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

    let result;
    if (isSimulation) {
      // Mock result for simulation mode
      result = {
        aiScore: 82,
        status: 'passed',
        feedback: "Simulated certification passed. Repository demonstrates strong architectural patterns and consistent implementation logic."
      };
    } else {
      // Call Groq for Real Repo Analysis
      const prompt = `Analyze the target GitHub repository for a ${skill} professional: ${repoLink}.
      Provide a professional assessment of the implied code quality, best practices, and architectural maturity.
      Return strictly JSON format:
      {
        "aiScore": <number 0-100>,
        "feedback": "A concise paragraph of technical feedback...",
        "status": "passed" or "failed"
      }
      Rules: 
      - Be strict. 
      - Use 70 as passing threshold for status.`;

      const chatCompletion = await groq.chat.completions.create({
        messages: [{ role: 'user', content: prompt }],
        model: 'llama-3.3-70b-versatile',
        response_format: { type: 'json_object' }
      });

      result = JSON.parse(chatCompletion.choices[0].message.content);
    }
    
    current.level2 = {
      repoLink,
      aiScore: result.aiScore,
      status: result.status === 'passed' ? 'passed' : 'failed',
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

const generateTask = async (req, res) => {
  const { skill } = req.body;
  const userId = req.user.id;

  if (!skill) {
    return res.status(400).json({ message: 'Skill is required' });
  }

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // 1. Check for PERSISTENT cached task
    const cachedTaskEntry = user.screeningTasks.find(t => t.skill === skill);
    if (cachedTaskEntry) {
      return res.json({ ...cachedTaskEntry.task, source: 'database' });
    }

    // 2. Resolve Hybrid Industry
    const industries = ['Fintech', 'EdTech', 'E-commerce', 'Healthcare', 'AgriTech'];
    
    // Simple variety logic: see what industries they ALREADY have
    const usedIndustries = user.screeningTasks.map(t => t.task.industry).filter(Boolean);
    const availableIndustries = industries.filter(i => !usedIndustries.includes(i));
    
    // If all used, reset or choose randomly from others
    const industryPool = availableIndustries.length > 0 ? availableIndustries : industries;
    const selectedIndustry = industryPool[Math.floor(Math.random() * industryPool.length)];

    // 3. Resolution Mapping for Experience Level
    let expLevel = 'Intermediate'; 
    const userLevel = user.level || '';
    const userExp = user.experience || '';

    if (userLevel.includes('1st') || userLevel.includes('2nd') || userExp === 'Beginner') {
      expLevel = 'Beginner';
    } else if (userLevel === 'PG' || userExp === 'Experienced') {
      expLevel = 'Advanced';
    } else if (userLevel.includes('3rd') || userLevel.includes('Final')) {
      expLevel = 'Intermediate';
    }

    const prompt = `You are a senior software engineer and technical interviewer at a top product-based company.
    Your task is to generate a REAL-WORLD Level 2 screening assignment.
    
    System Context:
    - Primary Skill: ${skill}
    - Experience Level: ${expLevel}
    - Target Industry: ${selectedIndustry}
    
    Instructions:
    - Make the task strictly specific to the skill: ${skill}.
    - Do NOT generate generic tasks.
    - Use a UNIQUE real-world scenario from the ${selectedIndustry} sector.
    - It should require problem-solving, architecture thinking, and clean coding.
    - The project must be completable within 4–8 hours and suitable for GitHub submission.
    
    Output Format (STRICT JSON ONLY):
    {
      "industry": "${selectedIndustry}",
      "title": "Clear project title",
      "description": "Explain the problem and outcome clearly in 4-6 lines",
      "requirements": ["Req 1", "Req 2", "Req 3", "Req 4"],
      "techStack": ["Tech 1", "Tech 2"],
      "evaluationCriteria": ["Criteria 1", "Criteria 2"]
    }
    Rules:
    - No markdown, no explanations. Strictly JSON.`;

    const chatCompletion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'llama-3.3-70b-versatile',
      response_format: { type: 'json_object' }
    });

    const taskData = JSON.parse(chatCompletion.choices[0].message.content);
    
    // Inject industry if AI missed it
    if (!taskData.industry) taskData.industry = selectedIndustry;

    // 4. PERSIST to Database
    user.screeningTasks.push({ skill, task: taskData });
    await user.save();

    return res.json({ ...taskData, source: 'ai_new' });

  } catch (error) {
    console.error('Task Generation Error:', error);
    return res.status(500).json({ message: 'Failed to generate technical task', error: error.message });
  }
};

const regenerateTask = async (req, res) => {
  const { skill } = req.body;
  const userId = req.user.id;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Remove existing task for this skill
    user.screeningTasks = user.screeningTasks.filter(t => t.skill !== skill);
    await user.save();

    // Call generateTask logic (internal or via redirect, let's just trigger generateTask logic)
    return generateTask(req, res);
  } catch (error) {
    console.error('Regenerate Error:', error);
    return res.status(500).json({ message: 'Failed to regenerate task' });
  }
};

module.exports = {
  generateQuestions,
  submitQuiz,
  submitRepo,
  generateTask,
  regenerateTask
};
