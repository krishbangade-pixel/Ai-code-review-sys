import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Cpu, Mail, Lock, Eye, EyeOff, Github } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function Login() {
  const { login, loading, toggleDevMode } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.error('Email is required');
      return;
    }
    if (!password) {
      toast.error('Password is required');
      return;
    }
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    try {
      const success = await login(email, password, rememberMe);
      if (success) {
        navigate('/dashboard');
      }
    } catch (error) {
      if (error.message && error.message.includes('rate')) {
        toast.error('Email rate limit exceeded. Please try again later.');
      }
    }
  };

  const handleOAuthLogin = (provider) => {
    toast.loading(`Connecting to ${provider}...`);
    setTimeout(() => {
      toast.dismiss();
      toast.success(`Successfully logged in with ${provider}!`);
      // Simulate OAuth login
      login('developer@pulsar.ai', 'oauth-login-token', true);
      navigate('/dashboard');
    }, 1500);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#030303] text-white p-4 relative overflow-hidden bg-grid-pattern">
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/4 w-[350px] h-[350px] bg-indigo-600/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[350px] h-[350px] bg-purple-600/10 rounded-full blur-[100px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Logo/Brand Header */}
        <div className="flex flex-col items-center mb-8">
          <div className="flex items-center justify-center p-3 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-xl shadow-indigo-500/20 mb-4">
            <Cpu size={32} />
          </div>
          <h2 className="text-3xl font-extrabold text-white tracking-tight mb-2">Welcome Back</h2>
          <p className="text-sm text-[#9ca3af]">Enter your details to access PulsarAI audits</p>
        </div>

        {/* Login Form Card */}
        <div className="glass-panel rounded-2xl border border-[#1f1f23] p-8 shadow-2xl relative">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Email Field */}
            <div>
              <label className="block text-xs font-semibold text-[#9ca3af] uppercase tracking-wider mb-2" htmlFor="email">
                Email Address
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-[#6b7280]">
                  <Mail size={16} />
                </span>
                <input
                  id="email"
                  type="email"
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#1f1f23] bg-[#0c0c0e]/80 text-white placeholder-[#4b5563] text-sm focus:border-indigo-500/80 focus:ring-1 focus:ring-indigo-500/80 outline-none transition-all"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-semibold text-[#9ca3af] uppercase tracking-wider" htmlFor="password">
                  Password
                </label>
                <Link to="/forgot-password" className="text-xs font-medium text-indigo-400 hover:text-indigo-300 transition-colors">
                  Forgot Password?
                </Link>
              </div>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-[#6b7280]">
                  <Lock size={16} />
                </span>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-3 rounded-xl border border-[#1f1f23] bg-[#0c0c0e]/80 text-white placeholder-[#4b5563] text-sm focus:border-indigo-500/80 focus:ring-1 focus:ring-indigo-500/80 outline-none transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#6b7280] hover:text-white cursor-pointer"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Remember Me Checkbox */}
            <div className="flex items-center">
              <input
                id="remember"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded border-[#1f1f23] bg-[#0c0c0e] text-indigo-600 focus:ring-indigo-500"
              />
              <label htmlFor="remember" className="ml-2.5 text-xs text-[#9ca3af] font-medium cursor-pointer">
                Remember me on this device
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-600/50 text-white font-semibold text-sm transition-all shadow-lg shadow-indigo-600/20 flex items-center justify-center cursor-pointer"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Social Logins */}
          <div className="mt-8">
            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#1f1f23]"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase tracking-wider font-semibold">
                <span className="bg-[#0a0a0c] px-3.5 text-[#6b7280]">Or continue with</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => handleOAuthLogin('GitHub')}
                className="flex items-center justify-center gap-2.5 py-2.5 rounded-xl border border-[#1f1f23] bg-[#0c0c0e]/80 hover:bg-[#161619] text-sm text-[#e5e7eb] hover:text-white transition-all cursor-pointer font-medium"
              >
                <Github size={16} />
                GitHub
              </button>
              <button
                type="button"
                onClick={() => handleOAuthLogin('Google')}
                className="flex items-center justify-center gap-2.5 py-2.5 rounded-xl border border-[#1f1f23] bg-[#0c0c0e]/80 hover:bg-[#161619] text-sm text-[#e5e7eb] hover:text-white transition-all cursor-pointer font-medium"
              >
                {/* SVG for Google Logo */}
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#EA4335" d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.114-5.186 4.114-3.504 0-6.343-2.839-6.343-6.343s2.839-6.343 6.343-6.343c1.624 0 3.099.613 4.228 1.624l3.15-3.15C19.167 2.228 15.938 1 12.24 1 6.032 1 1 6.032 1 12.24s5.032 11.24 11.24 11.24c5.897 0 10.8-4.228 10.8-11.24 0-.583-.058-1.127-.16-1.655H12.24Z"/>
                </svg>
                Google
              </button>
            </div>
          </div>

          {/* Dev Mode Button */}
          <button
            type="button"
            onClick={() => {
              toggleDevMode(true);
              navigate('/dashboard');
            }}
            className="w-full mt-6 py-2 rounded-lg bg-[#0c0c0e] border border-dashed border-[#4b5563] hover:border-purple-500/50 hover:bg-[#161619] text-[#9ca3af] hover:text-white font-medium text-xs transition-all cursor-pointer"
          >
            🧪 DEV MODE - Quick Access to Dashboard
          </button>
        </div>

        {/* Bottom Switch Link */}
        <p className="text-center mt-6 text-sm text-[#9ca3af]">
          Don't have an account?{' '}
          <Link to="/signup" className="text-indigo-400 hover:text-indigo-300 font-semibold transition-colors">
            Create an account
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
