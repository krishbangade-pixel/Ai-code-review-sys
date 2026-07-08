import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  Mail, 
  Lock, 
  Trash2, 
  Upload, 
  Sun, 
  Moon,
  KeyRound,
  ShieldAlert
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function Profile() {
  const { user, updateProfile, updatePassword, deleteAccount, theme, toggleTheme } = useAuth();
  
  // Profile info state
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [avatarUrl, setAvatarUrl] = useState(user?.avatar || '');

  // Password fields state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Handle profile save
  const handleSaveProfile = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error('Name cannot be empty');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      toast.error('Please enter a valid email address');
      return;
    }

    updateProfile({ name, email, avatar: avatarUrl });
  };

  // Handle password update
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (!currentPassword) {
      toast.error('Current password is required');
      return;
    }
    if (newPassword.length < 6) {
      toast.error('New password must be at least 6 characters');
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    const success = await updatePassword(currentPassword, newPassword);
    if (success) {
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    }
  };

  // Handle Avatar selection (Preset mock avatars)
  const handleAvatarSelect = (url) => {
    setAvatarUrl(url);
    updateProfile({ avatar: url });
    toast.success('Avatar image updated!');
  };

  const handleSimulateDelete = () => {
    if (confirm('CRITICAL: Are you sure you want to permanently delete your account? This action is simulated and will log you out.')) {
      deleteAccount();
    }
  };

  const AVATAR_PRESETS = [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=256&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=256&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=256&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=256&auto=format&fit=crop'
  ];

  return (
    <div className="space-y-8 pb-12">
      {/* Header section */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-white m-0">Account Settings</h2>
        <p className="text-sm text-[#9ca3af] mt-1">Manage your developer profile and application preferences.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Avatar & Theme preferences */}
        <div className="space-y-6">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider m-0">Profile Avatar</h3>
          
          <div className="glass-panel p-6 rounded-2xl border border-[#1f1f23] flex flex-col items-center gap-4 text-center">
            <div className="relative group">
              <img 
                src={avatarUrl} 
                alt={name} 
                className="w-24 h-24 rounded-full object-cover border-2 border-indigo-500/20 group-hover:border-indigo-500 transition-all duration-300 shadow-xl"
              />
              <div className="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                <Upload size={16} className="text-white" />
              </div>
            </div>

            <div>
              <h4 className="text-base font-bold text-white leading-tight">{name}</h4>
              <p className="text-xs text-[#9ca3af] mt-1">{user?.tier}</p>
            </div>

            {/* Avatar presets selection */}
            <div className="w-full space-y-2 mt-2">
              <span className="text-[10px] font-semibold text-[#6b7280] uppercase tracking-wider block">Choose Avatar Preset</span>
              <div className="flex justify-center gap-2">
                {AVATAR_PRESETS.map((url, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleAvatarSelect(url)}
                    className={`w-10 h-10 rounded-full overflow-hidden border-2 cursor-pointer transition-all ${
                      avatarUrl === url ? 'border-indigo-500 scale-105 shadow-md shadow-indigo-500/10' : 'border-[#1f1f23] hover:border-[#6b7280]'
                    }`}
                  >
                    <img src={url} alt={`Preset ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Theme Preference selector */}
          <h3 className="text-sm font-bold text-white uppercase tracking-wider m-0">Theme Mode</h3>
          <div className="glass-panel p-6 rounded-2xl border border-[#1f1f23] space-y-4">
            <div className="flex items-center justify-between text-xs text-[#9ca3af]">
              <span className="font-semibold">Switch active theme</span>
              <span className="font-bold text-white capitalize">{theme} Mode</span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => theme === 'light' && toggleTheme()}
                className={`py-2 px-3 rounded-xl border flex items-center justify-center gap-2 text-xs font-semibold cursor-pointer transition-all ${
                  theme === 'dark' 
                    ? 'border-indigo-500/20 bg-indigo-500/5 text-white' 
                    : 'border-[#1f1f23] bg-[#0c0c0e] text-[#6b7280] hover:text-[#9ca3af]'
                }`}
              >
                <Moon size={14} />
                Dark Theme
              </button>
              <button
                onClick={() => theme === 'dark' && toggleTheme()}
                className={`py-2 px-3 rounded-xl border flex items-center justify-center gap-2 text-xs font-semibold cursor-pointer transition-all ${
                  theme === 'light' 
                    ? 'border-indigo-500/20 bg-indigo-500/5 text-white' 
                    : 'border-[#1f1f23] bg-[#0c0c0e] text-[#6b7280] hover:text-[#9ca3af]'
                }`}
              >
                <Sun size={14} />
                Light Theme
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Update name/email & Change Password fields */}
        <div className="lg:col-span-2 space-y-6">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider m-0">General Details</h3>
          
          {/* General info form */}
          <div className="glass-panel p-6 rounded-2xl border border-[#1f1f23]">
            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Name */}
                <div>
                  <label className="block text-xs font-semibold text-[#9ca3af] uppercase tracking-wider mb-2" htmlFor="profName">
                    Display Name
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-[#6b7280]">
                      <User size={15} />
                    </span>
                    <input
                      id="profName"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-[#1f1f23] bg-[#0c0c0e]/80 text-white placeholder-[#4b5563] text-sm focus:border-indigo-500/80 outline-none transition-all"
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-xs font-semibold text-[#9ca3af] uppercase tracking-wider mb-2" htmlFor="profEmail">
                    Email Address
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-[#6b7280]">
                      <Mail size={15} />
                    </span>
                    <input
                      id="profEmail"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-[#1f1f23] bg-[#0c0c0e]/80 text-white placeholder-[#4b5563] text-sm focus:border-indigo-500/80 outline-none transition-all"
                    />
                  </div>
                </div>

              </div>

              <div className="pt-4 border-t border-[#1f1f23] flex justify-end">
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs tracking-wider transition-all cursor-pointer"
                >
                  Save Profile Changes
                </button>
              </div>
            </form>
          </div>

          <h3 className="text-sm font-bold text-white uppercase tracking-wider m-0">Change Credentials</h3>

          {/* Change Password form */}
          <div className="glass-panel p-6 rounded-2xl border border-[#1f1f23]">
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                
                {/* Current password */}
                <div>
                  <label className="block text-xs font-semibold text-[#9ca3af] uppercase tracking-wider mb-2" htmlFor="currPass">
                    Current Password
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-[#6b7280]">
                      <Lock size={15} />
                    </span>
                    <input
                      id="currPass"
                      type="password"
                      placeholder="••••••••"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-[#1f1f23] bg-[#0c0c0e]/80 text-white placeholder-[#4b5563] text-sm focus:border-indigo-500/80 outline-none transition-all"
                    />
                  </div>
                </div>

                {/* New password */}
                <div>
                  <label className="block text-xs font-semibold text-[#9ca3af] uppercase tracking-wider mb-2" htmlFor="newPass">
                    New Password
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-[#6b7280]">
                      <KeyRound size={15} />
                    </span>
                    <input
                      id="newPass"
                      type="password"
                      placeholder="••••••••"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-[#1f1f23] bg-[#0c0c0e]/80 text-white placeholder-[#4b5563] text-sm focus:border-indigo-500/80 outline-none transition-all"
                    />
                  </div>
                </div>

                {/* Confirm new password */}
                <div>
                  <label className="block text-xs font-semibold text-[#9ca3af] uppercase tracking-wider mb-2" htmlFor="confPass">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-[#6b7280]">
                      <KeyRound size={15} />
                    </span>
                    <input
                      id="confPass"
                      type="password"
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-[#1f1f23] bg-[#0c0c0e]/80 text-white placeholder-[#4b5563] text-sm focus:border-indigo-500/80 outline-none transition-all"
                    />
                  </div>
                </div>

              </div>

              <div className="pt-4 border-t border-[#1f1f23] flex justify-end">
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs tracking-wider transition-all cursor-pointer"
                >
                  Update Credentials
                </button>
              </div>
            </form>
          </div>

          <h3 className="text-sm font-bold text-red-400 uppercase tracking-wider m-0">Danger Zone</h3>

          {/* Delete account card */}
          <div className="glass-panel p-6 rounded-2xl border border-red-500/10 bg-red-500/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex gap-3">
              <div className="text-red-400 mt-1">
                <ShieldAlert size={20} />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white m-0">Deactivate Account</h4>
                <p className="text-xs text-[#9ca3af] mt-1 leading-relaxed max-w-lg">
                  Deactivating will immediately lock your login sessions and flag your project history for purging. This is permanent.
                </p>
              </div>
            </div>
            <button
              onClick={handleSimulateDelete}
              className="px-5 py-2.5 rounded-xl bg-red-950/20 hover:bg-red-500/20 text-red-400 border border-red-500/25 text-xs font-semibold transition-all cursor-pointer"
            >
              Delete My Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
