import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Editor from '@monaco-editor/react';
import { 
  Clipboard, 
  Upload, 
  Github, 
  Code, 
  File, 
  Trash2, 
  Zap, 
  CheckCircle,
  FileCheck,
  AlertCircle,
  HelpCircle
} from 'lucide-react';
import { useReviews } from '../context/ReviewContext';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function NewReview() {
  const { addReview, analyzing } = useReviews();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('paste'); // 'paste' | 'upload' | 'github'
  const [projectName, setProjectName] = useState('');
  const [language, setLanguage] = useState('javascript');

  // Paste Code Tab State
  const [codeValue, setCodeValue] = useState(`// Paste your source code here for analysis
function calculateTotal(items) {
  let total = 0;
  for (let i = 0; i < items.length; i++) {
    // Bottleneck: direct operation inside loop
    total = total + items[i].price;
  }
  return total;
}`);

  // File Upload Tab State
  const [files, setFiles] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(null); // null or 0-100
  const fileInputRef = useRef(null);

  // GitHub Tab State
  const [repoUrl, setRepoUrl] = useState('');

  // Preset default code snippets for users to try out instantly
  const handleLoadDemoSnippet = () => {
    if (language === 'javascript') {
      setCodeValue(`// Unsafe authentication token store
const SESSION_SECRET = "superSecretKey123";

function authenticateUser(userDb, username, password) {
  // Vulnerable SQL query construction
  const query = "SELECT * FROM users WHERE username = '" + username + "' AND password = '" + password + "'";
  return userDb.execute(query);
}`);
      toast.success('Loaded JavaScript vulnerability demo snippet!');
    } else if (language === 'python') {
      setCodeValue(`# Inefficient file ingestion causing memory leakage
def read_and_convert_logs(file_path):
    file = open(file_path, 'r')
    log_data = file.read()
    # Memory spike
    records = [line.split(',') for line in log_data.split('\\n')]
    file.close()
    return records`);
      toast.success('Loaded Python optimization demo snippet!');
    } else {
      setCodeValue(`// Code for analysis`);
    }
  };

  // Handler for Analyze Button
  const handleRunAnalysis = async () => {
    let payload = {
      projectName: projectName.trim() || 'Untitled Code Scan',
      language,
    };

    if (activeTab === 'paste') {
      if (!codeValue.trim() || codeValue.length < 20) {
        toast.error('Please write or paste code for auditing (min. 20 characters)');
        return;
      }
      payload.codeContent = codeValue;
    } 
    else if (activeTab === 'upload') {
      if (files.length === 0) {
        toast.error('Please select or drop files to upload');
        return;
      }
      payload.projectName = projectName.trim() || files[0].name;
      payload.codeContent = `// Auditing Uploaded Files:\n// ${files.map(f => f.name).join(', ')}`;
    } 
    else if (activeTab === 'github') {
      const gitRegex = /^https?:\/\/(www\.)?github\.com\/[a-zA-Z0-9_-]+\/[a-zA-Z0-9_-]+(\/)?$/;
      if (!repoUrl.trim() || !gitRegex.test(repoUrl.trim())) {
        toast.error('Please enter a valid public GitHub Repository URL (e.g. https://github.com/user/repo)');
        return;
      }
      const repoParts = repoUrl.split('/');
      payload.projectName = projectName.trim() || repoParts[repoParts.length - 1] || 'GitHub Repository';
      payload.codeContent = `// Remote Repository Scan: ${repoUrl}`;
    }

    const reviewId = await addReview(payload);
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
    
    // Simulate upload progress
    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setFiles(prevFiles => [...prevFiles, ...newFiles]);
          toast.success('Files successfully uploaded to scanner sandbox');
          return null;
        }
        return prev + 20;
      });
    }, 150);
  };

  const handleRemoveFile = (indexToRemove) => {
    setFiles(prev => prev.filter((_, idx) => idx !== indexToRemove));
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Page Header */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-white m-0">Review New Project</h2>
        <p className="text-sm text-[#9ca3af] mt-1">Submit your source code or repository to receive AI-driven reviews.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Code Input Area (2/3 width) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Method tabs */}
          <div className="flex border-b border-[#1f1f23] p-1 gap-2 bg-[#0a0a0c]/60 rounded-xl max-w-md">
            <button
              onClick={() => setActiveTab('paste')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                activeTab === 'paste' ? 'bg-[#1f1f23] text-white' : 'text-[#6b7280] hover:text-[#9ca3af]'
              }`}
            >
              <Code size={14} />
              Paste Code
            </button>
            <button
              onClick={() => setActiveTab('upload')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                activeTab === 'upload' ? 'bg-[#1f1f23] text-white' : 'text-[#6b7280] hover:text-[#9ca3af]'
              }`}
            >
              <Upload size={14} />
              Upload Files
            </button>
            <button
              onClick={() => setActiveTab('github')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                activeTab === 'github' ? 'bg-[#1f1f23] text-white' : 'text-[#6b7280] hover:text-[#9ca3af]'
              }`}
            >
              <Github size={14} />
              GitHub Repository
            </button>
          </div>

          {/* Form details */}
          <div className="glass-panel p-6 rounded-2xl border border-[#1f1f23] space-y-6">
            
            {/* Project name input */}
            <div>
              <label className="block text-xs font-semibold text-[#9ca3af] uppercase tracking-wider mb-2" htmlFor="projectName">
                Project Name
              </label>
              <input
                id="projectName"
                type="text"
                placeholder={
                  activeTab === 'paste' ? 'e.g. auth-handler.js' : 
                  activeTab === 'upload' ? 'e.g. my-node-api' : 'e.g. react-tailwind-boilerplate'
                }
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                className="w-full max-w-lg px-4 py-2.5 rounded-xl border border-[#1f1f23] bg-[#0c0c0e]/80 text-white placeholder-[#4b5563] text-sm focus:border-indigo-500/80 focus:ring-1 focus:ring-indigo-500/80 outline-none transition-all"
              />
            </div>

            {/* TAB CONTENT: Pasted Source Code */}
            {activeTab === 'paste' && (
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-[#9ca3af] uppercase tracking-wider mb-1">
                        Language
                      </label>
                      <select
                        value={language}
                        onChange={(e) => setLanguage(e.target.value)}
                        className="px-3 py-1.5 rounded-xl border border-[#1f1f23] bg-[#0c0c0e] text-xs font-semibold text-[#f3f4f6] focus:border-indigo-500 outline-none cursor-pointer"
                      >
                        <option value="javascript">JavaScript</option>
                        <option value="typescript">TypeScript</option>
                        <option value="python">Python</option>
                        <option value="go">Go</option>
                        <option value="html">HTML / CSS</option>
                      </select>
                    </div>
                  </div>
                  
                  <button
                    type="button"
                    onClick={handleLoadDemoSnippet}
                    className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <HelpCircle size={13} />
                    Load Demo Snippet
                  </button>
                </div>

                {/* Monaco Editor Component wrapper */}
                <div className="monaco-editor-wrapper">
                  <Editor
                    height="320px"
                    language={language}
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
                <div className="flex items-center gap-3 mb-2">
                  <label className="block text-xs font-semibold text-[#9ca3af] uppercase tracking-wider">
                    Primary Language
                  </label>
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="px-3 py-1.5 rounded-xl border border-[#1f1f23] bg-[#0c0c0e] text-xs font-semibold text-[#f3f4f6] focus:border-indigo-500 outline-none cursor-pointer"
                  >
                    <option value="javascript">JavaScript</option>
                    <option value="typescript">TypeScript</option>
                    <option value="python">Python</option>
                    <option value="go">Go</option>
                  </select>
                </div>

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
                    accept=".js,.jsx,.ts,.tsx,.py,.go,.zip"
                  />
                  <div className="p-3 rounded-full bg-indigo-500/10 text-indigo-400">
                    <Upload size={24} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">Drag & Drop files or browse</p>
                    <p className="text-xs text-[#9ca3af] mt-1">Supports JS, TS, PY, GO, and ZIP (max 10MB)</p>
                  </div>
                </div>

                {/* Upload Progress Animation */}
                {uploadProgress !== null && (
                  <div className="p-3 rounded-xl border border-[#1f1f23] bg-[#0c0c0e] space-y-2">
                    <div className="flex items-center justify-between text-xs font-semibold text-white">
                      <span>Uploading to audit sandbox...</span>
                      <span>{uploadProgress}%</span>
                    </div>
                    <div className="w-full bg-[#1c1c1f] h-1.5 rounded-full overflow-hidden">
                      <div className="bg-indigo-500 h-full transition-all duration-150" style={{ width: `${uploadProgress}%` }} />
                    </div>
                  </div>
                )}

                {/* File list */}
                {files.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-xs font-semibold text-[#9ca3af] uppercase tracking-wider mt-4">Selected Files</h4>
                    <div className="space-y-1.5 max-h-[200px] overflow-y-auto pr-1">
                      {files.map((file, idx) => (
                        <div key={idx} className="flex items-center justify-between p-2.5 rounded-xl border border-[#1f1f23] bg-[#0c0c0e]/70 text-xs">
                          <div className="flex items-center gap-2 text-white font-medium">
                            <File size={14} className="text-indigo-400" />
                            <span className="truncate max-w-[200px] sm:max-w-[400px]">{file.name}</span>
                            <span className="text-[10px] text-[#6b7280]">({(file.size / 1024).toFixed(1)} KB)</span>
                          </div>
                          <button 
                            onClick={(e) => { e.stopPropagation(); handleRemoveFile(idx); }}
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

            {/* TAB CONTENT: GitHub Integration */}
            {activeTab === 'github' && (
              <div className="space-y-4">
                <div className="flex items-center gap-3 mb-2">
                  <label className="block text-xs font-semibold text-[#9ca3af] uppercase tracking-wider">
                    Primary Language
                  </label>
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="px-3 py-1.5 rounded-xl border border-[#1f1f23] bg-[#0c0c0e] text-xs font-semibold text-[#f3f4f6] focus:border-indigo-500 outline-none cursor-pointer"
                  >
                    <option value="javascript">JavaScript</option>
                    <option value="typescript">TypeScript</option>
                    <option value="python">Python</option>
                    <option value="go">Go</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#9ca3af] uppercase tracking-wider mb-2" htmlFor="repoUrl">
                    Public GitHub Repository URL
                  </label>
                  <div className="relative max-w-lg">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-[#6b7280]">
                      <Github size={16} />
                    </span>
                    <input
                      id="repoUrl"
                      type="text"
                      placeholder="https://github.com/username/repository"
                      value={repoUrl}
                      onChange={(e) => setRepoUrl(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#1f1f23] bg-[#0c0c0e]/80 text-white placeholder-[#4b5563] text-sm focus:border-indigo-500/80 focus:ring-1 focus:ring-indigo-500/80 outline-none transition-all"
                    />
                  </div>
                  <p className="text-[10px] text-[#6b7280] mt-1.5">
                    Make sure the repository is public so PulsarAI's crawlers can fetch the code tree.
                  </p>
                </div>
              </div>
            )}
            
            {/* Primary Action Button */}
            <div className="pt-4 border-t border-[#1f1f23] flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs text-indigo-400 font-semibold uppercase tracking-wider">
                <Zap size={14} className="fill-indigo-500/10" />
                <span>Cost: 10 AI Credits</span>
              </div>
              <button
                onClick={handleRunAnalysis}
                disabled={analyzing}
                className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-600/50 text-white font-semibold text-xs tracking-wider transition-all shadow-md shadow-indigo-600/20 flex items-center gap-1.5 cursor-pointer"
              >
                {analyzing ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Auditing...
                  </>
                ) : (
                  <>
                    <FileCheck size={14} />
                    Run Audit Analysis
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Side Panel: Guidelines & Credit info (1/3 width) */}
        <div className="space-y-6">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider m-0">Scanner Sandbox</h3>
          
          {/* Credit balance display */}
          <div className="glass-panel p-5 rounded-2xl border border-[#1f1f23] flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs font-semibold text-[#9ca3af] uppercase tracking-wider">Account Balance</span>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-black text-white font-mono">{user?.credits}</span>
                <span className="text-xs text-[#6b7280]">credits</span>
              </div>
            </div>
            <div className="p-3 rounded-full bg-indigo-500/10 text-indigo-400">
              <Zap size={20} className="fill-indigo-500/20" />
            </div>
          </div>

          {/* Audit parameters guidelines */}
          <div className="glass-panel p-5 rounded-2xl border border-[#1f1f23] space-y-4">
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider m-0 flex items-center gap-1.5">
              <AlertCircle size={14} className="text-indigo-400" />
              Scan Scope Check
            </h4>
            <ul className="text-xs text-[#9ca3af] space-y-3 pl-4 list-disc leading-relaxed">
              <li>
                <strong className="text-[#f3f4f6]">Vulnerability Audits</strong>: Scans for OWASP Top 10 issues, SQL injections, open secrets, and weak cryptographic functions.
              </li>
              <li>
                <strong className="text-[#f3f4f6]">Performance Audits</strong>: Flags duplicate loop operations, redundant variable copying, synchronous blocking file IO, and memory bottlenecks.
              </li>
              <li>
                <strong className="text-[#f3f4f6]">Refactoring Suggestions</strong>: Automatically compiles optimal before/after comparisons mapping to readable syntax.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
