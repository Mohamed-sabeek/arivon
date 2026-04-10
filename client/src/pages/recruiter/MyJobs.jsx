import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Briefcase, MoreVertical, ExternalLink, Filter, 
  Search, ArrowLeft, Trash2, Power, PowerOff,
  AlertCircle, CheckCircle2, Calendar, MapPin, Pencil
} from 'lucide-react';
import api from '../../api/axios';

const MyJobs = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedJob, setSelectedJob] = useState(null);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const res = await api.get('/jobs/my-jobs');
      setJobs(res.data);
    } catch (err) {
      console.error('Failed to fetch jobs:', err);
      setError('System failure: Unable to retrieve job listings.');
    } finally {
      setLoading(false);
    }
  };

  const toggleStatus = async (jobId, currentStatus) => {
    try {
      const newStatus = currentStatus === 'Active' ? 'Closed' : 'Active';
      await api.patch(`/jobs/${jobId}/status`, { status: newStatus });
      setJobs(jobs.map(job => job._id === jobId ? { ...job, status: newStatus } : job));
    } catch (err) {
      console.error('Failed to update status:', err);
      alert('Operation failed. Please check network connectivity.');
    }
  };

  const handleDelete = async (jobId) => {
    if (!window.confirm("System Alert: Permanent deletion requested. Confirm destruction of job record?")) return;
    try {
      await api.delete(`/jobs/${jobId}`);
      setJobs(jobs.filter(job => job._id !== jobId));
      if (selectedJob?._id === jobId) setSelectedJob(null);
    } catch (err) {
      console.error('Delete failed:', err);
      alert('Operation failed. Target record remains intact.');
    }
  };

  const filteredJobs = jobs.filter(job => 
    job.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#0F172A] p-8">
      <div className="max-w-6xl mx-auto">
        <button 
          onClick={() => navigate('/recruiter/dashboard')}
          className="flex items-center gap-2 text-secondary hover:text-primary transition-colors mb-8 font-bold uppercase tracking-widest text-xs"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </button>

        <header className="mb-12 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-3 text-primary mb-3"
            >
              <div className="w-8 h-1 bg-primary rounded-full" />
              <span className="text-xs font-black uppercase tracking-[0.3em]">Operational Inventory</span>
            </motion.div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tighter uppercase mb-2">
              My Job <span className="text-primary">Listings</span>
            </h1>
            <p className="text-secondary text-lg font-medium opacity-80">
              Manage and monitor your active and closed job deployments.
            </p>
          </div>

          <div className="flex gap-4">
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary group-focus-within:text-primary transition-colors" />
              <input 
                type="text"
                placeholder="Search listings..."
                className="bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-6 outline-none focus:border-primary/50 transition-all font-bold text-sm w-64 placeholder:text-white/20"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button className="glass-card px-6 py-3 flex items-center gap-2 hover:bg-white/5 transition-all text-sm font-bold uppercase tracking-widest border-white/10">
              <Filter className="w-4 h-4 text-secondary" />
              Filter
            </button>
          </div>
        </header>

        {error && (
          <div className="glass-card p-6 border-red-500/20 flex items-center gap-4 mb-8 text-red-500 font-bold">
            <AlertCircle className="w-6 h-6" />
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            <p className="text-secondary font-bold uppercase tracking-widest text-xs animate-pulse">Syncing job database...</p>
          </div>
        ) : filteredJobs.length > 0 ? (
          <div className="glass-card overflow-hidden border-white/5">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-white/5 border-b border-white/5">
                  <tr>
                    <th className="px-6 py-4 text-[10px] font-black text-secondary uppercase tracking-[0.2em]">Job Architecture</th>
                    <th className="px-6 py-4 text-[10px] font-black text-secondary uppercase tracking-[0.2em]">Intel / Location</th>
                    <th className="px-6 py-4 text-[10px] font-black text-secondary uppercase tracking-[0.2em]">Engagement</th>
                    <th className="px-6 py-4 text-[10px] font-black text-secondary uppercase tracking-[0.2em]">Status</th>
                    <th className="px-6 py-4 text-[10px] font-black text-secondary uppercase tracking-[0.2em]">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredJobs.map((job) => (
                    <tr key={job._id} className="hover:bg-white/[0.02] transition-colors group">
                      <td 
                        className="px-6 py-6 cursor-pointer"
                        onClick={() => setSelectedJob(job)}
                      >
                        <p className="font-black text-sm group-hover:text-primary transition-colors mb-1 uppercase tracking-tight flex items-center gap-2">
                          {job.title}
                          <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </p>
                        <p className="text-[10px] text-secondary font-medium uppercase tracking-widest">Added: {new Date(job.createdAt).toLocaleDateString()}</p>
                      </td>
                      <td className="px-6 py-6 font-bold text-sm">
                        <div className="flex flex-col gap-1">
                          <span className="text-secondary opacity-80">{job.location}</span>
                          <span className="text-xs text-primary/70">{job.salary || 'N/A'}</span>
                        </div>
                      </td>
                      <td className="px-6 py-6">
                        <div className="flex items-center gap-2">
                          <span className="font-black text-lg">{job.applicantsCount}</span>
                          <span className="text-[10px] text-secondary font-black uppercase tracking-tighter">Applicants</span>
                        </div>
                      </td>
                      <td className="px-6 py-6">
                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.1em] ${
                          job.status === 'Active' ? 'bg-emerald-400/10 text-emerald-400 border border-emerald-400/20' : 'bg-red-400/10 text-red-400 border border-red-400/20'
                        }`}>
                          {job.status}
                        </span>
                      </td>
                      <td className="px-6 py-6">
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => toggleStatus(job._id, job.status)}
                            className="p-2.5 hover:bg-white/5 rounded-xl transition-all text-secondary hover:text-primary group/btn"
                            title={job.status === 'Active' ? 'Deactivate' : 'Activate'}
                          >
                            {job.status === 'Active' ? <PowerOff className="w-4 h-4" /> : <Power className="w-4 h-4" />}
                          </button>
                          
                          <button 
                            onClick={() => navigate('/recruiter/post-job', { state: { job } })}
                            className="p-2.5 hover:bg-white/5 rounded-xl transition-all text-secondary hover:text-emerald-400"
                            title="Quick Edit"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>

                          <button 
                            onClick={() => handleDelete(job._id)}
                            className="p-2.5 hover:bg-white/5 rounded-xl transition-all text-secondary hover:text-red-500"
                            title="Delete Listing"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="glass-card p-16 flex flex-col items-center justify-center text-center">
            <div className="w-24 h-24 bg-white/5 rounded-[2.5rem] flex items-center justify-center mb-8 border border-white/5">
              <Briefcase className="w-10 h-10 text-secondary/30" />
            </div>
            <h4 className="text-2xl font-black uppercase mb-3">Void Detected</h4>
            <p className="text-secondary max-w-sm mb-10 font-medium opacity-80">You currently have no job listings deployed in the field. Initialize your first requisition now.</p>
            <button 
              onClick={() => navigate('/recruiter/post-job')}
              className="glow-button px-10 py-4 flex items-center gap-3 text-sm font-black uppercase tracking-[0.2em]"
            >
              Post First Job Listing
            </button>
          </div>
        )}
      </div>

      {/* JOB DETAIL MODAL */}
      <AnimatePresence>
        {selectedJob && (
          <>
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedJob(null)}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[99]"
            />
            {/* Modal Content */}
            <motion.div 
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 100 }}
              className="fixed right-0 top-0 bottom-0 w-full max-w-2xl bg-[#0F172A] border-l border-white/10 z-[100] p-8 md:p-12 overflow-y-auto shadow-2xl"
            >
              <div className="flex items-center justify-between mb-12">
                <button 
                  onClick={() => setSelectedJob(null)}
                  className="p-3 hover:bg-white/5 rounded-2xl transition-all text-secondary border border-white/5"
                >
                  <ArrowLeft className="w-5 h-5 font-black" />
                </button>
                <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.1em] ${
                  selectedJob.status === 'Active' ? 'bg-emerald-400/10 text-emerald-400 border border-emerald-400/20' : 'bg-red-400/10 text-red-400 border border-red-400/20'
                }`}>
                  {selectedJob.status}
                </span>
              </div>

              <div className="mb-12">
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <h2 className="text-4xl md:text-5xl font-black tracking-tighter uppercase mb-4 leading-none">
                    {selectedJob.title}
                  </h2>
                  <div className="flex flex-wrap gap-4 text-secondary font-bold text-xs uppercase tracking-widest opacity-70">
                    <span className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5 text-primary" />{selectedJob.location}</span>
                    <span className="flex items-center gap-2"><Briefcase className="w-3.5 h-3.5 text-primary" />{selectedJob.salary}</span>
                    <span className="flex items-center gap-2"><Calendar className="w-3.5 h-3.5 text-primary" />{new Date(selectedJob.createdAt).toLocaleDateString()}</span>
                  </div>
                </motion.div>
              </div>

              <div className="space-y-12">
                {/* DescriptionSection */}
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="space-y-4"
                >
                  <h3 className="text-[10px] font-black text-primary uppercase tracking-[0.3em] flex items-center gap-3">
                    <div className="w-6 h-[2px] bg-primary" />
                    Mission Parameters
                  </h3>
                  <div className="text-white/80 leading-relaxed font-medium whitespace-pre-wrap">
                    {selectedJob.description}
                  </div>
                </motion.div>

                {/* Skills Section */}
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="space-y-4"
                >
                  <h3 className="text-[10px] font-black text-primary uppercase tracking-[0.3em] flex items-center gap-3">
                    <div className="w-6 h-[2px] bg-primary" />
                    Required Assets
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedJob.skillsRequired?.map((skill, idx) => (
                      <span key={idx} className="bg-white/5 border border-white/10 px-4 py-2 rounded-xl text-xs font-bold text-white shadow-sm">
                        {skill}
                      </span>
                    ))}
                  </div>
                </motion.div>

                {/* Performance Section */}
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="glass-card p-8 border-white/5"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-[10px] font-black text-secondary uppercase tracking-[0.2em] mb-1">Current Engagement</h4>
                      <p className="text-3xl font-black uppercase">{selectedJob.applicantsCount} <span className="text-xs text-secondary/50">Candidates</span></p>
                    </div>
                    <button 
                      onClick={() => navigate('/recruiter/candidates', { state: { jobId: selectedJob._id } })}
                      className="bg-primary/10 text-primary border border-primary/20 p-4 rounded-2xl hover:bg-primary/20 transition-all group"
                    >
                      <ExternalLink className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    </button>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MyJobs;
