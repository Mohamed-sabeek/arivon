import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Briefcase, MapPin, DollarSign, List, 
  Plus, CheckCircle, ArrowLeft, Send
} from 'lucide-react';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';

const PostJob = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { profile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const editJob = location.state?.job || null;

  const [formData, setFormData] = useState({
    title: editJob ? editJob.title : '',
    skillsRequired: editJob ? editJob.skillsRequired.join(', ') : '',
    salary: editJob ? editJob.salary : '',
    location: editJob ? editJob.location : '',
    description: editJob ? editJob.description : ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const skillsArray = formData.skillsRequired.split(',').map(skill => skill.trim()).filter(skill => skill !== '');
      
      const payload = {
        ...formData,
        companyName: profile?.companyName || 'Unknown Company',
        skillsRequired: skillsArray
      };

      if (editJob) {
        await api.put(`/jobs/${editJob._id}`, payload);
      } else {
        await api.post('/jobs', payload);
      }
      navigate('/recruiter/dashboard');
    } catch (err) {
      console.error('Failed to save job:', err);
      setError(err.response?.data?.message || 'Failed to save job. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0F172A] p-8">
      <div className="max-w-4xl mx-auto">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-secondary hover:text-primary transition-colors mb-8 font-bold uppercase tracking-widest text-xs"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Terminal
        </button>

        <header className="mb-12">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3 text-primary mb-3"
          >
            <div className="w-8 h-1 bg-primary rounded-full" />
            <span className="text-xs font-black uppercase tracking-[0.3em]">Job Architecture</span>
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter uppercase mb-2">
            Post New <span className="text-primary">Opportunity</span>
          </h1>
          <p className="text-secondary text-lg font-medium opacity-80">
            Define the parameters for your next talent requisition.
          </p>
        </header>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-2xl mb-8 flex items-center gap-3 font-bold">
            <CheckCircle className="w-5 h-5 rotate-180" />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Job Title */}
            <div className="space-y-3">
              <label className="text-xs font-black uppercase tracking-widest text-secondary ml-1">Job Title</label>
              <div className="relative group">
                <Briefcase className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary group-focus-within:text-primary transition-colors" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Senior Backend Architect"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-14 pr-6 outline-none focus:border-primary/50 transition-all font-bold placeholder:text-white/20"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>
            </div>

            {/* Skills */}
            <div className="space-y-3">
              <label className="text-xs font-black uppercase tracking-widest text-secondary ml-1">Skills (Comma Separated)</label>
              <div className="relative group">
                <List className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary group-focus-within:text-primary transition-colors" />
                <input
                  type="text"
                  required
                  placeholder="React, Node.js, MongoDB..."
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-14 pr-6 outline-none focus:border-primary/50 transition-all font-bold placeholder:text-white/20"
                  value={formData.skillsRequired}
                  onChange={(e) => setFormData({ ...formData, skillsRequired: e.target.value })}
                />
              </div>
            </div>

            {/* Salary */}
            <div className="space-y-3">
              <label className="text-xs font-black uppercase tracking-widest text-secondary ml-1">Proposed Salary Range</label>
              <div className="relative group">
                <DollarSign className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary group-focus-within:text-primary transition-colors" />
                <input
                  type="text"
                  placeholder="e.g. $120k - $160k"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-14 pr-6 outline-none focus:border-primary/50 transition-all font-bold placeholder:text-white/20"
                  value={formData.salary}
                  onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                />
              </div>
            </div>

            {/* Location */}
            <div className="space-y-3">
              <label className="text-xs font-black uppercase tracking-widest text-secondary ml-1">Location</label>
              <div className="relative group">
                <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary group-focus-within:text-primary transition-colors" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Remote or San Francisco, CA"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-14 pr-6 outline-none focus:border-primary/50 transition-all font-bold placeholder:text-white/20"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                />
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-3">
            <label className="text-xs font-black uppercase tracking-widest text-secondary ml-1">Job Description</label>
            <textarea
              required
              rows="6"
              placeholder="Detail the technical requirements, responsibilities, and impact of this role..."
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-6 px-6 outline-none focus:border-primary/50 transition-all font-medium placeholder:text-white/20 resize-none"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={loading}
              className="glow-button px-10 py-4 flex items-center gap-3 font-black uppercase tracking-[0.2em] group"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  {editJob ? 'Update Job Architecture' : 'Deploy Job Listing'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PostJob;
