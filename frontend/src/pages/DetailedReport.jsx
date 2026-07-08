
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, ShieldAlert, Bug, AlertTriangle, Info, Copy, Check, FileCode, Zap, BarChart3, Gauge } from 'lucide-react';
import { getReviewById } from '../services/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function DetailedReport() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [review, setReview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState(null);

  useEffect(() => {
    const fetchReview = async () => {
      if (!user?.id) return;
      try {
        setLoading(true);
        const result = await getReviewById(id, user.id);
        const reviewData = result.review;

        console.log('Fetched Review:', reviewData);

        if (!reviewData) {
          setReview(null);
          return;
        }

        setReview(reviewData);
      } catch (error) {
        console.error('Failed to fetch review:', error);
        toast.error('Failed to load review');
      } finally {
        setLoading(false);
      }
    };
    fetchReview();
  }, [id, user?.id]);

  // If review is still loading or doesn't exist
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center space-y-4">
        <div className="w-8 h-8 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
        <p className="text-sm text-[#9ca3af]">Loading review...</p>
      </div>
    );
  }

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
          onClick={() => navigate('/reviews')}
          className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-all cursor-pointer"
        >
          Return to Reviews
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
    const s = severity?.toLowerCase();
    switch (s) {
      case 'critical':
        return {
          bg: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
          icon: <ShieldAlert size={14} className="text-rose-500" />
        };
      case 'high':
        return {
          bg: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
          icon: <Bug size={14} className="text-orange-500" />
        };
      case 'medium':
        return {
          bg: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
          icon: <AlertTriangle size={14} className="text-amber-500" />
        };
      case 'low':
      default:
        return {
          bg: 'bg-sky-500/10 text-sky-400 border-sky-500/20',
          icon: <Info size={14} className="text-sky-500" />
        };
    }
  };

  const overallScore = review.overallScore ?? review.overall_score ?? 0;
  const createdAt = review.createdAt ?? review.created_at;
  const aiReview = review.aiReview ?? review.ai_review;
  const staticAnalysisResult = review.staticAnalysis ?? review.static_analysis;
  const score = overallScore;

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
              <span className="text-xs text-[#6b7280]">Created {new Date(createdAt).toLocaleDateString()}</span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-white m-0 mt-0.5">
              {review.project_name || 'Untitled Review'}
            </h2>
          </div>
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
                strokeDashoffset={389.5 - (389.5 * score) / 100}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-3xl font-black text-white font-mono leading-none">{score}</span>
              <span className="text-[10px] text-[#6b7280] font-semibold mt-1">HEALTH RATING</span>
            </div>
          </div>

          <div className={`px-4 py-1.5 rounded-full border text-xs font-bold ${getScoreColor(score)}`}>
            {score >= 85 ? 'Excellent Code Quality' : score >= 70 ? 'Needs Minor Refactoring' : 'Critical Issues Detected'}
          </div>
        </div>

        {/* Detailed Metrics */}
        <div className="glass-panel p-6 rounded-2xl border border-[#1f1f23] lg:col-span-2 flex flex-col justify-between">
          <span className="text-xs font-bold text-[#9ca3af] uppercase tracking-wider mb-4">Code Metrics</span>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {review.metrics?.project && (
              <>
                <div className="space-y-2 p-3 rounded-xl bg-[#0c0c0e] border border-[#1f1f23]">
                  <div className="flex items-center gap-1.5 text-xs text-[#9ca3af]">
                    <Gauge size={12} />
                    <span>Cyclomatic Complexity</span>
                  </div>
                  <div className="text-xl font-black text-white font-mono">
                    {review.metrics.project.totalCyclomaticComplexity}
                  </div>
                </div>
                <div className="space-y-2 p-3 rounded-xl bg-[#0c0c0e] border border-[#1f1f23]">
                  <div className="flex items-center gap-1.5 text-xs text-[#9ca3af]">
                    <FileCode size={12} />
                    <span>Total Functions</span>
                  </div>
                  <div className="text-xl font-black text-white font-mono">
                    {review.metrics.project.totalFunctionCount}
                  </div>
                </div>
                <div className="space-y-2 p-3 rounded-xl bg-[#0c0c0e] border border-[#1f1f23]">
                  <div className="flex items-center gap-1.5 text-xs text-[#9ca3af]">
                    <BarChart3 size={12} />
                    <span>Lines of Code</span>
                  </div>
                  <div className="text-xl font-black text-white font-mono">
                    {review.metrics.project.totalLinesOfCode}
                  </div>
                </div>
                <div className="space-y-2 p-3 rounded-xl bg-[#0c0c0e] border border-[#1f1f23]">
                  <div className="flex items-center gap-1.5 text-xs text-[#9ca3af]">
                    <Zap size={12} />
                    <span>Files Analyzed</span>
                  </div>
                  <div className="text-xl font-black text-white font-mono">
                    {review.metrics.project.fileCount}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* AI Summary Section */}
      {aiReview?.summary && (
        <div className="glass-panel p-6 rounded-2xl border border-[#1f1f23] space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-pulse" />
            <h3 className="text-xs font-bold text-white uppercase tracking-wider m-0">AI Code Summary & Verdict</h3>
          </div>
          <p className="text-sm text-[#9ca3af] leading-relaxed">
            {aiReview.summary}
          </p>
        </div>
      )}

      {/* Static Analysis Section */}
      {staticAnalysisResult && staticAnalysisResult.length > 0 && (
        <div className="space-y-6">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider m-0">ESLint Static Analysis</h3>

          <div className="space-y-4">
            {staticAnalysisResult.map((file, fileIdx) => (
              <div key={fileIdx} className="glass-panel rounded-2xl border border-[#1f1f23] overflow-hidden">
                <div className="p-5 border-b border-[#1f1f23] flex items-center justify-between bg-[#0a0a0c]/80">
                  <div>
                    <h4 className="text-sm font-bold text-white m-0 flex items-center gap-2">
                      <FileCode size={14} className="text-indigo-400" />
                      {file.filePath}
                    </h4>
                    <div className="flex gap-2 mt-1">
                      <span className="text-[10px] text-rose-400 font-semibold">{file.errors} Errors</span>
                      <span className="text-[10px] text-amber-400 font-semibold">{file.warnings} Warnings</span>
                    </div>
                  </div>
                </div>

                {file.messages && file.messages.length > 0 && (
                  <div className="p-5">
                    <div className="space-y-3">
                      {file.messages.map((msg, msgIdx) => {
                        const styles = getSeverityStyles(msg.severity);
                        return (
                          <div key={msgIdx} className="p-3 rounded-xl bg-[#0c0c0e] border border-[#1f1f23]">
                            <div className="flex items-start gap-3">
                              {styles.icon}
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border uppercase tracking-wider ${styles.bg}`}>
                                    {msg.severity}
                                  </span>
                                  {msg.ruleId && <span className="text-[10px] text-[#6b7280] font-mono">{msg.ruleId}</span>}
                                  {msg.line && (
                                    <span className="text-[10px] text-[#6b7280]">Line {msg.line}:{msg.column}</span>
                                  )}
                                </div>
                                <p className="text-xs text-[#e5e7eb]">{msg.message}</p>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* AI Issues Section */}
      {aiReview && (
        <div className="space-y-6">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider m-0">AI Analysis Results</h3>

          {/* Bugs */}
          {aiReview.bugs && aiReview.bugs.length > 0 && (
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-rose-400 flex items-center gap-2">
                <Bug size={16} />
                Bugs ({aiReview.bugs.length})
              </h4>
              {aiReview.bugs.map((bug, idx) => {
                const styles = getSeverityStyles(bug.severity);
                return (
                  <div key={idx} className="glass-panel rounded-2xl border border-[#1f1f23] overflow-hidden">
                    <div className="p-5 border-b border-[#1f1f23] bg-[#0a0a0c]/80">
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border uppercase tracking-wider ${styles.bg}`}>
                          {bug.severity}
                        </span>
                      </div>
                      <p className="text-sm text-white font-medium">{bug.description}</p>
                    </div>
                    {bug.suggestedFix && (
                      <div className="p-5">
                        <div className="rounded-xl border border-emerald-500/10 bg-[#020704]/90 overflow-hidden">
                          <div className="px-4 py-2 border-b border-emerald-500/10 bg-emerald-950/20 flex items-center justify-between">
                            <span className="text-[10px] font-bold text-emerald-400 tracking-wide uppercase">Suggested Fix</span>
                            <button 
                              onClick={() => handleCopyCode(bug.suggestedFix, `bug-${idx}`)}
                              className="text-[#6b7280] hover:text-[#9ca3af] transition-colors cursor-pointer"
                            >
                              {copiedId === `bug-${idx}` ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                            </button>
                          </div>
                          <div className="p-4 overflow-x-auto text-xs font-mono leading-relaxed text-[#a7f3d0]">
                            <pre className="m-0 select-text">{bug.suggestedFix}</pre>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Code Smells */}
          {aiReview.codeSmells && aiReview.codeSmells.length > 0 && (
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-amber-400 flex items-center gap-2">
                <AlertTriangle size={16} />
                Code Smells ({aiReview.codeSmells.length})
              </h4>
              {aiReview.codeSmells.map((smell, idx) => {
                const styles = getSeverityStyles(smell.severity);
                return (
                  <div key={idx} className="glass-panel p-5 rounded-2xl border border-[#1f1f23]">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border uppercase tracking-wider ${styles.bg}`}>
                        {smell.severity}
                      </span>
                    </div>
                    <p className="text-sm text-[#e5e7eb]">{smell.description}</p>
                  </div>
                );
              })}
            </div>
          )}

          {/* Security Recommendations */}
          {aiReview.securityRecommendations && aiReview.securityRecommendations.length > 0 && (
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-purple-400 flex items-center gap-2">
                <ShieldAlert size={16} />
                Security Recommendations ({aiReview.securityRecommendations.length})
              </h4>
              {aiReview.securityRecommendations.map((rec, idx) => {
                const styles = getSeverityStyles(rec.severity);
                return (
                  <div key={idx} className="glass-panel p-5 rounded-2xl border border-[#1f1f23]">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border uppercase tracking-wider ${styles.bg}`}>
                        {rec.severity}
                      </span>
                    </div>
                    <p className="text-sm text-[#e5e7eb]">{rec.description}</p>
                  </div>
                );
              })}
            </div>
          )}

          {/* Performance Improvements */}
          {aiReview.performanceImprovements && aiReview.performanceImprovements.length > 0 && (
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-cyan-400 flex items-center gap-2">
                <Zap size={16} />
                Performance Improvements ({aiReview.performanceImprovements.length})
              </h4>
              {aiReview.performanceImprovements.map((imp, idx) => {
                const styles = getSeverityStyles(imp.severity);
                return (
                  <div key={idx} className="glass-panel p-5 rounded-2xl border border-[#1f1f23]">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border uppercase tracking-wider ${styles.bg}`}>
                        {imp.severity}
                      </span>
                    </div>
                    <p className="text-sm text-[#e5e7eb]">{imp.description}</p>
                  </div>
                );
              })}
            </div>
          )}

          {/* Best Practices */}
          {aiReview.bestPractices && aiReview.bestPractices.length > 0 && (
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-emerald-400 flex items-center gap-2">
                <Info size={16} />
                Best Practices ({aiReview.bestPractices.length})
              </h4>
              {aiReview.bestPractices.map((bp, idx) => {
                const styles = getSeverityStyles(bp.severity);
                return (
                  <div key={idx} className="glass-panel p-5 rounded-2xl border border-[#1f1f23]">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border uppercase tracking-wider ${styles.bg}`}>
                        {bp.severity}
                      </span>
                    </div>
                    <p className="text-sm text-[#e5e7eb]">{bp.description}</p>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
