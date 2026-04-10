import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Rocket, 
  Brain, 
  Target, 
  Zap, 
  ChevronRight, 
  CheckCircle2, 
  Globe, 
  Trophy,
  ArrowRight,
  ShieldCheck,
  ZapIcon,
  Search,
  Layout,
  Cpu,
  Fingerprint,
  BarChart3,
  Video
} from 'lucide-react';
import logo from '../assets/logo.png';

const Home = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  const pillars = [
    { 
      icon: Cpu, 
      title: "AI Analysis", 
      desc: "Instant ATS scoring and role-specific matching using proprietary Hybrid AI algorithms.",
      accent: "from-orange-500/20 to-transparent"
    },
    { 
      icon: Video, 
      title: "Adaptive Learning", 
      desc: "10,000+ curated YouTube courses with intelligent session persistence and smart caching.",
      accent: "from-blue-500/20 to-transparent"
    },
    { 
      icon: ShieldCheck, 
      title: "Skill Verification", 
      desc: "Industry-grade L1 assessments that verify your proficiency with professional badges.",
      accent: "from-green-500/20 to-transparent"
    },
    { 
      icon: Fingerprint, 
      title: "Career Intelligence", 
      desc: "Deterministic career pathing that identifies high-growth opportunities based on your DNA.",
      accent: "from-purple-500/20 to-transparent"
    }
  ];

  const loopSteps = [
    { title: "Sync Data", desc: "Upload your PDF resume for instant AI parsing and mapping." },
    { title: "Identify Gaps", desc: "Receive your AI Match Score and see exactly where you stand." },
    { title: "Master Skills", desc: "Bridge gaps through our persistence-backed learning modules." },
    { title: "Get Verified", desc: "Pass L1 assessments and join the elite vetted talent pool." }
  ];

  return (
    <div className="relative overflow-hidden bg-background">
      {/* Background Neural Glows */}
      <div className="neural-glow -top-40 -right-40 opacity-30" />
      <div className="neural-glow top-1/2 -left-40 opacity-15" />
      <div className="neural-glow bottom-0 right-1/4 opacity-10 blur-[120px]" />

      {/* Hero Section */}
      <section className="relative px-6 py-20 lg:py-32 container mx-auto text-center flex flex-col items-center">
        <motion.div
           initial={{ opacity: 0, y: -10 }}
           animate={{ opacity: 1, y: 0 }}
           className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-white/5 border border-white/10 mb-8 backdrop-blur-md shadow-2xl"
        >
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse shadow-[0_0_10px_#F97316]" />
          <span className="text-[10px] font-black tracking-[0.2em] text-white/70 uppercase">Elite Career Intelligence</span>
        </motion.div>

        <motion.h1 
          className="text-6xl md:text-8xl lg:text-9xl font-black tracking-tight leading-[0.95] mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Beyond Networking.<br />
          <span className="text-primary italic">AI Mastery.</span>
        </motion.h1>

        <motion.p 
          className="max-w-3xl text-lg md:text-xl text-secondary mb-12 leading-relaxed font-medium"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          Stop applying blindly. Use Hybrid AI Career Intelligence to scan your resume, bridge skill gaps with smart-cached learning, and get verified by the industry.
        </motion.p>

        <motion.div 
          className="flex flex-col sm:flex-row items-center justify-center gap-6 w-full max-w-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Link to="/register" className="glow-button w-full sm:w-auto flex items-center justify-center gap-3 text-lg group">
            Start Your AI Journey
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          <a href="#intelligence" className="w-full sm:w-auto px-10 py-4 rounded-2xl border border-white/10 hover:bg-white/5 transition-all text-lg font-bold flex items-center justify-center bg-white/5">
            View Analysis Engine
          </a>
        </motion.div>
      </section>

      {/* AI Score Spotlight Section */}
      <section id="intelligence" className="container mx-auto px-6 py-24 relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-24 bg-gradient-to-b from-primary/50 to-transparent" />
        
        <div className="glass-card p-1 lg:p-2 rounded-[2.5rem] overflow-hidden group">
          <div className="bg-background/80 backdrop-blur-2xl rounded-[2.2rem] p-10 lg:p-20 border border-white/5 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 blur-[100px] -translate-y-1/2 translate-x-1/2" />
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div className="space-y-8">
                <div className="inline-flex items-center gap-3 px-4 py-2 rounded-xl bg-primary/10 border border-primary/20">
                  <BarChart3 className="w-5 h-5 text-primary" />
                  <span className="text-sm font-bold text-primary italic">Real-time ATS Engine</span>
                </div>
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter leading-tight">
                  Stop Guessing.<br />
                  <span className="text-secondary">Know Your Rank.</span>
                </h2>
                <p className="text-secondary text-lg leading-relaxed max-w-md">
                  Our Career Intelligence scans every line of your resume against 1,000+ top industry roles, providing a deterministic "Growth Match" score that identifies your elite potential.
                </p>
                <div className="flex flex-col gap-4">
                  {['93% Full Stack Match Score', 'Growth Match Path identified', 'No "Low Match" discouragement'].map((text, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-success/10 flex items-center justify-center border border-success/30">
                        <CheckCircle2 className="w-3.5 h-3.5 text-success" />
                      </div>
                      <span className="text-sm font-bold text-white/80">{text}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Mock Match Card */}
              <motion.div 
                whileHover={{ scale: 1.02 }}
                className="relative glass-card p-8 md:p-12 space-y-8 border-primary/20 shadow-[0_0_50px_rgba(249,115,22,0.1)]"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-xs font-black uppercase tracking-[0.2em] text-secondary mb-2">Analysis Result</h4>
                    <h3 className="text-3xl font-black italic">MERN Developer</h3>
                  </div>
                  <div className="p-4 rounded-2xl bg-primary/20 border border-primary/30">
                    <span className="text-2xl font-black text-primary italic">93%</span>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: '93%' }}
                      transition={{ duration: 1, delay: 0.5 }}
                      className="h-full bg-primary shadow-[0_0_15px_#F97316]"
                    />
                  </div>
                  <p className="text-xs font-bold text-success flex items-center gap-2">
                    <Zap className="w-3 h-3" />
                    Growth Match: Ivy League Coaching Recommended
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5">
                  <div className="text-center p-4 rounded-xl bg-white/5 border border-white/5">
                    <p className="text-[10px] font-black uppercase text-secondary mb-1 tracking-widest">Skill Rank</p>
                    <p className="text-xl font-bold">TOP 2%</p>
                  </div>
                  <div className="text-center p-4 rounded-xl bg-white/5 border border-white/5">
                    <p className="text-[10px] font-black uppercase text-secondary mb-1 tracking-widest">Growth Path</p>
                    <p className="text-xl font-bold">READY</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Pillars */}
      <section className="container mx-auto px-6 py-24">
        <div className="text-center mb-20 space-y-4">
          <h2 className="text-4xl md:text-5xl font-black tracking-tight">Constructed For <span className="text-primary italic">Elite Performance</span></h2>
          <p className="text-secondary max-w-2xl mx-auto font-medium">Built by career architects, driven by Hybrid AI. Experience the new standard in professional transformation.</p>
        </div>
        
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {pillars.map((p, i) => (
            <motion.div
              key={i}
              variants={itemVariants}
              whileHover={{ y: -10 }}
              className={`glass-card p-10 flex flex-col items-center text-center group relative overflow-hidden border-white/10`}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${p.accent} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
              <div className="p-4 rounded-3xl bg-white/5 mb-10 border border-white/10 group-hover:border-primary/50 transition-all duration-300 shadow-xl relative z-10 group-hover:rotate-[10deg]">
                <p.icon className="w-10 h-10 text-primary" />
              </div>
              <h3 className="text-2xl font-black mb-5 group-hover:text-primary transition-colors relative z-10">{p.title}</h3>
              <p className="text-secondary leading-relaxed text-sm relative z-10 font-medium">{p.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* The Mastery Loop */}
      <section className="container mx-auto px-6 py-32 border-t border-white/5 relative overflow-hidden">
        <div className="neural-glow -bottom-40 left-1/2 -translate-x-1/2 opacity-20" />
        <div className="text-center mb-24 relative z-10">
          <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-4">The <span className="text-primary italic">Elite Loop</span></h2>
          <p className="text-secondary font-medium">Standardized flow for career acceleration.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 relative z-10">
          {/* Connector Line (Desktop) */}
          <div className="hidden md:block absolute top-[60px] left-[10%] right-[10%] h-[2px] bg-gradient-to-r from-transparent via-white/10 to-transparent z-0" />
          
          {loopSteps.map((s, i) => (
            <div key={i} className="flex flex-col items-center text-center relative z-10 group">
              <div className="w-16 h-16 rounded-[1.5rem] bg-[#0F172A] border-2 border-white/10 flex items-center justify-center font-black text-white group-hover:border-primary group-hover:text-primary group-hover:rotate-6 transition-all duration-300 mb-8 shadow-2xl">
                {i + 1}
              </div>
              <h3 className="text-2xl font-black mb-4 group-hover:text-primary transition-colors">{s.title}</h3>
              <p className="text-secondary text-sm px-4 leading-relaxed font-medium">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-6 py-20 border-t border-white/5 mt-20 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-center gap-12">
          <div className="flex flex-col items-center md:items-start space-y-6">
            <Link to="/" className="flex items-center gap-2 leading-none group">
              <img 
                src={logo} 
                alt="Arivon" 
                className="h-11 w-auto object-contain block group-hover:scale-110 transition-transform" 
              />
              <span className="text-2xl font-black tracking-tighter text-white m-0 leading-none">RIVON</span>
            </Link>
            <p className="text-secondary text-sm font-bold tracking-wide italic">Hybrid AI Career Intelligence Platform</p>
            <p className="text-secondary/60 text-xs font-medium uppercase tracking-[0.2em]">© 2026 High Growth Tech Group</p>
          </div>

          <div className="flex flex-wrap justify-center gap-x-12 gap-y-6 text-xs font-black uppercase tracking-widest text-secondary">
            <Link to="/login" className="hover:text-primary transition-colors">Client Sign In</Link>
            <Link to="/register" className="hover:text-primary transition-colors">Join Elite Community</Link>
            <a href="#" className="hover:text-primary transition-colors">Neural Assets</a>
            <a href="#" className="hover:text-primary transition-colors">Privacy Privacy</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
