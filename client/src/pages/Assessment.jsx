import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Brain, 
  Target, 
  ArrowRight, 
  CheckCircle2, 
  PlayCircle,
  Trophy,
  History,
  Timer,
  Github,
  Search,
  Cpu,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

const Assessment = () => {
  const { profile, refreshProfile } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    refreshProfile();
  }, []);

  // Get skills from profile or default to few if none
  const userSkills = profile?.skills || [];
  const assessments = profile?.assessments || {};

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-12 min-h-screen relative">
      <div className="fixed top-0 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative z-10">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center border border-primary/30 shadow-[0_0_15px_rgba(249,115,22,0.2)]">
              <Brain className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-sm font-bold tracking-widest text-primary uppercase mb-1">Intelligence Pipeline</p>
              <h1 className="text-4xl font-black tracking-tighter text-white uppercase">Test Your Worth</h1>
            </div>
          </div>
          <p className="text-secondary text-lg mt-2 max-w-2xl">
            A structured verification pipeline. Prove your technical foundation in Level 1 and demonstrate your practical architecture in Level 2.
          </p>
        </div>
      </div>

      {/* Skills Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
        {userSkills.length > 0 ? userSkills.map((skill, index) => {
          const stats = assessments[skill] || {};
          const isL1Passed = stats.level1?.status === 'passed';
          const isVerified = stats.finalStatus === 'verified';
          
          return (
            <motion.div
              key={skill}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="glass-card p-6 border border-white/5 hover:border-primary/30 transition-all group relative overflow-hidden flex flex-col"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full blur-2xl -mr-8 -mt-8 pointer-events-none" />
              
              <div className="flex items-start justify-between mb-6">
                <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center border border-white/10 group-hover:bg-primary/20 group-hover:border-primary/30 transition-all">
                  <Target className={`w-6 h-6 ${isVerified ? 'text-success' : 'text-primary'}`} />
                </div>
                <div className="flex flex-col items-end gap-1">
                  {isVerified ? (
                    <span className="px-3 py-1 bg-success/10 text-success text-[10px] font-black uppercase tracking-widest rounded-full border border-success/20">
                      Fully Verified 🟢
                    </span>
                  ) : isL1Passed ? (
                    <span className="px-3 py-1 bg-yellow-500/10 text-yellow-500 text-[10px] font-black uppercase tracking-widest rounded-full border border-yellow-500/20">
                      L1 Completed ✅
                    </span>
                  ) : (
                    <span className="px-3 py-1 bg-white/5 text-secondary text-[10px] font-black uppercase tracking-widest rounded-full border border-white/10">
                      Pending L1
                    </span>
                  )}
                </div>
              </div>

              <h3 className="text-xl font-bold text-white mb-2 group-hover:text-primary transition-colors">{skill}</h3>
              
              <div className="space-y-4 mb-8 flex-grow">
                {/* L1 Info */}
                <div className="flex items-center justify-between text-secondary text-sm font-bold">
                  <span className="flex items-center gap-3"><Timer className="w-4 h-4 opacity-50" /> Level 1 Quiz</span>
                  <span className={isL1Passed ? 'text-success' : ''}>{isL1Passed ? `${stats.level1.score}%` : 'Not Attempted'}</span>
                </div>
                {/* L2 Info */}
                <div className="flex items-center justify-between text-secondary text-sm font-bold">
                  <span className="flex items-center gap-3"><Github className="w-4 h-4 opacity-50" /> Level 2 Repo</span>
                  <span className={isVerified ? 'text-success' : ''}>{isVerified ? `AI Score: ${stats.level2.aiScore}%` : isL1Passed ? 'Unlocked' : 'Locked 🔒'}</span>
                </div>
              </div>

              <div className="space-y-3 mt-auto">
                {isVerified ? (
                  <div className="w-full py-3 bg-success/10 text-success rounded-xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 border border-success/20">
                    <CheckCircle2 className="w-4 h-4" />
                    Certification Complete
                  </div>
                ) : isL1Passed ? (
                  <button
                    onClick={() => navigate(`/assessment/${encodeURIComponent(skill)}/level2`)}
                    className="w-full py-3 bg-yellow-500 text-black rounded-xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 hover:shadow-[0_0_15px_rgba(234,179,8,0.3)] hover:-translate-y-1 transition-all"
                  >
                    Proceed to Level 2
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    onClick={() => navigate(`/assessment/${encodeURIComponent(skill)}`)}
                    className="w-full py-3 bg-primary text-white rounded-xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 hover:shadow-[0_0_15px_rgba(249,115,22,0.3)] hover:-translate-y-1 transition-all"
                  >
                    Start Level 1 Test
                    <PlayCircle className="w-4 h-4" />
                  </button>
                )}
              </div>
            </motion.div>
          );
        }) : (
          <div className="col-span-full py-24 text-center glass-card border border-white/5">
             <Brain className="w-16 h-16 text-white/10 mx-auto mb-4" />
             <h3 className="text-2xl font-black text-white uppercase">No Skills Detected</h3>
             <p className="text-secondary max-w-sm mx-auto mt-2">Update your profile with technical skills to unlock AI assessments.</p>
             <button 
               onClick={() => navigate('/profile')}
               className="mt-6 px-8 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl font-bold transition-all border border-white/10"
             >
               Add Skills First
             </button>
          </div>
        )}
      </div>

      {/* Global Metadata */}
      <div className="glass-card p-10 border border-white/5 relative overflow-hidden bg-gradient-to-br from-card to-card/50 z-10">
          <div className="absolute top-0 right-0 p-8 opacity-5">
            <Trophy className="w-48 h-48 text-primary" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-4">
              <h4 className="text-primary font-black uppercase text-xs tracking-[0.3em] flex items-center gap-3">
                <span className="w-8 h-px bg-primary/30" /> Stage I: Knowledge
              </h4>
              <p className="text-secondary text-sm leading-relaxed font-bold">Comprehensive theoretical validation focusing on tactical architecture and software engineering principles.</p>
            </div>
            <div className="space-y-4">
              <h4 className="text-success font-black uppercase text-xs tracking-[0.3em] flex items-center gap-3">
                <span className="w-8 h-px bg-success/30" /> Stage II: Practical
              </h4>
              <p className="text-secondary text-sm leading-relaxed font-bold">Practical project screening where our AI analyzes your GitHub repository for real-world impact and code quality.</p>
            </div>
          </div>
      </div>
    </div>
  );
};

export default Assessment;
