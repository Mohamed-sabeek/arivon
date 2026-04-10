require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');

const authRoutes = require('./routes/authRoutes');
const profileRoutes = require('./routes/profileRoutes');
const jobRoutes = require('./routes/jobRoutes');
const atsRoutes = require('./routes/atsRoutes');
const assessmentRoutes = require('./routes/assessmentRoutes');
const chatRoutes = require('./routes/chatRoutes');
const repoRoutes = require('./routes/repoRoutes');
const userRoutes = require('./routes/userRoutes');
const applicationRoutes = require('./routes/applicationRoutes');

const app = express();

// 1. CORS Configuration - Whitelist local and production
// Place this BEFORE all other middleware and routes
const allowedOrigins = [
  'http://localhost:5173',
  'https://arivon.vercel.app'
];

const corsOptions = {
  origin: function (origin, callback) {
    // allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    // Check if origin is in whitelist or is a variation (like trailing slash)
    const normalizedOrigin = origin.replace(/\/$/, "");
    const isAllowed = allowedOrigins.some(ao => ao.replace(/\/$/, "") === normalizedOrigin);

    if (isAllowed) {
      callback(null, true);
    } else {
      console.log(`CORS Blocked for origin: ${origin}`);
      callback(new Error('Not allowed by CORS'), false);
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

// 2. Apply CORS middleware
app.use(cors(corsOptions));

// 3. Handle Preflight OPTIONS requests for all routes
app.options("*", cors(corsOptions));

// Other Middleware
app.use(bodyParser.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Root Route for Server Status
app.get('/', (req, res) => {
  res.json({ 
    message: 'Arivon AI Career Intelligence Backend: ONLINE',
    status: 'Operational',
    timestamp: new Date()
  });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/ats', atsRoutes);
app.use('/api/assessment', assessmentRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/repo', repoRoutes);
app.use('/api/users', userRoutes);
app.use('/api/applications', applicationRoutes);

// Database Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log('MongoDB Connection Error:', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
