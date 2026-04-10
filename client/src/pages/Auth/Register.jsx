import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  UserPlus, 
  Mail, 
  Lock, 
  User as UserIcon, 
  ArrowRight, 
  Sparkles,
  Building,
  GraduationCap,
  Briefcase,
  Eye,
  EyeOff
} from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'student', // "student" or "recruiter"
    companyName: ''
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');
  
  const { register } = useAuth();
  const navigate = useNavigate();

  // Reset company name when switching to student
  const handleRoleChange = (newRole) => {
    setFormData(prev => ({ 
      ...prev, 
      role: newRole,
      companyName: newRole === 'user' ? '' : prev.companyName 
    }));
    // Clear field-specific error for company if moving back to student
    if (newRole === 'student') {
      const newErrors = { ...errors };
      delete newErrors.companyName;
      setErrors(newErrors);
    }
  };

  const validateField = (name, value) => {
    let error = '';
    if (name === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!value) error = 'Email is required';
      else if (!emailRegex.test(value)) error = 'Invalid email format';
    }
    if (name === 'password') {
      if (!value) error = 'Password is required';
      else if (value.length < 6) error = 'Password must be at least 6 characters';
    }
    if (name === 'confirmPassword') {
      if (!value) error = 'Please confirm your password';
      else if (value !== formData.password) error = 'Passwords do not match';
    }
    if (name === 'name' && !value) error = 'Full name is required';
    if (name === 'companyName' && formData.role === 'recruiter' && !value) error = 'Company name is required';

    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    setServerError('');
  };

  const handleBlur = (e) => {
    validateField(e.target.name, e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');
    
    // Final validation check
    const newErrors = {};
    if (!formData.name) newErrors.name = 'Full name is required';
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (formData.role === 'recruiter' && !formData.companyName) {
      newErrors.companyName = 'Company name is required';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      const userData = await register(
        formData.name, 
        formData.email, 
        formData.password, 
        formData.role, 
        formData.companyName
      );

      // Role-based navigation
      if (formData.role === 'recruiter') {
        navigate('/recruiter/dashboard', { replace: true });
      } else {
        if (!userData.user?.isProfileComplete) {
          navigate('/onboarding', { replace: true });
        } else {
          navigate('/dashboard', { replace: true });
        }
      }
    } catch (err) {
      setServerError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 relative pt-24 pb-12 overflow-x-hidden">
      {/* Background Elements */}
      <div className="neural-glow top-0 right-0 opacity-20 pointer-events-none" />
      <div className="neural-glow bottom-0 left-0 opacity-10 pointer-events-none" />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="glass-card w-full max-w-xl p-8 md:p-12 relative z-10"
      >
        <div className="text-center mb-10">
          <motion.div 
            initial={{ scale: 0 }} 
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-primary/20 shadow-xl shadow-primary/5"
          >
            <UserPlus className="text-primary w-8 h-8" />
          </motion.div>
          <h2 className="text-3xl md:text-4xl font-black tracking-tight mb-2 uppercase">Create Your Account</h2>
          <p className="text-secondary font-medium italic">Start your journey with Arivon</p>
        </div>

        {/* Role Selection Toggle */}
        <div className="flex bg-white/5 p-1 rounded-2xl mb-10 border border-white/5 shadow-inner">
          <button
            type="button"
            onClick={() => handleRoleChange('student')}
            className={`flex-1 flex items-center justify-center gap-3 py-4 font-black text-xs tracking-widest uppercase transition-all duration-300 rounded-xl ${
              formData.role === 'student' 
                ? 'bg-primary text-white shadow-[0_0_20px_rgba(249,115,22,0.4)] scale-[1.02]' 
                : 'text-secondary hover:text-white hover:bg-white/5'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            Student
          </button>
          <button
            type="button"
            onClick={() => handleRoleChange('recruiter')}
            className={`flex-1 flex items-center justify-center gap-3 py-4 font-black text-xs tracking-widest uppercase transition-all duration-300 rounded-xl ${
              formData.role === 'recruiter' 
                ? 'bg-primary text-white shadow-[0_0_20px_rgba(249,115,22,0.4)] scale-[1.02]' 
                : 'text-secondary hover:text-white hover:bg-white/5'
            }`}
          >
            <Briefcase className="w-4 h-4" />
            Recruiter
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6" noValidate>
          <AnimatePresence mode="wait">
            {serverError && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="p-4 bg-error/10 border border-error/20 text-error text-sm font-bold rounded-2xl flex items-center gap-3 shadow-lg"
              >
                <div className="w-6 h-6 rounded-full bg-error/20 flex items-center justify-center shrink-0">
                  <Sparkles className="w-4 h-4 text-error" />
                </div>
                {serverError}
              </motion.div>
            )}
          </AnimatePresence>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-secondary uppercase tracking-[0.2em] ml-1">Full Name</label>
              <div className="relative group">
                <UserIcon className={`absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors duration-300 ${errors.name ? 'text-error' : 'text-secondary group-focus-within:text-primary'}`} />
                <input
                  type="text"
                  name="name"
                  required
                  autoComplete="name"
                  placeholder="John Doe"
                  className={`floating-label-input pl-14 h-14 text-sm transition-all duration-300 focus:ring-2 focus:ring-primary/20 ${errors.name ? 'border-error/50 bg-error/5 focus:border-error focus:ring-error/20' : 'focus:border-primary'}`}
                  value={formData.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </div>
              {errors.name && <p className="text-[10px] text-error font-bold ml-1 animate-pulse">{errors.name}</p>}
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-secondary uppercase tracking-[0.2em] ml-1">Email Address</label>
              <div className="relative group">
                <Mail className={`absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors duration-300 ${errors.email ? 'text-error' : 'text-secondary group-focus-within:text-primary'}`} />
                <input
                  type="email"
                  name="email"
                  required
                  autoComplete="email"
                  placeholder="you@example.com"
                  className={`floating-label-input pl-14 h-14 text-sm transition-all duration-300 focus:ring-2 focus:ring-primary/20 ${errors.email ? 'border-error/50 bg-error/5 focus:border-error focus:ring-error/20' : 'focus:border-primary'}`}
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </div>
              {errors.email && <p className="text-[10px] text-error font-bold ml-1 animate-pulse">{errors.email}</p>}
            </div>
          </div>

          <AnimatePresence>
            {formData.role === 'recruiter' && (
              <motion.div 
                initial={{ height: 0, opacity: 0, marginTop: 0 }}
                animate={{ height: 'auto', opacity: 1, marginTop: 16 }}
                exit={{ height: 0, opacity: 0, marginTop: 0 }}
                className="overflow-hidden"
              >
                <div className="space-y-1.5 pb-1">
                  <label className="text-[10px] font-black text-primary uppercase tracking-[0.2em] ml-1">Company Name</label>
                  <div className="relative group">
                    <Building className={`absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors duration-300 ${errors.companyName ? 'text-error' : 'text-secondary group-focus-within:text-primary'}`} />
                    <input
                      type="text"
                      name="companyName"
                      required={formData.role === 'recruiter'}
                      placeholder="Tech Solutions Inc."
                      className={`floating-label-input pl-14 h-14 text-sm transition-all duration-300 focus:ring-2 focus:ring-primary/20 ${errors.companyName ? 'border-error/50 bg-error/5 focus:border-error focus:ring-error/20' : 'border-primary/20 focus:border-primary'}`}
                      value={formData.companyName}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                  </div>
                  {errors.companyName && <p className="text-[10px] text-error font-bold ml-1 animate-pulse">{errors.companyName}</p>}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-secondary uppercase tracking-[0.2em] ml-1">Password</label>
              <div className="relative group">
                <Lock className={`absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors duration-300 ${errors.password ? 'text-error' : 'text-secondary group-focus-within:text-primary'}`} />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  required
                  autoComplete="new-password"
                  placeholder="••••••••"
                  className={`floating-label-input pl-14 pr-12 h-14 text-sm transition-all duration-300 focus:ring-2 focus:ring-primary/20 ${errors.password ? 'border-error/50 bg-error/5 focus:border-error focus:ring-error/20' : 'focus:border-primary'}`}
                  value={formData.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-1.5 text-secondary hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <p className="text-[10px] text-error font-bold ml-1 animate-pulse">{errors.password}</p>}
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-secondary uppercase tracking-[0.2em] ml-1">Confirm Password</label>
              <div className="relative group">
                <Lock className={`absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors duration-300 ${errors.confirmPassword ? 'text-error' : 'text-secondary group-focus-within:text-primary'}`} />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  required
                  autoComplete="new-password"
                  placeholder="••••••••"
                  className={`floating-label-input pl-14 pr-12 h-14 text-sm transition-all duration-300 focus:ring-2 focus:ring-primary/20 ${errors.confirmPassword ? 'border-error/50 bg-error/5 focus:border-error focus:ring-error/20' : 'focus:border-primary'}`}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-1.5 text-secondary hover:text-white transition-colors"
                >
                  {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.confirmPassword && <p className="text-[10px] text-error font-bold ml-1 animate-pulse">{errors.confirmPassword}</p>}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`glow-button w-full flex items-center justify-center gap-3 text-lg h-16 mt-8 transition-all duration-500 ${loading ? 'opacity-70 cursor-not-allowed scale-[0.98]' : 'hover:scale-[1.01]'}`}
          >
            {loading ? (
              <div className="flex items-center gap-4">
                <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                <span className="font-bold tracking-widest text-sm">CREATING ACCOUNT...</span>
              </div>
            ) : (
              <>
                <span className="font-black uppercase tracking-[0.1em] text-sm">Complete Registration</span>
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </form>

        <div className="mt-10 text-center border-t border-white/5 pt-8">
          <p className="text-secondary font-medium text-sm">
            Already an elite member?
            <Link 
              to="/login" 
              className="ml-3 text-primary hover:text-primary-light font-black underline underline-offset-8 decoration-primary/30 hover:decoration-primary transition-all uppercase text-[10px] tracking-widest"
            >
              Access Console
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;

