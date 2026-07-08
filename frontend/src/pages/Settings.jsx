import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Sliders, 
  Bell, 
  Settings as SettingsIcon,
  Github, 
  ChevronRight, 
  Globe, 
  Cpu, 
  Lock,
  Layers,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function Settings() {
  const { user, updateProfile, theme, setTheme } = useAuth();
  
  // Notification states
  const [emailAlerts, setEmailAlerts] = useState(user?.notifications?.emailAlerts ?? true);
  const [weeklyDigest, setWeeklyDigest] = useState(user?.notifications?.weeklyDigest ?? false);
  const [securityAlerts, setSecurityAlerts] = useState(user?.notifications?.securityAlerts ?? true);

  // Preference states
  const [defaultLanguage, setDefaultLanguage] = useState('javascript');
  const [autoRefactor, setAutoRefactor] = useState(true);

  // Handle Preferences Save
  const handleSaveSettings = (e) => {
    e.preventDefault();
    updateProfile({
      notifications: {
        emailAlerts,
        weeklyDigest,
        securityAlerts
      }
    });
    toast.success('Preferences updated successfully!');
  };

  const handleToggleGit = () => {
    const nextConnected = !user.githubConnected;
    updateProfile({ githubConnected: nextConnected });
    if (nextConnected) {
      toast.success('Successfully connected GitHub account @alex-rivera');
    } else {
      toast.success('Disconnected GitHub account connection');
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header section */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-white m-0">Preferences</h2>
        <p className="text-sm text-[#9ca3af] mt-1">Configure your scan configurations, hooks, and sync services.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Connections & Themes (1/3) */}
        <div className="space-y-6">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider m-0">Integrations</h3>

          {/* GitHub Connection Card */}
          <div className="glass-panel p-5 rounded-2xl border border-[#1f1f23] space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-white/5 border border-white/10 text-white">
                <Github size={20} />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white m-0">GitHub Webhook</h4>
                <p className="text-[11px] text-[#9ca3af] mt-0.5">
                  {user?.githubConnected ? 'Linked: @alex-rivera' : 'Status: Offline'}
                </p>
              </div>
            </div>
            
            <p className="text-xs text-[#9ca3af] leading-relaxed">
              Link repositories directly to auto-push audits.
            </p>

            <button
              onClick={handleToggleGit}
              className={`w-full py-2 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                user?.githubConnected 
                  ? 'border border-red-500/25 bg-red-500/5 text-red-400 hover:bg-red-500/10' 
                  : 'bg-white text-black hover:bg-neutral-200'
              }`}
            >
              {user?.githubConnected ? 'Disconnect GitHub' : 'Link GitHub Profile'}
            </button>
          </div>

          {/* Theme Quick Toggle */}
          <h3 className="text-sm font-bold text-white uppercase tracking-wider m-0">Theme</h3>
          <div className="glass-panel p-5 rounded-2xl border border-[#1f1f23] space-y-3">
            <span className="text-xs text-[#9ca3af] font-semibold block">Select Active Theme</span>
            <div className="space-y-2">
              {[
                { id: 'dark', name: 'Deep Dark Theme (Vercel-centric)' },
                { id: 'light', name: 'Light High-Contrast Theme' }
              ].map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTheme(t.id)}
                  className={`w-full px-4.5 py-2.5 rounded-xl border text-xs font-semibold text-left transition-all flex items-center justify-between cursor-pointer ${
                    theme === t.id 
                      ? 'border-indigo-500/40 bg-indigo-500/5 text-white' 
                      : 'border-[#1f1f23] bg-[#0c0c0e] text-[#6b7280] hover:text-[#9ca3af]'
                  }`}
                >
                  <span>{t.name}</span>
                  {theme === t.id && <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Preferences form (2/3) */}
        <div className="lg:col-span-2 space-y-6">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider m-0">Preferences & Scanner Settings</h3>
          
          <div className="glass-panel p-6 rounded-2xl border border-[#1f1f23]">
            <form onSubmit={handleSaveSettings} className="space-y-6">
              
              {/* Alert notifications list */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider m-0 flex items-center gap-1.5">
                  <Bell size={14} className="text-indigo-400" />
                  Notifications & Alerts
                </h4>

                <div className="space-y-3 pl-1">
                  
                  {/* Email Alert Toggle */}
                  <div className="flex items-start">
                    <input
                      id="emailAlert"
                      type="checkbox"
                      checked={emailAlerts}
                      onChange={(e) => setEmailAlerts(e.target.checked)}
                      className="w-4 h-4 mt-0.5 rounded border-[#1f1f23] bg-[#0c0c0e] text-indigo-600 focus:ring-indigo-500"
                    />
                    <div className="ml-3">
                      <label htmlFor="emailAlert" className="text-xs font-bold text-white cursor-pointer">
                        Email Alerts
                      </label>
                      <p className="text-[11px] text-[#9ca3af] mt-0.5">Receive instantaneous report summaries upon manual sandbox scans.</p>
                    </div>
                  </div>

                  {/* Weekly Digest Toggle */}
                  <div className="flex items-start">
                    <input
                      id="weeklyAlert"
                      type="checkbox"
                      checked={weeklyDigest}
                      onChange={(e) => setWeeklyDigest(e.target.checked)}
                      className="w-4 h-4 mt-0.5 rounded border-[#1f1f23] bg-[#0c0c0e] text-indigo-600 focus:ring-indigo-500"
                    />
                    <div className="ml-3">
                      <label htmlFor="weeklyAlert" className="text-xs font-bold text-white cursor-pointer">
                        Weekly Health digest
                      </label>
                      <p className="text-[11px] text-[#9ca3af] mt-0.5">Receive aggregated score dashboards and security vulnerability trends every Monday.</p>
                    </div>
                  </div>

                  {/* Critical Security Warnings */}
                  <div className="flex items-start">
                    <input
                      id="securityAlert"
                      type="checkbox"
                      checked={securityAlerts}
                      onChange={(e) => setSecurityAlerts(e.target.checked)}
                      className="w-4 h-4 mt-0.5 rounded border-[#1f1f23] bg-[#0c0c0e] text-indigo-600 focus:ring-indigo-500"
                    />
                    <div className="ml-3">
                      <label htmlFor="securityAlert" className="text-xs font-bold text-white cursor-pointer">
                        Critical security notifications
                      </label>
                      <p className="text-[11px] text-[#9ca3af] mt-0.5">High-priority warning alerts when a hardcoded key or injection vulnerability is scanned.</p>
                    </div>
                  </div>

                </div>
              </div>

              {/* Scanner settings list */}
              <div className="space-y-4 pt-6 border-t border-[#1f1f23]/60">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider m-0 flex items-center gap-1.5">
                  <Sparkles size={14} className="text-indigo-400" />
                  Engine Customizations
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Default Sandbox compiler */}
                  <div>
                    <label className="block text-xs font-semibold text-[#9ca3af] uppercase tracking-wider mb-2" htmlFor="defLang">
                      Default Compiler Language
                    </label>
                    <select
                      id="defLang"
                      value={defaultLanguage}
                      onChange={(e) => setDefaultLanguage(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-[#1f1f23] bg-[#0c0c0e] text-xs font-semibold text-[#f3f4f6] focus:border-indigo-500 outline-none cursor-pointer"
                    >
                      <option value="javascript">JavaScript (ECMAScript 6+)</option>
                      <option value="typescript">TypeScript v5.0+</option>
                      <option value="python">Python 3.10+</option>
                      <option value="go">Go (Golang Router)</option>
                    </select>
                  </div>

                  {/* Auto suggestion switch */}
                  <div className="flex items-center pt-6">
                    <input
                      id="autoRef"
                      type="checkbox"
                      checked={autoRefactor}
                      onChange={(e) => setAutoRefactor(e.target.checked)}
                      className="w-4 h-4 rounded border-[#1f1f23] bg-[#0c0c0e] text-indigo-600 focus:ring-indigo-500"
                    />
                    <div className="ml-3">
                      <label htmlFor="autoRef" className="text-xs font-bold text-white cursor-pointer">
                        Enable Automated Refactor Diffs
                      </label>
                      <p className="text-[10px] text-[#9ca3af]">Compile side-by-side suggest panels during audits.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Form submit footer */}
              <div className="pt-4 border-t border-[#1f1f23] flex justify-end">
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs tracking-wider transition-all cursor-pointer"
                >
                  Save Preference Settings
                </button>
              </div>

            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
