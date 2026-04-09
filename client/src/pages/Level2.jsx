import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Github, 
  ArrowLeft, 
  Target, 
  Cpu, 
  Search, 
  CheckCircle2, 
  AlertCircle,
  FileCode,
  Box,
  Layout,
  Settings,
  ShieldCheck,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import Loader from '../components/Loader';

const Level2 = () => {
  const { skill } = useParams();
  const navigate = useNavigate();
  const { profile, refreshProfile } = useAuth();

  const [repoLink, setRepoLink] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  // Verification: Ensure L1 is passed
  useEffect(() => {
    if (profile && profile.assessments) {
      const stats = profile.assessments[skill];
      if (!stats || stats.level1?.status !== 'passed') {
        navigate('/assessment');
      }
    }
  }, [profile, skill, navigate]);

  if (!profile) return <Loader text="Synchronizing Screening Sequence..." />;

  // Define Skill Tasks
  const taskMap = {
    'JavaScript': {
      title: 'Technical Logic: Task Engine',
      description: 'Build a sophisticated Task Management application using core JavaScript logic.',
      requirements: ['Full CRUD operations', 'Browser LocalStorage persistence', 'Dynamic UI filtering', 'Clean modern CSS'],
      icon: FileCode
    },
    'React': {
      title: 'Architectural Design: Analytics Dash',
      description: 'Construct a data visualization dashboard utilizing React functional components.',
      requirements: ['State management (Hooks)', 'Dynamic API data fetching', 'Responsive component architecture', 'Reusable UI elements'],
      icon: Layout
    },
    'Python': {
      title: 'Systems Automation: CLI Integrity',
      description: 'Develop a Python-based automation tool or advanced CLI data processor.',
      requirements: ['Exception handling', 'File I/O or API integration', 'Modular code structure', 'Standard library optimization'],
      icon: Settings
    },
    'Node.js': {
      title: 'Backend Architecture: REST API',
      description: 'Design a robust RESTful API with middleware and data persistence.',
      requirements: ['JWT Authentication', 'MongoDB/SQL Integration', 'Error handling middleware', 'Clean folder structure'],
      icon: Box
    }
  };

  const currentTask = taskMap[skill] || {
    title: `${skill} Implementation`,
    description: `Demonstrate your technical depth in ${skill} by building a high-impact professional project.`,
    requirements: ['Clean repository structure', 'Comprehensive README.md', 'Modern technical implementation', 'Production-ready code'],
    icon: Target
  };

  const handleSubmit = async () => {
    if (!repoLink || !repoLink.includes('github.com')) {
      setError("Please provide a valid GitHub repository URL.");
      return;
    }

    setIsSubmitting(true);
    setError(null);
    try {
      const res = await api.post('/assessment/submit-repo', { skill, repoLink });
      setResult(res.data);
      await refreshProfile();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to initiate AI screening. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (result) {
    const isPassed = result.finalStatus === 'verified';
    return (
      <div className="p-8 max-w-4xl mx-auto min-h-screen flex items-center justify-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card p-12 border border-white/5 text-center relative overflow-hidden w-full"
        >
          <div className={`absolute top-0 left-0 w-full h-1 ${isPassed ? 'bg-success' : 'bg-error'}`} />
          <div className="mb-8">
            <div className={`w-24 h-24 rounded-full mx-auto flex items-center justify-center mb-6 ${isPassed ? 'bg-success/20 text-success' : 'bg-error/20 text-error'}`}>
               {isPassed ? <ShieldCheck className="w-12 h-12" /> : <AlertCircle className="w-12 h-12" />}
            </div>
            <h2 className="text-4xl font-black uppercase tracking-tighter text-white mb-2">
              {isPassed ? "Practical Logic Verified" : "Verification Failed"}
            </h2>
            <p className="text-secondary font-bold text-lg mb-8">{skill} Level 2 Assessment Complete</p>
          </div>

          <div className="glass-card p-8 bg-white/5 border-white/10 text-left mb-10">
            <div className="flex items-center justify-between mb-4">
               <span className="text-xs font-black tracking-widest text-primary uppercase">AI Technical Feedback</span>
               <span className={`text-xl font-black ${isPassed ? 'text-success' : 'text-error'}`}>{result.aiScore}% Match</span>
            </div>
            <p className="text-secondary text-base leading-relaxed italic">"{result.feedback}"</p>
          </div>

          <button
            onClick={() => navigate('/assessment')}
            className="px-10 py-4 bg-primary text-white font-black uppercase tracking-widest rounded-xl hover:shadow-[0_0_20px_rgba(249,115,22,0.3)] transition-all flex items-center gap-3 mx-auto"
          >
            Return to Assessment Hub
            <ChevronRight className="w-5 h-5" />
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-5xl mx-auto min-h-screen space-y-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start gap-6">
        <div>
           <button 
             onClick={() => navigate('/assessment')}
             className="flex items-center gap-2 text-secondary hover:text-primary transition-colors mb-6 font-black uppercase text-[10px] tracking-widest"
           >
             <ArrowLeft className="w-4 h-4" /> Back to Assessment
           </button>
           <div className="flex items-center gap-4 mb-3">
             <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center border border-primary/30 shadow-[0_0_20px_rgba(249,115,22,0.2)]">
               <currentTask.icon className="w-8 h-8 text-primary" />
             </div>
             <div>
               <p className="text-sm font-black uppercase tracking-[0.3em] text-primary mb-1">Practical Screening: Level 2</p>
               <h1 className="text-5xl font-black tracking-tighter text-white uppercase">{skill} Challenge</h1>
             </div>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Task Details */}
        <div className="lg:col-span-2 space-y-8">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass-card p-10 border border-white/5 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-8 opacity-5">
               <currentTask.icon className="w-48 h-48 text-white" />
            </div>
            <h2 className="text-2xl font-black text-white mb-4 uppercase tracking-tight">{currentTask.title}</h2>
            <p className="text-secondary text-lg leading-relaxed mb-8 font-medium italic">"{currentTask.description}"</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {currentTask.requirements.map((req, i) => (
                <div key={i} className="flex gap-4 items-start p-4 bg-white/5 rounded-2xl border border-white/5">
                  <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xs font-black">
                    {i + 1}
                  </div>
                  <p className="text-sm text-secondary font-bold">{req}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card p-10 border border-white/5"
          >
            <h3 className="text-xl font-black text-white mb-6 flex items-center gap-3 uppercase tracking-widest">
              <Github className="w-6 h-6 text-primary" /> Submission Terminal
            </h3>
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-secondary opacity-60 ml-1">GitHub Repository URL</label>
                <input 
                  type="text" 
                  value={repoLink}
                  onChange={(e) => setRepoLink(e.target.value)}
                  placeholder="https://github.com/username/project"
                  className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl text-white outline-none focus:border-primary/50 transition-all font-bold placeholder:text-white/10"
                />
              </div>
              
              {error && (
                <div className="flex items-center gap-3 p-4 bg-error/10 border border-error/20 rounded-xl text-error text-sm font-bold">
                  <AlertCircle className="w-5 h-5" /> {error}
                </div>
              )}

              <button
                onClick={handleSubmit}
                disabled={isSubmitting || !repoLink}
                className={`
                  w-full py-5 rounded-2xl font-black uppercase tracking-widest text-sm flex items-center justify-center gap-3 transition-all
                  ${(isSubmitting || !repoLink) 
                    ? 'bg-white/5 text-white/20 border border-white/10 cursor-not-allowed'
                    : 'bg-primary text-white hover:shadow-[0_0_30px_rgba(249,115,22,0.4)] hover:-translate-y-1'}
                `}
              >
                {isSubmitting ? "Initiating Analysis..." : "Submit for AI Certification"}
                <Sparkles className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        </div>

        {/* Right: Rules */}
        <div className="space-y-6">
           <div className="glass-card p-8 border border-white/5 bg-gradient-to-br from-white/5 to-transparent">
              <h4 className="text-sm font-black text-white uppercase tracking-widest mb-6 flex items-center gap-3">
                <ShieldCheck className="w-4 h-4 text-primary" /> Screening Protocol
              </h4>
              <ul className="space-y-4">
                {[
                  "Public GitHub repo only.",
                  "Meaningful commit history.",
                  "Professional README documentation.",
                  "Original code only (Verified by AI)."
                ].map((txt, i) => (
                  <li key={i} className="flex gap-3 text-secondary text-xs font-bold leading-relaxed">
                    <span className="text-primary mt-0.5">•</span> {txt}
                  </li>
                ))}
              </ul>
           </div>

           <div className="glass-card p-8 border border-primary/20 bg-primary/5">
              <div className="flex items-center gap-4 mb-4">
                 <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                    <Cpu className="text-primary w-5 h-5" />
                 </div>
                 <h4 className="text-sm font-black text-white uppercase tracking-tighter">AI Verification Engine</h4>
              </div>
              <p className="text-secondary text-[11px] font-bold leading-relaxed">
                Our Llama-3 backend performs a multi-dimensional scan of your repository to verify structural integrity and practical domain logic.
              </p>
           </div>
        </div>
      </div>

      {/* Analysis Overlay */}
      <AnimatePresence>
        {isSubmitting && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-background/90 backdrop-blur-2xl flex flex-col items-center justify-center p-6 text-center"
          >
            <div className="relative mb-12">
               <motion.div 
                 animate={{ rotate: 360 }}
                 transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
                 className="w-48 h-48 rounded-full border-t-2 border-primary shadow-[0_0_40px_rgba(249,115,22,0.2)]"
               />
               <div className="absolute inset-0 flex items-center justify-center">
                 <Cpu className="w-16 h-16 text-primary animate-pulse" />
               </div>
            </div>
            <h3 className="text-4xl font-black uppercase tracking-tighter text-white mb-4">AI Certification in Progress</h3>
            <p className="text-secondary font-black flex items-center gap-2 mt-2 tracking-widest text-sm uppercase">
              <Search className="w-5 h-5 text-primary" />
              Scanning Repository & Verifying Logic Patterns...
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Level2;
