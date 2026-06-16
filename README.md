# 🚀 Arivon

> An AI-powered career intelligence platform that analyzes user profiles, matches them with relevant jobs, and validates skills through a structured verification system.

![License](https://img.shields.io/badge/license-MIT-blue)
![Stack](https://img.shields.io/badge/stack-MERN%20%7C%20AI-green)
![Status](https://img.shields.io/badge/status-Active-brightgreen)

---

## 📌 Problem Statement

Intelligent Career Matching & Skill Validation Platform for Students and Job Seekers

---

## 🚀 Features

| Feature | Description |
|---|---|
| 🧠 AI Career Match | Generates personalized job matches with match percentage and reasoning |
| 📊 Smart Dashboard | Displays career insights, match scores, and progress |
| 🧪 Skill Verification | 2-level system (MCQ + Real-world project submission) |
| 💼 Job Browsing | Shows relevant jobs with AI-calculated match score |
| 🤖 AI Assistant | Chatbot powered by LLM for career guidance |
| 🔐 Authentication | Secure JWT-based login and user management |

---

## 🏗️ Tech Stack

### Frontend
- ⚛️ React 19 — Component-based UI
- ⚡ Vite — Fast development build tool
- 🎨 Tailwind CSS v4 — Utility-first styling
- 🔗 Axios — API communication
- 🧭 React Router DOM — Routing

### Backend
- 🟢 Node.js — Runtime environment
- 🚀 Express v5 — REST API framework
- 🍃 MongoDB — Database
- 🧩 Mongoose — ODM for MongoDB
- 🔐 JWT — Authentication
- 🔑 bcryptjs — Password hashing

### AI Layer
- 🤖 Groq API (LLaMA-3)
- 🧠 Hybrid AI (Backend logic + LLM reasoning)

---

## 📂 Project Structure

Arivon/
├── client/ # Frontend (React)
│ ├── src/
│ │ ├── components/
│ │ │ ├── chat/
│ │ │ │ ├── Chatbot.jsx
│ │ │ │ └── AIWidget.jsx
│ │ ├── pages/
│ │ │ ├── Dashboard.jsx
│ │ │ ├── BrowseJobs.jsx
│ │ │ ├── SkillCheck.jsx
│ │ │ └── Profile.jsx
│ │ ├── data/
│ │ │ └── jobs.js
│ │ └── App.jsx
│
├── server/ # Backend (Node.js)
│ ├── controllers/
│ │ ├── authController.js
│ │ ├── jobController.js
│ │ └── careerController.js
│ ├── routes/
│ ├── models/
│ ├── middleware/
│ ├── config/
│ └── server.js
│
└── README.md


---

## ⚙️ Installation & Setup

### Prerequisites
- Node.js 18+
- MongoDB (local or cloud)

---
### 1. Clone the Repository

```bash
git clone https://github.com/your-username/arivon.git
cd arivon
```

### 2. Backend Setup
```bash
cd server
npm install
```

Create `.env` file:
```env
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret_key
GROQ_API_KEY=your_groq_api_key
```

Run backend:
```bash
npm run dev
```
*Backend runs at: http://localhost:5000*

### 3. Frontend Setup
```bash
cd client
npm install
npm run dev
```
*Frontend runs at: http://localhost:5173*

---

## 🧠 How It Works

### User Profiling Flow
1. User signs up and logs in
2. Completes onboarding questions:
   - Skills
   - Interests
   - Experience
   - Resume upload
3. Data stored in MongoDB
4. Profile used for AI matching

### AI Career Match Flow
1. Fetch user profile from database
2. Compute match score using backend logic
3. Send enriched prompt to LLM (Groq)
4. Generate:
   - Match percentage
   - Skill gap analysis
   - Recommendations

### Job Browsing Flow
1. Jobs loaded dynamically
2. Each job evaluated against user profile
3. Match score displayed
4. Intelligent loading UI simulates AI processing

### Skill Verification Flow
**Level 1 – Screening**
- MCQ-based test
- Evaluates theoretical knowledge

**Level 2 – Practical Task**
1. User navigates to detailed task page
2. Reads real-world problem statement
3. Builds solution
4. Submits GitHub repository

### Dashboard Flow
Displays:
- Career match results
- Completed assessments
- AI insights
- Updates dynamically based on user activity

---

## 📈 Scalability
- Backend can be deployed using Docker & cloud services
- MongoDB can scale horizontally using Atlas
- AI requests handled asynchronously
- Frontend can be deployed via CDN

## 💡 Feasibility
Arivon is built using widely adopted technologies like React, Node.js, and MongoDB.
The AI integration uses Groq API, making it lightweight and fast without requiring heavy infrastructure.

This makes the system:
- Easy to deploy
- Cost-efficient
- Scalable for real-world usage

## 🌟 Novelty
- Combines AI + Skill Validation in one platform
- Uses Hybrid AI (Math + LLM reasoning)
- Goes beyond resumes by validating real-world skills
- Provides explainable career recommendations

## 🔧 Feature Depth
- Personalized job matching using structured profile data
- Real-world project-based verification system
- AI-generated career insights
- Dynamic UI simulating intelligent systems
- Modular backend architecture for easy extension

---

## ⚠️ Ethical Use & Disclaimer
Arivon is intended for:
- Educational purposes
- Career guidance
- Skill development

**Do not misuse the platform for fraudulent job applications or false submissions.**

---

## 📜 License
This project is licensed under the MIT License.

---

## 🤝 Contributing
Contributions are welcome!
1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Open a Pull Request

---

## 🧩 Author
**Mohamed Sabeek**
💻 Full Stack Developer | AI Enthusiast

---

## 🎤 Final Note
*Arivon is not just a job platform — it is an AI-powered career intelligence system that analyzes, validates, and guides users toward the right career path.*
