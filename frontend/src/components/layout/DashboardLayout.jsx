import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Menu, Cpu, Bell, ChevronDown } from 'lucide-react';
import Sidebar from './Sidebar';
import { useAuth } from '../../context/AuthContext';

export default function DashboardLayout({ children }) {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Protected route logic
  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
    }
  }, [user, loading, navigate]);

  if (loading || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#030303]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center animate-spin">
            <Cpu size={24} className="text-indigo-400" />
          </div>
          <span className="text-sm text-[#9ca3af] font-medium tracking-wide">Loading Autonomous AI...</span>
        </div>
      </div>
    );
  }

  // Get human readable title of current active route
  const getHeaderTitle = () => {
    switch (location.pathname) {
      case '/':
      case '/dashboard':
        return 'Overview';
      case '/new-review':
        return 'Code Reviewer';
      case '/reviews':
        return 'Review History';
      case '/profile':
        return 'Account Settings';
      case '/settings':
        return 'Preferences';
      default:
        if (location.pathname.startsWith('/reviews/')) {
          return 'Analysis Report';
        }
        return 'Autonomous AI';
    }
  };

  return (
    <div className="flex min-h-screen bg-[#030303] text-white">
      {/* Sidebar Panel */}
      <Sidebar isMobileOpen={isMobileOpen} setIsMobileOpen={setIsMobileOpen} />

      {/* Main Workspace */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Top Header Navbar */}
        <header className="h-16 border-b border-[#1f1f23] bg-[#0a0a0c]/60 backdrop-blur-md px-4 sm:px-6 md:px-8 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-4">
            {/* Mobile Hamburger menu */}
            <button 
              onClick={() => setIsMobileOpen(true)}
              className="md:hidden flex items-center justify-center p-2 rounded-lg border border-[#1f1f23] hover:bg-[#161619] text-[#9ca3af] hover:text-white cursor-pointer"
            >
              <Menu size={18} />
            </button>
            <h1 className="text-base font-bold text-white tracking-wide font-sans m-0">
              {getHeaderTitle()}
            </h1>
          </div>

          <div className="flex items-center gap-4">
            {/* Quick action: new review */}
            <button 
              onClick={() => navigate('/new-review')}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/15 transition-all cursor-pointer"
            >
              New Audit
            </button>

            {/* Notifications Button */}
            <button className="flex items-center justify-center p-2 rounded-lg border border-[#1f1f23] hover:bg-[#161619] text-[#9ca3af] hover:text-white transition-colors relative cursor-pointer">
              <Bell size={16} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-indigo-500" />
            </button>

            {/* Quick Profile Dropdown wrapper */}
            <div className="flex items-center gap-2 pl-2 border-l border-[#1f1f23]">
              <img 
                src={user.avatar} 
                alt={user.name} 
                className="w-7 h-7 rounded-full object-cover border border-[#1f1f23] cursor-pointer"
                onClick={() => navigate('/profile')}
              />
              <ChevronDown size={14} className="text-[#6b7280] hidden sm:block" />
            </div>
          </div>
        </header>

        {/* Dynamic Route Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 bg-grid-pattern relative">
          <div className="absolute top-0 left-1/4 w-[300px] h-[300px] sm:w-[500px] sm:h-[500px] bg-indigo-600/5 rounded-full blur-[120px] pointer-events-none" />
          <div className="absolute bottom-0 right-1/4 w-[250px] h-[250px] sm:w-[400px] sm:h-[400px] bg-purple-600/5 rounded-full blur-[100px] pointer-events-none" />
          
          <div className="w-full max-w-6xl mx-auto relative z-10">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
