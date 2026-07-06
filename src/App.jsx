import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Context Providers
import { AuthProvider } from './context/AuthContext';
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

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ReviewProvider>
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
            {/* Landing page */}
            <Route path="/" element={<Landing />} />

            {/* Public Authentication Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />

            {/* Protected Dashboard/Audit Routes */}
            <Route path="/dashboard" element={
              <DashboardLayout>
                <Dashboard />
              </DashboardLayout>
            } />
            
            <Route path="/new-review" element={
              <DashboardLayout>
                <NewReview />
              </DashboardLayout>
            } />

            <Route path="/reviews" element={
              <DashboardLayout>
                <Reviews />
              </DashboardLayout>
            } />

            <Route path="/reviews/:id" element={
              <DashboardLayout>
                <DetailedReport />
              </DashboardLayout>
            } />

            <Route path="/profile" element={
              <DashboardLayout>
                <Profile />
              </DashboardLayout>
            } />

            <Route path="/settings" element={
              <DashboardLayout>
                <Settings />
              </DashboardLayout>
            } />

            {/* Fallbacks */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </ReviewProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
