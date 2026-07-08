
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Trash2, Eye, ChevronLeft, ChevronRight, FileText } from 'lucide-react';
import { useReviews } from '../context/ReviewContext';
import toast from 'react-hot-toast';

export default function Reviews() {
  const { reviews, loading, deleteReview } = useReviews();
  const navigate = useNavigate();

  // Search State
  const [searchQuery, setSearchQuery] = useState('');

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Filtered reviews
  const processedReviews = reviews.filter((review) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        (review.repo_url && review.repo_url.toLowerCase().includes(q)) ||
        (review.type && review.type.toLowerCase().includes(q)) ||
        review.id.toLowerCase().includes(q)
      );
    }
    return true;
  });

  // Pagination bounds
  const totalPages = Math.ceil(processedReviews.length / itemsPerPage);
  const paginatedReviews = processedReviews.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleDelete = async (id, e) => {
    e.stopPropagation(); // Avoid triggering row navigation
    if (confirm('Are you sure you want to delete this review?')) {
      await deleteReview(id);
      // Adjust current page if empty
      const nextTotalPages = Math.ceil((processedReviews.length - 1) / itemsPerPage);
      if (currentPage > nextTotalPages && nextTotalPages > 0) {
        setCurrentPage(nextTotalPages);
      }
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header section */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-white m-0">Review History</h2>
        <p className="text-sm text-[#9ca3af] mt-1">All your AI code reviews</p>
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
            placeholder="Search reviews..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-[#1f1f23] bg-[#0c0c0e] text-white placeholder-[#4b5563] text-sm focus:border-indigo-500/80 outline-none transition-all"
          />
        </div>
      </div>

      {/* Main Table Card */}
      <div className="glass-panel rounded-2xl border border-[#1f1f23] overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
          </div>
        ) : paginatedReviews.length > 0 ? (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#1f1f23] bg-[#0a0a0c]/80 text-[#9ca3af] text-xs font-bold uppercase tracking-wider">
                    <th className="p-4 font-semibold font-mono">Review ID</th>
                    <th className="p-4 font-semibold">Type</th>
                    <th className="p-4 font-semibold">Date</th>
                    <th className="p-4 font-semibold">Score</th>
                    <th className="p-4 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1f1f23]/60 text-sm">
                  {paginatedReviews.map((review) => (
                    <motion.tr
                      key={review.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.15 }}
                      onClick={() => navigate(`/reviews/${review.id}`)}
                      className="hover:bg-[#161619]/40 transition-colors cursor-pointer group"
                    >
                      <td className="p-4 font-mono font-semibold text-[#818cf8]">{review.id}</td>
                      <td className="p-4">
                        <span className="text-xs font-semibold text-white">
                          {review.type.charAt(0).toUpperCase() + review.type.slice(1)}
                        </span>
                      </td>
                      <td className="p-4 text-[#9ca3af]">
                        {new Date(review.created_at).toLocaleDateString(undefined, {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </td>
                      <td className="p-4">
                        <span
                          className={`text-xs font-black px-2 py-0.5 rounded-lg ${
                            review.overall_score >= 85
                              ? 'text-emerald-400 bg-emerald-500/10'
                              : review.overall_score >= 70
                              ? 'text-amber-400 bg-amber-500/10'
                              : 'text-rose-400 bg-rose-500/10'
                          }`}
                        >
                          {review.overall_score}/100
                        </span>
                      </td>
                      <td className="p-4 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => navigate(`/reviews/${review.id}`)}
                            className="p-1.5 rounded-lg border border-[#1f1f23] hover:border-indigo-500/50 hover:bg-[#161619] text-[#9ca3af] hover:text-white transition-all cursor-pointer"
                            title="View detailed report"
                          >
                            <Eye size={14} />
                          </button>
                          <button
                            onClick={(e) => handleDelete(review.id, e)}
                            className="p-1.5 rounded-lg border border-[#1f1f23] hover:border-red-500/30 hover:bg-red-500/5 text-[#6b7280] hover:text-red-400 transition-all cursor-pointer"
                            title="Delete record"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination bar */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between p-4 border-t border-[#1f1f23] bg-[#0a0a0c]/60 text-xs">
                <span className="text-[#6b7280] font-semibold">
                  Showing page <strong className="text-[#f3f4f6]">{currentPage}</strong> of{' '}
                  <strong className="text-[#f3f4f6]">{totalPages}</strong>
                </span>
                <div className="flex gap-2">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-xl border border-[#1f1f23] hover:border-indigo-500/50 hover:bg-[#161619] text-[#9ca3af] hover:text-white disabled:opacity-40 disabled:hover:border-[#1f1f23] disabled:hover:bg-transparent transition-all cursor-pointer font-semibold"
                  >
                    <ChevronLeft size={13} />
                    Previous
                  </button>
                  <button
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-xl border border-[#1f1f23] hover:border-indigo-500/50 hover:bg-[#161619] text-[#9ca3af] hover:text-white disabled:opacity-40 disabled:hover:border-[#1f1f23] disabled:hover:bg-transparent transition-all cursor-pointer font-semibold"
                  >
                    Next
                    <ChevronRight size={13} />
                  </button>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12 text-[#9ca3af]">
            <div className="flex flex-col items-center gap-2">
              <FileText size={24} className="text-[#4b5563]" />
              <span>No reviews yet. Start by creating your first review!</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
