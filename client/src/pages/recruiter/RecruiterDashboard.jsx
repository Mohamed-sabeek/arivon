import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Users, Briefcase, CheckCircle, Clock, Plus, 
  Search, Filter, MoreVertical, ExternalLink, 
  TrendingUp, BarChart3, Building2, LayoutDashboard
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';

const RecruiterDashboard = () => {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const res = await api.get('/jobs/my-jobs');
      setJobs(res.data);
    } catch (err) {
      console.error('Failed to fetch jobs:', err);
    } finally {
      setLoading(false);
    }
  };

  const activeJobs = jobs.filter(j => j.status === 'Active');
  const totalApplicants = jobs.reduce((acc, curr) => acc + curr.applicantsCount, 0);

  const stats = [
    { label: 'Total Jobs Posted', value: jobs.length.toString(), icon: Briefcase, color: 'text-blue-400', bg: 'bg-blue-400/10' },
    { label: 'Active Jobs', value: activeJobs.length.toString(), icon: TrendingUp, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
    { label: 'Total Applicants', value: totalApplicants.toString(), icon: Users, color: 'text-primary', bg: 'bg-primary/10' },
    { label: 'Shortlisted', value: '0', icon: CheckCircle, color: 'text-purple-400', bg: 'bg-purple-400/10' },
  ];

  const recentJobs = jobs.slice(0, 4);

  return (
    <div className="min-h-screen bg-[#0F172A] text-white flex">
      {/* Dashboard Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        {/* Header */}
        <header className="mb-12 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-3 text-primary mb-3"
            >
              <div className="w-8 h-1 bg-primary rounded-full" />
              <span className="text-xs font-black uppercase tracking-[0.3em]">Recruiter Console v1.0</span>
            </motion.div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tighter uppercase mb-2">
              Welcome back, <span className="text-primary">{profile?.companyName || 'Recruiter'}</span>
            </h1>
            <p className="text-secondary text-lg font-medium opacity-80">
              Manage your talent pipeline and job ecosystem from your command center.
            </p>
          </div>

          <div className="flex gap-4">
            <button className="glass-card px-6 py-3 flex items-center gap-2 hover:bg-white/5 transition-all text-sm font-bold uppercase tracking-widest border-white/10">
              <BarChart3 className="w-4 h-4 text-secondary" />
              Analytic Reports
            </button>
            <button 
              onClick={() => navigate('/recruiter/post-job')}
              className="glow-button px-8 py-3 flex items-center gap-2 text-sm font-black uppercase tracking-widest"
            >
              <Plus className="w-5 h-5" />
              Post New Job
            </button>
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="glass-card p-6 flex items-center gap-6 group hover:border-primary/30 transition-all cursor-default"
            >
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 ${stat.bg}`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-secondary mb-1">{stat.label}</p>
                <p className="text-3xl font-black">{stat.value}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom Section: Quick Actions & Recent Jobs */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <div className="lg:col-span-1 space-y-6">
            <h3 className="text-xl font-black uppercase tracking-tight flex items-center gap-3">
              <LayoutDashboard className="w-5 h-5 text-primary" />
              Quick Operations
            </h3>
            
            <div className="grid grid-cols-1 gap-4">
              {[
                { title: 'View All Applicants', desc: 'Screen and shortlist candidates', icon: Users, color: 'text-blue-400', path: '#' },
                { title: 'Active Listings', desc: 'Modify live job postings', icon: Briefcase, color: 'text-emerald-400', path: '/recruiter/jobs' },
                { title: 'System Settings', desc: 'Manage your recruiter profile', icon: Building2, color: 'text-secondary', path: '#' },
              ].map((action, idx) => (
                <button 
                  key={idx}
                  onClick={() => action.path !== '#' && navigate(action.path)}
                  className="glass-card p-5 flex items-start gap-4 hover:border-primary/30 hover:bg-white/5 transition-all text-left group"
                >
                  <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0 group-hover:bg-primary/10 transition-colors">
                    <action.icon className={`w-5 h-5 ${action.color}`} />
                  </div>
                  <div>
                    <h4 className="font-black text-sm uppercase mb-1">{action.title}</h4>
                    <p className="text-xs text-secondary font-medium">{action.desc}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Jobs Table */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-black uppercase tracking-tight">Recent Job Postings</h3>
              <button 
                onClick={() => navigate('/recruiter/jobs')}
                className="text-primary text-xs font-black uppercase tracking-widest flex items-center gap-2 hover:underline"
              >
                See All Jobs <ExternalLink className="w-3 h-3" />
              </button>
            </div>

            {loading ? (
              <div className="glass-card p-12 flex flex-col items-center justify-center">
                <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mb-4" />
                <p className="text-xs text-secondary font-bold uppercase tracking-widest">Initializing Inventory...</p>
              </div>
            ) : recentJobs.length > 0 ? (
              <div className="glass-card overflow-hidden border-white/5">
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-white/5 border-b border-white/5">
                      <tr>
                        <th className="px-6 py-4 text-[10px] font-black text-secondary uppercase tracking-[0.2em]">Job Title</th>
                        <th className="px-6 py-4 text-[10px] font-black text-secondary uppercase tracking-[0.2em]">Applicants</th>
                        <th className="px-6 py-4 text-[10px] font-black text-secondary uppercase tracking-[0.2em]">Status</th>
                        <th className="px-6 py-4 text-[10px] font-black text-secondary uppercase tracking-[0.2em]">Posted Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {recentJobs.map((job) => (
                        <tr key={job._id} className="hover:bg-white/[0.02] transition-colors group">
                          <td className="px-6 py-5">
                            <p className="font-black text-sm group-hover:text-primary transition-colors uppercase tracking-tighter">{job.title}</p>
                          </td>
                          <td className="px-6 py-5">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-sm">{job.applicantsCount}</span>
                              <span className="text-[10px] text-secondary font-medium uppercase">Total</span>
                            </div>
                          </td>
                          <td className="px-6 py-5">
                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${
                              job.status === 'Active' ? 'bg-emerald-400/10 text-emerald-400' : 'bg-red-400/10 text-red-400'
                            }`}>
                              {job.status}
                            </span>
                          </td>
                          <td className="px-6 py-5 text-sm text-secondary font-medium">
                            {new Date(job.createdAt).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="glass-card p-12 flex flex-col items-center justify-center text-center">
                <div className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center mb-6 border border-white/5">
                  <Briefcase className="w-10 h-10 text-secondary/30" />
                </div>
                <h4 className="text-xl font-black uppercase mb-2">No jobs posted yet</h4>
                <p className="text-secondary max-w-xs mb-8 font-medium">Start building your talent ecosystem by posting your first opportunity.</p>
                <button 
                  onClick={() => navigate('/recruiter/post-job')}
                  className="glow-button px-8 py-3 flex items-center gap-2 text-sm font-black uppercase tracking-widest"
                >
                  Post Your First Job
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default RecruiterDashboard;
