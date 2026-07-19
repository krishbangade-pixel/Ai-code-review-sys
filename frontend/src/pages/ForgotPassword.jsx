import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Cpu, Mail, ArrowLeft, Send } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function ForgotPassword() {
  const { forgotPassword, loading } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    // Detect if we landed from a password recovery link and redirect to /reset-password
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    const queryParams = new URLSearchParams(window.location.search);
    
    const hasAccessToken = hashParams.has('access_token') && (
      hashParams.has('type') && hashParams.get('type') === 'recovery'
    );
    const hasResetParam = queryParams.has('reset') && queryParams.get('reset') === 'true';
    
    if (hasAccessToken || hasResetParam) {
      navigate(`/reset-password${window.location.search}${window.location.hash}`, { replace: true });
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.error('Please enter your email address');
      return;
    }
    const success = await forgotPassword(email);
    if (success) {
      setSubmitted(true);
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
        <div className="flex flex-col items-center mb-8">
          <div className="flex items-center justify-center p-3 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-xl shadow-indigo-500/20 mb-4">
            <Cpu size={32} />
          </div>
          <h2 className="text-3xl font-extrabold text-white tracking-tight mb-2">
            Reset Password
          </h2>
          <p className="text-sm text-[#9ca3af]">
            We'll send you recovery details in seconds
          </p>
        </div>

        {/* Card */}
        <div className="glass-panel rounded-2xl border border-[#1f1f23] p-8 shadow-2xl relative">
          {!submitted ? (
            /* Forgot password request form */
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-xs font-semibold text-[#9ca3af] uppercase tracking-wider mb-2.5" htmlFor="email">
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

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-600/50 text-white font-semibold text-sm transition-all shadow-lg shadow-indigo-600/20 flex items-center justify-center gap-2 cursor-pointer"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <Send size={15} />
                    Send Reset Link
                  </>
                )}
              </button>
            </form>
          ) : (
            /* Submitted success feedback */
            <div className="text-center py-4 space-y-4">
              <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto text-emerald-400">
                <Mail size={22} />
              </div>
              <h3 className="text-lg font-bold text-white">Check Your Inbox</h3>
              <p className="text-sm text-[#9ca3af] leading-relaxed">
                We've sent recovery instructions to <span className="text-white font-semibold">{email}</span>. Follow the link inside to set up your new credentials.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
              >
                Didn't receive email? Try another address
              </button>
            </div>
          )}

          <div className="mt-8 pt-6 border-t border-[#1f1f23] flex justify-center">
            <Link to="/login" className="flex items-center gap-2 text-sm text-[#9ca3af] hover:text-white transition-colors">
              <ArrowLeft size={14} />
              Back to Sign In
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
