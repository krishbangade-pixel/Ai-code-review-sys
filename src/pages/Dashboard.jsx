import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FileCode, 
  Bug, 
  ShieldAlert, 
  Award, 
  Zap, 
  Gauge, 
  ArrowUpRight, 
  Search, 
  Plus, 
  Github,
  ChevronRight,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useReviews } from '../context/ReviewContext';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip,
  BarChart,
  Bar,
  Cell
} from 'recharts';
import toast from 'react-hot-toast';

export default function Dashboard() {
  const { user, updateProfile } = useAuth();
  const { reviews } = useReviews();
  const navigate = useNavigate();

  // Compute stats from reviews data
  const stats = useMemo(() => {
    const total = reviews.length;
    let bugs = 0;
    let securityIssues = 0;
    let totalScore = 0;
    
    reviews.forEach(r => {
      totalScore += r.score;
      r.issues.forEach(i => {
        if (i.category === 'Security' && i.severity === 'critical') securityIssues++;
        if (i.severity === 'critical' || i.severity === 'warning') bugs++;
      });
    });

    const avgScore = total > 0 ? Math.round(totalScore / total) : 0;

    return {
      total,
      bugs,
      securityIssues,
      avgScore
    };
  }, [reviews]);

  // Data for quality score trend chart
  const trendData = useMemo(() => {
    return [...reviews]
      .reverse()
      .map(r => ({
        name: r.projectName.length > 12 ? r.projectName.substring(0, 12) + '...' : r.projectName,
        score: r.score,
        date: new Date(r.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
      }));
  }, [reviews]);

  // Data for issues by category bar chart
  const categoryData = useMemo(() => {
    const counts = { Security: 0, Performance: 0, Maintainability: 0, Readability: 0 };
    reviews.forEach(r => {
      r.issues.forEach(i => {
        if (counts[i.category] !== undefined) {
          counts[i.category]++;
        }
      });
    });
    return Object.keys(counts).map(key => ({
      name: key,
      issues: counts[key]
    }));
  }, [reviews]);

  const handleBuyCredits = () => {
    toast.promise(
      new Promise(resolve => setTimeout(resolve, 1000)),
      {
        loading: 'Processing simulated checkout...',
        success: () => {
          updateProfile({ credits: user.credits + 100 });
          return 'Added 100 AI Credits! (Mock Purchase)';
        },
        error: 'Failed to purchase credits.'
      }
    );
  };

  const handleConnectGit = () => {
    if (user.githubConnected) {
      toast.error('GitHub is already connected');
    } else {
      toast.loading('Redirecting to GitHub authorization...');
      setTimeout(() => {
        toast.dismiss();
        updateProfile({ githubConnected: true });
        toast.success('Connected to @github/alex-rivera');
      }, 1200);
    }
  };

  // Color mapping for Bar Charts
  const COLORS = ['#f43f5e', '#a855f7', '#6366f1', '#06b6d4'];

  return (
    <div className="space-y-8 pb-12">
      {/* Welcome Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-white m-0">Dashboard Overview</h2>
          <p className="text-sm text-[#9ca3af] mt-1">Real-time analysis and reports on your repositories.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={handleBuyCredits}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-xl border border-[#1f1f23] hover:border-indigo-500/50 hover:bg-[#161619] transition-all text-white cursor-pointer"
          >
            <Zap size={14} className="text-yellow-400 fill-yellow-400" />
            Buy Credits
          </button>
          <button 
            onClick={() => navigate('/new-review')}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/20 transition-all cursor-pointer"
          >
            <Plus size={14} />
            New Review
          </button>
        </div>
      </div>

      {/* Grid of 6 Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
        
        {/* Total Reviews Card */}
        <motion.div 
          whileHover={{ y: -2 }}
          className="glass-panel p-4.5 rounded-2xl flex flex-col justify-between h-[110px]"
        >
          <div className="flex items-center justify-between text-[#9ca3af]">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Audits</span>
            <FileCode size={16} />
          </div>
          <div className="mt-2">
            <h3 className="text-2xl font-bold text-white font-mono">{stats.total}</h3>
            <span className="text-[10px] text-indigo-400 font-medium">completed</span>
          </div>
        </motion.div>

        {/* Bugs Found Card */}
        <motion.div 
          whileHover={{ y: -2 }}
          className="glass-panel p-4.5 rounded-2xl flex flex-col justify-between h-[110px]"
        >
          <div className="flex items-center justify-between text-[#9ca3af]">
            <span className="text-xs font-semibold uppercase tracking-wider">Bugs Found</span>
            <Bug size={16} className="text-rose-500" />
          </div>
          <div className="mt-2">
            <h3 className="text-2xl font-bold text-white font-mono">{stats.bugs}</h3>
            <span className="text-[10px] text-rose-400 font-medium">requiring review</span>
          </div>
        </motion.div>

        {/* Security Issues Card */}
        <motion.div 
          whileHover={{ y: -2 }}
          className="glass-panel p-4.5 rounded-2xl flex flex-col justify-between h-[110px]"
        >
          <div className="flex items-center justify-between text-[#9ca3af]">
            <span className="text-xs font-semibold uppercase tracking-wider">Security Audits</span>
            <ShieldAlert size={16} className="text-amber-500" />
          </div>
          <div className="mt-2">
            <h3 className="text-2xl font-bold text-white font-mono">{stats.securityIssues}</h3>
            <span className="text-[10px] text-amber-400 font-medium">critical flags</span>
          </div>
        </motion.div>

        {/* Performance Score Card */}
        <motion.div 
          whileHover={{ y: -2 }}
          className="glass-panel p-4.5 rounded-2xl flex flex-col justify-between h-[110px]"
        >
          <div className="flex items-center justify-between text-[#9ca3af]">
            <span className="text-xs font-semibold uppercase tracking-wider">Avg Perf</span>
            <Gauge size={16} className="text-purple-500" />
          </div>
          <div className="mt-2">
            <h3 className="text-2xl font-bold text-white font-mono">82%</h3>
            <span className="text-[10px] text-purple-400 font-medium">optimal rating</span>
          </div>
        </motion.div>

        {/* AI Credits Card */}
        <motion.div 
          whileHover={{ y: -2 }}
          className="glass-panel p-4.5 rounded-2xl flex flex-col justify-between h-[110px]"
        >
          <div className="flex items-center justify-between text-[#9ca3af]">
            <span className="text-xs font-semibold uppercase tracking-wider">AI Credits</span>
            <Zap size={16} className="text-indigo-400 fill-indigo-500/20" />
          </div>
          <div className="mt-2">
            <h3 className="text-2xl font-bold text-white font-mono">{user.credits}</h3>
            <span className="text-[10px] text-indigo-400 font-medium">credits remaining</span>
          </div>
        </motion.div>

        {/* Quality Score Card */}
        <motion.div 
          whileHover={{ y: -2 }}
          className="glass-panel p-4.5 rounded-2xl flex flex-col justify-between h-[110px]"
        >
          <div className="flex items-center justify-between text-[#9ca3af]">
            <span className="text-xs font-semibold uppercase tracking-wider">Quality Score</span>
            <Award size={16} className="text-emerald-500" />
          </div>
          <div className="mt-2">
            <h3 className={`text-2xl font-bold font-mono ${stats.avgScore >= 80 ? 'text-emerald-400' : stats.avgScore >= 60 ? 'text-amber-400' : 'text-rose-400'}`}>
              {stats.avgScore}/100
            </h3>
            <span className="text-[10px] text-emerald-400 font-medium">overall health</span>
          </div>
        </motion.div>
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Trend Area Chart (2/3 width) */}
        <div className="glass-panel p-5 rounded-2xl border border-[#1f1f23] lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <TrendingUp size={16} className="text-indigo-400" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider m-0">Code Quality Timeline</h3>
            </div>
            <span className="text-[10px] bg-indigo-500/10 text-indigo-400 font-medium px-2 py-0.5 rounded-full">
              Live Feed
            </span>
          </div>
          <div className="h-[260px]">
            {trendData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.25}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="name" stroke="#4b5563" fontSize={10} tickLine={false} axisLine={false} />
                  <YAxis stroke="#4b5563" fontSize={10} tickLine={false} axisLine={false} domain={[0, 100]} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0a0a0c', borderColor: '#1f1f23', borderRadius: '12px', color: 'white' }}
                    labelStyle={{ fontWeight: 'bold', fontSize: '12px' }}
                    itemStyle={{ color: '#a5b4fc', fontSize: '12px' }}
                  />
                  <Area type="monotone" dataKey="score" stroke="#6366f1" strokeWidth={2.5} fillOpacity={1} fill="url(#colorScore)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-sm text-[#4b5563]">
                No review data to plot. Submit a new code review.
              </div>
            )}
          </div>
        </div>

        {/* Category Bar Chart (1/3 width) */}
        <div className="glass-panel p-5 rounded-2xl border border-[#1f1f23]">
          <div className="flex items-center gap-2 mb-6">
            <AlertCircle size={16} className="text-purple-400" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider m-0">Issue Distribution</h3>
          </div>
          <div className="h-[260px] flex items-center">
            {categoryData.some(d => d.issues > 0) ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryData} margin={{ top: 10, right: 10, left: -30, bottom: 0 }}>
                  <XAxis dataKey="name" stroke="#4b5563" fontSize={10} tickLine={false} axisLine={false} />
                  <YAxis stroke="#4b5563" fontSize={10} tickLine={false} axisLine={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0a0a0c', borderColor: '#1f1f23', borderRadius: '12px', color: 'white' }}
                    itemStyle={{ fontSize: '12px' }}
                  />
                  <Bar dataKey="issues" radius={[6, 6, 0, 0]} maxBarSize={30}>
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center w-full h-full text-sm text-[#4b5563] text-center">
                All clean! No issues found.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recent Reviews Table (Vercel-like Projects grid) & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Recent Audits (Left 2/3) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider m-0">Recent Repositories</h3>
            <button 
              onClick={() => navigate('/reviews')}
              className="flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 font-semibold cursor-pointer transition-colors"
            >
              See all reviews
              <ChevronRight size={14} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {reviews.slice(0, 4).map((rev) => (
              <motion.div
                key={rev.id}
                whileHover={{ y: -2 }}
                onClick={() => navigate(`/reviews/${rev.id}`)}
                className="glass-panel p-5 rounded-2xl border border-[#1f1f23] hover:border-indigo-500/30 transition-all cursor-pointer flex flex-col justify-between min-h-[170px]"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-semibold text-[#6b7280] font-mono">{rev.id}</span>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                      rev.score >= 85 ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                      rev.score >= 70 ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                      'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                    }`}>
                      Score: {rev.score}
                    </span>
                  </div>
                  <h4 className="text-base font-bold text-white mt-2 m-0 truncate">{rev.projectName}</h4>
                  <p className="text-xs text-[#9ca3af] mt-1.5 line-clamp-2 leading-relaxed">
                    {rev.summary}
                  </p>
                </div>

                <div className="flex items-center justify-between border-t border-[#1f1f23]/60 pt-3 mt-4">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-indigo-500" />
                    <span className="text-xs font-semibold text-[#e5e7eb]">{rev.language}</span>
                  </div>
                  <span className="text-[10px] text-[#6b7280]">
                    {new Date(rev.date).toLocaleDateString()}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Quick Actions & Connection Status (Right 1/3) */}
        <div className="space-y-6">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider m-0">Quick Connections</h3>

          {/* GitHub Connection Card */}
          <div className="glass-panel p-5 rounded-2xl border border-[#1f1f23] flex flex-col gap-4 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-white/5 border border-white/10 text-white">
                  <Github size={20} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white m-0">GitHub Connector</h4>
                  <p className="text-[11px] text-[#9ca3af] mt-0.5">
                    {user.githubConnected ? 'Connected to @alexr' : 'Disconnected'}
                  </p>
                </div>
              </div>
              <span className={`w-2.5 h-2.5 rounded-full ${user.githubConnected ? 'bg-emerald-500 shadow-md shadow-emerald-500/30' : 'bg-[#374151]'}`} />
            </div>

            <p className="text-xs text-[#9ca3af] leading-relaxed">
              Auto-trigger AI code review audits on every commit, pull request, or manually scan branch folders.
            </p>

            <button
              onClick={handleConnectGit}
              className={`w-full py-2 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                user.githubConnected 
                  ? 'border border-[#1f1f23] hover:bg-[#161619] text-[#e5e7eb]' 
                  : 'bg-white text-black hover:bg-neutral-200'
              }`}
            >
              {user.githubConnected ? 'Manage Repository Webhooks' : 'Connect Repository'}
              <ArrowUpRight size={13} />
            </button>
          </div>

          {/* Anomaly Upgrade Premium Alert */}
          <div className="glass-panel p-5 rounded-2xl border border-indigo-500/20 bg-indigo-500/5 relative overflow-hidden flex flex-col gap-3">
            <div className="absolute -right-8 -top-8 w-24 h-24 bg-indigo-500/10 blur-xl rounded-full" />
            <h4 className="text-sm font-bold text-white m-0 flex items-center gap-1.5">
              <Award size={15} className="text-indigo-400" />
              Upgrade to Developer Pro
            </h4>
            <p className="text-xs text-[#9ca3af] leading-relaxed">
              Unlock unlimited AI credits, concurrent repo scanning, automated PR refactoring suggest logs, and customized team linters.
            </p>
            <button 
              onClick={() => toast.success('Developer Pro plan unlocked! (Simulated Upgrade)')}
              className="py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold text-xs transition-all shadow-md shadow-indigo-600/10 hover:opacity-90 cursor-pointer"
            >
              Upgrade Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
