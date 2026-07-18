
import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Editor from '@monaco-editor/react';
import {
  Upload,
  Code,
  File,
  Trash2,
  Zap,
  FileCheck,
} from 'lucide-react';
import { useReviews } from '../context/ReviewContext';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function NewReview() {
  const { addReviewCode, addReviewFiles, analyzing } =
    useReviews();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('paste');

  // Project Name State
  const [projectName, setProjectName] = useState('');

  // Paste Code Tab State
  const [codeValue, setCodeValue] = useState('');

  // File Upload Tab State
  const [files, setFiles] = useState([]);
  const fileInputRef = useRef(null);

  // Handler for Analyze Button
  const handleRunAnalysis = async () => {
    let reviewId = null;
    if (activeTab === 'paste') {
      if (!codeValue.trim()) {
        toast.error('Please write or paste code for auditing');
        return;
      }
      reviewId = await addReviewCode(codeValue, projectName);
    } else if (activeTab === 'upload') {
      if (files.length === 0) {
        toast.error('Please select or drop files to upload');
        return;
      }
      reviewId = await addReviewFiles(files, projectName);
    }

    if (reviewId) {
      navigate(`/reviews/${reviewId}`);
    }
  };

  // Drag & Drop handlers
  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFiles = Array.from(e.dataTransfer.files);
    handleFileSelection(droppedFiles);
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    handleFileSelection(selectedFiles);
  };

  const handleFileSelection = (newFiles) => {
    if (newFiles.length === 0) return;
    setFiles((prev) => [...prev, ...newFiles]);
    toast.success('Files selected');
  };

  const handleRemoveFile = (indexToRemove) => {
    setFiles((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Page Header */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-white m-0">
          Review New Project
        </h2>
        <p className="text-sm text-[#9ca3af] mt-1">
          Submit your source code or repository to receive AI-driven reviews.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
        {/* Code Input Area (2/3 width) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Project Name Input */}
          <div className="glass-panel p-6 rounded-2xl border border-[#1f1f23] space-y-3">
            <label
              className="block text-xs font-semibold text-[#9ca3af] uppercase tracking-wider"
              htmlFor="projectName"
            >
              Project Name (Optional)
            </label>
            <input
              id="projectName"
              type="text"
              placeholder="Enter project name..."
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-[#1f1f23] bg-[#0c0c0e]/80 text-white placeholder-[#4b5563] text-sm focus:border-indigo-500/80 focus:ring-1 focus:ring-indigo-500/80 outline-none transition-all"
            />
            <p className="text-[10px] text-[#6b7280]">
              Give your review a friendly name (defaults to "Untitled Review" if left empty)
            </p>
          </div>

          {/* Method tabs */}
          <div className="flex border-b border-[#1f1f23] p-1 gap-2 bg-[#0a0a0c]/60 rounded-xl w-full max-w-md">
            <button
              onClick={() => setActiveTab('paste')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                activeTab === 'paste'
                  ? 'bg-[#1f1f23] text-white'
                  : 'text-[#6b7280] hover:text-[#9ca3af]'
              }`}
            >
              <Code size={14} />
              Paste Code
            </button>
            <button
              onClick={() => setActiveTab('upload')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                activeTab === 'upload'
                  ? 'bg-[#1f1f23] text-white'
                  : 'text-[#6b7280] hover:text-[#9ca3af]'
              }`}
            >
              <Upload size={14} />
              Upload Files
            </button>
          </div>

          {/* Form details */}
          <div className="glass-panel p-6 rounded-2xl border border-[#1f1f23] space-y-6">
            {/* TAB CONTENT: Pasted Source Code */}
            {activeTab === 'paste' && (
              <div className="space-y-4">
                {/* Monaco Editor Component wrapper */}
                <div className="monaco-editor-wrapper">
                  <Editor
                    height="400px"
                    language="javascript"
                    theme="vs-dark"
                    value={codeValue}
                    onChange={setCodeValue}
                    options={{
                      fontSize: 13,
                      fontFamily: "'JetBrains Mono', monospace",
                      minimap: { enabled: false },
                      scrollBeyondLastLine: false,
                      padding: { top: 12, bottom: 12 },
                    }}
                  />
                </div>
              </div>
            )}

            {/* TAB CONTENT: Upload Files */}
            {activeTab === 'upload' && (
              <div className="space-y-4">
                {/* Drag zone */}
                <div
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-[#1f1f23] hover:border-indigo-500/50 bg-[#0c0c0e]/50 hover:bg-[#161619]/40 p-8 rounded-2xl flex flex-col items-center justify-center text-center cursor-pointer transition-all gap-3"
                >
                  <input
                    type="file"
                    multiple
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                    accept=".js,.jsx"
                  />
                  <div className="p-3 rounded-full bg-indigo-500/10 text-indigo-400">
                    <Upload size={24} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">
                      Drag & Drop files or browse
                    </p>
                    <p className="text-xs text-[#9ca3af] mt-1">
                      Supports JS and JSX files
                    </p>
                  </div>
                </div>

                {/* File list */}
                {files.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-xs font-semibold text-[#9ca3af] uppercase tracking-wider mt-4">
                      Selected Files
                    </h4>
                    <div className="space-y-1.5 max-h-[200px] overflow-y-auto pr-1">
                      {files.map((file, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between p-2.5 rounded-xl border border-[#1f1f23] bg-[#0c0c0e]/70 text-xs"
                        >
                          <div className="flex items-center gap-2 text-white font-medium">
                            <File size={14} className="text-indigo-400" />
                            <span className="truncate max-w-[100px] sm:max-w-[200px] md:max-w-[400px]">
                              {file.name}
                            </span>
                            <span className="text-[10px] text-[#6b7280]">
                              ({(file.size / 1024).toFixed(1)} KB)
                            </span>
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemoveFile(idx);
                            }}
                            className="p-1 rounded hover:bg-[#161619] text-[#6b7280] hover:text-red-400 transition-colors cursor-pointer"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Primary Action Button */}
            <div className="pt-4 border-t border-[#1f1f23] flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs text-indigo-400 font-semibold uppercase tracking-wider">
                <Zap size={14} className="fill-indigo-500/10" />
                <span>AI Analysis</span>
              </div>
              <button
                onClick={handleRunAnalysis}
                disabled={analyzing}
                className="px-4 sm:px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-600/50 text-white font-semibold text-xs tracking-wider transition-all shadow-md shadow-indigo-600/20 flex items-center gap-1.5 cursor-pointer"
              >
                {analyzing ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <FileCheck size={14} />
                    Run Analysis
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Side Panel: Guidelines & Credit info (1/3 width) */}
        <div className="space-y-6">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider m-0">
            Scanner Sandbox
          </h3>

          {/* Credit balance display */}
          <div className="glass-panel p-5 rounded-2xl border border-[#1f1f23] flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs font-semibold text-[#9ca3af] uppercase tracking-wider">
                User
              </span>
              <div className="flex items-baseline gap-1">
                <span className="text-xl font-bold text-white">
                  {user?.email}
                </span>
              </div>
            </div>
            <div className="p-3 rounded-full bg-indigo-500/10 text-indigo-400">
              <Zap size={20} />
            </div>
          </div>

          {/* Audit parameters guidelines */}
          <div className="glass-panel p-5 rounded-2xl border border-[#1f1f23] space-y-4">
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider m-0">
              What we analyze
            </h4>
            <ul className="text-xs text-[#9ca3af] space-y-3 pl-4 list-disc leading-relaxed">
              <li>
                <strong className="text-[#f3f4f6]">ESLint Static Analysis</strong>:
                Syntax errors, unused variables, formatting issues
              </li>
              <li>
                <strong className="text-[#f3f4f6]">Code Metrics</strong>:
                Cyclomatic complexity, lines of code, function counts
              </li>
              <li>
                <strong className="text-[#f3f4f6]">AI Review</strong>: Bugs,
                code smells, performance and security improvements
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
