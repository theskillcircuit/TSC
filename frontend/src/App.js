import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';

// Scroll to top on route change
const ScrollToTop = () => {
  const { pathname } = useLocation();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  
  return null;
};
import { Toaster } from 'sonner';
import { AuthProvider, useAuth } from './context/AuthContext';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Pages
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import CoursesPage from './pages/CoursesPage';
import CourseDetailPage from './pages/CourseDetailPage';
import ContactPage from './pages/ContactPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import AuthCallback from './pages/AuthCallback';
import StudentDashboard from './pages/StudentDashboard';
import AdminDashboard from './pages/AdminDashboard';
import PaymentSuccessPage from './pages/PaymentSuccessPage';

import './App.css';

// Protected Route Component
const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, loading, isAuthenticated } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#f16a2f]"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to={user?.role === 'admin' ? '/admin' : '/dashboard'} replace />;
  }

  return children;
};

// Layout with Navbar and Footer
const MainLayout = ({ children, hideFooter = false }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 pt-16">
        {children}
      </main>
      {!hideFooter && <Footer />}
    </div>
  );
};

// App Router Component
const AppRouter = () => {
  const location = useLocation();
  
  // Handle Google OAuth callback - check for session_id in hash
  if (location.hash?.includes('session_id=')) {
    return <AuthCallback />;
  }

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<MainLayout><HomePage /></MainLayout>} />
      <Route path="/about" element={<MainLayout><AboutPage /></MainLayout>} />
      <Route path="/courses" element={<MainLayout><CoursesPage /></MainLayout>} />
      <Route path="/courses/:courseId" element={<MainLayout><CourseDetailPage /></MainLayout>} />
      <Route path="/contact" element={<MainLayout><ContactPage /></MainLayout>} />
      
      {/* Auth Routes - No navbar/footer */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      
      {/* Payment Success */}
      <Route path="/payment/success" element={
        <ProtectedRoute>
          <MainLayout hideFooter><PaymentSuccessPage /></MainLayout>
        </ProtectedRoute>
      } />
      
      {/* Protected Student Routes */}
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <MainLayout hideFooter><StudentDashboard /></MainLayout>
        </ProtectedRoute>
      } />
      <Route path="/dashboard/*" element={
        <ProtectedRoute>
          <MainLayout hideFooter><StudentDashboard /></MainLayout>
        </ProtectedRoute>
      } />
      
      {/* Protected Admin Routes */}
      <Route path="/admin" element={
        <ProtectedRoute requiredRole="admin">
          <MainLayout hideFooter><AdminDashboard /></MainLayout>
        </ProtectedRoute>
      } />
      <Route path="/admin/*" element={
        <ProtectedRoute requiredRole="admin">
          <MainLayout hideFooter><AdminDashboard /></MainLayout>
        </ProtectedRoute>
      } />
      
      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRouter />
        <Toaster 
          position="top-right"
          toastOptions={{
            style: {
              fontFamily: "'Plus Jakarta Sans', sans-serif",
            },
          }}
        />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
