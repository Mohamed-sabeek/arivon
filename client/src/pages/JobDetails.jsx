import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Briefcase, 
  MapPin, 
  Building2, 
  CheckCircle2, 
  XCircle, 
  Target, 
  User, 
  ChevronLeft,
  ArrowRight,
  Sparkles,
  Zap,
  Activity,
  Search,
  Cpu,
  ShieldCheck,
  ExternalLink,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

const JobDetails = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const { profile, refreshProfile } = useAuth();
  
  const [job, setJob] = useState(null);
  const [loadingJob, setLoadingJob] = useState(true);
  const [userSkills, setUserSkills] = useState([]);
  const [matchedSkills, setMatchedSkills] = useState([]);
  const [missingSkills, setMissingSkills] = useState([]);
  const [matchPercentage, setMatchPercentage] = useState(0);
  const [displayPercentage, setDisplayPercentage] = useState(0);
  
  const [isApplying, setIsApplying] = useState(false);
  const [applyStep, setApplyStep] = useState(0);
  const [applied, setApplied] = useState(false);
  const [applicationStatus, setApplicationStatus] = useState(null);

  useEffect(() => {
    if (refreshProfile) {
      refreshProfile();
    }
    fetchJobDetails();
    fetchApplicationStatus();
  }, [id]);

  const fetchApplicationStatus = async () => {
    try {
      const isInternal = /^[0-9a-fA-F]{24}$/.test(id);
      if (!isInternal) return;

      const res = await api.get(`/applications/status/${id}`);
      if (res.data.applied) {
        setApplicationStatus(res.data.status);
        if (res.data.status !== 'Rejected') {
          setApplied(true);
        } else {
          setApplied(false); // Allow re-application if rejected
        }
      }
    } catch (err) {
      console.warn('Failed to fetch application status:', err);
    }
  };

  const fetchJobDetails = async () => {
    try {
      // Check if it's an internal MongoDB ID (24 chars hex) or external
      const isInternal = /^[0-9a-fA-F]{24}$/.test(id);
      
      if (isInternal) {
        const res = await api.get(`/jobs/${id}`);
        setJob({
          title: res.data.title,
          company: res.data.companyName,
          location: res.data.location,
          requiredSkills: res.data.skillsRequired || [],
          description: res.data.description,
          isInternal: true
        });
      } else {
        // Fallback for demo/external jobs (mock data or from state)
        setJob({
          title: "Senior Full Stack Engineer",
          company: "TechNova Solutions",
          location: "Bangalore, India (Hybrid)",
          requiredSkills: ["JavaScript", "Python", "React", "Node.js", "Microservices", "REST API", "SQL", "AWS"],
          description: "We are looking for a Senior Full Stack Engineer to join our core architecture team. You will be responsible for building scalable microservices and high-performance frontend applications.",
          externalUrl: location.state?.jobUrl || "https://linkedin.com/jobs",
          isInternal: false
        });
      }
    } catch (err) {
      console.error('Failed to fetch job:', err);
    } finally {
      setLoadingJob(false);
    }
  };

  useEffect(() => {
    if (!job) return;

    let skills = [];
    try {
      if (profile && Array.isArray(profile.skills)) {
        skills = profile.skills.filter(skill => {
          const assessment = profile.assessments?.[skill];
          if (!assessment) return false;
          return assessment.finalStatus === 'verified' || 
                 assessment.level2?.status === 'completed' || 
                 assessment.level2?.status === 'passed';
        });
      }
    } catch (e) {
      console.warn("Skill sync warning:", e);
    }

    if (skills.length === 0) {
      // Fallback only if no skills at all, but prefer empty array if they just have unverified skills
      // If profile is loaded but has 0 verified skills, this should actually be [] to reflect 0% match properly
      // However, to keep fallback for guest mode:
      if (!profile) {
        skills = ["JavaScript", "Node.js", "React", "SQL"];
      }
    }

    setUserSkills(skills);

    const matched = job.requiredSkills.filter(skill => 
      skills.some(userSkill => userSkill.toLowerCase() === skill.toLowerCase())
    );
    
    const missing = job.requiredSkills.filter(skill => 
      !skills.some(userSkill => userSkill.toLowerCase() === skill.toLowerCase())
    );
    
    setMatchedSkills(matched);
    setMissingSkills(missing);
    
    const percentage = job.requiredSkills.length > 0 
      ? Math.round((matched.length / job.requiredSkills.length) * 100) 
      : 0;
    
    setMatchPercentage(percentage);

    let start = 0;
    const duration = 1500;
    const increment = (percentage || 1) / (duration / 16);
    
    const timer = setInterval(() => {
      start += increment;
      if (start >= (percentage || 1)) {
        setDisplayPercentage(percentage);
        clearInterval(timer);
      } else {
        setDisplayPercentage(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [profile, job]);

  const handleApply = async () => {
    setIsApplying(true);
    setApplyStep(0);

    try {
      if (job.isInternal) {
        // Internal Application
        setTimeout(() => setApplyStep(1), 1000);
        setTimeout(() => setApplyStep(2), 2000);
        
        await api.post(`/applications/apply/${id}`);
        
        setTimeout(() => {
          setApplied(true);
          setIsApplying(false);
        }, 3000);
      } else {
        // External Application
        setTimeout(() => setApplyStep(1), 1000);
        setTimeout(() => setApplyStep(2), 2000);
        setTimeout(() => {
          window.open(job.externalUrl, '_blank');
          setIsApplying(false);
        }, 3000);
      }
    } catch (err) {
      console.error('Apply error:', err);
      alert(err.response?.data?.message || 'Failed to submit application');
      setIsApplying(false);
    }
  };

  if (loadingJob) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
        <p className="text-secondary font-bold uppercase tracking-widest text-xs animate-pulse">Syncing Job Details...</p>
      </div>
    );
  }

  const jobInfo = job; // Map back for easier template usage

  const getScoreColor = () => {
    if (matchPercentage >= 70) return 'text-success';
    if (matchPercentage >= 30) return 'text-warning';
    return 'text-error';
  };

  const getBarColor = () => {
    if (matchPercentage >= 70) return 'bg-success';
    if (matchPercentage >= 30) return 'bg-warning';
    return 'bg-error';
  };

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-12 min-h-screen relative">
      
      {/* Skill Check Overlay */}
      <AnimatePresence>
        {isApplying && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-background/90 backdrop-blur-2xl flex flex-col items-center justify-center p-6 text-center"
          >
            <div className="relative mb-8">
               <motion.div 
                 animate={{ rotate: 360 }}
                 transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
                 className="w-40 h-40 rounded-full border-t-2 border-primary border-r-2 border-primary/20"
               />
               <div className="absolute inset-0 flex items-center justify-center">
                 {applyStep === 0 && <Search className="w-12 h-12 text-primary animate-pulse" />}
                 {applyStep === 1 && <Cpu className="w-12 h-12 text-primary animate-pulse" />}
                 {applyStep === 2 && <ShieldCheck className="w-12 h-12 text-success" />}
               </div>
            </div>

            <div className="space-y-4 max-w-md">
              <h3 className="text-3xl font-black uppercase tracking-tighter text-white">
                {applyStep === 0 && "Scanning Career Architecture..."}
                {applyStep === 1 && "Validating Technical Alignment..."}
                {applyStep === 2 && "Match Certified: Access Granted!"}
              </h3>
              <p className="text-secondary font-bold">
                {applyStep === 0 && "Analyzing user profile against role requirements..."}
                {applyStep === 1 && "Verifying extracted skill authenticity..."}
                {applyStep === 2 && "Routing to secure application portal. Best of luck!"}
              </p>
            </div>
            
            <div className="mt-12 flex gap-2">
               {[0, 1, 2].map((i) => (
                 <div key={i} className={`h-1.5 w-12 rounded-full transition-all duration-500 ${applyStep >= i ? 'bg-primary shadow-[0_0_10px_rgba(249,115,22,0.5)]' : 'bg-white/10'}`} />
               ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Back Button */}
      <button 
        onClick={() => navigate('/jobs')}
        className="flex items-center gap-2 text-secondary hover:text-primary transition-colors font-bold uppercase tracking-widest text-xs relative z-10"
      >
        <ChevronLeft className="w-4 h-4" />
        Back to Listings
      </button>

      {/* Header Profile Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 border-b border-white/5 pb-12 relative z-10">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center border border-primary/30 shadow-[0_0_15px_rgba(249,115,22,0.2)]">
              <Target className="w-6 h-6 text-primary" />
            </div>
            <p className="text-sm font-black tracking-widest text-primary uppercase">Intelligence Match</p>
          </div>
          <h1 className="text-5xl font-black tracking-tighter text-white uppercase tracking-tight">{jobInfo.title}</h1>
          <div className="flex items-center gap-6 text-secondary font-bold">
            <span className="flex items-center gap-2"><Building2 className="w-5 h-5 opacity-50 text-white" /> {jobInfo.company}</span>
            <span className="flex items-center gap-2"><MapPin className="w-5 h-5 opacity-50 text-white" /> {jobInfo.location}</span>
          </div>
        </div>

        {/* Big Match Score Card */}
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="glass-card p-8 border border-white/5 relative overflow-hidden flex flex-col items-center min-w-[200px]"
        >
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
            <span className="text-xs font-black uppercase text-secondary/60 mb-2 tracking-widest">Match Score</span>
            <span className={`text-6xl font-black tracking-tighter ${getScoreColor()}`}>
              {displayPercentage}%
            </span>
            <div className="w-full bg-white/5 h-2 rounded-full mt-4 overflow-hidden">
               <motion.div 
                 initial={{ width: 0 }}
                 animate={{ width: `${matchPercentage}%` }}
                 transition={{ duration: 1.5, ease: "easeOut" }}
                 className={`h-full ${getBarColor()}`}
               />
            </div>
        </motion.div>
      </div>

      {/* Sectioned Skills Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10">
        
        {/* A. Requirements (Red Theme) */}
        <div className="glass-card p-8 border border-white/5 border-l-4 border-l-error bg-error/5">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-black uppercase text-white flex items-center gap-3">
              <Activity className="w-6 h-6 text-error" /> 
              Requirements
            </h3>
            <span className="text-error font-black text-xs px-2 py-1 bg-error/10 rounded border border-error/20">
              {jobInfo.requiredSkills.length} Total
            </span>
          </div>
          <div className="flex flex-wrap gap-2.5">
            {jobInfo.requiredSkills.map(skill => (
              <span key={skill} className="px-3.5 py-1.5 bg-error/10 text-error border border-error/20 rounded-lg text-xs font-bold">
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* B. Your Profile (Green Theme) */}
        <div className="glass-card p-8 border border-white/5 border-l-4 border-l-success bg-success/5">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-black uppercase text-white flex items-center gap-3">
              <User className="w-6 h-6 text-success" /> 
              Your Profile
            </h3>
            <span className="text-success font-black text-xs px-2 py-1 bg-success/10 rounded border border-success/20">
               {userSkills.length} Profiled
            </span>
          </div>
          <div className="flex flex-wrap gap-2.5">
            {userSkills.map(skill => (
              <span key={skill} className="px-3.5 py-1.5 bg-success/10 text-success border border-success/20 rounded-lg text-xs font-bold">
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* C. Success Gaps (Orange Theme) */}
        <div className="glass-card p-8 border border-white/5 border-l-4 border-l-warning bg-warning/5">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-black uppercase text-white flex items-center gap-3">
              <Sparkles className="w-6 h-6 text-warning" /> 
              Success Gaps
            </h3>
            <span className="text-warning font-black text-xs px-2 py-1 bg-warning/10 rounded border border-warning/20">
              {missingSkills.length} MISSING
            </span>
          </div>
          <div className="flex flex-wrap gap-2.5">
            {missingSkills.map(skill => (
              <span key={skill} className="px-3.5 py-1.5 bg-warning/10 text-warning border border-warning/20 rounded-lg text-xs font-bold">
                {skill}
              </span>
            ))}
            {missingSkills.length === 0 && (
              <div className="w-full p-4 bg-success/10 border border-success/20 rounded-xl flex items-center gap-3">
                 <CheckCircle2 className="w-5 h-5 text-success" />
                 <p className="text-xs text-success font-bold uppercase tracking-widest">Full Technical Overlap Detected</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Summary Advice */}
      <div className="glass-card p-10 border border-white/5 relative overflow-hidden bg-gradient-to-br from-card to-card/50 z-10">
          <div className="absolute -right-12 -bottom-12 opacity-5 rotate-12">
            <Zap className="w-64 h-64 text-primary" />
          </div>
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-10 text-center md:text-left">
            <div className="shrink-0 w-24 h-24 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center">
              <Activity className="w-12 h-12 text-primary animate-pulse" />
            </div>
            <div className="space-y-4 flex-1">
              <h3 className="text-2xl font-black uppercase text-white tracking-tight">AI Strategic Evaluation</h3>
              <p className="text-secondary leading-relaxed max-w-3xl">
                {matchPercentage >= 70 
                  ? `Exceptional match detected at ${matchPercentage}%. Your existing architecture perfectly supports TechNova's requirements. We've verified your proficiency in ${matchedSkills.slice(0, 3).join(', ')}.` 
                  : matchPercentage >= 30 
                    ? `Viable match at ${matchPercentage}%. Strategic overlap found in ${matchedSkills.length} key areas. Focus on bridging the gap in ${missingSkills.slice(0, 2).join(' and ')} to maximize success.`
                    : `Low technical overlap (${matchPercentage}%). This role requires specialized experience that isn't currently prominent in your profile. Bridge the architectural requirements to increase success rate.`}
              </p>
              <div className="flex items-center justify-center md:justify-start gap-6 pt-4">
                {applied ? (
                  <div className={`px-10 py-4 font-black uppercase tracking-widest rounded-xl border flex items-center gap-3 ${
                    applicationStatus === 'Shortlisted' 
                      ? 'bg-amber-500/10 text-amber-500 border-amber-500/20 shadow-[0_0_15px_rgba(245,158,11,0.1)]' 
                      : 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                  }`}>
                    {applicationStatus === 'Shortlisted' ? <Zap className="w-5 h-5 animate-pulse" /> : <CheckCircle2 className="w-5 h-5" />}
                    Applied: {applicationStatus || 'Pending Review'}
                  </div>
                ) : (
                  <div className="flex flex-col gap-4">
                    {applicationStatus === 'Rejected' && (
                      <p className="text-xs font-bold text-error uppercase tracking-widest flex items-center gap-2">
                        <XCircle className="w-4 h-4" />
                        Previous application was rejected. You can re-apply below.
                      </p>
                    )}
                    
                    {matchPercentage < 50 ? (
                      <div className="flex flex-col gap-3">
                        <p className="text-xs font-bold text-error uppercase tracking-[0.2em] flex items-center gap-2 bg-error/10 p-3 rounded-lg border border-error/20">
                          <AlertCircle className="w-4 h-4" />
                          Finalize Application disabled: Your match score is less than 50%
                        </p>
                        <button 
                          disabled
                          className="px-10 py-4 bg-white/5 text-white/20 font-black uppercase tracking-widest rounded-xl border border-white/5 cursor-not-allowed flex items-center gap-3"
                        >
                          Application Restricted
                        </button>
                      </div>
                    ) : (
                      <button 
                        onClick={handleApply}
                        className="px-10 py-4 bg-primary text-white font-black uppercase tracking-widest rounded-xl shadow-[0_0_20px_rgba(249,115,22,0.3)] hover:-translate-y-1 transition-all flex items-center gap-3 group"
                      >
                         Finalize Application 
                         <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
      </div>
    </div>
  );
};

export default JobDetails;
