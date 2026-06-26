"use client";

import React, { useEffect, useState } from 'react';
import { 
  Zap, ChevronRight, Bookmark, Share2, Type, 
  FileText, Clock, ArrowUp, MessageSquare, Download,
  Lightbulb, Info, AlertTriangle, Target, User, Twitter,
  Github, Linkedin
} from 'lucide-react';

export default function ResourceContentPage({ params }: { params: { id: string } }) {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [fontSize, setFontSize] = useState('medium');
  const [isUpvoted, setIsUpvoted] = useState(false);
  const [upvoteCount, setUpvoteCount] = useState(521);
  const [toasts, setToasts] = useState<{ id: number, message: string, type: string }[]>([]);

  useEffect(() => {
    const handleScroll = () => {
      const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = (winScroll / height) * 100;
      setScrollProgress(scrolled);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const showToast = (message: string, type: string = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  };

  const handleUpvote = () => {
    if (isUpvoted) {
      setUpvoteCount(prev => prev - 1);
      setIsUpvoted(false);
    } else {
      setUpvoteCount(prev => prev + 1);
      setIsUpvoted(true);
      showToast('Upvoted!', 'success');
    }
  };

  const handleShare = () => {
    showToast('Link copied to clipboard! 🔗', 'success');
  };

  const toggleFont = () => {
    setFontSize(prev => {
      if (prev === 'medium') return 'large';
      if (prev === 'large') return 'small';
      return 'medium';
    });
  };

  const getFontSizeClass = () => {
    if (fontSize === 'small') return 'text-[15px]';
    if (fontSize === 'large') return 'text-[19px]';
    return 'text-[17px]'; // medium
  };

  const getFontLabel = () => {
    if (fontSize === 'small') return 'aa';
    if (fontSize === 'large') return 'AA';
    return 'Aa';
  };

  return (
    <div className="min-h-screen">
      {/* Toast Container */}
      <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-2">
        {toasts.map(toast => (
          <div key={toast.id} className="toast flex items-center gap-2.5 px-4 py-3 rounded-xl bg-zinc-900 border border-white/10 shadow-2xl">
            {toast.type === 'success' ? (
              <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
              </div>
            ) : (
              <div className="w-6 h-6 rounded-full bg-cyan-500/20 flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-cyan-500"></div>
              </div>
            )}
            <span className="text-sm font-medium">{toast.message}</span>
          </div>
        ))}
      </div>

      {/* Reading Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-[3px] z-[60] bg-transparent">
        <div className="h-full bg-emerald-500 transition-all duration-75" style={{ width: `${scrollProgress}%` }}></div>
      </div>

      {/* NAVBAR */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-[#09090b]/90 backdrop-blur-[12px]">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <a href="/resources" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                <Zap className="w-4 h-4 text-emerald-400" />
              </div>
              <span className="font-semibold text-sm tracking-tight hidden sm:inline">DSA Quest</span>
            </a>
            <div className="hidden md:flex items-center gap-1 text-xs text-zinc-600">
              <ChevronRight className="w-3 h-3" />
              <a href="/resources" className="hover:text-zinc-400 transition-colors">Resources</a>
              <ChevronRight className="w-3 h-3" />
              <span className="text-zinc-400 truncate max-w-[200px]">Dynamic Programming</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => showToast('Bookmark saved! 📌', 'success')} className="p-2 rounded-lg hover:bg-white/5 transition-colors text-zinc-400 hover:text-white" title="Bookmark">
              <Bookmark className="w-4 h-4" />
            </button>
            <button onClick={handleShare} className="p-2 rounded-lg hover:bg-white/5 transition-colors text-zinc-400 hover:text-white" title="Share">
              <Share2 className="w-4 h-4" />
            </button>
            <button onClick={toggleFont} className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg hover:bg-white/5 transition-colors text-zinc-400 hover:text-white text-xs" title="Toggle font size">
              <Type className="w-3.5 h-3.5" />
              <span>{getFontLabel()}</span>
            </button>
          </div>
        </div>
      </nav>

      {/* MAIN LAYOUT */}
      <div className="pt-14 flex max-w-7xl mx-auto">
        {/* LEFT: Table of Contents */}
        <aside className="hidden xl:block w-56 flex-shrink-0 sticky top-14 h-[calc(100vh-56px)] overflow-y-auto py-8 pl-6">
          <div className="text-[10px] font-bold uppercase tracking-widest text-zinc-600 mb-3 px-3">On this page</div>
          <nav className="space-y-0.5 text-[13px]">
            <a href="#what-is-dp" className="toc-link block px-3 py-1.5 text-zinc-500 hover:text-white hover:bg-white/5 rounded-r-md">What is DP?</a>
            <a href="#two-patterns" className="toc-link block px-3 py-1.5 text-zinc-500 hover:text-white hover:bg-white/5 rounded-r-md">Two Core Patterns</a>
            <a href="#memoization" className="toc-link block px-3 py-1.5 text-zinc-500 hover:text-white hover:bg-white/5 rounded-r-md pl-6">Memoization</a>
            <a href="#tabulation" className="toc-link block px-3 py-1.5 text-zinc-500 hover:text-white hover:bg-white/5 rounded-r-md pl-6">Tabulation</a>
            <a href="#state-diagram" className="toc-link block px-3 py-1.5 text-zinc-500 hover:text-white hover:bg-white/5 rounded-r-md">State Transition Diagram</a>
            <a href="#classic-problems" className="toc-link block px-3 py-1.5 text-zinc-500 hover:text-white hover:bg-white/5 rounded-r-md">Classic Problems</a>
            <a href="#complexity-table" className="toc-link block px-3 py-1.5 text-zinc-500 hover:text-white hover:bg-white/5 rounded-r-md">Complexity Cheat Sheet</a>
            <a href="#practice-roadmap" className="toc-link block px-3 py-1.5 text-zinc-500 hover:text-white hover:bg-white/5 rounded-r-md">Practice Roadmap</a>
          </nav>
        </aside>

        {/* CENTER: Article */}
        <main className="flex-1 min-w-0">
          <article className="max-w-3xl mx-auto px-6 py-12">
            {/* Type badge + meta */}
            <div className="flex items-center gap-3 mb-6 flex-wrap">
              <span className="px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 bg-orange-500/10 text-orange-400 border border-orange-500/20">
                <FileText className="w-3 h-3" /> PDF Study Material
              </span>
              <span className="text-[10px] text-zinc-600">•</span>
              <span className="text-xs text-zinc-500 flex items-center gap-1">
                <Clock className="w-3 h-3" /> 15 min read
              </span>
              <span className="text-[10px] text-zinc-600">•</span>
              <span className="text-xs text-zinc-500">June 24, 2026</span>
            </div>

            <h1 className="text-3xl md:text-4xl font-semibold tracking-tight leading-[1.15] mb-5">
              Mastering Dynamic Programming: A Visual Guide
            </h1>

            <p className="text-lg text-zinc-400 leading-relaxed mb-8 max-w-2xl">
              Complete DP cheat sheet covering all major patterns — from Fibonacci to Matrix Chain Multiplication with state transition diagrams.
            </p>

            {/* Author + Actions row */}
            <div className="flex items-center justify-between mb-10 pb-8 border-b border-white/5 flex-wrap gap-4">
              <div className="flex items-center gap-3">
                <img src="https://picsum.photos/seed/pro1/80/80.jpg" className="w-11 h-11 rounded-full object-cover border border-white/10" alt="Author" />
                <div>
                  <div className="text-sm font-medium flex items-center gap-1.5">
                    Priya Sharma
                    <span className="text-[9px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded font-bold">PRO</span>
                  </div>
                  <div className="text-xs text-zinc-500">SDE @ Google • 42 pages • 3.8 MB</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={handleUpvote} 
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs transition-all ${isUpvoted ? 'bg-emerald-500/20 border-emerald-500/30 text-emerald-400' : 'bg-white/5 border-white/5 text-zinc-400 hover:bg-white/10'}`}
                >
                  <ArrowUp className="w-3.5 h-3.5" />
                  <span>{upvoteCount}</span>
                </button>
                <button onClick={() => showToast('Saved to bookmarks! 📌', 'success')} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/5 text-xs text-zinc-400 hover:bg-white/10 transition-all">
                  <Bookmark className="w-3.5 h-3.5" /> Save
                </button>
                <button onClick={handleShare} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/5 text-xs text-zinc-400 hover:bg-white/10 transition-all">
                  <Share2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-10">
              {['dp', 'cheatsheet', 'interview-prep', 'dynamic-programming', 'patterns'].map(tag => (
                <span key={tag} className="px-2 py-1 rounded text-[10px] bg-white/5 text-zinc-400 border border-white/5">#{tag}</span>
              ))}
            </div>

            {/* PDF Download Banner */}
            <div className="flex items-center justify-between p-4 rounded-xl bg-orange-500/5 border border-orange-500/10 mb-12 flex-wrap gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-12 rounded-lg bg-orange-500/10 border border-orange-500/20 flex items-center justify-center flex-shrink-0">
                  <FileText className="w-5 h-5 text-orange-400" />
                </div>
                <div>
                  <div className="text-sm font-medium">Download the full PDF</div>
                  <div className="text-xs text-zinc-500">42 pages • 3.8 MB • Includes all diagrams & code</div>
                </div>
              </div>
              <button onClick={() => showToast('PDF download started! 📄', 'success')} className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-medium hover:bg-orange-500/20 transition-all">
                <Download className="w-3.5 h-3.5" /> Download PDF
              </button>
            </div>

            {/* ARTICLE BODY */}
            <div className={`article-body ${getFontSizeClass()} leading-[1.85] text-zinc-300`}>
              <h2 id="what-is-dp" className="text-2xl font-semibold text-white mt-10 mb-4 border-b border-white/5 pb-2">What is Dynamic Programming?</h2>
              <p className="mb-6">Dynamic Programming (DP) is an optimization technique that solves complex problems by breaking them into <strong className="text-white">overlapping subproblems</strong> and storing their solutions to avoid redundant computation. Think of it as <em className="text-zinc-400 italic">"remembering past work so you don't repeat it."</em></p>
              <p className="mb-6">The key insight is simple: if you've already computed the answer to a subproblem, <strong className="text-white">store it</strong>. The next time you need it, just look it up instead of computing it again.</p>

              <div className="p-5 rounded-xl bg-emerald-500/5 border border-emerald-500/10 flex gap-4 mb-8">
                <Lightbulb className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-emerald-400 mb-1">Core Principle</strong>
                  <p className="text-sm">DP applies when a problem has <strong className="text-white">Overlapping Subproblems</strong> (same subproblems solved multiple times) AND <strong className="text-white">Optimal Substructure</strong> (optimal solution can be built from optimal solutions of subproblems).</p>
                </div>
              </div>

              <h2 id="two-patterns" className="text-2xl font-semibold text-white mt-10 mb-4 border-b border-white/5 pb-2">Two Core Patterns</h2>
              <p className="mb-6">Every DP problem can be solved using one of two approaches. Understanding both is essential because some problems are naturally easier with one vs. the other.</p>

              <h3 id="memoization" className="text-xl font-semibold text-zinc-200 mt-8 mb-3">1. Top-Down (Memoization)</h3>
              <p className="mb-6">Start from the main problem and recursively break it down. <strong className="text-white">Cache every result</strong> before returning. This is usually the more intuitive approach — you write the natural recursive solution first, then add caching.</p>

              <pre className="p-6 rounded-xl bg-white/[0.03] border border-white/5 overflow-x-auto mb-8 text-sm">
                <code className="text-zinc-300 font-mono">
{`# Fibonacci with Memoization
def fib(n, memo={}):
    if n in memo:
        return memo[n]
    if n <= 1:
        return n
    
    memo[n] = fib(n-1, memo) + fib(n-2, memo)
    return memo[n]

print(fib(50))  # Runs instantly!`}
                </code>
              </pre>

              <h3 id="tabulation" className="text-xl font-semibold text-zinc-200 mt-8 mb-3">2. Bottom-Up (Tabulation)</h3>
              <p className="mb-6">Start from the smallest subproblems and build up to the final answer. Fill a table iteratively. This is often more efficient because it eliminates recursion overhead and is easier to space-optimize.</p>

              <pre className="p-6 rounded-xl bg-white/[0.03] border border-white/5 overflow-x-auto mb-8 text-sm">
                <code className="text-zinc-300 font-mono">
{`# Fibonacci with Tabulation
def fib(n):
    if n <= 1:
        return n
    
    dp = [0] * (n + 1)
    dp[1] = 1
    
    for i in range(2, n + 1):
        dp[i] = dp[i-1] + dp[i-2]
    
    return dp[n]

print(fib(50))  # Also instant, O(n) space`}
                </code>
              </pre>

              <div className="p-5 rounded-xl bg-cyan-500/5 border border-cyan-500/10 flex gap-4 mb-8">
                <Info className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-cyan-400 mb-1">Space Optimization</strong>
                  <p className="text-sm">For Fibonacci, notice that <code className="px-1.5 py-0.5 rounded bg-white/5 text-cyan-400 font-mono text-xs">dp[i]</code> only depends on <code className="px-1.5 py-0.5 rounded bg-white/5 text-cyan-400 font-mono text-xs">dp[i-1]</code> and <code className="px-1.5 py-0.5 rounded bg-white/5 text-cyan-400 font-mono text-xs">dp[i-2]</code>. You don't need the full array — just two variables. This reduces space from <strong className="text-white">O(n)</strong> to <strong className="text-white">O(1)</strong>.</p>
                </div>
              </div>

              <h2 id="state-diagram" className="text-2xl font-semibold text-white mt-10 mb-4 border-b border-white/5 pb-2">State Transition Diagram</h2>
              <p className="mb-6">Understanding <strong className="text-white">state transitions</strong> is the single most important skill in DP. A "state" is a set of variables that completely defines a subproblem. The transition tells you how to move from one state to the next.</p>

              <div className="p-8 rounded-2xl bg-emerald-500/[0.02] border border-emerald-500/10 text-center mb-8">
                <svg viewBox="0 0 700 340" xmlns="http://www.w3.org/2000/svg" className="mx-auto max-w-[600px] w-full h-auto">
                  <text x="350" y="28" textAnchor="middle" fill="#a1a1aa" fontSize="12" fontWeight="600" letterSpacing="0.1em">FIBONACCI STATE TRANSITION</text>
                  <g>
                    <rect x="60" y="130" width="120" height="50" rx="12" fill="rgba(16,185,129,0.08)" stroke="rgba(16,185,129,0.25)" strokeWidth="1.5"/>
                    <text x="120" y="160" textAnchor="middle" fill="#34d399" fontSize="14" fontWeight="500">fib(n-2)</text>
                    <rect x="290" y="130" width="120" height="50" rx="12" fill="rgba(16,185,129,0.08)" stroke="rgba(16,185,129,0.25)" strokeWidth="1.5"/>
                    <text x="350" y="160" textAnchor="middle" fill="#34d399" fontSize="14" fontWeight="500">fib(n-1)</text>
                    <rect x="520" y="130" width="120" height="50" rx="12" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5"/>
                    <text x="580" y="160" textAnchor="middle" fill="#ffffff" fontSize="14" fontWeight="600">fib(n)</text>
                  </g>
                  <defs>
                    <marker id="arrowhead" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
                      <polygon points="0 0, 8 3, 0 6" fill="#10b981"/>
                    </marker>
                  </defs>
                  <line x1="180" y1="155" x2="285" y2="155" stroke="#10b981" strokeWidth="1.5" markerEnd="url(#arrowhead)" strokeDasharray="6,3"/>
                  <line x1="180" y1="145" x2="515" y2="145" stroke="#10b981" strokeWidth="1.5" markerEnd="url(#arrowhead)" opacity="0.5"/>
                  <line x1="410" y1="155" x2="515" y2="155" stroke="#10b981" strokeWidth="1.5" markerEnd="url(#arrowhead)"/>
                  <text x="232" y="148" textAnchor="middle" fill="#71717a" fontSize="10">store</text>
                  <text x="462" y="148" textAnchor="middle" fill="#71717a" fontSize="10">store</text>
                  <text x="468" y="140" textAnchor="middle" fill="#10b981" fontSize="18" fontWeight="700">+</text>
                  <rect x="200" y="250" width="300" height="44" rx="10" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.06)" strokeWidth="1"/>
                  <text x="350" y="277" textAnchor="middle" fill="#d4d4d8" fontSize="13">dp[n] = dp[n-1] + dp[n-2]</text>
                  <line x1="350" y1="180" x2="350" y2="248" stroke="rgba(255,255,255,0.06)" strokeWidth="1" strokeDasharray="4,4"/>
                </svg>
              </div>

              <h2 id="classic-problems" className="text-2xl font-semibold text-white mt-10 mb-4 border-b border-white/5 pb-2">Classic DP Problems</h2>
              
              <h3 id="fibonacci" className="text-xl font-semibold text-zinc-200 mt-8 mb-3">Fibonacci Sequence</h3>
              <p className="mb-6">The simplest DP problem. Each number is the sum of the two before it. Despite its simplicity, it perfectly demonstrates why memoization matters — without it, the naive recursive solution has <strong className="text-white">O(2ⁿ)</strong> time complexity.</p>

              <div className="overflow-x-auto mb-8">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr>
                      <th className="bg-white/5 p-3 border border-white/10 text-white font-medium">Approach</th>
                      <th className="bg-white/5 p-3 border border-white/10 text-white font-medium">Time</th>
                      <th className="bg-white/5 p-3 border border-white/10 text-white font-medium">Space</th>
                      <th className="bg-white/5 p-3 border border-white/10 text-white font-medium">When to Use</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="p-3 border border-white/10">Naive Recursion</td>
                      <td className="p-3 border border-white/10">O(2ⁿ)</td>
                      <td className="p-3 border border-white/10">O(n)</td>
                      <td className="p-3 border border-white/10">Never for large n</td>
                    </tr>
                    <tr>
                      <td className="p-3 border border-white/10">Memoization</td>
                      <td className="p-3 border border-white/10">O(n)</td>
                      <td className="p-3 border border-white/10">O(n)</td>
                      <td className="p-3 border border-white/10">When you think recursively</td>
                    </tr>
                    <tr>
                      <td className="p-3 border border-white/10">Tabulation</td>
                      <td className="p-3 border border-white/10">O(n)</td>
                      <td className="p-3 border border-white/10">O(n)</td>
                      <td className="p-3 border border-white/10">When you want iterative</td>
                    </tr>
                    <tr>
                      <td className="p-3 border border-white/10">Space-Optimized</td>
                      <td className="p-3 border border-white/10">O(n)</td>
                      <td className="p-3 border border-white/10 font-bold text-white">O(1)</td>
                      <td className="p-3 border border-white/10 font-bold text-white">Always preferred</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <h2 id="complexity-table" className="text-2xl font-semibold text-white mt-10 mb-4 border-b border-white/5 pb-2">Complexity Cheat Sheet</h2>
              <div className="overflow-x-auto mb-8">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr>
                      <th className="bg-white/5 p-3 border border-white/10 text-white font-medium">Problem</th>
                      <th className="bg-white/5 p-3 border border-white/10 text-white font-medium">State</th>
                      <th className="bg-white/5 p-3 border border-white/10 text-white font-medium">Transition</th>
                      <th className="bg-white/5 p-3 border border-white/10 text-white font-medium">Time</th>
                      <th className="bg-white/5 p-3 border border-white/10 text-white font-medium">Space</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="p-3 border border-white/10">Fibonacci</td>
                      <td className="p-3 border border-white/10"><code className="px-1.5 py-0.5 rounded bg-white/5 text-emerald-400 font-mono text-xs">dp[n]</code></td>
                      <td className="p-3 border border-white/10"><code className="px-1.5 py-0.5 rounded bg-white/5 text-emerald-400 font-mono text-xs">dp[n-1] + dp[n-2]</code></td>
                      <td className="p-3 border border-white/10">O(n)</td>
                      <td className="p-3 border border-white/10">O(1)</td>
                    </tr>
                    <tr>
                      <td className="p-3 border border-white/10">0/1 Knapsack</td>
                      <td className="p-3 border border-white/10"><code className="px-1.5 py-0.5 rounded bg-white/5 text-emerald-400 font-mono text-xs">dp[i][w]</code></td>
                      <td className="p-3 border border-white/10"><code className="px-1.5 py-0.5 rounded bg-white/5 text-emerald-400 font-mono text-xs">max(skip, take)</code></td>
                      <td className="p-3 border border-white/10">O(nW)</td>
                      <td className="p-3 border border-white/10">O(nW)</td>
                    </tr>
                    <tr>
                      <td className="p-3 border border-white/10">LCS</td>
                      <td className="p-3 border border-white/10"><code className="px-1.5 py-0.5 rounded bg-white/5 text-emerald-400 font-mono text-xs">dp[i][j]</code></td>
                      <td className="p-3 border border-white/10"><code className="px-1.5 py-0.5 rounded bg-white/5 text-emerald-400 font-mono text-xs">match ? +1 : max(..)</code></td>
                      <td className="p-3 border border-white/10">O(mn)</td>
                      <td className="p-3 border border-white/10">O(mn)</td>
                    </tr>
                    <tr>
                      <td className="p-3 border border-white/10">LIS</td>
                      <td className="p-3 border border-white/10"><code className="px-1.5 py-0.5 rounded bg-white/5 text-emerald-400 font-mono text-xs">dp[i]</code></td>
                      <td className="p-3 border border-white/10"><code className="px-1.5 py-0.5 rounded bg-white/5 text-emerald-400 font-mono text-xs">max(dp[j]+1)</code></td>
                      <td className="p-3 border border-white/10">O(n²)</td>
                      <td className="p-3 border border-white/10">O(n)</td>
                    </tr>
                    <tr>
                      <td className="p-3 border border-white/10">Matrix Chain</td>
                      <td className="p-3 border border-white/10"><code className="px-1.5 py-0.5 rounded bg-white/5 text-emerald-400 font-mono text-xs">dp[i][j]</code></td>
                      <td className="p-3 border border-white/10"><code className="px-1.5 py-0.5 rounded bg-white/5 text-emerald-400 font-mono text-xs">min over k</code></td>
                      <td className="p-3 border border-white/10">O(n³)</td>
                      <td className="p-3 border border-white/10">O(n²)</td>
                    </tr>
                    <tr>
                      <td className="p-3 border border-white/10">Coin Change</td>
                      <td className="p-3 border border-white/10"><code className="px-1.5 py-0.5 rounded bg-white/5 text-emerald-400 font-mono text-xs">dp[amount]</code></td>
                      <td className="p-3 border border-white/10"><code className="px-1.5 py-0.5 rounded bg-white/5 text-emerald-400 font-mono text-xs">min over coins</code></td>
                      <td className="p-3 border border-white/10">O(nW)</td>
                      <td className="p-3 border border-white/10">O(W)</td>
                    </tr>
                    <tr>
                      <td className="p-3 border border-white/10">Edit Distance</td>
                      <td className="p-3 border border-white/10"><code className="px-1.5 py-0.5 rounded bg-white/5 text-emerald-400 font-mono text-xs">dp[i][j]</code></td>
                      <td className="p-3 border border-white/10"><code className="px-1.5 py-0.5 rounded bg-white/5 text-emerald-400 font-mono text-xs">min(insert,del,replace)</code></td>
                      <td className="p-3 border border-white/10">O(mn)</td>
                      <td className="p-3 border border-white/10">O(mn)</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <h2 id="practice-roadmap" className="text-2xl font-semibold text-white mt-10 mb-4 border-b border-white/5 pb-2">Practice Roadmap</h2>
              <ol className="list-decimal pl-5 mb-8 space-y-2">
                <li><strong className="text-white">Week 1-2: Linear DP</strong> — Fibonacci, Climbing Stairs, House Robber, Coin Change</li>
                <li><strong className="text-white">Week 3-4: 2D DP</strong> — 0/1 Knapsack, LCS, Edit Distance, Grid Paths</li>
                <li><strong className="text-white">Week 5-6: String DP</strong> — Palindrome Subsequence, Word Break, Regex Matching</li>
                <li><strong className="text-white">Week 7-8: Advanced</strong> — Matrix Chain MCM, Burst Balloons, DP on Trees, DP with Bitmask</li>
              </ol>

              <div className="p-5 rounded-xl bg-emerald-500/5 border border-emerald-500/10 flex gap-4 mb-8">
                <Target className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-emerald-400 mb-1">Pro Tip</strong>
                  <p className="text-sm">For every DP problem, follow this ritual: (1) Identify the state, (2) Write the recurrence, (3) Identify base cases, (4) Decide top-down vs bottom-up, (5) Code it. <strong className="text-white">Never memorize solutions — memorize the process.</strong></p>
                </div>
              </div>

              <hr className="border-t border-white/5 my-10" />
              <p className="italic text-zinc-500 text-sm">This article is part of the DSA Quest Expert Knowledge Hub — curated by verified industry professionals. Download the full 42-page PDF for all diagrams, code, and practice problems.</p>
            </div>

            {/* Author Card */}
            <div className="mt-14 p-6 rounded-2xl glass flex items-start gap-4 flex-wrap">
              <img src="https://picsum.photos/seed/pro1/96/96.jpg" className="w-14 h-14 rounded-full object-cover border border-white/10" alt="Author" />
              <div className="flex-1 min-w-[200px]">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-medium">Priya Sharma</span>
                  <span className="text-[9px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded font-bold">PRO</span>
                </div>
                <p className="text-xs text-zinc-500 mb-3">Software Engineer at Google • 5+ years of interviewing experience • Passionate about making DSA accessible to everyone</p>
                <div className="flex items-center gap-3">
                  <button className="text-xs text-emerald-400 hover:text-emerald-300 transition-colors flex items-center gap-1">
                    <Twitter className="w-3 h-3" /> Follow
                  </button>
                  <span className="text-zinc-700">•</span>
                  <span className="text-xs text-zinc-500">47 resources published</span>
                </div>
              </div>
            </div>

            {/* Engagement Bar */}
            <div className="mt-10 flex items-center justify-between py-6 border-t border-b border-white/5 flex-wrap gap-4">
              <div className="flex items-center gap-3">
                <button 
                  onClick={handleUpvote} 
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-sm transition-all ${isUpvoted ? 'bg-emerald-500/20 border-emerald-500/30 text-emerald-400' : 'bg-white/5 border-white/5 text-zinc-400 hover:bg-white/10'}`}
                >
                  <ArrowUp className="w-4 h-4" />
                  <span>{upvoteCount}</span>
                  <span className="hidden sm:inline">Upvotes</span>
                </button>
                <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/5 text-sm text-zinc-400 hover:bg-white/10 transition-all">
                  <MessageSquare className="w-4 h-4" />
                  89 Comments
                </button>
              </div>
              <div className="flex items-center gap-3">
                <button onClick={() => showToast('Saved to bookmarks! 📌', 'success')} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/5 text-sm text-zinc-400 hover:bg-white/10 transition-all">
                  <Bookmark className="w-4 h-4" /> Save
                </button>
                <button onClick={handleShare} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/5 text-sm text-zinc-400 hover:bg-white/10 transition-all">
                  <Share2 className="w-4 h-4" /> Share
                </button>
              </div>
            </div>

            {/* Comments Section */}
            <div className="mt-10">
              <h3 className="text-lg font-medium mb-6">Discussion (89)</h3>
              <div className="flex items-start gap-3 mb-8">
                <div className="w-9 h-9 rounded-full bg-zinc-800 flex items-center justify-center flex-shrink-0">
                  <User className="w-4 h-4 text-zinc-500" />
                </div>
                <div className="flex-1">
                  <textarea rows={3} placeholder="Share your thoughts..." className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/10 text-sm text-zinc-300 placeholder:text-zinc-600 outline-none focus:border-emerald-500/30 transition-colors resize-none leading-relaxed"></textarea>
                  <div className="flex justify-end mt-2">
                    <button onClick={() => showToast('Comment posted! 💬', 'success')} className="px-4 py-1.5 rounded-lg bg-white text-zinc-900 text-xs font-medium hover:bg-zinc-200 transition-all">Post Comment</button>
                  </div>
                </div>
              </div>

              {/* Sample comments */}
              <div className="space-y-6">
                <div className="flex items-start gap-3">
                  <img src="https://picsum.photos/seed/commenter1/40/40.jpg" className="w-9 h-9 rounded-full object-cover flex-shrink-0" alt="commenter" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium">Arjun M.</span>
                      <span className="text-[10px] text-zinc-600">3h ago</span>
                    </div>
                    <p className="text-sm text-zinc-400 leading-relaxed">The state transition diagram is exactly what I needed. I've been struggling to visualize how DP states connect — this makes it click. Any chance you could do one for Matrix Chain Multiplication?</p>
                    <div className="flex items-center gap-3 mt-2">
                      <button className="text-[10px] text-zinc-500 hover:text-zinc-300 transition-colors flex items-center gap-1"><ArrowUp className="w-3 h-3" />24</button>
                      <button className="text-[10px] text-zinc-500 hover:text-zinc-300 transition-colors">Reply</button>
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <img src="https://picsum.photos/seed/commenter2/40/40.jpg" className="w-9 h-9 rounded-full object-cover flex-shrink-0" alt="commenter" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium">Sneha R.</span>
                      <span className="text-[10px] text-zinc-600">5h ago</span>
                    </div>
                    <p className="text-sm text-zinc-400 leading-relaxed">Downloaded the PDF — the practice roadmap at the end is gold. Week 3-4 is exactly where I'm stuck. Starting the 2D DP section today 🚀</p>
                    <div className="flex items-center gap-3 mt-2">
                      <button className="text-[10px] text-zinc-500 hover:text-zinc-300 transition-colors flex items-center gap-1"><ArrowUp className="w-3 h-3" />18</button>
                      <button className="text-[10px] text-zinc-500 hover:text-zinc-300 transition-colors">Reply</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </article>
        </main>

        {/* RIGHT: Recommendations */}
        <aside className="hidden lg:block w-72 flex-shrink-0 sticky top-14 h-[calc(100vh-56px)] overflow-y-auto py-8 pr-6">
          <div className="glass rounded-xl p-4 mb-5">
            <div className="text-[10px] font-bold uppercase tracking-widest text-zinc-600 mb-3">Resource Info</div>
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs text-zinc-500">Type</span>
                <span className="text-xs text-orange-400 font-medium">PDF + Article</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-zinc-500">Pages</span>
                <span className="text-xs text-zinc-300">42</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-zinc-500">File Size</span>
                <span className="text-xs text-zinc-300">3.8 MB</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-zinc-500">Read Time</span>
                <span className="text-xs text-zinc-300">15 min</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-zinc-500">Published</span>
                <span className="text-xs text-zinc-300">Jun 24, 2026</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-zinc-500">Views</span>
                <span className="text-xs text-zinc-300">3,247</span>
              </div>
            </div>
          </div>

          <div className="mb-5">
            <div className="text-[10px] font-bold uppercase tracking-widest text-zinc-600 mb-3 px-1">Related Resources</div>
            <div className="space-y-3">
              <a href="#" className="rec-card block p-3 rounded-xl glass">
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-1.5 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Blog</span>
                  <span className="text-[9px] text-zinc-600">8 min read</span>
                </div>
                <h4 className="text-xs font-medium leading-snug mb-1.5 line-clamp-2">Why Graph Problems Terrify Beginners (And Shouldn't)</h4>
                <div className="flex items-center gap-1.5 text-[10px] text-zinc-500">
                  <ArrowUp className="w-3 h-3" />178
                  <span className="text-zinc-700">•</span>
                  <span>Ankit G.</span>
                </div>
              </a>

              <a href="#" className="rec-card block p-3 rounded-xl glass">
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-1.5 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider bg-orange-500/10 text-orange-400 border border-orange-500/20">PDF</span>
                  <span className="text-[9px] text-zinc-600">78 pages</span>
                </div>
                <h4 className="text-xs font-medium leading-snug mb-1.5 line-clamp-2">System Design Primer: Distributed Systems Notes</h4>
                <div className="flex items-center gap-1.5 text-[10px] text-zinc-500">
                  <ArrowUp className="w-3 h-3" />445
                  <span className="text-zinc-700">•</span>
                  <span>Rahul V.</span>
                </div>
              </a>

              <a href="#" className="rec-card block p-3 rounded-xl glass">
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-1.5 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider bg-purple-500/10 text-purple-400 border border-purple-500/20">Image</span>
                  <span className="text-[9px] text-zinc-600">Flowchart</span>
                </div>
                <h4 className="text-xs font-medium leading-snug mb-1.5 line-clamp-2">Sorting Algorithms Comparison Chart</h4>
                <div className="flex items-center gap-1.5 text-[10px] text-zinc-500">
                  <ArrowUp className="w-3 h-3" />334
                  <span className="text-zinc-700">•</span>
                  <span>Meera P.</span>
                </div>
              </a>

              <a href="#" className="rec-card block p-3 rounded-xl glass">
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-1.5 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Blog</span>
                  <span className="text-[9px] text-zinc-600">12 min read</span>
                </div>
                <h4 className="text-xs font-medium leading-snug mb-1.5 line-clamp-2">How I Cracked Google SDE Interview: Real Experience</h4>
                <div className="flex items-center gap-1.5 text-[10px] text-zinc-500">
                  <ArrowUp className="w-3 h-3" />891
                  <span className="text-zinc-700">•</span>
                  <span>Sarah C.</span>
                </div>
              </a>

              <a href="#" className="rec-card block p-3 rounded-xl glass">
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-1.5 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">Link</span>
                  <span className="text-[9px] text-zinc-600">neetcode.io</span>
                </div>
                <h4 className="text-xs font-medium leading-snug mb-1.5 line-clamp-2">NeetCode 150 — The Ultimate Blind 75 Expansion</h4>
                <div className="flex items-center gap-1.5 text-[10px] text-zinc-500">
                  <ArrowUp className="w-3 h-3" />198
                  <span className="text-zinc-700">•</span>
                  <span>Ankit G.</span>
                </div>
              </a>
            </div>
          </div>

          {/* Tags */}
          <div>
            <div className="text-[10px] font-bold uppercase tracking-widest text-zinc-600 mb-3 px-1">Tags</div>
            <div className="flex flex-wrap gap-1.5">
              {['dp', 'cheatsheet', 'interview-prep', 'dynamic-programming', 'patterns', 'knapsack', 'lcs', 'fibonacci'].map(tag => (
                <a href="#" key={tag} className="px-2 py-1 rounded text-[10px] bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10 transition-colors">#{tag}</a>
              ))}
            </div>
          </div>
        </aside>
      </div>

      {/* FOOTER */}
      <footer className="border-t border-white/5 py-8 px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-zinc-800 flex items-center justify-center">
              <Zap className="w-3 h-3 text-emerald-400" />
            </div>
            <span className="text-[10px] text-zinc-600">© 2025 DSA Quest. Built for students, backed by pros.</span>
          </div>
          <div className="flex items-center gap-4">
            <a href="#" className="text-zinc-600 hover:text-zinc-400 transition-colors"><Twitter className="w-4 h-4" /></a>
            <a href="#" className="text-zinc-600 hover:text-zinc-400 transition-colors"><Github className="w-4 h-4" /></a>
            <a href="#" className="text-zinc-600 hover:text-zinc-400 transition-colors"><Linkedin className="w-4 h-4" /></a>
          </div>
        </div>
      </footer>
    </div>
  );
}
