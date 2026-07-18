import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Cpu, Mail, Lock, Eye, EyeOff, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function SignUp() {
  const { signUp, loading } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [nameError, setNameError] = useState('');

  const validateName = (value) => {
    if (!value || value.trim() === '') {
      return 'Name is required';
    }
    // Check if name contains at least one letter
    const hasLetter = /[a-zA-Z]/.test(value);
    if (!hasLetter) {
      return 'Name must contain letters';
    }
    return '';
  };

  const handleNameChange = (e) => {
    const value = e.target.value;
    setName(value);
    const error = validateName(value);
    setNameError(error);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate name
    const nameValidationError = validateName(name);
    if (nameValidationError) {
      setNameError(nameValidationError);
      return;
    }
    
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
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    if (!agreeTerms) {
      toast.error('You must agree to the Terms of Service');
      return;
    }

    try {
      const success = await signUp(email, password, name);
      if (success) {
        navigate('/dashboard');
      }
    } catch (error) {
      if (error.message && error.message.includes('rate')) {
        toast.error('Email rate limit exceeded. Please try again in a few minutes.');
      }
    }
  };


  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#030303] text-white p-4 relative overflow-hidden bg-grid-pattern">
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/4 w-[200px] h-[200px] sm:w-[350px] sm:h-[350px] bg-indigo-600/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[200px] h-[200px] sm:w-[350px] sm:h-[350px] bg-purple-600/10 rounded-full blur-[100px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Logo/Brand Header */}
        <div className="flex flex-col items-center mb-6">
          <div className="flex items-center justify-center p-3 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-xl shadow-indigo-500/20 mb-4">
            <Cpu size={32} />
          </div>
          <h2 className="text-3xl font-extrabold text-white tracking-tight mb-1">Create Account</h2>
          <p className="text-sm text-[#9ca3af]">Join Autonomous AI to audit and refactor your code</p>
        </div>

        {/* SignUp Form Card */}
        <div className="glass-panel rounded-2xl border border-[#1f1f23] p-6 shadow-2xl relative">
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Full Name Field */}
            <div>
              <label className="block text-xs font-semibold text-[#9ca3af] uppercase tracking-wider mb-1.5" htmlFor="name">
                Full Name
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-[#6b7280]">
                  <User size={16} />
                </span>
                <input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={handleNameChange}
                  className={`w-full pl-10 pr-4 py-2.5 rounded-xl border bg-[#0c0c0e]/80 text-white placeholder-[#4b5563] text-sm focus:ring-1 outline-none transition-all ${
                    nameError 
                      ? 'border-red-500/80 focus:border-red-500/80 focus:ring-red-500/80' 
                      : 'border-[#1f1f23] focus:border-indigo-500/80 focus:ring-indigo-500/80'
                  }`}
                />
              </div>
              {nameError && (
                <p className="mt-1.5 text-xs text-red-400 font-medium">{nameError}</p>
              )}
            </div>

            {/* Email Field */}
            <div>
              <label className="block text-xs font-semibold text-[#9ca3af] uppercase tracking-wider mb-1.5" htmlFor="email">
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
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#1f1f23] bg-[#0c0c0e]/80 text-white placeholder-[#4b5563] text-sm focus:border-indigo-500/80 focus:ring-1 focus:ring-indigo-500/80 outline-none transition-all"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-xs font-semibold text-[#9ca3af] uppercase tracking-wider mb-1.5" htmlFor="password">
                Password
              </label>
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
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-[#1f1f23] bg-[#0c0c0e]/80 text-white placeholder-[#4b5563] text-sm focus:border-indigo-500/80 focus:ring-1 focus:ring-indigo-500/80 outline-none transition-all"
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

            {/* Confirm Password Field */}
            <div>
              <label className="block text-xs font-semibold text-[#9ca3af] uppercase tracking-wider mb-1.5" htmlFor="confirmPassword">
                Confirm Password
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-[#6b7280]">
                  <Lock size={16} />
                </span>
                <input
                  id="confirmPassword"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#1f1f23] bg-[#0c0c0e]/80 text-white placeholder-[#4b5563] text-sm focus:border-indigo-500/80 focus:ring-1 focus:ring-indigo-500/80 outline-none transition-all"
                />
              </div>
            </div>

            {/* Terms of Service Checkbox */}
            <div className="flex items-start">
              <input
                id="terms"
                type="checkbox"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                className="w-4 h-4 mt-0.5 rounded border-[#1f1f23] bg-[#0c0c0e] text-indigo-600 focus:ring-indigo-500"
              />
              <label htmlFor="terms" className="ml-2.5 text-xs text-[#9ca3af] font-medium leading-tight cursor-pointer">
                I agree to the{' '}
                <a href="#" className="text-indigo-400 hover:text-indigo-300">
                  Terms of Service
                </a>{' '}
                and{' '}
                <a href="#" className="text-indigo-400 hover:text-indigo-300">
                  Privacy Policy
                </a>
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
                'Create Account'
              )}
            </button>
          </form>


        </div>

        {/* Bottom Switch Link */}
        <p className="text-center mt-5 text-sm text-[#9ca3af]">
          Already have an account?{' '}
          <Link to="/login" className="text-indigo-400 hover:text-indigo-300 font-semibold transition-colors">
            Sign in
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
