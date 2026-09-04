"use client";

import React, { useState, useEffect } from 'react';
import { createClient } from '@/app/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { Check, X, Eye, FileText, AlertTriangle } from 'lucide-react';
import TiptapEditor from '@/components/editor/TiptapEditor';
import AdminSidebar from '@/components/admin/AdminSidebar';

interface PendingDoc {
  _id: string;
  userId: string;
  authorName?: string;
  authorEmail?: string;
  title: string;
  category: string;
  status: string;
  createdAt: string;
  content: string;
  coverImage?: string;
  tags: string[];
}

export default function AdminReviewPage() {
  const [documents, setDocuments] = useState<PendingDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  const [rejectingDocId, setRejectingDocId] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [previewingDoc, setPreviewingDoc] = useState<PendingDoc | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    fetchPendingDocuments();
  }, []);

  const fetchPendingDocuments = async () => {
    try {
      const res = await fetch('/api/admin/pending');
      if (!res.ok) {
        if (res.status === 403) {
          setError("Forbidden. You do not have superadmin privileges.");
        } else {
          setError("Failed to load documents");
        }
        setLoading(false);
        return;
      }
      const data = await res.json();
      setDocuments(data);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: string) => {
    if (!confirm("Are you sure you want to approve and publish this document?")) return;
    setIsProcessing(true);
    try {
      const res = await fetch(`/api/admin/pending/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'published' })
      });
      if (res.ok) {
        setDocuments(docs => docs.filter(d => d._id !== id));
      } else {
        alert("Failed to approve");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rejectingDocId || !rejectionReason.trim()) return;
    
    setIsProcessing(true);
    try {
      const res = await fetch(`/api/admin/pending/${rejectingDocId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'rejected', rejectionReason })
      });
      if (res.ok) {
        setDocuments(docs => docs.filter(d => d._id !== rejectingDocId));
        setRejectingDocId(null);
        setRejectionReason('');
      } else {
        alert("Failed to reject");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#09090b] text-zinc-500">
        <span className="animate-pulse font-mono text-sm">Loading pending reviews...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#09090b] p-6">
        <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 p-6 rounded-2xl max-w-md text-center">
          <AlertTriangle className="w-12 h-12 mx-auto mb-4 opacity-80" />
          <h2 className="text-xl font-bold mb-2">Access Denied</h2>
          <p className="text-sm opacity-80">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#09090b] text-white selection:bg-zinc-800 selection:text-white font-sans flex flex-col">
      {/* Top Header Bar */}
      <header className="border-b border-zinc-800/80 bg-[#09090b]/80 backdrop-blur-xl sticky top-0 z-30 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]"></div>
          <span className="text-sm font-semibold tracking-tight text-white">ErithX Admin</span>
          <span className="text-zinc-600 font-mono text-xs">/</span>
          <span className="text-xs text-zinc-400 font-medium">Content Approvals</span>
        </div>
      </header>

      {/* Main Split Layout: Sidebar + Workspace */}
      <div className="flex flex-1">
        <AdminSidebar activeTab="review" />

        <main className="flex-1 p-6 md:p-8 overflow-y-auto max-w-5xl">
          <header className="mb-8">
            <h1 className="text-2xl font-bold tracking-tight mb-1">Content Review Queue</h1>
            <p className="text-zinc-500 text-xs">Review, verify, and approve community submitted blueprints and articles.</p>
          </header>

        {documents.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white/5 rounded-2xl border border-white/10 border-dashed text-zinc-500">
            <Check className="w-12 h-12 mb-4 text-emerald-500/50" />
            <p>You're all caught up! No pending documents.</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {documents.map((doc) => (
              <div key={doc._id} className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 bg-white/[0.02] border border-white/10 hover:border-white/20 hover:bg-white/[0.04] transition-all rounded-xl">
                
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-amber-500/10 text-amber-500 border border-amber-500/20">
                      Pending
                    </span>
                    <span className="text-xs text-zinc-500 font-mono">{new Date(doc.createdAt).toLocaleDateString()}</span>
                  </div>
                  <h3 className="text-lg font-semibold">{doc.title || "Untitled Document"}</h3>
                  <div className="text-sm text-zinc-400 mt-1 flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    <span>{doc.category}</span>
                    <span className="text-zinc-700">|</span>
                    <span className="font-mono text-xs">Author: {doc.authorName || 'Anonymous'} {doc.authorEmail ? `(${doc.authorEmail})` : ''}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 mt-4 md:mt-0">
                  <button 
                    onClick={() => setPreviewingDoc(doc)}
                    className="p-2 text-zinc-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                    title="Preview Document"
                  >
                    <Eye className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={() => setRejectingDocId(doc._id)}
                    className="px-4 py-2 text-sm font-medium text-rose-400 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 rounded-lg transition-colors flex items-center gap-2"
                  >
                    <X className="w-4 h-4" /> Reject
                  </button>
                  <button 
                    onClick={() => handleApprove(doc._id)}
                    disabled={isProcessing}
                    className="px-4 py-2 text-sm font-medium text-emerald-950 bg-emerald-500 hover:bg-emerald-400 rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50"
                  >
                    <Check className="w-4 h-4" /> Approve
                  </button>
                </div>

              </div>
            ))}
          </div>
        )}
        </main>
      </div>

      {/* Reject Modal */}
      {rejectingDocId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setRejectingDocId(null)} />
          <div className="relative w-full max-w-md bg-[#18181b] border border-white/10 rounded-2xl shadow-2xl p-6">
            <h3 className="text-lg font-bold text-white mb-2">Reject Document</h3>
            <p className="text-sm text-zinc-400 mb-6">Please provide a reason for rejection. This will be shown to the author so they can fix it.</p>
            
            <form onSubmit={handleReject}>
              <textarea
                autoFocus
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="e.g., Please fix the cover image and add more detail to the second paragraph."
                className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-rose-500 transition-colors min-h-[120px] mb-6 resize-none"
                required
              />
              <div className="flex gap-3">
                <button type="button" onClick={() => setRejectingDocId(null)} className="flex-1 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-sm font-medium transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={isProcessing || !rejectionReason.trim()} className="flex-1 px-4 py-2 bg-rose-500 hover:bg-rose-600 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50">
                  {isProcessing ? 'Rejecting...' : 'Confirm Rejection'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {previewingDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={() => setPreviewingDoc(null)} />
          <div className="relative w-full max-w-4xl max-h-[90vh] bg-[#09090b] border border-white/10 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/10 bg-black/40">
              <div className="flex items-center gap-3">
                <span className="px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider bg-zinc-800 text-zinc-300 border border-white/10">
                  Preview Mode
                </span>
                <span className="text-sm font-medium text-zinc-400">{previewingDoc.category}</span>
              </div>
              <div className="flex items-center gap-3">
                <button onClick={() => setPreviewingDoc(null)} className="p-2 text-zinc-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Scrollable Content */}
            <div className="overflow-y-auto p-8 md:p-12">
              <div className="max-w-3xl mx-auto">
                {previewingDoc.coverImage && (
                  <img src={previewingDoc.coverImage} alt="Cover" className="w-full h-64 object-cover rounded-xl mb-8 border border-white/10" />
                )}
                
                <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-8">
                  {previewingDoc.title}
                </h2>

                {/* Tags */}
                {previewingDoc.tags && previewingDoc.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-12">
                    {previewingDoc.tags.map(tag => (
                      <span key={tag} className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs text-zinc-300">
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Tiptap Rendered Content */}
                <div className="article-body tiptap mt-8">
                  <TiptapEditor content={previewingDoc.content} readOnly />
                </div>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
