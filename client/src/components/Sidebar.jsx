import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Users,
  LayoutDashboard, 
  Target, 
  Layers, 
  Map as MapIcon, 
  User as UserIcon, 
  LogOut, 
  ChevronLeft,
  Sparkles,
  Zap,
  FileSearch,
  Briefcase,
  Trophy,
  Brain,
  BookOpen,
  PanelLeftClose,
  PanelLeftOpen
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/logo.png';

const Sidebar = ({ isOpen, toggleSidebar, isCollapsed, setIsCollapsed }) => {
  const { user, profile, logout } = useAuth();
  const location = useLocation();

  const isRecruiter = user?.role === 'recruiter' || profile?.role === 'recruiter';

  const menuItems = isRecruiter ? [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/recruiter/dashboard' },
    { icon: Briefcase, label: 'My Job Listings', path: '/recruiter/jobs' }, // Placeholder for now
    { icon: Users, label: 'Recruit Candidates', path: '/recruiter/candidates' }, // Placeholder
    { icon: UserIcon, label: 'Company Profile', path: '/profile' },
  ] : [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: UserIcon, label: 'Profile', path: '/profile' },
    { icon: FileSearch, label: 'ATS Analyzer', path: '/ats' },
    { icon: Briefcase, label: 'Browse Jobs', path: '/jobs' },
    { icon: Brain, label: 'Test Your Worth', path: '/assessment' },
    { icon: BookOpen, label: 'Learn', path: '/learn' },
  ];

  const handleLogout = () => {
    logout();
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar Container */}
      <aside className={`
        fixed top-0 left-0 h-full bg-card border-r border-white/5 z-50
        transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]
        ${isCollapsed ? 'w-20' : 'w-72'}
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Header */}
        <div className={`p-6 flex flex-col gap-8 ${isCollapsed ? 'items-center' : ''}`}>
          <div className={`flex items-center w-full ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
            <Link to="/dashboard" className="flex items-center gap-2 group overflow-hidden leading-none">
              <img 
                src={logo} 
                alt="Arivon" 
                className="h-11 w-auto object-contain block group-hover:scale-110 transition-transform" 
              />
              {!isCollapsed && (
                <span className="text-2xl font-black tracking-tighter text-white whitespace-nowrap m-0 leading-none">
                  RIVON
                </span>
              )}
            </Link>
            {!isCollapsed && (
              <button 
                onClick={() => setIsCollapsed(!isCollapsed)} 
                className="hidden lg:flex p-2 hover:bg-white/5 rounded-xl text-secondary transition-colors shrink-0"
                title="Collapse Sidebar"
              >
                <PanelLeftClose className="w-5 h-5" />
              </button>
            )}
            <button onClick={toggleSidebar} className="lg:hidden p-2 hover:bg-white/5 rounded-xl text-secondary">
              <ChevronLeft className="w-6 h-6" />
            </button>
          </div>
          {isCollapsed && (
            <button 
              onClick={() => setIsCollapsed(!isCollapsed)} 
              className="hidden lg:flex p-2 hover:bg-white/5 rounded-xl text-secondary transition-colors"
              title="Expand Sidebar"
            >
              <PanelLeftOpen className="w-5 h-5 text-primary" />
            </button>
          )}
        </div>

        {/* Navigation */}
        <nav className={`px-4 py-4 space-y-4 ${isCollapsed ? 'flex flex-col items-center' : ''}`}>
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                title={isCollapsed ? item.label : ""}
                className={`
                  flex items-center transition-all duration-300 group rounded-2xl border border-transparent
                  ${isCollapsed ? 'justify-center w-12 h-12 p-0' : 'gap-4 px-4 py-3 w-full'}
                  ${isActive 
                    ? 'bg-primary/10 text-primary border-primary/20 shadow-lg shadow-primary/5' 
                    : 'text-secondary hover:text-white hover:bg-white/5'}
                `}
              >
                <div className={`
                  flex items-center justify-center shrink-0 transition-all duration-300
                  ${isCollapsed ? 'w-10 h-10' : 'w-10 h-10 p-2 rounded-xl bg-primary/10'}
                  ${isActive && !isCollapsed ? 'bg-primary/20' : ''}
                `}>
                  <Icon className={`w-5 h-5 ${isActive ? 'text-primary' : ''}`} />
                </div>
                {!isCollapsed && <span className="font-bold tracking-tight">{item.label}</span>}
                {isActive && !isCollapsed && (
                  <motion.div 
                    layoutId="sidebar-active"
                    className="ml-auto w-1.5 h-1.5 rounded-full bg-primary"
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bottom Section */}
        <div className={`absolute bottom-0 left-0 w-full p-4 space-y-4 ${isCollapsed ? 'flex flex-col items-center' : ''}`}>
          <button 
            onClick={handleLogout}
            title={isCollapsed ? "Sign Out" : ""}
            className={`flex items-center transition-all font-bold group shadow-lg shadow-error/5 border border-error/20 hover:border-error/30 bg-error/10 hover:bg-error/20 text-error rounded-xl
              ${isCollapsed ? 'justify-center w-12 h-12 p-0' : 'gap-3 px-4 py-3 w-full'}
            `}
          >
            <div className={`flex items-center justify-center shrink-0 ${isCollapsed ? 'w-10 h-10' : ''}`}>
              <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            </div>
            {!isCollapsed && <span>Sign Out</span>}
          </button>
          
          <div className="text-center w-full">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 truncate px-2">
              {isCollapsed ? 'V2.0' : 'Arivon Intelligence v2.0'}
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
