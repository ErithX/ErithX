"use client";

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { 
  Sparkles, 
  Send, 
  Save, 
  RefreshCw, 
  CheckCircle2, 
  AlertCircle, 
  ExternalLink, 
  Mail, 
  Code2, 
  User, 
  Clock, 
  Edit3, 
  Eye, 
  X, 
  History, 
  RotateCcw 
} from 'lucide-react';
import AdminSidebar from '@/components/admin/AdminSidebar';

interface ReviewData {
  id: string;
  generatedText: string;
  targetsSet: string;
  hiddenSummary?: string;
  modelUsed?: string;
  promptTokensUsed?: number;
  royFactor: number;
  adminNote?: string;
  emailSent: boolean;
  emailSentAt?: string;
  createdAt: string;
}

interface ReviewUser {
  userId: string;
  email: string;
  fullName: string;
  avatarUrl: string | null;
  mentorReviewEnabled: boolean;
  platforms: {
    leetcode?: { handle: string; statsSummary?: any };
    codeforces?: { handle: string; statsSummary?: any };
    github?: { handle: string; statsSummary?: any };
  };
  otherUrls: string[];
  pendingAdminNote: string;
  totalReviewsCount: number;
  activeRoyFactor: number;
  reviews: ReviewData[];
  latestReview: ReviewData | null;
}

export default function AdminReviewsStudioPage() {
  const [users, setUsers] = useState<ReviewUser[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [selectedReviewIndex, setSelectedReviewIndex] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Workspace state
  const [adminNoteInput, setAdminNoteInput] = useState('');
  const [isSavingNote, setIsSavingNote] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [isSavingEdit, setIsSavingEdit] = useState(false);
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Editable review state
  const [editableReviewText, setEditableReviewText] = useState('');
  const [editableTargets, setEditableTargets] = useState('');
  const [showEmailPreviewModal, setShowEmailPreviewModal] = useState(false);

  const getTeaserSnippet = (text: string) => {
    const clean = text.replace(/^#+\s.*$/gm, '').replace(/\*\*/g, '').trim();
    const sentences = clean.match(/[^.!?]+[.!?]+(?:\s|$)/g) || [];
    let snippet = '';
    if (sentences.length > 0) {
      for (let i = 0; i < Math.min(3, sentences.length); i++) {
        const candidate = (snippet ? snippet + ' ' : '') + sentences[i].trim();
        if (candidate.length > 360 && snippet.length > 100) break;
        snippet = candidate;
      }
    }
    if (!snippet || snippet.length < 40) {
      snippet = clean.substring(0, 260).trim();
      if (clean.length > 260) snippet += '...';
    }
    return snippet;
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 4000);
  };

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/reviews');
      if (!res.ok) {
        if (res.status === 403) {
          setError('Access Denied: Superadmin privileges required.');
        } else {
          setError('Failed to fetch reviews pipeline users.');
        }
        setLoading(false);
        return;
      }
      const data = await res.json();
      setUsers(data.users || []);
      if (data.users && data.users.length > 0) {
        const target = selectedUserId 
          ? data.users.find((u: ReviewUser) => u.userId === selectedUserId) || data.users[0]
          : data.users[0];
        selectUser(target);
      }
    } catch (e: any) {
      setError(e.message || 'Network error');
    } finally {
      setLoading(false);
    }
  };

  const selectUser = (user: ReviewUser) => {
    setSelectedUserId(user.userId);
    setSelectedReviewIndex(0);
    setAdminNoteInput(user.pendingAdminNote || '');
    const currentRev = user.reviews?.[0] || user.latestReview;
    if (currentRev) {
      setEditableReviewText(currentRev.generatedText || '');
      setEditableTargets(currentRev.targetsSet || '');
    } else {
      setEditableReviewText('');
      setEditableTargets('');
    }
  };

  const handleSelectHistoryReview = (index: number) => {
    setSelectedReviewIndex(index);
    const targetRev = selectedUser?.reviews?.[index];
    if (targetRev) {
      setEditableReviewText(targetRev.generatedText || '');
      setEditableTargets(targetRev.targetsSet || '');
    }
  };

  const selectedUser = users.find(u => u.userId === selectedUserId);
  const activeReview = selectedUser?.reviews?.[selectedReviewIndex] || selectedUser?.latestReview;

  // Clean, Vercel-style Roy Factor Badge (no verbose meaning text)
  const getRoyFactorBadge = (factor: number) => {
    if (factor === 0) {
      return { label: 'RF 0', color: 'text-zinc-300 border-zinc-750 bg-zinc-900' };
    }
    if (factor === 1) {
      return { label: 'RF 1', color: 'text-amber-300 border-amber-500/30 bg-amber-500/10' };
    }
    return { label: `RF ${factor}`, color: 'text-rose-300 border-rose-500/30 bg-rose-500/10' };
  };

  // Global Analytics: Total generated reviews sum across all users
  const globalStats = useMemo(() => {
    const totalGeneratedReviews = users.reduce((acc, u) => acc + (u.totalReviewsCount || (u.latestReview ? 1 : 0)), 0);
    const totalConnectedUsers = users.length;
    const totalEmailsSent = users.reduce((acc, u) => {
      const sentCount = u.reviews ? u.reviews.filter(r => r.emailSent).length : (u.latestReview?.emailSent ? 1 : 0);
      return acc + sentCount;
    }, 0);
    const totalDrafts = Math.max(0, totalGeneratedReviews - totalEmailsSent);

    return {
      totalGeneratedReviews,
      totalConnectedUsers,
      totalEmailsSent,
      totalDrafts
    };
  }, [users]);

  // Save Admin Note
  const handleSaveAdminNote = async () => {
    if (!selectedUserId) return;
    setIsSavingNote(true);
    try {
      const res = await fetch('/api/admin/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: selectedUserId,
          pendingAdminNote: adminNoteInput
        })
      });
      if (res.ok) {
        showToast('Admin note saved');
        setUsers(prev => prev.map(u => u.userId === selectedUserId ? { ...u, pendingAdminNote: adminNoteInput } : u));
      } else {
        showToast('Failed to save note', 'error');
      }
    } catch {
      showToast('Network error while saving note', 'error');
    } finally {
      setIsSavingNote(false);
    }
  };

  // Generate / Regenerate Review (Safe Dry Run)
  const handleGenerateReview = async () => {
    if (!selectedUserId) return;
    setIsGenerating(true);
    try {
      const res = await fetch('/api/admin/reviews/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: selectedUserId,
          adminNote: adminNoteInput,
          sendEmail: false
        })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        showToast('Review generated');
        setEditableReviewText(data.review.generatedText);
        setEditableTargets(data.review.targetsSet);
        setSelectedReviewIndex(0);
        await fetchUsers();
      } else {
        showToast(data.error || 'Generation failed', 'error');
      }
    } catch (e: any) {
      showToast(e.message || 'Generation failed', 'error');
    } finally {
      setIsGenerating(false);
    }
  };

  // Save manual edits to the currently selected review
  const handleSaveReviewEdit = async () => {
    if (!activeReview?.id) return;
    setIsSavingEdit(true);
    try {
      const res = await fetch('/api/admin/reviews', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reviewId: activeReview.id,
          generatedText: editableReviewText,
          targetsSet: editableTargets
        })
      });
      if (res.ok) {
        showToast('Changes saved');
        setUsers(prev => prev.map(u => {
          if (u.userId === selectedUserId) {
            const updatedReviews = (u.reviews || []).map(r => 
              r.id === activeReview.id 
                ? { ...r, generatedText: editableReviewText, targetsSet: editableTargets } 
                : r
            );
            return {
              ...u,
              reviews: updatedReviews,
              latestReview: updatedReviews[0] || null
            };
          }
          return u;
        }));
      } else {
        showToast('Failed to save edits', 'error');
      }
    } catch {
      showToast('Error saving edits', 'error');
    } finally {
      setIsSavingEdit(false);
    }
  };

  // Dispatch email to user
  const handleSendEmail = async () => {
    if (!activeReview?.id || !selectedUser) return;
    const confirmSend = window.confirm(
      `Send this review to ${selectedUser.fullName} (${selectedUser.email})?`
    );
    if (!confirmSend) return;

    setIsSendingEmail(true);
    try {
      const res = await fetch('/api/admin/reviews/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reviewId: activeReview.id,
          generatedText: editableReviewText,
          targetsSet: editableTargets
        })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast(`Email delivered to ${selectedUser.email}`);
        setUsers(prev => prev.map(u => {
          if (u.userId === selectedUserId) {
            const updatedReviews = (u.reviews || []).map(r => 
              r.id === activeReview.id 
                ? { 
                    ...r, 
                    generatedText: editableReviewText,
                    targetsSet: editableTargets,
                    emailSent: true, 
                    emailSentAt: new Date().toISOString() 
                  } 
                : r
            );
            return {
              ...u,
              reviews: updatedReviews,
              latestReview: updatedReviews[0] || null
            };
          }
          return u;
        }));
      } else {
        showToast(data.error || 'Failed to send email', 'error');
      }
    } catch (e: any) {
      showToast(e.message || 'Error sending email', 'error');
    } finally {
      setIsSendingEmail(false);
    }
  };

  if (loading && users.length === 0) {
    return (
      <div className="min-h-screen bg-[#09090b] text-zinc-400 flex flex-col items-center justify-center gap-3">
        <RefreshCw className="w-5 h-5 animate-spin text-zinc-400" />
        <p className="text-xs font-mono text-zinc-500">Loading Review Studio...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#09090b] text-white flex items-center justify-center p-6">
        <div className="max-w-md p-6 rounded-xl bg-zinc-950 border border-zinc-800 text-center">
          <AlertCircle className="w-8 h-8 text-rose-400 mx-auto mb-3" />
          <h2 className="text-sm font-semibold text-white mb-1">Access Blocked</h2>
          <p className="text-xs text-zinc-400">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#09090b] text-white selection:bg-zinc-800 selection:text-white font-sans flex flex-col">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-[100] flex items-center gap-2 px-3.5 py-2.5 rounded-lg shadow-2xl border border-zinc-800 bg-zinc-950 text-xs font-medium animate-in fade-in slide-in-from-bottom-3 text-zinc-200">
          {toastMessage.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <AlertCircle className="w-4 h-4 text-rose-400" />}
          {toastMessage.text}
        </div>
      )}

      {/* Clean Top Header Bar */}
      <header className="border-b border-zinc-800/80 bg-[#09090b]/80 backdrop-blur-xl sticky top-0 z-30 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
          <span className="text-sm font-semibold tracking-tight text-white">ErithX Admin</span>
          <span className="text-zinc-600 font-mono text-xs">/</span>
          <span className="text-xs text-zinc-400 font-medium">Review Studio</span>
        </div>
        <button
          onClick={fetchUsers}
          className="text-xs text-zinc-400 hover:text-white flex items-center gap-1.5 transition-colors"
          title="Refresh"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-zinc-300' : ''}`} />
          <span>Refresh</span>
        </button>
      </header>

      {/* Main Split Layout: Sidebar + Workspace */}
      <div className="flex flex-1">
        <AdminSidebar activeTab="reviews" />

        <main className="flex-1 p-6 overflow-y-auto max-w-7xl">
          {/* Global Analytics Metric Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
            <div className="p-3.5 rounded-lg border border-zinc-800/80 bg-zinc-950/40">
              <span className="text-[11px] text-zinc-500 font-medium block">Total Reviews Generated</span>
              <span className="text-xl font-bold text-white tracking-tight">{globalStats.totalGeneratedReviews}</span>
            </div>
            <div className="p-3.5 rounded-lg border border-zinc-800/80 bg-zinc-950/40">
              <span className="text-[11px] text-zinc-500 font-medium block">Connected Coders</span>
              <span className="text-xl font-bold text-white tracking-tight">{globalStats.totalConnectedUsers}</span>
            </div>
            <div className="p-3.5 rounded-lg border border-zinc-800/80 bg-zinc-950/40">
              <span className="text-[11px] text-zinc-500 font-medium block">Delivered to Inbox</span>
              <span className="text-xl font-bold text-white tracking-tight">{globalStats.totalEmailsSent}</span>
            </div>
            <div className="p-3.5 rounded-lg border border-zinc-800/80 bg-zinc-950/40">
              <span className="text-[11px] text-zinc-500 font-medium block">Unsent Drafts</span>
              <span className="text-xl font-bold text-white tracking-tight">{globalStats.totalDrafts}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* ================= LEFT COLUMN: USERS QUEUE ================= */}
            <section className="lg:col-span-4 bg-zinc-950/40 border border-zinc-800/80 rounded-xl p-4 overflow-hidden">
              <div className="flex items-center justify-between mb-3 px-1">
                <div>
                  <h2 className="text-xs font-semibold text-zinc-300">
                    Coders ({users.length})
                  </h2>
                </div>
              </div>

              <div className="space-y-2 max-h-[calc(100vh-270px)] overflow-y-auto pr-1 thin-scrollbar">
                {users.map(u => {
                  const isSelected = u.userId === selectedUserId;
                  const lc = u.platforms?.leetcode?.handle;
                  const cf = u.platforms?.codeforces?.handle;
                  const gh = u.platforms?.github?.handle;
                  const count = u.totalReviewsCount || (u.latestReview ? 1 : 0);
                  const rfBadge = getRoyFactorBadge(u.activeRoyFactor);

                  return (
                    <button
                      key={u.userId}
                      onClick={() => selectUser(u)}
                      className={`w-full text-left p-3 rounded-lg border transition-all flex flex-col gap-2 ${
                        isSelected 
                          ? 'bg-zinc-900 border-zinc-700' 
                          : 'bg-black/40 border-zinc-800/60 hover:bg-zinc-900/40 hover:border-zinc-700'
                      }`}
                    >
                      <div className="flex items-center justify-between w-full">
                        <div className="flex items-center gap-2.5 min-w-0">
                          {u.avatarUrl ? (
                            <img src={u.avatarUrl} alt="" className="w-7 h-7 rounded-full border border-zinc-800 object-cover shrink-0" />
                          ) : (
                            <div className="w-7 h-7 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-xs font-medium shrink-0 text-zinc-400">
                              {u.fullName.charAt(0)}
                            </div>
                          )}
                          <div className="min-w-0">
                            <p className="text-xs font-medium text-white truncate tracking-tight">{u.fullName}</p>
                            <p className="text-[11px] text-zinc-500 truncate">{u.email}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded border ${rfBadge.color}`}>
                            {rfBadge.label}
                          </span>
                          <span className="text-[10px] text-zinc-500 font-mono">
                            {count}
                          </span>
                        </div>
                      </div>

                      {/* Monochrome Platform Tags */}
                      <div className="flex flex-wrap gap-1.5 pt-0.5">
                        {lc && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-zinc-900 text-zinc-400 border border-zinc-800 font-mono">
                            LC: {lc}
                          </span>
                        )}
                        {cf && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-zinc-900 text-zinc-400 border border-zinc-800 font-mono">
                            CF: {cf}
                          </span>
                        )}
                        {gh && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-zinc-900 text-zinc-400 border border-zinc-800 font-mono">
                            GH: {gh}
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </section>

            {/* ================= RIGHT COLUMN: WORKSPACE ================= */}
            <section className="lg:col-span-8 space-y-4">
              {selectedUser ? (
                <>
                  {/* 1. Selected User Overview */}
                  <div className="p-4 rounded-xl bg-zinc-950/40 border border-zinc-800/80 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2.5">
                        <h2 className="text-base font-semibold text-white tracking-tight">{selectedUser.fullName}</h2>
                        <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded border ${getRoyFactorBadge(selectedUser.activeRoyFactor).color}`}>
                          {getRoyFactorBadge(selectedUser.activeRoyFactor).label}
                        </span>
                      </div>
                      <p className="text-xs text-zinc-400 mt-0.5">{selectedUser.email}</p>
                      
                      {/* Platform Links */}
                      <div className="flex flex-wrap items-center gap-3 mt-2">
                        {selectedUser.platforms.leetcode?.handle && (
                          <a 
                            href={`https://leetcode.com/u/${selectedUser.platforms.leetcode.handle}`} 
                            target="_blank" 
                            rel="noreferrer"
                            className="flex items-center gap-1 text-[11px] text-zinc-400 hover:text-white"
                          >
                            LeetCode ({selectedUser.platforms.leetcode.handle})
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                        {selectedUser.platforms.codeforces?.handle && (
                          <a 
                            href={`https://codeforces.com/profile/${selectedUser.platforms.codeforces.handle}`} 
                            target="_blank" 
                            rel="noreferrer"
                            className="flex items-center gap-1 text-[11px] text-zinc-400 hover:text-white"
                          >
                            Codeforces ({selectedUser.platforms.codeforces.handle})
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                        {selectedUser.platforms.github?.handle && (
                          <a 
                            href={`https://github.com/${selectedUser.platforms.github.handle}`} 
                            target="_blank" 
                            rel="noreferrer"
                            className="flex items-center gap-1 text-[11px] text-zinc-400 hover:text-white"
                          >
                            GitHub ({selectedUser.platforms.github.handle})
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleGenerateReview}
                        disabled={isGenerating}
                        className="px-3.5 py-1.5 rounded-lg bg-white text-zinc-950 font-medium text-xs flex items-center gap-1.5 hover:bg-zinc-200 transition-colors disabled:opacity-50"
                      >
                        <RotateCcw className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin' : ''}`} />
                        <span>{isGenerating ? 'Generating...' : 'Regenerate'}</span>
                      </button>
                    </div>
                  </div>

                  {/* 2. Admin Note */}
                  <div className="p-4 rounded-xl bg-zinc-950/40 border border-zinc-800/80 space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-medium text-zinc-300">
                        Admin Note
                      </label>
                      <button
                        onClick={handleSaveAdminNote}
                        disabled={isSavingNote}
                        className="px-2.5 py-1 rounded-md bg-zinc-900 hover:bg-zinc-800 text-xs font-medium text-zinc-300 border border-zinc-800 flex items-center gap-1.5 transition-colors disabled:opacity-50"
                      >
                        <Save className="w-3 h-3" />
                        {isSavingNote ? 'Saving...' : 'Save'}
                      </button>
                    </div>

                    <textarea
                      rows={2}
                      value={adminNoteInput}
                      onChange={(e) => setAdminNoteInput(e.target.value)}
                      placeholder="High-priority guidance or directives for this user's review..."
                      className="w-full px-3 py-2 rounded-lg bg-black border border-zinc-800 text-xs text-zinc-200 placeholder:text-zinc-600 resize-none focus:outline-none focus:border-zinc-700 transition-colors font-sans"
                    />
                  </div>

                  {/* 3. Review Workspace */}
                  <div className="p-4 rounded-xl bg-zinc-950/40 border border-zinc-800/80 space-y-3.5">
                    
                    {/* History Timeline Selector */}
                    {selectedUser.reviews && selectedUser.reviews.length > 0 && (
                      <div className="border-b border-zinc-800 pb-3">
                        <div className="flex items-center gap-2 overflow-x-auto thin-scrollbar">
                          {selectedUser.reviews.map((rev, idx) => {
                            const isCurrentSelected = idx === selectedReviewIndex;
                            const dateLabel = new Date(rev.createdAt).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric'
                            });

                            return (
                              <button
                                key={rev.id}
                                onClick={() => handleSelectHistoryReview(idx)}
                                className={`px-2.5 py-1 rounded-md text-xs font-medium whitespace-nowrap transition-all border ${
                                  isCurrentSelected
                                    ? 'bg-zinc-800 text-white border-zinc-600'
                                    : 'bg-black text-zinc-400 border-zinc-800 hover:text-white hover:bg-zinc-900'
                                }`}
                              >
                                {idx === 0 ? `Latest (${dateLabel})` : `Week ${selectedUser.reviews.length - idx} (${dateLabel})`}
                                {rev.emailSent && (
                                  <span className="ml-1 text-[9px] text-emerald-400 font-mono">✓</span>
                                )}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Toolbar Header */}
                    <div className="flex items-center justify-between flex-wrap gap-2 pt-1 border-b border-zinc-800 pb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-xs font-semibold text-white">
                            {selectedReviewIndex === 0 ? 'Current Response' : `Review #${selectedUser.reviews.length - selectedReviewIndex}`}
                          </h3>
                          {activeReview?.emailSent ? (
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20">
                              Delivered
                            </span>
                          ) : activeReview ? (
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-mono text-zinc-400 bg-zinc-900 border border-zinc-800">
                              Draft
                            </span>
                          ) : null}
                        </div>
                        {activeReview?.modelUsed && (
                          <p className="text-[11px] text-zinc-500 mt-0.5 font-mono">
                            {activeReview.modelUsed}
                          </p>
                        )}
                      </div>

                      {activeReview && (
                        <div className="flex items-center gap-2 flex-wrap">
                          <button
                            onClick={handleGenerateReview}
                            disabled={isGenerating}
                            className="px-2.5 py-1 rounded-md bg-zinc-900 hover:bg-zinc-800 text-xs text-zinc-300 border border-zinc-800 transition-colors flex items-center gap-1.5 disabled:opacity-50"
                          >
                            <RotateCcw className={`w-3 h-3 ${isGenerating ? 'animate-spin' : ''}`} />
                            Regenerate
                          </button>

                          <button
                            onClick={() => setShowEmailPreviewModal(true)}
                            className="px-2.5 py-1 rounded-md bg-zinc-900 hover:bg-zinc-800 text-xs text-zinc-300 border border-zinc-800 transition-colors flex items-center gap-1.5"
                          >
                            <Eye className="w-3 h-3 text-zinc-400" />
                            Preview
                          </button>

                          <button
                            onClick={handleSaveReviewEdit}
                            disabled={isSavingEdit}
                            className="px-2.5 py-1 rounded-md bg-zinc-900 hover:bg-zinc-800 text-xs text-zinc-200 border border-zinc-800 transition-colors flex items-center gap-1.5 disabled:opacity-50"
                          >
                            <Save className="w-3 h-3" />
                            {isSavingEdit ? 'Saving...' : 'Save'}
                          </button>

                          <button
                            onClick={handleSendEmail}
                            disabled={isSendingEmail}
                            className="px-3 py-1 rounded-md text-xs font-semibold bg-white text-zinc-950 hover:bg-zinc-200 flex items-center gap-1.5 transition-all disabled:opacity-50"
                          >
                            <Send className="w-3 h-3" />
                            {isSendingEmail ? 'Sending...' : (activeReview.emailSent ? 'Re-send' : 'Send Email')}
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Review Fields */}
                    {activeReview ? (
                      <div className="space-y-3">
                        <div>
                          <label className="text-[11px] font-medium text-zinc-400 mb-1 block">
                            Targets Set
                          </label>
                          <input
                            type="text"
                            value={editableTargets}
                            onChange={(e) => setEditableTargets(e.target.value)}
                            className="w-full px-3 py-1.5 rounded-lg bg-black border border-zinc-800 text-xs text-zinc-200 focus:outline-none focus:border-zinc-700"
                          />
                        </div>

                        <div>
                          <label className="text-[11px] font-medium text-zinc-400 mb-1 block">
                            Review Content
                          </label>
                          <textarea
                            rows={10}
                            value={editableReviewText}
                            onChange={(e) => setEditableReviewText(e.target.value)}
                            className="w-full p-3 rounded-lg bg-black border border-zinc-800 text-xs text-zinc-200 leading-relaxed font-sans resize-y focus:outline-none focus:border-zinc-700"
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="py-12 text-center text-zinc-500 text-xs">
                        No review generated for {selectedUser.fullName} yet.
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="p-12 text-center text-zinc-500 bg-zinc-950/20 rounded-xl border border-zinc-800 text-xs">
                  Select a coder to view or generate reviews.
                </div>
              )}
            </section>

          </div>
        </main>
      </div>

      {/* Email Preview Modal */}
      {showEmailPreviewModal && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#111113] border border-zinc-800 rounded-xl max-w-lg w-full p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-2.5">
              <div>
                <h3 className="text-xs font-semibold text-white">Email Preview</h3>
                <p className="text-[11px] text-zinc-400 mt-0.5">To: {selectedUser.email}</p>
              </div>
              <button 
                onClick={() => setShowEmailPreviewModal(false)}
                className="p-1 rounded text-zinc-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="bg-white text-zinc-900 rounded-lg p-5 border border-zinc-200 font-sans space-y-3">
              <div>
                <h4 className="text-sm font-bold text-zinc-900">Weekly Performance Analysis</h4>
                <p className="text-[11px] text-zinc-500">Your latest engineering insights are ready.</p>
              </div>

              <p className="text-xs text-zinc-800">Hi {selectedUser.fullName.split(' ')[0] || 'Developer'},</p>

              <div className="border-l-2 border-zinc-400 bg-zinc-50 p-3 rounded-r">
                <p className="text-xs italic text-zinc-700 leading-relaxed">
                  &ldquo;{getTeaserSnippet(editableReviewText)}&rdquo;
                </p>
              </div>

              <p className="text-[11px] text-zinc-600">
                Review your complete breakdown, including your updated trajectory and recommended focus areas for the upcoming week.
              </p>

              <div>
                <span className="inline-block bg-zinc-900 text-white text-[11px] font-semibold px-3 py-1.5 rounded">
                  View Full Analysis →
                </span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-1">
              <button
                onClick={() => setShowEmailPreviewModal(false)}
                className="px-3 py-1.5 rounded-lg bg-zinc-800 text-xs text-zinc-300"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setShowEmailPreviewModal(false);
                  handleSendEmail();
                }}
                className="px-3.5 py-1.5 rounded-lg bg-white text-zinc-950 text-xs font-semibold"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
