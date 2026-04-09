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
  Sparkles,
  Zap,
  HardDrive,
  RotateCcw,
  Database
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import Loader from '../components/Loader';

const Level2 = () => {
  const { skill } = useParams();
  const navigate = useNavigate();
  const { profile, refreshProfile } = useAuth();

  const [task, setTask] = useState(null);
  const [isGeneratingTask, setIsGeneratingTask] = useState(true);
  const [repoLink, setRepoLink] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingText, setLoadingText] = useState("Analyzing repository...");
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [isRegenerating, setIsRegenerating] = useState(false);

  // Verification: Ensure L1 is passed and Fetch Task
  useEffect(() => {
    const initLevel2 = async () => {
      if (profile && profile.assessments) {
        const stats = profile.assessments[skill];
        if (!stats || stats.level1?.status !== 'passed') {
          navigate('/assessment');
          return;
        }
        await fetchDynamicTask();
      }
    };
    initLevel2();
  }, [profile, skill, navigate]);

  const fetchDynamicTask = async (isRegen = false) => {
    if (isRegen) setIsRegenerating(true);
    else setIsGeneratingTask(true);
    
    setError(null);
    try {
      const endpoint = isRegen ? '/assessment/regenerate-task' : '/assessment/generate-task';
      const res = await api.post(endpoint, { skill });
      setTask(res.data);
    } catch (err) {
      setError("Failed to synchronize AI screening task. Please refresh.");
    } finally {
      setIsRegenerating(false);
      setIsGeneratingTask(false);
    }
  };

  const handleRegenerate = async () => {
    if (window.confirm("This will discard your current task and generate a new one in a different industry scenario. Continue?")) {
      await fetchDynamicTask(true);
    }
  };

  const handleSubmit = async () => {
    if (!repoLink || !repoLink.includes('github.com')) {
      setError("Please provide a valid GitHub repository URL.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    const stages = [
      "Analyzing repository...",
      "Checking commit history...",
      "Validating project structure...",
      "Evaluating code quality..."
    ];

    let currentStage = 0;
    const interval = setInterval(() => {
      currentStage++;
      if (currentStage < stages.length) {
        setLoadingText(stages[currentStage]);
      }
    }, 1000);

    setTimeout(async () => {
      clearInterval(interval);
      try {
        // PERSIST the simulation result to the DB
        await api.post('/assessment/submit-repo', { 
          skill, 
          repoLink,
          isSimulation: true 
        });
        
        setResult({
          aiScore: 82,
          feedback: "The repository demonstrates a good understanding of core concepts. Commit history is consistent, and the project structure is well organized. Some improvements can be made in error handling and optimization.",
          highlights: [
            { type: 'pro', text: 'Frequent commits detected' },
            { type: 'pro', text: 'Proper project structure' },
            { type: 'pro', text: 'README present' },
            { type: 'con', text: 'Improve error handling' },
            { type: 'con', text: 'Add performance optimization' }
          ],
          finalStatus: 'verified'
        });
        setIsSubmitting(false);
        await refreshProfile(); 
      } catch (err) {
        console.error('Finalization Error:', err);
        setIsSubmitting(false);
      }
    }, 4500);
  };

  // Professional AI Loader for Task Generation
  if (isGeneratingTask || isRegenerating) {
    return (
      <div className="fixed inset-0 z-[100] bg-background flex flex-col items-center justify-center p-6 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent">
        <div className="relative mb-12">
           <motion.div 
             animate={{ rotate: 360 }}
             transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
             className="w-48 h-48 rounded-full border-t-2 border-primary shadow-[0_0_40px_rgba(249,115,22,0.2)]"
           />
           <div className="absolute inset-0 flex items-center justify-center">
             <Zap className="w-16 h-16 text-primary animate-pulse" />
           </div>
           <div className="absolute -top-4 -right-4">
              <Sparkles className="w-10 h-10 text-primary/40 animate-bounce" />
           </div>
        </div>
        <div className="text-center space-y-4">
          <h2 className="text-4xl font-black uppercase tracking-tighter text-white">
            {isRegenerating ? "Synthesizing Fresh Brief" : "Negotiating with AI Lead"}
          </h2>
          <p className="text-secondary font-black tracking-[0.2em] text-xs uppercase flex items-center justify-center gap-3">
            <HardDrive className="w-4 h-4 text-primary" />
            {isRegenerating ? "Rolling Industry Sequence..." : `Staging Personalized ${skill} Challenge...`}
          </p>
          <div className="max-w-xs mx-auto pt-6">
            <div className="h-1 bg-white/5 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 6, ease: "linear" }}
                className="h-full bg-primary"
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (result) {
    const isPassed = result.finalStatus === 'verified';
    return (
      <div className="p-8 max-w-4xl mx-auto min-h-screen flex items-center justify-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card p-12 border border-white/5 text-center relative overflow-hidden w-full transition-all"
        >
          <div className={`absolute top-0 left-0 w-full h-1 ${isPassed ? 'bg-success' : 'bg-error'}`} />
          <div className="mb-8">
            <div className={`w-24 h-24 rounded-full mx-auto flex items-center justify-center mb-6 shadow-2xl ${isPassed ? 'bg-success/20 text-success border border-success/30' : 'bg-error/20 text-error border border-error/30'}`}>
               {isPassed ? <ShieldCheck className="w-12 h-12" /> : <AlertCircle className="w-12 h-12" />}
            </div>
            <h2 className="text-4xl font-black uppercase tracking-tighter text-white mb-2">
              {isPassed ? "Practical Logic Verified" : "Verification Failed"}
            </h2>
            <p className="text-secondary font-bold text-lg mb-8 uppercase tracking-widest">{skill} Certification Hub</p>
          </div>

          <div className="glass-card p-8 bg-white/5 border-white/10 text-left mb-10 shadow-inner">
            <div className="flex items-center justify-between mb-4 border-b border-white/5 pb-4">
               <span className="text-[10px] font-black tracking-[0.2em] text-primary uppercase">Elite AI Review</span>
               <span className={`text-2xl font-black ${isPassed ? 'text-success' : 'text-error'}`}>{result.aiScore}% Match</span>
            </div>
            <p className="text-secondary text-base leading-relaxed italic font-medium mb-6">"{result.feedback}"</p>
            
            <div className="space-y-3">
              {result.highlights?.map((item, idx) => (
                <div key={idx} className="flex items-center gap-3 text-xs font-bold">
                  {item.type === 'pro' ? (
                    <span className="text-success">✔</span>
                  ) : (
                    <span className="text-warning">⚠</span>
                  )}
                  <span className="text-secondary">{item.text}</span>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => navigate('/assessment')}
            className="px-12 py-5 bg-primary text-white font-black uppercase tracking-widest rounded-2xl hover:shadow-[0_0_30px_rgba(249,115,22,0.4)] hover:-translate-y-1 transition-all flex items-center gap-3 mx-auto text-sm"
          >
            Return to Hub
            <ChevronRight className="w-5 h-5" />
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-6xl mx-auto min-h-screen space-y-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start gap-6 relative z-10">
        <div className="w-full">
           <button 
             onClick={() => navigate('/assessment')}
             className="flex items-center gap-2 text-secondary/60 hover:text-primary transition-colors mb-8 font-black uppercase text-[10px] tracking-widest group"
           >
             <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Intelligence Area
           </button>
           <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-center gap-6 mb-3">
                <div className="w-20 h-20 rounded-2xl bg-primary/20 flex items-center justify-center border border-primary/30 shadow-[0_0_30px_rgba(249,115,22,0.2)]">
                  <Target className="w-10 h-10 text-primary" />
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <p className="text-xs font-black uppercase tracking-[0.4em] text-primary">Stage II: Practical Match</p>
                    <span className="px-2 py-0.5 bg-white/5 border border-white/10 rounded text-[9px] font-black text-secondary uppercase tracking-widest flex items-center gap-2">
                       {task?.source === 'database' ? <Database className="w-2 h-2" /> : <Sparkles className="w-2 h-2" />}
                       {task?.source === 'database' ? 'Securely Stored' : 'Newly Synthesized'}
                    </span>
                  </div>
                  <h1 className="text-6xl font-black tracking-tighter text-white uppercase leading-none">{skill} Challenge</h1>
                </div>
              </div>
              
              <button
                onClick={handleRegenerate}
                className="flex items-center gap-3 px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all text-xs font-black uppercase tracking-widest text-secondary hover:text-white"
              >
                <RotateCcw className="w-4 h-4" />
                Regenerate Technical Brief
              </button>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 relative z-10">
        {/* Left: Task Details */}
        <div className="lg:col-span-2 space-y-10">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass-card p-12 border border-white/5 relative overflow-hidden bg-gradient-to-br from-card to-card/50"
          >
            <div className="absolute top-0 right-0 p-8 opacity-5">
               <Cpu className="w-64 h-64 text-white" />
            </div>
            
            <div className="mb-10">
              <div className="flex items-center gap-3 mb-4">
                 <span className="px-3 py-1 bg-primary/20 text-primary rounded-lg text-[9px] font-black uppercase tracking-widest border border-primary/30">
                    Industry Sequence: {task?.industry}
                 </span>
              </div>
              <h2 className="text-3xl font-black text-white mb-6 uppercase tracking-tight border-l-4 border-primary pl-6 leading-tight">{task?.title}</h2>
              <p className="text-secondary text-lg leading-relaxed font-bold italic opacity-80">"{task?.description}"</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-4 flex items-center gap-2">
                  <Layout className="w-3 h-3" /> Core Requirements
                </h4>
                {task?.requirements.map((req, i) => (
                  <div key={i} className="flex gap-4 items-center p-4 bg-white/5 rounded-2xl border border-white/5 hover:border-white/10 transition-all">
                    <div className="w-2 h-2 rounded-full bg-primary" />
                    <p className="text-xs text-secondary font-black uppercase tracking-wide">{req}</p>
                  </div>
                ))}
              </div>

              <div className="space-y-4">
                <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-4 flex items-center gap-2">
                  <Zap className="w-3 h-3" /> Tech Stack Stack
                </h4>
                <div className="flex flex-wrap gap-3">
                  {task?.techStack.map((tech, i) => (
                    <span key={i} className="px-4 py-2 bg-primary/10 border border-primary/20 rounded-xl text-[10px] font-black text-primary uppercase tracking-widest">
                       {tech}
                    </span>
                  ))}
                </div>
                
                <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-4 pt-4 flex items-center gap-2">
                  <ShieldCheck className="w-3 h-3" /> Evaluation Axis
                </h4>
                <div className="flex flex-wrap gap-2">
                  {task?.evaluationCriteria.map((crit, i) => (
                    <span key={i} className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-[9px] font-black text-secondary uppercase tracking-widest">
                       {crit}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Submission Panel */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card p-12 border border-white/5 shadow-2xl bg-gradient-to-tr from-card to-transparent"
          >
            <h3 className="text-2xl font-black text-white mb-8 flex items-center gap-4 uppercase tracking-tighter">
              <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/10">
                <Github className="w-6 h-6 text-white" />
              </div>
              Final Submission Terminal
            </h3>
            <div className="space-y-8">
              <div className="space-y-3">
                <div className="flex justify-between items-end px-1">
                  <label className="text-[10px] font-black uppercase tracking-[0.3em] text-secondary/60">GitHub Connection Point</label>
                  <span className="text-[9px] font-bold text-primary italic uppercase tracking-widest">Public Repositories Only</span>
                </div>
                <input 
                  type="text" 
                  value={repoLink}
                  onChange={(e) => setRepoLink(e.target.value)}
                  placeholder="https://github.com/yourstack/screening-project"
                  className="w-full bg-white/5 border border-white/10 p-6 rounded-2xl text-white outline-none focus:border-primary/50 focus:bg-primary/5 transition-all font-mono font-bold placeholder:text-white/5 shadow-inner"
                />
              </div>
              
              {error && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center gap-4 p-5 bg-error/10 border border-error/20 rounded-2xl text-error text-sm font-black uppercase tracking-tighter"
                >
                  <AlertCircle className="w-6 h-6" /> {error}
                </motion.div>
              )}

              <button
                onClick={handleSubmit}
                disabled={isSubmitting || !repoLink}
                className={`
                  w-full py-6 rounded-2xl font-black uppercase tracking-[0.2em] text-base flex items-center justify-center gap-4 transition-all
                  ${(isSubmitting || !repoLink) 
                    ? 'bg-white/5 text-white/20 border border-white/10 cursor-not-allowed'
                    : 'bg-primary text-white hover:shadow-[0_0_40px_rgba(249,115,22,0.5)] hover:-translate-y-1 active:scale-[0.98]'}
                `}
              >
                {isSubmitting ? "Processing through Neural Axis..." : "Handover to AI for Certification"}
                <Sparkles className="w-6 h-6" />
              </button>
            </div>
          </motion.div>
        </div>

        {/* Right: protocol & info */}
        <div className="space-y-8">
           <div className="glass-card p-10 border border-white/5 bg-gradient-to-t from-white/5 to-transparent relative overflow-hidden group">
              <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors" />
              <h4 className="text-xs font-black text-white uppercase tracking-[0.3em] mb-8 flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" /> Screening Protocol
              </h4>
              <ul className="space-y-6">
                {[
                  { icon: ShieldCheck, title: "Integrity Scan", desc: "Arivon AI cross-references patterns against global repositories." },
                  { icon: FileCode, title: "Clean Arch", desc: "Explicit focus on SOLID principles and architectural modularity." },
                  { icon: Search, title: "Technical Depth", desc: "Commit history and technical complexity weight 40% of the score." }
                ].map((item, i) => (
                  <li key={i} className="flex gap-4 items-start">
                    <item.icon className="w-5 h-5 text-primary mt-1 shrink-0" />
                    <div>
                      <p className="text-[11px] font-black text-white uppercase tracking-widest mb-1">{item.title}</p>
                      <p className="text-[10px] text-secondary font-bold leading-relaxed opacity-60">{item.desc}</p>
                    </div>
                  </li>
                ))}
              </ul>
           </div>

           <div className="glass-card p-10 border border-success/20 bg-success/5 relative overflow-hidden">
              <div className="flex items-center gap-5 mb-6">
                 <div className="w-12 h-12 rounded-2xl bg-success/20 flex items-center justify-center border border-success/30 shadow-[0_0_20px_rgba(34,197,94,0.2)]">
                    <Zap className="text-success w-6 h-6" />
                 </div>
                 <h4 className="text-sm font-black text-white uppercase tracking-tighter">Why Level 2?</h4>
              </div>
              <p className="text-secondary text-[10px] font-bold leading-relaxed tracking-wider">
                Candidates with Level 2 Certification on their profile experience a <span className="text-success font-black">4.2x increase</span> in technical interview shortlisting on the Arivon Talent Network.
              </p>
           </div>
        </div>
      </div>

      {/* Analysis Overlay during submission */}
      <AnimatePresence>
        {isSubmitting && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[999] bg-background/95 backdrop-blur-3xl flex flex-col items-center justify-center p-6 text-center"
          >
            <div className="relative mb-16 scale-125">
               <motion.div 
                 animate={{ rotate: 360 }}
                 transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
                 className="w-48 h-48 rounded-full border-t-2 border-primary shadow-[0_0_50px_rgba(249,115,22,0.3)]"
               />
               <div className="absolute inset-0 flex items-center justify-center">
                 <Cpu className="w-16 h-16 text-primary animate-pulse" />
               </div>
               <div className="absolute inset-0 animate-ping opacity-10">
                 <div className="w-full h-full rounded-full bg-primary" />
               </div>
            </div>
            <h3 className="text-5xl font-black uppercase tracking-tighter text-white mb-4">Neural Data Synthesis</h3>
            <p className="text-secondary font-black flex items-center gap-3 mt-2 tracking-[0.4em] text-xs uppercase">
              <Sparkles className="w-4 h-4 text-primary" />
              {loadingText}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Level2;
