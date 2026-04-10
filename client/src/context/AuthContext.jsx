import { createContext, useState, useContext, useEffect } from 'react';
import api from '../api/axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = sessionStorage.getItem('token');
    const savedUser = sessionStorage.getItem('user');

    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      setUser(parsedUser);
      setProfile(parsedUser);
    }

    if (token) {
      loadUser();
    } else {
      setLoading(false);
    }
  }, []);

  const loadUser = async () => {
    try {
      const res = await api.get('/profile/me');
      const userData = res.data;
      
      // Parse skills and interests if they come as strings
      if (typeof userData.skills === 'string') {
        try {
          userData.skills = JSON.parse(userData.skills);
        } catch (e) {
          userData.skills = [];
        }
      }
      if (typeof userData.interests === 'string') {
        try {
          userData.interests = JSON.parse(userData.interests);
        } catch (e) {
          userData.interests = [];
        }
      }
      
      // Ensure they are arrays
      userData.skills = Array.isArray(userData.skills) ? userData.skills : [];
      userData.interests = Array.isArray(userData.interests) ? userData.interests : [];
      
      setUser(userData);
      setProfile(userData);
      sessionStorage.setItem('user', JSON.stringify(userData));
    } catch (err) {
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('user');
      setUser(null);
      setProfile(null);
    } finally {
      setLoading(false);
    }
  };

  const refreshProfile = async () => {
    try {
      const res = await api.get('/profile/me');
      const userData = res.data;
      
      // Parse skills and interests if they come as strings
      if (typeof userData.skills === 'string') {
        try {
          userData.skills = JSON.parse(userData.skills);
        } catch (e) {
          userData.skills = [];
        }
      }
      if (typeof userData.interests === 'string') {
        try {
          userData.interests = JSON.parse(userData.interests);
        } catch (e) {
          userData.interests = [];
        }
      }
      
      // Ensure they are arrays
      userData.skills = Array.isArray(userData.skills) ? userData.skills : [];
      userData.interests = Array.isArray(userData.interests) ? userData.interests : [];
      
      setUser(userData);
      setProfile(userData);
      return userData;
    } catch (err) {
      console.error('Failed to refresh profile');
    }
  };

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    sessionStorage.setItem('token', res.data.token);
    sessionStorage.setItem('user', JSON.stringify(res.data.user));
    setUser(res.data.user);
    setProfile(res.data.user);
    return res.data;
  };

  const register = async (name, email, password, role, companyName) => {
    const res = await api.post('/auth/register', { name, email, password, role, companyName });
    sessionStorage.setItem('token', res.data.token);
    sessionStorage.setItem('user', JSON.stringify(res.data.user));
    setUser(res.data.user);
    setProfile(res.data.user);
    return res.data;
  };

  const logout = () => {
    sessionStorage.clear();
    setUser(null);
    setProfile(null);
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, login, register, logout, setUser, setProfile, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
