import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Trophy, 
  XCircle, 
  CheckCircle2, 
  ArrowRight, 
  Brain,
  History,
  Target,
  Sparkles,
  Zap
} from 'lucide-react';

const AssessmentResult = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  if (!state || !state.result) {
    navigate('/assessment');
    return null;
  }

  const { result, skill } = state;
  const isPassed = result.status === 'passed';

  return (
    <div className="p-8 max-w-4xl mx-auto min-h-screen flex flex-col items-center justify-center text-center">
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent pointer-events-none" />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative z-10 w-full"
      >
        {/* Result Icon */}
        <div className="mb-8 relative inline-block">
           <motion.div 
             initial={{ scale: 0 }}
             animate={{ scale: 1 }}
             transition={{ type: 'spring', damping: 12 }}
             className={`w-32 h-32 rounded-full flex items-center justify-center border-2 border-white/5 shadow-2xl ${isPassed ? 'bg-yellow-500/20 border-yellow-500/30' : 'bg-error/20 border-error/30'}`}
           >
             {isPassed ? <Zap className="w-16 h-16 text-yellow-500" /> : <XCircle className="w-16 h-16 text-error" />}
           </motion.div>
           {isPassed && (
             <motion.div 
               animate={{ scale: [1, 1.2, 1] }} 
               transition={{ repeat: Infinity, duration: 2 }}
               className="absolute -top-2 -right-2 w-10 h-10 rounded-full bg-primary flex items-center justify-center border border-background shadow-lg shadow-primary/20"
             >
               <Sparkles className="w-5 h-5 text-white" />
             </motion.div>
           )}
        </div>

        <h1 className="text-5xl font-black uppercase tracking-tighter text-white mb-4">
           {isPassed ? "Knowledge Validated" : "Sync Interrupted"}
        </h1>
        <p className="text-secondary text-lg max-w-md mx-auto mb-12 font-bold leading-relaxed">
          {isPassed 
            ? `Excellent. Your theoretical foundation in ${skill} is certified at the professional level. You are now cleared for Level 2 Practical Screening.` 
            : `Your technical depth for ${skill} requires further synchronization. Review the core concepts and re-initiate the knowledge sequence.`}
        </p>

        {/* Score Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 max-w-2xl mx-auto">
          <div className="glass-card p-6 border border-white/5 bg-white/5">
             <Target className="w-5 h-5 text-primary mx-auto mb-3" />
             <div className="text-2xl font-black text-white">{result.score}%</div>
             <div className="text-[10px] font-black uppercase tracking-widest text-secondary mt-1">Accuracy</div>
          </div>
          <div className="glass-card p-6 border border-white/5 bg-white/5">
             <History className={`w-5 h-5 mx-auto mb-3 ${isPassed ? 'text-success' : 'text-error'}`} />
             <div className="text-2xl font-black text-white">{result.correct}/{result.total}</div>
             <div className="text-[10px] font-black uppercase tracking-widest text-secondary mt-1">Hits</div>
          </div>
          <div className="glass-card p-6 border border-white/5 bg-white/5">
             <CheckCircle2 className={`w-5 h-5 mx-auto mb-3 ${isPassed ? 'text-yellow-500' : 'text-secondary/30'}`} />
             <div className={`text-2xl font-black ${isPassed ? 'text-yellow-500' : 'text-white'}`}>{isPassed ? "L1 PASSED" : "FAILED"}</div>
             <div className="text-[10px] font-black uppercase tracking-widest text-secondary mt-1">Status</div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => navigate('/assessment')}
            className={`w-full sm:w-auto px-10 py-4 font-black uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-3 group ${isPassed ? 'bg-yellow-500 text-black hover:shadow-yellow-500/20' : 'bg-primary text-white shadow-primary/20'}`}
          >
            {isPassed ? "Proceed to Level 2" : "Return to Hub"}
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
          {!isPassed && (
            <button
               onClick={() => navigate(`/assessment/${encodeURIComponent(skill)}`)}
               className="w-full sm:w-auto px-10 py-4 bg-white/5 hover:bg-white/10 text-white font-black uppercase tracking-widest rounded-xl border border-white/10 transition-all flex items-center justify-center gap-3"
            >
              Retry Level 1
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default AssessmentResult;
