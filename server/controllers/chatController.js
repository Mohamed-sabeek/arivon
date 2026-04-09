const Groq = require('groq-sdk');
const User = require('../models/User');

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

const handleChat = async (req, res) => {
  const { message } = req.body;
  const userId = req.user.id;

  if (!message) {
    return res.status(400).json({ message: 'Message is required' });
  }

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Prepare profile context for the AI
    const profileContext = {
      skills: user.skills || [],
      experience: user.experience || 'Beginner',
      level: user.level || 'Not specified',
      branch: user.branch || '',
      interests: user.interests || []
    };

    const prompt = `
You are Arivon AI Career Twin, a smart AI career mentor inside the Arivon platform.

CANDIDATE PROFILE:
- Skills: ${profileContext.skills.join(', ')}
- Experience Level: ${profileContext.experience}
- Academic Level: ${profileContext.level}
- Branch: ${profileContext.branch}
- Interests: ${profileContext.interests.join(', ')}

INSTRUCTIONS:
1. **Identity**: Always refer to yourself as "Arivon AI Career Twin". Never use any other name.
2. **Who are you?**: If the user asks "who are you" or similar identity questions, always respond with: "I am Arivon AI Career Twin, your personal AI mentor designed to guide your career growth."
3. **Be Concise and Actionable**: Provide clear steps or tips.
4. **Context-Aware**: Use the candidate's profile to tailor your advice.
5. **Professional & Approachable**: Use a helpful but expert tone with occasional emojis.

USER MESSAGE:
"${message}"

Provide clear, practical, and personalized guidance.
`;

    const chatCompletion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.7,
      max_tokens: 1024
    });

    const reply = chatCompletion.choices[0]?.message?.content || "I'm sorry, I couldn't process that.";
    res.json({ reply });

  } catch (error) {
    console.error('Chat AI Error:', error);
    res.status(500).json({ message: 'Error communicating with AI Twin', error: error.message });
  }
};

module.exports = {
  handleChat
};
