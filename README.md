# 🚀 Arivon

> An AI-powered career intelligence platform that analyzes user profiles, matches them with relevant jobs, and validates skills through a structured verification system.

### 🌐 Live Demo
- **Platform Access:** [https://arivon.vercel.app/](https://arivon.vercel.app/)

---

## 🚀 Core Innovation

Arivon introduces a unified AI-driven career intelligence framework that combines:

- **AI-powered career matching**
- **Dynamic skill gap detection**
- **Personalized learning recommendations**
- **Multi-stage skill verification**
- **Resume intelligence**
- **Career readiness analytics**

Unlike traditional job portals, Arivon creates a continuous ecosystem where users can discover opportunities, identify missing skills, learn required competencies, and validate their expertise within a single platform.

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
| 📚 Learn Module | Identifies missing skills and recommends learning resources using YouTube API |
| ⚡ Smart Caching | Multi-layer caching system (Memory + LocalStorage + API) for optimized learning content delivery |
| 📄 Resume Management | Upload, view, edit, and re-upload resumes directly from the profile dashboard |

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

## 🏗️ System Architecture

Arivon operates through five interconnected layers:

- **Profile Intelligence Layer:** Collects academic, technical, and career data.
- **Career Matching Layer:** Calculates role compatibility using hybrid AI scoring.
- **Learning Intelligence Layer:** Identifies skill gaps and recommends learning resources.
- **Skill Verification Layer:** Validates theoretical and practical competencies.
- **Career Analytics Layer:** Generates insights, readiness scores, and progress tracking.

This architecture enables a closed-loop career development ecosystem.

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

### Learn Module Flow
1. Analyze user profile skills
2. Identify missing skills from global skill repository
3. Display skill gap recommendations
4. Fetch relevant learning videos using YouTube Data API
5. Cache videos using:
   * In-memory cache
   * LocalStorage persistence
   * API fallback mechanism
6. Provide instant access to learning resources

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
Arivon differentiates itself from traditional platforms through:
- **Closed-loop Career Intelligence Framework**
- **Dynamic Skill Gap Detection Engine**
- **Learning Recommendation Pipeline**
- **Multi-stage Skill Verification Architecture**
- **Career Readiness Scoring System**

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

## 📜 Intellectual Property Notice

Arivon and its associated workflows, recommendation methodologies, skill-gap analysis framework, learning intelligence system, and career verification mechanisms are proprietary concepts developed by Mohamed Sabeek.

This repository is intended for demonstration and academic purposes. Unauthorized reproduction, commercial deployment, or redistribution of the platform architecture without permission is strictly prohibited.

---

## 🧩 Author
**Mohamed Sabeek**
💻 Full Stack Developer | AI Enthusiast

---

## 🎤 Final Note
*Arivon is not just a job platform — it is an AI-powered career intelligence system that analyzes, validates, and guides users toward the right career path.*
