import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Layers, CheckCircle2, TrendingUp, Sparkles, BookOpen, Briefcase, Trophy, Brain
} from 'lucide-react';
import { Link } from 'react-router-dom';
import Loader from '../components/Loader';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { profile, loading } = useAuth();

  if (loading || !profile) return <div className="p-20"><Loader text="Syncing Career Dashboard..." /></div>;

  // Calculate Verification Stats
  const assessments = profile?.assessments || {};
  const verifiedCount = Object.values(assessments).filter(a => a.finalStatus === 'verified').length;
  const inProgressCount = Object.values(assessments).filter(a => a.level1?.status === 'passed' && a.finalStatus !== 'verified').length;

  const StatCard = ({ icon: Icon, label, value, color }) => (
    <div className="glass-card p-6 flex items-center gap-6 group hover:border-primary/30 transition-all">
      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 ${color}`}>
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <p className="text-[10px] font-black uppercase tracking-widest text-secondary/60 mb-1">{label}</p>
        <p className="text-2xl font-black">{value}</p>
      </div>
    </div>
  );

  return (
    <div className="p-8 max-w-7xl mx-auto min-h-screen">
      {/* Hero Welcome */}
      <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div>
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3 text-primary mb-4"
          >
            <div className="w-8 h-1 bg-primary rounded-full" />
            <span className="text-xs font-black uppercase tracking-[0.3em]">Neural Interface v2.5</span>
          </motion.div>
          <h1 className="text-5xl font-black tracking-tighter uppercase mb-4">
            Welcome, <span className="text-primary">{profile?.name?.split(' ')[0] || 'User'}</span>
          </h1>
          <p className="text-secondary max-w-xl text-lg leading-relaxed font-bold">
            Navigate your career architecture, verified skills, and job-market standing from your centralized command center.
          </p>
        </div>
        
        <div className="glass-card p-6 min-w-[300px] border-primary/20 bg-primary/5">
          <div className="flex items-center gap-4 mb-4">
            <TrendingUp className="text-primary w-5 h-5" />
            <span className="text-sm font-black uppercase tracking-widest">Career Readiness</span>
          </div>
          <div className="h-2 bg-white/5 rounded-full overflow-hidden mb-2">
            <div className="h-full bg-primary shadow-[0_0_10px_rgba(249,115,22,0.5)]" style={{ width: profile?.isProfileComplete ? '100%' : '65%' }} />
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[10px] text-primary font-black uppercase tracking-tighter">Sync Active</span>
            <p className="text-[10px] text-secondary text-right font-bold">{profile?.isProfileComplete ? '100% Core Configured' : '65% Configured'}</p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <StatCard icon={Trophy} label="Verified Skills" value={verifiedCount} color="bg-success/20 text-success" />
        <StatCard icon={Brain} label="In Assessment" value={inProgressCount} color="bg-yellow-500/20 text-yellow-500" />
        <StatCard icon={Briefcase} label="Projects" value={profile.projects?.hasProjects ? profile.projects.count : 0} color="bg-primary/20 text-primary" />
        <StatCard icon={Layers} label="Total Skills" value={profile.skills?.length || 0} color="bg-blue-500/20 text-blue-400" />
      </div>

      {/* Feature Bento Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Verification Hub Link */}
        <Link 
          to="/assessment"
          className="glass-card p-8 flex flex-col justify-between group overflow-hidden relative border-primary/20 hover:border-primary/50 transition-all"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -z-10 group-hover:bg-primary/10 transition-colors" />
          <div>
            <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center text-primary mb-6 transition-transform group-hover:scale-110">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-black mb-4 uppercase tracking-tighter">Skill Verification Hub</h3>
            <p className="text-secondary text-sm leading-relaxed mb-8 font-medium">
              Validate your technical architecture. Proceed to Level 2 Practical Screening and unlock your green verification badges.
            </p>
          </div>
          <div className="flex items-center justify-center py-3 bg-primary text-white rounded-xl font-black uppercase tracking-widest text-xs shadow-lg shadow-primary/20 group-hover:-translate-y-1 transition-all">
            Enter Verification Hub
          </div>
        </Link>

        {/* Skills Preview */}
        <div className="glass-card p-8 flex flex-col justify-between group overflow-hidden relative border-white/5">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl -z-10 group-hover:bg-blue-500/10 transition-colors" />
          <div>
            <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center text-blue-400 mb-6 transition-transform group-hover:scale-110">
              <Layers className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-black mb-4 uppercase tracking-tighter">Your Intelligence Stack</h3>
            <p className="text-secondary text-sm leading-relaxed mb-4 font-medium">
              A snapshot of your registered technical capabilities.
            </p>
            <div className="flex flex-wrap gap-2 mb-8">
              {profile.skills?.slice(0, 10).map((skill, idx) => {
                const stats = assessments[skill];
                const isVerified = stats?.finalStatus === 'verified';
                return (
                  <span 
                    key={idx} 
                    className={`px-3 py-1.5 border rounded-full text-[10px] font-black uppercase tracking-tighter transition-colors ${isVerified ? 'bg-success/10 border-success/30 text-success' : 'bg-white/5 border-white/10 text-secondary'}`}
                  >
                    {skill} {isVerified && '●'}
                  </span>
                );
              })}
              {(!profile.skills || profile.skills.length === 0) && (
                <span className="text-xs text-secondary italic">No skills registered yet</span>
              )}
            </div>
          </div>
          <Link to="/profile" className="flex items-center justify-center py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white font-bold tracking-wide transition-all uppercase text-xs">
            Edit Stack
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
