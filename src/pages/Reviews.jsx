import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Trash2, 
  Eye, 
  ChevronLeft, 
  ChevronRight, 
  Filter, 
  SlidersHorizontal,
  ChevronDown,
  ChevronUp,
  FileText
} from 'lucide-react';
import { useReviews } from '../context/ReviewContext';
import toast from 'react-hot-toast';

export default function Reviews() {
  const { reviews, deleteReview } = useReviews();
  const navigate = useNavigate();

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  
  // Sorting State
  const [sortField, setSortField] = useState('date'); // 'date' | 'score' | 'projectName'
  const [sortDirection, setSortDirection] = useState('desc'); // 'asc' | 'desc'

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Extract unique languages for filter dropdown
  const languages = useMemo(() => {
    const langs = new Set(reviews.map(r => r.language));
    return ['all', ...Array.from(langs)];
  }, [reviews]);

  // Handle Sort Toggle
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  // Filtered & Sorted reviews
  const processedReviews = useMemo(() => {
    let result = [...reviews];

    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        r => r.projectName.toLowerCase().includes(q) || r.id.toLowerCase().includes(q)
      );
    }

    // Language filter
    if (selectedLanguage !== 'all') {
      result = result.filter(r => r.language === selectedLanguage);
    }

    // Status filter
    if (selectedStatus !== 'all') {
      result = result.filter(r => r.status === selectedStatus);
    }

    // Sorting
    result.sort((a, b) => {
      let aVal = a[sortField];
      let bVal = b[sortField];

      if (sortField === 'date') {
        aVal = new Date(a.date).getTime();
        bVal = new Date(b.date).getTime();
      }

      if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    return result;
  }, [reviews, searchQuery, selectedLanguage, selectedStatus, sortField, sortDirection]);

  // Pagination bounds
  const totalPages = Math.ceil(processedReviews.length / itemsPerPage);
  const paginatedReviews = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return processedReviews.slice(startIndex, startIndex + itemsPerPage);
  }, [processedReviews, currentPage]);

  const handleDelete = (id, e) => {
    e.stopPropagation(); // Avoid triggering row navigation
    if (confirm(`Are you sure you want to delete review ${id}?`)) {
      deleteReview(id);
      // Adjust current page if empty
      const nextTotalPages = Math.ceil((processedReviews.length - 1) / itemsPerPage);
      if (currentPage > nextTotalPages && nextTotalPages > 0) {
        setCurrentPage(nextTotalPages);
      }
    }
  };

  // Helper for sorting indicator icons
  const renderSortIcon = (field) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />;
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header section */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-white m-0">Review History</h2>
        <p className="text-sm text-[#9ca3af] mt-1">Audit trail log of all completed, pending, or failed reviews.</p>
      </div>

      {/* Filters and Search Bar */}
      <div className="glass-panel p-4 rounded-2xl border border-[#1f1f23] flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-[#6b7280]">
            <Search size={16} />
          </span>
          <input
            type="text"
            placeholder="Search by ID or Project Name..."
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-[#1f1f23] bg-[#0c0c0e] text-white placeholder-[#4b5563] text-sm focus:border-indigo-500/80 outline-none transition-all"
          />
        </div>

        {/* Filters dropdowns */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs text-[#9ca3af] font-semibold">
            <Filter size={13} />
            <span>Filters:</span>
          </div>

          {/* Language filter selector */}
          <select
            value={selectedLanguage}
            onChange={(e) => { setSelectedLanguage(e.target.value); setCurrentPage(1); }}
            className="px-3 py-1.5 rounded-xl border border-[#1f1f23] bg-[#0c0c0e] text-xs font-semibold text-[#f3f4f6] focus:border-indigo-500 outline-none cursor-pointer"
          >
            <option value="all">All Languages</option>
            {languages.filter(l => l !== 'all').map((lang) => (
              <option key={lang} value={lang}>{lang}</option>
            ))}
          </select>

          {/* Status filter selector */}
          <select
            value={selectedStatus}
            onChange={(e) => { setSelectedStatus(e.target.value); setCurrentPage(1); }}
            className="px-3 py-1.5 rounded-xl border border-[#1f1f23] bg-[#0c0c0e] text-xs font-semibold text-[#f3f4f6] focus:border-indigo-500 outline-none cursor-pointer"
          >
            <option value="all">All Statuses</option>
            <option value="Completed">Completed</option>
            <option value="In Progress">In Progress</option>
            <option value="Failed">Failed</option>
          </select>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="glass-panel rounded-2xl border border-[#1f1f23] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#1f1f23] bg-[#0a0a0c]/80 text-[#9ca3af] text-xs font-bold uppercase tracking-wider">
                <th className="p-4 font-semibold font-mono">Review ID</th>
                <th 
                  onClick={() => handleSort('projectName')}
                  className="p-4 font-semibold cursor-pointer hover:text-white transition-colors"
                >
                  <div className="flex items-center gap-1">
                    Project Name
                    {renderSortIcon('projectName')}
                  </div>
                </th>
                <th className="p-4 font-semibold">Language</th>
                <th 
                  onClick={() => handleSort('date')}
                  className="p-4 font-semibold cursor-pointer hover:text-white transition-colors"
                >
                  <div className="flex items-center gap-1">
                    Date Submitted
                    {renderSortIcon('date')}
                  </div>
                </th>
                <th className="p-4 font-semibold">Status</th>
                <th 
                  onClick={() => handleSort('score')}
                  className="p-4 font-semibold cursor-pointer hover:text-white transition-colors"
                >
                  <div className="flex items-center gap-1">
                    Score
                    {renderSortIcon('score')}
                  </div>
                </th>
                <th className="p-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1f1f23]/60 text-sm">
              <AnimatePresence mode="popLayout">
                {paginatedReviews.length > 0 ? (
                  paginatedReviews.map((rev) => (
                    <motion.tr
                      key={rev.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.15 }}
                      onClick={() => navigate(`/reviews/${rev.id}`)}
                      className="hover:bg-[#161619]/40 transition-colors cursor-pointer group"
                    >
                      <td className="p-4 font-mono font-semibold text-[#818cf8]">{rev.id}</td>
                      <td className="p-4 font-bold text-white max-w-[200px] truncate">{rev.projectName}</td>
                      <td className="p-4">
                        <span className="flex items-center gap-1.5 text-xs font-medium text-[#e5e7eb]">
                          <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                          {rev.language}
                        </span>
                      </td>
                      <td className="p-4 text-[#9ca3af]">
                        {new Date(rev.date).toLocaleDateString(undefined, { 
                          year: 'numeric', 
                          month: 'short', 
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </td>
                      <td className="p-4">
                        <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                          rev.status === 'Completed' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                          rev.status === 'In Progress' ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' :
                          'bg-rose-500/10 text-rose-400 border-rose-500/20'
                        }`}>
                          {rev.status}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className={`text-xs font-black px-2 py-0.5 rounded-lg ${
                          rev.score >= 85 ? 'text-emerald-400 bg-emerald-500/10' :
                          rev.score >= 70 ? 'text-amber-400 bg-amber-500/10' :
                          'text-rose-400 bg-rose-500/10'
                        }`}>
                          {rev.score}/100
                        </span>
                      </td>
                      <td className="p-4 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => navigate(`/reviews/${rev.id}`)}
                            className="p-1.5 rounded-lg border border-[#1f1f23] hover:border-indigo-500/50 hover:bg-[#161619] text-[#9ca3af] hover:text-white transition-all cursor-pointer"
                            title="View detailed report"
                          >
                            <Eye size={14} />
                          </button>
                          <button
                            onClick={(e) => handleDelete(rev.id, e)}
                            className="p-1.5 rounded-lg border border-[#1f1f23] hover:border-red-500/30 hover:bg-red-500/5 text-[#6b7280] hover:text-red-400 transition-all cursor-pointer"
                            title="Delete record"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="text-center py-12 text-[#6b7280] font-sans">
                      <div className="flex flex-col items-center gap-2">
                        <FileText size={24} className="text-[#374151]" />
                        <span>No review records matched your criteria.</span>
                      </div>
                    </td>
                  </tr>
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {/* Pagination bar */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between p-4 border-t border-[#1f1f23] bg-[#0a0a0c]/60 text-xs">
            <span className="text-[#6b7280] font-semibold">
              Showing page <strong className="text-[#f3f4f6]">{currentPage}</strong> of <strong className="text-[#f3f4f6]">{totalPages}</strong>
            </span>
            <div className="flex gap-2">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl border border-[#1f1f23] hover:border-indigo-500/50 hover:bg-[#161619] text-[#9ca3af] hover:text-white disabled:opacity-40 disabled:hover:border-[#1f1f23] disabled:hover:bg-transparent transition-all cursor-pointer font-semibold"
              >
                <ChevronLeft size={13} />
                Previous
              </button>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl border border-[#1f1f23] hover:border-indigo-500/50 hover:bg-[#161619] text-[#9ca3af] hover:text-white disabled:opacity-40 disabled:hover:border-[#1f1f23] disabled:hover:bg-transparent transition-all cursor-pointer font-semibold"
              >
                Next
                <ChevronRight size={13} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
