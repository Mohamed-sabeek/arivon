import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { 
  Brain, 
  Loader2, 
  ChevronRight, 
  ChevronLeft,
  AlertCircle,
  Cpu,
  Database,
  CheckCircle2,
  Clock
} from 'lucide-react';
import api from '../api/axios';

const Quiz = () => {
  const { skill } = useParams();
  const navigate = useNavigate();
  const { refreshProfile } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(true);
  const [questions, setQuestions] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState({});
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    generateQuestions();
  }, [skill]);

  const generateQuestions = async () => {
    setGenerating(true);
    setError(null);
    try {
      const res = await api.post('/assessment/generate', { skill });
      if (Array.isArray(res.data)) {
        setQuestions(res.data);
      } else {
        throw new Error('Invalid question format received');
      }
    } catch (err) {
      console.error('Generation Error:', err);
      setError('Failed to generate AI questions. This can happen due to high traffic on the AI engine. Please try again.');
    } finally {
      setGenerating(false);
      setLoading(false);
    }
  };

  const handleAnswer = (option) => {
    setAnswers(prev => ({ ...prev, [currentIdx]: option }));
  };

  const handleNext = () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx(prev => prev + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (currentIdx > 0) {
      setCurrentIdx(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const res = await api.post('/assessment/submit', {
        skill,
        answers,
        questions
      });
      await refreshProfile();
      navigate('/assessment/result', { state: { result: res.data, skill } });
    } catch (err) {
      console.error('Submit Error:', err);
      setError('Failed to evaluate quiz. Please check your connection.');
      setSubmitting(false);
    }
  };

  if (generating) {
    return (
      <div className="fixed inset-0 z-[100] bg-background flex flex-col items-center justify-center p-6 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent">
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
        <div className="text-center space-y-4">
          <h2 className="text-4xl font-black uppercase tracking-tighter text-white">Synthesizing Challenge</h2>
          <div className="flex items-center justify-center gap-3 text-secondary font-black tracking-widest text-sm uppercase">
            <Database className="w-4 h-4 text-primary" />
            Configuring {skill} Requisition...
          </div>
          <div className="max-w-xs mx-auto pt-4">
            <div className="h-1 bg-white/5 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 5, ease: "linear" }}
                className="h-full bg-primary"
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 max-w-2xl mx-auto mt-24 text-center glass-card border-error/20 bg-error/5">
        <AlertCircle className="w-16 h-16 text-error mx-auto mb-6" />
        <h2 className="text-2xl font-black text-white uppercase mb-4">Engine Interruption</h2>
        <p className="text-secondary mb-8 font-bold">{error}</p>
        <button 
          onClick={() => navigate('/assessment')}
          className="px-8 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-bold border border-white/10 transition-all"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  const currentQuestion = questions[currentIdx];
  const progress = ((currentIdx + 1) / questions.length) * 100;

  return (
    <div className="p-8 max-w-4xl mx-auto min-h-screen">
      {/* Quiz Header */}
      <div className="flex items-center justify-between mb-12">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center border border-primary/30">
            <Brain className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white uppercase tracking-tight">{skill} Verify</h1>
            <p className="text-secondary text-xs font-black tracking-widest uppercase">Question {currentIdx + 1} of {questions.length}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 glass-card px-4 py-2 border-white/5">
           <Clock className="w-4 h-4 text-primary" />
           <span className="font-mono font-bold text-white">LIVE SESSION</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-1.5 bg-white/5 rounded-full mb-12 overflow-hidden border border-white/5">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          className="h-full bg-primary shadow-[0_0_15px_rgba(249,115,22,0.5)]"
        />
      </div>

      {/* Question Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIdx}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="glass-card p-10 border border-white/5 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-4">
             <span className="text-6xl font-black text-white/5 select-none">{currentIdx + 1}</span>
          </div>
          
          <h2 className="text-2xl font-bold text-white mb-10 leading-snug relative z-10">
            {currentQuestion?.question}
          </h2>

          <div className="grid grid-cols-1 gap-4 relative z-10">
            {currentQuestion?.options.map((option, oIdx) => {
              const letter = String.fromCharCode(65 + oIdx);
              const isSelected = answers[currentIdx] === letter;
              
              return (
                <button
                  key={oIdx}
                  onClick={() => handleAnswer(letter)}
                  className={`
                    w-full flex items-center gap-6 p-6 rounded-2xl border text-left transition-all group
                    ${isSelected 
                      ? 'bg-primary/20 border-primary shadow-lg shadow-primary/5' 
                      : 'bg-white/5 border-white/10 hover:border-white/20 hover:bg-white/[0.07]'}
                  `}
                >
                  <div className={`
                    w-10 h-10 rounded-xl flex items-center justify-center font-black transition-all
                    ${isSelected ? 'bg-primary text-white scale-110' : 'bg-white/10 text-secondary group-hover:text-white'}
                  `}>
                    {letter}
                  </div>
                  <span className={`text-lg font-bold transition-all ${isSelected ? 'text-white' : 'text-secondary group-hover:text-white'}`}>
                    {option}
                  </span>
                </button>
              );
            })}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="mt-10 flex justify-between items-center">
        <button
          onClick={handleBack}
          disabled={currentIdx === 0 || submitting}
          className={`
            px-8 py-5 rounded-2xl font-black uppercase tracking-widest text-sm flex items-center gap-3 transition-all
            ${currentIdx === 0 || submitting
              ? 'opacity-0 pointer-events-none'
              : 'bg-white/5 text-white hover:bg-white/10 border border-white/10 hover:border-white/20'}
          `}
        >
          <ChevronLeft className="w-5 h-5" />
          Previous Sequence
        </button>

        <button
          onClick={handleNext}
          disabled={!answers[currentIdx] || submitting}
          className={`
            px-12 py-5 rounded-2xl font-black uppercase tracking-widest text-sm flex items-center gap-3 transition-all
            ${!answers[currentIdx] || submitting
              ? 'bg-white/5 text-white/20 border border-white/10 cursor-not-allowed'
              : 'bg-primary text-white hover:shadow-[0_0_25px_rgba(249,115,22,0.4)] hover:-translate-y-1'}
          `}
        >
          {submitting ? (
            <>Evaluating Results <Loader2 className="w-5 h-5 animate-spin" /></>
          ) : (
            <>
              {currentIdx === questions.length - 1 ? 'Finalize Requisition' : 'Next Sequence'}
              <ChevronRight className="w-5 h-5" />
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default Quiz;
