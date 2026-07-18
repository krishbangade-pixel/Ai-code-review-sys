import React, { useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  FileCode, 
  History, 
  User, 
  Settings, 
  LogOut, 
  ChevronLeft, 
  ChevronRight,
  Cpu,
  Menu,
  X,
  Zap
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function Sidebar({ isMobileOpen, setIsMobileOpen }) {
  const { user, logout } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'New Review', path: '/new-review', icon: FileCode },
    { name: 'Previous Reviews', path: '/reviews', icon: History },
    { name: 'Profile', path: '/profile', icon: User },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const SidebarContent = () => (
    <div className="sidebar-container flex flex-col h-full bg-[#0a0a0c] border-r border-[#1f1f23] text-[#9ca3af] overflow-hidden">
      {/* Brand logo */}
      <div className="flex items-center justify-between p-4 border-b border-[#1f1f23]">
        <div className="flex items-center gap-3 overflow-hidden" onClick={() => navigate('/dashboard')}>
          <div className="flex items-center justify-center p-2 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-md shadow-indigo-500/10 cursor-pointer">
            <Cpu size={22} className="animate-pulse" />
          </div>
          {!isCollapsed && (
            <motion.span 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="brand-logo-text text-lg font-bold bg-gradient-to-r from-white via-[#f3f4f6] to-purple-400 bg-clip-text text-transparent font-sans cursor-pointer"
            >
              Autonomous<span className="text-indigo-400 font-extrabold"> AI</span>
            </motion.span>
          )}
        </div>
        
        {/* Toggle Collapse on Desktop */}
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)} 
          className="hidden md:flex items-center justify-center p-1.5 rounded-lg border border-[#1f1f23] hover:border-indigo-500/50 hover:bg-[#161619] hover:text-white transition-colors cursor-pointer"
        >
          {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>

        {/* Close button on Mobile */}
        <button 
          onClick={() => setIsMobileOpen(false)} 
          className="flex md:hidden items-center justify-center p-1.5 rounded-lg border border-[#1f1f23] hover:bg-[#161619] hover:text-white transition-colors cursor-pointer"
        >
          <X size={16} />
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto scrollbar-none">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path || (item.path === '/dashboard' && location.pathname === '/');
          return (
            <NavLink
              key={item.name}
              to={item.path}
              onClick={() => setIsMobileOpen(false)}
              className={({ isActive }) => `
                flex items-center gap-3.5 px-3 py-3 rounded-xl text-sm font-medium transition-all duration-300 relative group cursor-pointer
                ${isActive 
                  ? 'text-white bg-gradient-to-r from-indigo-500/10 to-purple-500/5 border border-indigo-500/20' 
                  : 'hover:text-[#f3f4f6] hover:bg-[#161619]/60 border border-transparent'
                }
              `}
            >
              <item.icon size={18} className={`${isActive ? 'text-indigo-400' : 'group-hover:text-white'} transition-colors`} />
              {!isCollapsed && <span>{item.name}</span>}
              
              {/* Tooltip for collapsed mode */}
              {isCollapsed && (
                <div className="absolute left-16 scale-0 group-hover:scale-100 transition-all duration-200 bg-[#0a0a0c] text-white border border-[#1f1f23] text-xs font-semibold px-2.5 py-1.5 rounded-md shadow-xl whitespace-nowrap z-50 pointer-events-none">
                  {item.name}
                </div>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* User profile footer */}
      {user && (
        <div className="p-3 border-t border-[#1f1f23] flex flex-col gap-2">
          {!isCollapsed ? (
            <div className="flex items-center gap-3 p-2 rounded-xl bg-[#161619]/40 border border-[#1f1f23]/60">
              <img 
                src={user.avatar} 
                alt={user.name} 
                className="w-9 h-9 rounded-full object-cover border border-[#1f1f23]"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white truncate leading-none mb-1">{user.name}</p>
                <span className="text-[10px] bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 font-medium px-2 py-0.5 rounded-full inline-block">
                  {user.tier}
                </span>
              </div>
            </div>
          ) : (
            <div className="flex justify-center py-2">
              <img 
                src={user.avatar} 
                alt={user.name} 
                className="w-8 h-8 rounded-full object-cover border border-[#1f1f23]"
                onClick={() => navigate('/profile')}
              />
            </div>
          )}

          <button
            onClick={handleLogout}
            className={`
              flex items-center justify-center gap-3.5 px-3 py-2.5 rounded-xl text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-500/5 transition-all cursor-pointer
              ${isCollapsed ? 'justify-center' : 'w-full'}
            `}
          >
            <LogOut size={17} />
            {!isCollapsed && <span>Logout</span>}
            
            {isCollapsed && (
              <div className="absolute left-16 scale-0 hover:scale-100 transition-all duration-200 bg-[#0a0a0c] text-red-400 border border-[#1f1f23] text-xs font-semibold px-2.5 py-1.5 rounded-md shadow-xl whitespace-nowrap z-50 pointer-events-none">
                Logout
              </div>
            )}
          </button>
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* Spacer to preserve layout structure when sidebar is fixed */}
      <motion.div 
        animate={{ width: isCollapsed ? '72px' : '260px' }}
        transition={{ type: 'spring', damping: 20, stiffness: 120 }}
        className="hidden md:block h-screen shrink-0"
      />

      {/* Desktop Sidebar wrapper with Framer Motion width control */}
      <motion.div 
        animate={{ width: isCollapsed ? '72px' : '260px' }}
        transition={{ type: 'spring', damping: 20, stiffness: 120 }}
        className="hidden md:block h-screen fixed top-0 left-0 shrink-0 overflow-hidden z-20"
      >
        <SidebarContent />
      </motion.div>

      {/* Mobile Drawer (AnimatePresence) */}
      <AnimatePresence>
        {isMobileOpen && (
          <>
            {/* Backdrop overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileOpen(false)}
              className="md:hidden fixed inset-0 bg-black z-40"
            />
            {/* Sidebar drawer panel */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="md:hidden fixed inset-y-0 left-0 w-[85vw] max-w-[270px] z-50 shadow-2xl overflow-hidden"
            >
              <SidebarContent />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
