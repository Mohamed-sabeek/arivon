import axios from 'axios';

// 1. Environment-aware API URL
const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

// Debug: Log the current API endpoint (Safe for dev, harmless in prod)
if (import.meta.env.DEV) {
  console.log('📡 Arivon AI Connection Point:', API_URL);
}

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // Required for secure cross-origin sessions
  headers: {
    'Content-Type': 'application/json'
  }
});

// 2. Security Interceptor: Attach JWT Token
api.interceptors.request.use((config) => {
  const token = sessionStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;
