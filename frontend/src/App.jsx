import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Context Providers
import { AuthProvider, useAuth } from './context/AuthContext';
import { ReviewProvider } from './context/ReviewContext';

// Layout Wrap
import DashboardLayout from './components/layout/DashboardLayout';

// Pages
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import ForgotPassword from './pages/ForgotPassword';
import Dashboard from './pages/Dashboard';
import NewReview from './pages/NewReview';
import Reviews from './pages/Reviews';
import DetailedReport from './pages/DetailedReport';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import Landing from './pages/Landing';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center space-y-4">
        <div className="w-8 h-8 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
        <p className="text-sm text-[#9ca3af]">Loading...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return children;
};

// Auth Route Component (for login/signup/forgot-password - redirect to dashboard if logged in)
const AuthRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center space-y-4">
        <div className="w-8 h-8 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
        <p className="text-sm text-[#9ca3af]">Loading...</p>
      </div>
    );
  }

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

// Root Route Component (always show Landing Page on initial load)
const RootRoute = () => {
  const { loading } = useAuth();
  
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center space-y-4">
        <div className="w-8 h-8 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
        <p className="text-sm text-[#9ca3af]">Loading...</p>
      </div>
    );
  }

  return <Landing />;
};

const AppContent = () => {
  return (
    <>
      {/* Custom Vercel-like Toaster Notifications */}
      <Toaster 
        position="top-right"
        toastOptions={{
          style: {
            background: '#0a0a0c',
            color: '#f3f4f6',
            border: '1px solid #1f1f23',
            borderRadius: '14px',
            fontSize: '13px',
            padding: '12px 16px',
            boxShadow: '0 10px 30px -10px rgba(0, 0, 0, 0.5)'
          },
          success: {
            iconTheme: {
              primary: '#6366f1',
              secondary: '#000000',
            },
          },
        }}
      />

      <Routes>
        {/* Root Route - decides between Landing and Dashboard */}
        <Route path="/" element={<RootRoute />} />

        {/* Public Authentication Routes (redirect to dashboard if logged in) */}
        <Route path="/login" element={<AuthRoute><Login /></AuthRoute>} />
        <Route path="/signup" element={<AuthRoute><SignUp /></AuthRoute>} />
        <Route path="/forgot-password" element={<AuthRoute><ForgotPassword /></AuthRoute>} />

        {/* Protected Dashboard/Audit Routes */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <DashboardLayout>
              <Dashboard />
            </DashboardLayout>
          </ProtectedRoute>
        } />
        
        <Route path="/new-review" element={
          <ProtectedRoute>
            <DashboardLayout>
              <NewReview />
            </DashboardLayout>
          </ProtectedRoute>
        } />

        <Route path="/reviews" element={
          <ProtectedRoute>
            <DashboardLayout>
              <Reviews />
            </DashboardLayout>
          </ProtectedRoute>
        } />

        <Route path="/reviews/:id" element={
          <ProtectedRoute>
            <DashboardLayout>
              <DetailedReport />
            </DashboardLayout>
          </ProtectedRoute>
        } />

        <Route path="/profile" element={
          <ProtectedRoute>
            <DashboardLayout>
              <Profile />
            </DashboardLayout>
          </ProtectedRoute>
        } />

        <Route path="/settings" element={
          <ProtectedRoute>
            <DashboardLayout>
              <Settings />
            </DashboardLayout>
          </ProtectedRoute>
        } />

        {/* Fallbacks */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
};

const AppProviders = ({ children }) => {
  return (
    <AuthProvider>
      <ReviewProvider>
        {children}
      </ReviewProvider>
    </AuthProvider>
  );
};

export default function App() {
  return (
    <BrowserRouter>
      <AppProviders>
        <AppContent />
      </AppProviders>
    </BrowserRouter>
  );
}
