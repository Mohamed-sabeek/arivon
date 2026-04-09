import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute, PublicRoute } from './components/RouteGuards';
import { AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { Menu } from 'lucide-react';

import Home from './pages/Home';
import { Login, Register } from './pages/AuthPages';
import Onboarding from './pages/Onboarding';
import ProfileForm from './pages/ProfileForm';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import ATS from './pages/ATS';
import BrowseJobs from './pages/BrowseJobs';
import JobDetails from './pages/JobDetails';
import Assessment from './pages/Assessment';
import Quiz from './pages/Quiz';
import AssessmentResult from './pages/AssessmentResult';
import Level2 from './pages/Level2';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';

const AppContent = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();
  const isPublicPage = location.pathname === '/' || location.pathname === '/login' || location.pathname === '/register';
  const isOnboardingPage = location.pathname === '/onboarding';

  return (
    <div className="flex min-h-screen bg-background text-white">
      {!isPublicPage && !isOnboardingPage && (
        <Sidebar isOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
      )}
      
      <div className={`flex-grow flex flex-col transition-all duration-300 ${!isPublicPage && !isOnboardingPage ? 'lg:pl-72' : ''}`}>
        {isPublicPage ? (
          <Navbar toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
        ) : !isOnboardingPage ? (
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="lg:hidden fixed top-6 left-6 z-40 p-3 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl text-white hover:bg-white/10 transition-all shadow-xl"
          >
            <Menu className="w-6 h-6" />
          </button>
        ) : null}
        
        <main className={`flex-grow ${isPublicPage || isOnboardingPage ? '' : 'pt-12 pb-12'}`}>
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route 
                path="/login" 
                element={
                  <PublicRoute>
                    <Login />
                  </PublicRoute>
                } 
              />
              <Route 
                path="/register" 
                element={
                  <PublicRoute>
                    <Register />
                  </PublicRoute>
                } 
              />

              {/* Protected Routes */}
              <Route 
                path="/onboarding" 
                element={
                  <ProtectedRoute>
                    <Onboarding />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/profile-form" 
                element={
                  <ProtectedRoute>
                    <ProfileForm />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/profile" 
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/ats" 
                element={
                  <ProtectedRoute>
                    <ATS />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/jobs" 
                element={
                  <ProtectedRoute>
                    <BrowseJobs />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/jobs/:id" 
                element={
                  <ProtectedRoute>
                    <JobDetails />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/assessment" 
                element={
                  <ProtectedRoute>
                    <Assessment />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/assessment/:skill" 
                element={
                  <ProtectedRoute>
                    <Quiz />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/assessment/result" 
                element={
                  <ProtectedRoute>
                    <AssessmentResult />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/assessment/:skill/level2" 
                element={
                  <ProtectedRoute>
                    <Level2 />
                  </ProtectedRoute>
                } 
              />
            </Routes>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;
