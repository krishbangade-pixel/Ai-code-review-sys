
import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FileCode, ShieldAlert, Award, Zap, ArrowUpRight, Plus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useReviews } from '../context/ReviewContext';

export default function Dashboard() {
  const { user } = useAuth();
  const { reviews, loading } = useReviews();
  const navigate = useNavigate();

  // Compute stats from reviews data
  const stats = useMemo(() => {
    const total = reviews.length;
    let totalScore = 0;
    
    reviews.forEach(r => {
      totalScore += r.overall_score || 0;
    });

    const avgScore = total > 0 ? Math.round(totalScore / total) : 0;

    return {
      total,
      avgScore
    };
  }, [reviews]);

  return (
    <div className="space-y-8 pb-12">
      {/* Welcome Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-white m-0">Dashboard Overview</h2>
          <p className="text-sm text-[#9ca3af] mt-1">Real-time analysis and reports on your code reviews.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => navigate('/new-review')}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/20 transition-all cursor-pointer"
          >
            <Plus size={14} />
            New Review
          </button>
        </div>
      </div>

      {/* Grid of Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total Reviews Card */}
        <motion.div 
          whileHover={{ y: -2 }}
          className="glass-panel p-4.5 rounded-2xl flex flex-col justify-between h-[110px]"
        >
          <div className="flex items-center justify-between text-[#9ca3af]">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Reviews</span>
            <FileCode size={16} />
          </div>
          <div className="mt-2">
            <h3 className="text-2xl font-bold text-white font-mono">
              {loading ? '...' : stats.total}
            </h3>
            <span className="text-[10px] text-indigo-400 font-medium">completed</span>
          </div>
        </motion.div>

        {/* Average Score Card */}
        <motion.div 
          whileHover={{ y: -2 }}
          className="glass-panel p-4.5 rounded-2xl flex flex-col justify-between h-[110px]"
        >
          <div className="flex items-center justify-between text-[#9ca3af]">
            <span className="text-xs font-semibold uppercase tracking-wider">Average Score</span>
            <Award size={16} className="text-emerald-500" />
          </div>
          <div className="mt-2">
            <h3 className={`text-2xl font-bold font-mono ${stats.avgScore >= 80 ? 'text-emerald-400' : stats.avgScore >= 60 ? 'text-amber-400' : 'text-rose-400'}`}>
              {loading ? '...' : stats.avgScore}
            </h3>
            <span className="text-[10px] text-[#9ca3af] font-medium">out of 100</span>
          </div>
        </motion.div>

        {/* User Email Card */}
        <motion.div 
          whileHover={{ y: -2 }}
          className="glass-panel p-4.5 rounded-2xl flex flex-col justify-between h-[110px]"
        >
          <div className="flex items-center justify-between text-[#9ca3af]">
            <span className="text-xs font-semibold uppercase tracking-wider">User</span>
            <ShieldAlert size={16} className="text-indigo-400" />
          </div>
          <div className="mt-2">
            <h3 className="text-sm font-bold text-white truncate max-w-[140px]">
              {user?.email || 'Guest'}
            </h3>
            <span className="text-[10px] text-[#9ca3af] font-medium">signed in</span>
          </div>
        </motion.div>

        {/* Start New Review Card */}
        <motion.div 
          whileHover={{ y: -2 }}
          onClick={() => navigate('/new-review')}
          className="glass-panel p-4.5 rounded-2xl flex flex-col justify-between h-[110px] cursor-pointer border border-indigo-500/30 bg-indigo-500/5"
        >
          <div className="flex items-center justify-between text-[#9ca3af]">
            <span className="text-xs font-semibold uppercase tracking-wider">Quick Action</span>
            <Zap size={16} className="text-indigo-400" />
          </div>
          <div className="mt-2 flex items-center gap-2">
            <button className="text-xs font-semibold text-indigo-300 flex items-center gap-1">
              <Plus size={14} />
              Start Review
              <ArrowUpRight size={12} />
            </button>
          </div>
        </motion.div>
      </div>

      {/* Recent Reviews Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider m-0">Recent Reviews</h3>
          <button 
            onClick={() => navigate('/reviews')}
            className="flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 font-semibold cursor-pointer transition-colors"
          >
            View All
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
          </div>
        ) : reviews.length === 0 ? (
          <div className="glass-panel p-8 rounded-2xl border border-[#1f1f23] text-center">
            <FileCode size={24} className="text-[#6b7280] mx-auto mb-3" />
            <h4 className="text-white font-medium mb-1">No reviews yet</h4>
            <p className="text-xs text-[#9ca3af] mb-4">Start by reviewing your first piece of code</p>
            <button 
              onClick={() => navigate('/new-review')}
              className="px-4 py-2 text-xs font-semibold rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white transition-all cursor-pointer"
            >
              Create First Review
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {reviews.slice(0, 4).map((rev) => (
              <motion.div
                key={rev.id}
                whileHover={{ y: -2 }}
                onClick={() => navigate(`/reviews/${rev.id}`)}
                className="glass-panel p-5 rounded-2xl border border-[#1f1f23] hover:border-indigo-500/30 transition-all cursor-pointer flex flex-col justify-between min-h-[150px]"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-semibold text-[#6b7280] font-mono truncate max-w-[120px]">{rev.project_name || 'Untitled Review'}</span>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                      (rev.overall_score || 0) >= 85 ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                      (rev.overall_score || 0) >= 70 ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                      'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                    }`}>
                      Score: {rev.overall_score || 0}
                    </span>
                  </div>
                  <h4 className="text-base font-bold text-white mt-2 m-0 truncate">
                    {rev.type.charAt(0).toUpperCase() + rev.type.slice(1)} Review
                  </h4>
                  <p className="text-xs text-[#9ca3af] mt-1.5 line-clamp-2 leading-relaxed">
                    {rev.repo_url || 'Code analysis completed'}
                  </p>
                </div>

                <div className="flex items-center justify-between border-t border-[#1f1f23]/60 pt-3 mt-4">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-indigo-500" />
                    <span className="text-xs font-semibold text-[#e5e7eb]">
                      {rev.type}
                    </span>
                  </div>
                  <span className="text-[10px] text-[#6b7280]">
                    {new Date(rev.created_at).toLocaleDateString()}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
