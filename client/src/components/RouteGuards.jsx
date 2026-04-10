import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const ProtectedRoute = ({ children }) => {
  const { user, profile, loading } = useAuth();
  const location = window.location;

  if (loading) return null;

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // RECRUITER FLOW PROTECTION
  if (user.role === "recruiter") {
    const isCompanyProfileComplete = user?.companyProfileCompleted || profile?.companyProfileCompleted;
    
    // Force setup if not completed
    if (!isCompanyProfileComplete && location.pathname !== '/recruiter/setup') {
      return <Navigate to="/recruiter/setup" />;
    }

    // Redirect away from setup if already completed
    if (isCompanyProfileComplete && location.pathname === '/recruiter/setup') {
      return <Navigate to="/recruiter/dashboard" />;
    }

    // Prevent recruiter from accessing student routes
    if (location.pathname.startsWith("/onboarding") || location.pathname === "/dashboard") {
      return <Navigate to={isCompanyProfileComplete ? "/recruiter/dashboard" : "/recruiter/setup"} />;
    }
  }

  // STUDENT FLOW PROTECTION
  if (user.role === "student") {
    // Prevent students from accessing recruiter routes
    if (location.pathname.startsWith("/recruiter")) {
      return <Navigate to="/dashboard" />;
    }

    const isProfileComplete = user?.isProfileComplete || profile?.isProfileComplete;
    
    // If profile is incomplete and not on onboarding page, redirect to onboarding
    if (!isProfileComplete && location.pathname !== '/onboarding') {
      return <Navigate to="/onboarding" />;
    }

    // If profile is complete and on onboarding page, redirect to dashboard
    if (isProfileComplete && location.pathname === '/onboarding') {
      return <Navigate to="/dashboard" />;
    }
  }

  return children;
};

export const PublicRoute = ({ children }) => {
  const { user, profile, loading } = useAuth();

  if (loading) return null;

  if (user) {
    if (user.role === "student") {
      return user.isProfileComplete
        ? <Navigate to="/dashboard" />
        : <Navigate to="/onboarding" />;
    }

    if (user.role === "recruiter") {
      const isCompanyProfileComplete = user?.companyProfileCompleted || profile?.companyProfileCompleted;
      return isCompanyProfileComplete
        ? <Navigate to="/recruiter/dashboard" />
        : <Navigate to="/recruiter/setup" />;
    }
  }

  return children;
};
