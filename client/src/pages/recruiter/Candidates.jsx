import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, Search, Filter, CheckCircle2, XCircle, 
  ExternalLink, Mail, Briefcase, Target, Zap, 
  Clock, ArrowRight, User, ShieldCheck, MoreVertical
} from 'lucide-react';
import api from '../../api/axios';

const Candidates = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterJob, setFilterJob] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const res = await api.get('/applications/recruiter');
      setApplications(res.data);
    } catch (err) {
      console.error('Failed to fetch applications:', err);
      setError('System failure: Unable to retrieve candidate database.');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (appId, newStatus) => {
    try {
      await api.patch(`/applications/${appId}/status`, { status: newStatus });
      setApplications(applications.map(app => 
        app._id === appId ? { ...app, status: newStatus } : app
      ));
    } catch (err) {
      console.error('Failed to update status:', err);
      alert('Operation failed. Please check network connectivity.');
    }
  };

  const uniqueJobs = ['All', ...new Set(applications.map(app => app.jobId?.title))];

  const filteredApps = applications.filter(app => {
    const matchesJob = filterJob === 'All' || app.jobId?.title === filterJob;
    const matchesSearch = app.studentId?.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         app.studentId?.email.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesJob && matchesSearch;
  });

  const stats = {
    total: applications.length,
    shortlisted: applications.filter(a => a.status === 'Shortlisted').length,
    pending: applications.filter(a => a.status === 'Pending').length
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0F172A] flex flex-col items-center justify-center gap-4">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-secondary font-bold uppercase tracking-widest text-xs animate-pulse">Initializing Candidate Matrix...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0F172A] p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-12">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3 text-primary mb-3"
          >
            <div className="w-8 h-1 bg-primary rounded-full" />
            <span className="text-xs font-black uppercase tracking-[0.3em]">Talent Acquisition Intelligence</span>
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter uppercase mb-2">
            Candidate <span className="text-primary">Management</span>
          </h1>
          <p className="text-secondary text-lg font-medium opacity-80">
            Review, analyze, and shortlist high-alignment technical assets.
          </p>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {[
            { label: 'Total Applicants', value: stats.total, icon: Users, color: 'text-white' },
            { label: 'Shortlisted', value: stats.shortlisted, icon: CheckCircle2, color: 'text-emerald-400' },
            { label: 'Pending Review', value: stats.pending, icon: Clock, color: 'text-amber-400' }
          ].map((stat, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="glass-card p-6 border-white/5 relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full blur-2xl -mr-12 -mt-12 group-hover:bg-primary/5 transition-all" />
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center border border-white/5">
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase text-secondary tracking-widest mb-1">{stat.label}</p>
                  <p className={`text-3xl font-black ${stat.color}`}>{stat.value}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Filters */}
        <div className="glass-card p-6 mb-8 border-white/5 flex flex-col md:flex-row gap-6">
          <div className="flex-1 relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary group-focus-within:text-primary transition-colors" />
            <input 
              type="text"
              placeholder="Search by name or email..."
              className="bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-6 outline-none focus:border-primary/50 transition-all font-bold text-sm w-full placeholder:text-white/20"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-4">
            <Filter className="w-4 h-4 text-secondary" />
            <select 
              className="bg-white/5 border border-white/10 rounded-xl py-3 px-6 outline-none focus:border-primary/50 transition-all font-bold text-sm appearance-none cursor-pointer hover:bg-white/10"
              value={filterJob}
              onChange={(e) => setFilterJob(e.target.value)}
            >
              {uniqueJobs.map(job => (
                <option key={job} value={job} className="bg-[#0F172A]">{job}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Candidate List */}
        <div className="space-y-4">
          <AnimatePresence mode="popLayout">
            {filteredApps.length > 0 ? (
              filteredApps.map((app, idx) => (
                <motion.div
                  key={app._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: idx * 0.05 }}
                  className="glass-card p-6 border-white/5 hover:border-white/10 transition-all group"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center gap-8">
                    {/* Identity */}
                    <div className="flex items-center gap-4 lg:w-1/4">
                      <div className="w-14 h-14 bg-gradient-to-br from-primary to-orange-600 rounded-2xl flex items-center justify-center text-xl font-black shadow-lg">
                        {app.studentId?.name.charAt(0)}
                      </div>
                      <div>
                        <h3 className="font-black text-lg group-hover:text-primary transition-colors">{app.studentId?.name}</h3>
                        <p className="text-xs text-secondary font-bold flex items-center gap-1.5">
                          <Mail className="w-3 h-3" /> {app.studentId?.email}
                        </p>
                      </div>
                    </div>

                    {/* Job Applied For */}
                    <div className="lg:w-1/5">
                      <p className="text-[10px] uppercase font-black text-secondary tracking-widest mb-2">Applied Position</p>
                      <div className="flex items-center gap-2 text-white font-bold text-sm">
                        <Briefcase className="w-4 h-4 text-primary" />
                        {app.jobId?.title}
                      </div>
                    </div>

                    {/* Match Score */}
                    <div className="lg:w-1/5">
                      <p className="text-[10px] uppercase font-black text-secondary tracking-widest mb-2">Internal Alignment</p>
                      <div className="flex items-center gap-3">
                        <div className="text-2xl font-black text-primary">{app.matchScore}%</div>
                        <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${app.matchScore}%` }}
                            className="h-full bg-primary"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Verified Skills */}
                    <div className="lg:w-1/5">
                      <p className="text-[10px] uppercase font-black text-secondary tracking-widest mb-2">Verified Assets</p>
                      <div className="flex flex-wrap gap-1.5">
                        {app.studentId?.skills?.slice(0, 3).map((skill, i) => (
                          <div key={i} className="flex items-center gap-1 bg-emerald-400/10 border border-emerald-400/20 px-2 py-0.5 rounded-full text-[10px] font-black text-emerald-400 uppercase">
                            <ShieldCheck className="w-2.5 h-2.5" />
                            {skill}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="lg:w-1/4 flex items-center justify-end gap-3">
                      <div className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border ${
                        app.status === 'Shortlisted' ? 'bg-emerald-400/10 text-emerald-400 border-emerald-400/20' :
                        app.status === 'Rejected' ? 'bg-red-400/10 text-red-400 border-red-400/20' :
                        'bg-white/5 text-secondary border-white/5'
                      }`}>
                        {app.status}
                      </div>
                      
                      {app.status === 'Pending' && (
                        <div className="flex items-center gap-2 border-l border-white/10 pl-6 ml-3">
                          <button 
                            onClick={() => updateStatus(app._id, 'Shortlisted')}
                            className="p-2.5 bg-emerald-400/10 hover:bg-emerald-400 text-emerald-400 hover:text-white rounded-xl transition-all border border-emerald-400/20"
                            title="Shortlist"
                          >
                            <CheckCircle2 className="w-5 h-5" />
                          </button>
                          <button 
                            onClick={() => updateStatus(app._id, 'Rejected')}
                            className="p-2.5 bg-red-400/10 hover:bg-red-400 text-red-400 hover:text-white rounded-xl transition-all border border-red-400/20"
                            title="Reject"
                          >
                            <XCircle className="w-5 h-5" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="glass-card p-24 text-center border-white/5">
                <Users className="w-16 h-16 text-white/10 mx-auto mb-6" />
                <h3 className="text-2xl font-black uppercase mb-2">No Candidates Detected</h3>
                <p className="text-secondary max-w-sm mx-auto font-medium opacity-60">Adjust your reconnaissance filters or wait for candidate deployment signals.</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Candidates;
