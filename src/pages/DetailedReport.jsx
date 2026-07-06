import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  ShieldAlert, 
  Bug, 
  CheckCircle2, 
  AlertTriangle,
  Info,
  Calendar,
  Layers,
  FileCode2,
  Copy,
  Check
} from 'lucide-react';
import { useReviews } from '../context/ReviewContext';
import toast from 'react-hot-toast';

export default function DetailedReport() {
  const { id } = useParams();
  const { getReview } = useReviews();
  const navigate = useNavigate();
  const [copiedId, setCopiedId] = useState(null);

  const review = getReview(id);

  // If review is still loading or doesn't exist
  if (!review) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center space-y-4">
        <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
          <ShieldAlert size={24} />
        </div>
        <div>
          <h3 className="text-lg font-bold text-white">Report Not Found</h3>
          <p className="text-sm text-[#9ca3af] mt-1">The review ID you requested does not exist or was deleted.</p>
        </div>
        <button 
          onClick={() => navigate('/dashboard')}
          className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-all cursor-pointer"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  // Copy code helper
  const handleCopyCode = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopiedId(index);
    toast.success('Code copied to clipboard!');
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Get score border colors
  const getScoreColor = (score) => {
    if (score >= 85) return 'text-emerald-400 border-emerald-500/30 bg-emerald-500/5';
    if (score >= 70) return 'text-amber-400 border-amber-500/30 bg-amber-500/5';
    return 'text-rose-400 border-rose-500/30 bg-rose-500/5';
  };

  const getSeverityStyles = (severity) => {
    switch (severity) {
      case 'critical':
        return {
          bg: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
          icon: <ShieldAlert size={14} className="text-rose-500" />
        };
      case 'warning':
        return {
          bg: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
          icon: <AlertTriangle size={14} className="text-amber-500" />
        };
      case 'info':
      default:
        return {
          bg: 'bg-sky-500/10 text-sky-400 border-sky-500/20',
          icon: <Info size={14} className="text-sky-500" />
        };
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Back button & Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link 
            to="/reviews" 
            className="p-2 rounded-xl border border-[#1f1f23] bg-[#0a0a0c]/60 text-[#9ca3af] hover:text-white hover:bg-[#161619] transition-all"
          >
            <ArrowLeft size={16} />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-indigo-400 font-mono uppercase tracking-wider">{review.id}</span>
              <span className="w-1 h-1 rounded-full bg-[#1f1f23]" />
              <span className="text-xs text-[#6b7280]">Created {new Date(review.date).toLocaleDateString()}</span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-white m-0 mt-0.5">{review.projectName}</h2>
          </div>
        </div>

        <div className="flex gap-2.5">
          <button 
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-xl border border-[#1f1f23] hover:border-indigo-500/50 hover:bg-[#161619] transition-all text-white cursor-pointer"
          >
            Download PDF Report
          </button>
        </div>
      </div>

      {/* Main Scores Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Radial Overall Score Gauge */}
        <div className="glass-panel p-6 rounded-2xl border border-[#1f1f23] flex flex-col items-center justify-center text-center">
          <span className="text-xs font-bold text-[#9ca3af] uppercase tracking-wider mb-4">Overall Score</span>
          
          <div className="relative w-36 h-36 flex items-center justify-center mb-4">
            {/* SVG circle track and fill */}
            <svg className="w-full h-full transform -rotate-90">
              <circle 
                cx="72" 
                cy="72" 
                r="62" 
                className="stroke-neutral-800" 
                strokeWidth="10" 
                fill="transparent" 
              />
              <circle 
                cx="72" 
                cy="72" 
                r="62" 
                className={`stroke-indigo-500 transition-all duration-1000`} 
                strokeWidth="10" 
                fill="transparent"
                strokeDasharray={389.5}
                strokeDashoffset={389.5 - (389.5 * review.score) / 100}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-3xl font-black text-white font-mono leading-none">{review.score}</span>
              <span className="text-[10px] text-[#6b7280] font-semibold mt-1">HEALTH RATING</span>
            </div>
          </div>

          <div className={`px-4 py-1.5 rounded-full border text-xs font-bold ${getScoreColor(review.score)}`}>
            {review.score >= 85 ? 'Excellent Code Quality' : review.score >= 70 ? 'Needs Minor Refactoring' : 'Critical Issues Detected'}
          </div>
        </div>

        {/* Detailed Metrics (Progress bars) */}
        <div className="glass-panel p-6 rounded-2xl border border-[#1f1f23] lg:col-span-2 flex flex-col justify-between">
          <span className="text-xs font-bold text-[#9ca3af] uppercase tracking-wider mb-4">Quality Breakdown</span>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
            {/* Security */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-[#e5e7eb]">Security Audit Score</span>
                <span className={`font-mono font-bold ${review.securityScore >= 80 ? 'text-emerald-400' : review.securityScore >= 50 ? 'text-amber-400' : 'text-rose-400'}`}>
                  {review.securityScore}%
                </span>
              </div>
              <div className="w-full bg-[#1c1c1f] h-2 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-700 ${
                    review.securityScore >= 80 ? 'bg-emerald-500' : review.securityScore >= 50 ? 'bg-amber-500' : 'bg-rose-500'
                  }`} 
                  style={{ width: `${review.securityScore}%` }} 
                />
              </div>
            </div>

            {/* Performance */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-[#e5e7eb]">Performance Rating</span>
                <span className="font-mono font-bold text-indigo-400">{review.performanceScore}%</span>
              </div>
              <div className="w-full bg-[#1c1c1f] h-2 rounded-full overflow-hidden">
                <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${review.performanceScore}%` }} />
              </div>
            </div>

            {/* Maintainability */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-[#e5e7eb]">Maintainability Score</span>
                <span className="font-mono font-bold text-purple-400">{review.maintainabilityScore}%</span>
              </div>
              <div className="w-full bg-[#1c1c1f] h-2 rounded-full overflow-hidden">
                <div className="h-full bg-purple-500 rounded-full" style={{ width: `${review.maintainabilityScore}%` }} />
              </div>
            </div>

            {/* Readability */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-[#e5e7eb]">Readability & Syntax</span>
                <span className="font-mono font-bold text-cyan-400">{review.readabilityScore}%</span>
              </div>
              <div className="w-full bg-[#1c1c1f] h-2 rounded-full overflow-hidden">
                <div className="h-full bg-cyan-500 rounded-full" style={{ width: `${review.readabilityScore}%` }} />
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 mt-6 pt-4 border-t border-[#1f1f23]/60 text-xs text-[#9ca3af]">
            <div className="flex items-center gap-1.5">
              <Calendar size={13} />
              <span>Language: <strong className="text-white">{review.language}</strong></span>
            </div>
            <div className="flex items-center gap-1.5">
              <Layers size={13} />
              <span>Issues Tagged: <strong className="text-white">{review.issues.length} total</strong></span>
            </div>
            <div className="flex items-center gap-1.5">
              <FileCode2 size={13} />
              <span>Engine: <strong className="text-white">PulsarAI v2.8</strong></span>
            </div>
          </div>
        </div>
      </div>

      {/* AI Summary Section */}
      <div className="glass-panel p-6 rounded-2xl border border-[#1f1f23] space-y-3">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-pulse" />
          <h3 className="text-xs font-bold text-white uppercase tracking-wider m-0">AI Code Summary & Verdict</h3>
        </div>
        <p className="text-sm text-[#9ca3af] leading-relaxed">
          {review.summary}
        </p>
      </div>

      {/* Issues List with Code Diffs */}
      <div className="space-y-6">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider m-0">Issues Found & Fixes</h3>

        <div className="space-y-6">
          {review.issues.map((issue, idx) => {
            const styles = getSeverityStyles(issue.severity);
            return (
              <div 
                key={issue.id}
                className="glass-panel rounded-2xl border border-[#1f1f23] overflow-hidden"
              >
                {/* Issue Header Info bar */}
                <div className="p-5 border-b border-[#1f1f23] flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#0a0a0c]/80">
                  <div className="space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border uppercase tracking-wider ${styles.bg}`}>
                        {issue.severity}
                      </span>
                      <span className="text-[10px] font-semibold bg-[#1c1c1f] text-[#9ca3af] border border-[#1f1f23] px-2 py-0.5 rounded-md">
                        {issue.category}
                      </span>
                      <span className="text-xs text-[#6b7280] font-mono">{issue.file}</span>
                    </div>
                    <h4 className="text-base font-bold text-white m-0">{issue.title}</h4>
                  </div>
                  <span className="text-xs text-[#6b7280] font-mono font-semibold">{issue.id}</span>
                </div>

                {/* Description details */}
                <div className="p-5 space-y-4">
                  <p className="text-xs text-[#9ca3af] leading-relaxed max-w-4xl m-0">
                    {issue.description}
                  </p>

                  {/* Code Diffs panels */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-2">
                    
                    {/* Before block */}
                    <div className="rounded-xl border border-rose-500/10 bg-[#070204]/90 overflow-hidden">
                      <div className="px-4 py-2 border-b border-rose-500/10 bg-rose-950/20 flex items-center justify-between">
                        <span className="text-[10px] font-bold text-rose-400 tracking-wide uppercase">Original Code (Bottleneck)</span>
                        <button 
                          onClick={() => handleCopyCode(issue.beforeCode, `${idx}-before`)}
                          className="text-[#6b7280] hover:text-[#9ca3af] transition-colors cursor-pointer"
                        >
                          {copiedId === `${idx}-before` ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                        </button>
                      </div>
                      <div className="p-4 overflow-x-auto text-xs font-mono leading-relaxed text-[#fca5a5]">
                        <pre className="m-0 select-text">{issue.beforeCode}</pre>
                      </div>
                    </div>

                    {/* After block (Fix) */}
                    <div className="rounded-xl border border-emerald-500/10 bg-[#020704]/90 overflow-hidden">
                      <div className="px-4 py-2 border-b border-emerald-500/10 bg-emerald-950/20 flex items-center justify-between">
                        <span className="text-[10px] font-bold text-emerald-400 tracking-wide uppercase">Refactored Code (AI Suggestion)</span>
                        <button 
                          onClick={() => handleCopyCode(issue.afterCode, `${idx}-after`)}
                          className="text-[#6b7280] hover:text-[#9ca3af] transition-colors cursor-pointer"
                        >
                          {copiedId === `${idx}-after` ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                        </button>
                      </div>
                      <div className="p-4 overflow-x-auto text-xs font-mono leading-relaxed text-[#a7f3d0]">
                        <pre className="m-0 select-text">{issue.afterCode}</pre>
                      </div>
                    </div>

                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
