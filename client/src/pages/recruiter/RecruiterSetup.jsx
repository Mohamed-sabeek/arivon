import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Building2, Globe, MapPin, Layers, 
  FileText, Users, ArrowRight, Sparkles,
  CheckCircle2, AlertCircle
} from 'lucide-react';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';

const RecruiterSetup = () => {
  const navigate = useNavigate();
  const { user, profile, setUser, setProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    companyName: user?.companyName || '',
    companyWebsite: '',
    companyLocation: '',
    industry: '',
    companyDescription: '',
    companySize: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await api.put('/users/company-profile', formData);
      
      if (res.data.success) {
        // Update local state with new profile info
        const updatedUser = res.data.user;
        setUser(updatedUser);
        setProfile(updatedUser);
        
        // Safety reload to ensure all contexts are synced
        window.location.reload();
      }
    } catch (err) {
      console.error('Failed to update company profile:', err);
      setError(err.response?.data?.message || 'Failed to initialize company profile.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0F172A] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-primary/5 blur-[120px] rounded-full translate-y-1/2 -translate-x-1/2" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card w-full max-w-2xl p-10 md:p-12 relative z-10"
      >
        <div className="mb-10 text-center">
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-primary/20 shadow-xl shadow-primary/5"
          >
            <Building2 className="w-10 h-10 text-primary" />
          </motion.div>
          <h1 className="text-4xl font-black tracking-tighter uppercase mb-2">
            Company <span className="text-primary">Configuration</span>
          </h1>
          <p className="text-secondary font-medium uppercase tracking-widest text-xs opacity-70">
            Establish your identity. Build your talent ecosystem.
          </p>
        </div>

        {error && (
          <div className="mb-8 p-4 bg-red-500/10 border border-red-500/20 text-red-500 text-sm rounded-2xl flex items-center gap-3 font-bold animate-shake">
            <AlertCircle className="w-5 h-5" />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Company Name */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-secondary ml-1">Company Name</label>
              <div className="relative group">
                <Building2 className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary group-focus-within:text-primary transition-colors" />
                <input
                  type="text"
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-6 outline-none focus:border-primary/50 transition-all font-bold placeholder:text-white/20"
                  placeholder="e.g. Acme Innovations"
                  value={formData.companyName}
                  onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                />
              </div>
            </div>

            {/* Company Website */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-secondary ml-1">Company Website</label>
              <div className="relative group">
                <Globe className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary group-focus-within:text-primary transition-colors" />
                <input
                  type="url"
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-6 outline-none focus:border-primary/50 transition-all font-bold placeholder:text-white/20"
                  placeholder="https://acme.inc"
                  value={formData.companyWebsite}
                  onChange={(e) => setFormData({ ...formData, companyWebsite: e.target.value })}
                />
              </div>
            </div>

            {/* Location */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-secondary ml-1">Location</label>
              <div className="relative group">
                <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary group-focus-within:text-primary transition-colors" />
                <input
                  type="text"
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-6 outline-none focus:border-primary/50 transition-all font-bold placeholder:text-white/20"
                  placeholder="e.g. San Francisco, CA"
                  value={formData.companyLocation}
                  onChange={(e) => setFormData({ ...formData, companyLocation: e.target.value })}
                />
              </div>
            </div>

            {/* Industry */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-secondary ml-1">Industry</label>
              <div className="relative group">
                <Layers className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary group-focus-within:text-primary transition-colors" />
                <input
                  type="text"
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-6 outline-none focus:border-primary/50 transition-all font-bold placeholder:text-white/20"
                  placeholder="e.g. Artificial Intelligence"
                  value={formData.industry}
                  onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                />
              </div>
            </div>
          </div>

          {/* Company Size */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-secondary ml-1">Company Size</label>
            <div className="relative group">
              <Users className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary group-focus-within:text-primary transition-colors" />
              <select
                required
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-6 outline-none focus:border-primary/50 transition-all font-bold text-white appearance-none"
                value={formData.companySize}
                onChange={(e) => setFormData({ ...formData, companySize: e.target.value })}
              >
                <option value="" className="bg-[#1E293B]">Select Company Size</option>
                <option value="1-10" className="bg-[#1E293B]">1-10 Employees (Startup)</option>
                <option value="11-50" className="bg-[#1E293B]">11-50 Employees (Early Stage)</option>
                <option value="51-200" className="bg-[#1E293B]">51-200 Employees (Growth Stage)</option>
                <option value="201-500" className="bg-[#1E293B]">201-500 Employees (Mid-Market)</option>
                <option value="500+" className="bg-[#1E293B]">500+ Employees (Enterprise)</option>
              </select>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-secondary ml-1">Company Vision / Description</label>
            <div className="relative group">
              <FileText className="absolute left-5 top-6 w-4 h-4 text-secondary group-focus-within:text-primary transition-colors" />
              <textarea
                required
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 pl-12 pr-6 outline-none focus:border-primary/50 transition-all font-medium placeholder:text-white/20 min-h-[140px] resize-none"
                placeholder="Briefly describe your company's mission and culture..."
                value={formData.companyDescription}
                onChange={(e) => setFormData({ ...formData, companyDescription: e.target.value })}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="glow-button w-full h-[64px] flex items-center justify-center gap-3 text-lg font-black uppercase tracking-widest relative overflow-hidden group"
          >
            {loading ? (
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                <span>Initializing...</span>
              </div>
            ) : (
              <>
                <span>Complete Initialization</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
              </>
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default RecruiterSetup;
