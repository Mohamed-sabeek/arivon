const { getRepoData } = require("../services/githubService");
const Groq = require("groq-sdk");

const getGroq = () => new Groq({ apiKey: process.env.GROQ_API_KEY });

const PROMPT = `You are an expert software engineer and hackathon judge.

Your task is to evaluate a GitHub repository based on the provided data.

Analyze the project on the following criteria:

1. Project Completeness
* Does the project appear functional and complete?
* Is the README meaningful?

2. Code Quality (based on commit messages and structure hints)
* Are commits meaningful or generic?
* Does development look structured?

3. Commit Authenticity
* Are commits spread over time or dumped at once?
* Are commit messages descriptive?

4. Effort & Originality
* Does it look like genuine work or copied/uploaded code?

5. Overall Impression

Based on the analysis, provide:
* A score out of 100
* A verdict: (Excellent / Good / Average / Suspicious / Poor)
* Key strengths (bullet points)
* Key issues (bullet points)
* Suggestions for improvement

Be strict and realistic like a hackathon judge.

Here is the repository data:
{{repo_data}}

Return your response ONLY in this JSON format:
{
  "score": number,
  "verdict": "string",
  "strengths": ["point1", "point2"],
  "issues": ["point1", "point2"],
  "suggestions": ["point1", "point2"]
}`;

const analyzeRepo = async (req, res) => {
  try {
    const { repoUrl } = req.body;
    if (!repoUrl) return res.status(400).json({ error: "repoUrl is required" });

    const parts = repoUrl.replace(/\/$/, "").split("/");
    const owner = parts[3];
    const repo = parts[4];

    if (!owner || !repo)
      return res.status(400).json({ error: "Invalid GitHub URL" });

    const data = await getRepoData(owner, repo);

    // Trim commit messages to avoid token limit
    const trimmedData = {
      ...data,
      commitMessages: data.commitMessages.slice(0, 20),
      readme: data.readme.slice(0, 1500),
    };

    const aiResponse = await getGroq().chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "user",
          content: PROMPT.replace("{{repo_data}}", JSON.stringify(trimmedData)),
        },
      ],
    });

    const raw = aiResponse.choices[0].message.content;
    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    const result = jsonMatch ? JSON.parse(jsonMatch[0]) : { raw };

    res.json({ repoData: data, evaluation: result });
  } catch (err) {
    console.error("Repo analysis error:", err.response?.data || err.message);
    res.status(500).json({ error: "Failed to analyze repo", detail: err.response?.data?.message || err.message });
  }
};

module.exports = { analyzeRepo };
