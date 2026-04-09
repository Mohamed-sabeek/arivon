const axios = require("axios");

const GITHUB_API = "https://api.github.com";

const getHeaders = () => ({
  Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
});

const safeGet = (url, headers) =>
  axios.get(url, { headers }).catch(() => null);

const getRepoData = async (owner, repo) => {
  const headers = getHeaders();
  const base = `${GITHUB_API}/repos/${owner}/${repo}`;

  const [repoRes, commitsRes, contributorsRes, readmeRes] = await Promise.all([
    axios.get(base, { headers }),
    safeGet(`${base}/commits?per_page=100`, headers),
    safeGet(`${base}/contributors`, headers),
    safeGet(`${base}/readme`, headers),
  ]);

  const commits = commitsRes?.data || [];
  const contributors = contributorsRes?.data || [];
  const readmeContent = readmeRes?.data?.content
    ? Buffer.from(readmeRes.data.content, "base64").toString("utf-8")
    : "No README found";

  return {
    name: repoRes.data.name,
    stars: repoRes.data.stargazers_count,
    forks: repoRes.data.forks_count,
    commitCount: commits.length,
    contributors: contributors.length,
    lastCommitDate: commits[0]?.commit?.author?.date || null,
    commitMessages: commits.map((c) => c.commit.message),
    readme: readmeContent,
  };
};

module.exports = { getRepoData };
