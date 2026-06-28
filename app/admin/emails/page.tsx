"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Zap, Mail, Send, CheckSquare, Square, Search, 
  ArrowLeft, Users, CheckCircle, XCircle, AlertTriangle, Loader2 
} from 'lucide-react';
import { createClient } from '@/app/lib/supabase/client';

interface UserProfile {
  id: string;
  email: string;
  full_name: string | null;
  created_at: string;
}

export default function AdminEmailsPage() {
  const router = useRouter();
  const supabase = createClient();

  const [isAdmin, setIsAdmin] = useState(false);
  const [authChecking, setAuthChecking] = useState(true);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);

  // Search & selection
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEmails, setSelectedEmails] = useState<string[]>([]);
  
  // Composition form
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  
  // Sending status
  const [sending, setSending] = useState(false);
  const [sendResult, setSendResult] = useState<{
    success: boolean;
    message: string;
    sentCount?: number;
    failedCount?: number;
  } | null>(null);

  // Authenticate user and fetch email list
  useEffect(() => {
    async function checkAdminAndFetchData() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          router.replace('/');
          return;
        }

        // Fetch users from the admin endpoint. If the user is not an admin, this API returns 403.
        const res = await fetch('/api/admin/users');
        if (!res.ok) {
          if (res.status === 403) {
            console.warn('Access denied: User is not a superadmin');
            router.replace('/dashboard');
          } else {
            throw new Error(`API error: ${res.statusText}`);
          }
          return;
        }

        const data = await res.json();
        if (data.success) {
          setIsAdmin(true);
          setUsers(data.users || []);
        } else {
          throw new Error(data.error || 'Failed to fetch users');
        }
      } catch (err) {
        console.error('Error verifying admin permissions:', err);
        router.replace('/dashboard');
      } finally {
        setAuthChecking(false);
        setLoadingUsers(false);
      }
    }

    checkAdminAndFetchData();
  }, [router]);

  // Filtering users by search query
  const filteredUsers = users.filter(user => {
    const query = searchQuery.toLowerCase();
    const name = (user.full_name || '').toLowerCase();
    const email = user.email.toLowerCase();
    return name.includes(query) || email.includes(query);
  });

  const toggleSelectEmail = (email: string) => {
    setSelectedEmails(prev => 
      prev.includes(email) 
        ? prev.filter(e => e !== email) 
        : [...prev, email]
    );
  };

  const handleSelectAll = () => {
    const visibleEmails = filteredUsers.map(u => u.email);
    setSelectedEmails(prev => {
      // Add all visible emails that are not already selected
      const newSelection = [...prev];
      visibleEmails.forEach(email => {
        if (!newSelection.includes(email)) {
          newSelection.push(email);
        }
      });
      return newSelection;
    });
  };

  const handleDeselectAll = () => {
    const visibleEmails = filteredUsers.map(u => u.email);
    setSelectedEmails(prev => prev.filter(email => !visibleEmails.includes(email)));
  };

  const handleSendEmails = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedEmails.length === 0) {
      alert('Please select at least one recipient.');
      return;
    }
    if (!subject.trim() || !body.trim()) {
      alert('Please complete the subject and body fields.');
      return;
    }

    const confirmSend = window.confirm(`Are you sure you want to send this email to ${selectedEmails.length} user(s)?`);
    if (!confirmSend) return;

    setSending(true);
    setSendResult(null);

    try {
      // Determine if sending to all or specific users
      const recipientsParam = selectedEmails.length === users.length ? 'all' : selectedEmails;

      const res = await fetch('/api/admin/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subject,
          body,
          recipients: recipientsParam,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setSendResult({
          success: true,
          message: data.message,
          sentCount: data.sentCount,
          failedCount: data.failedCount,
        });
        // Clear composition inputs
        setSubject('');
        setBody('');
        setSelectedEmails([]);
      } else {
        throw new Error(data.error || 'Failed to dispatch emails');
      }
    } catch (err: any) {
      console.error('Error sending emails:', err);
      setSendResult({
        success: false,
        message: err.message || 'An error occurred while sending emails',
      });
    } finally {
      setSending(false);
    }
  };

  if (authChecking) {
    return (
      <div className="min-h-screen bg-[#09090b] flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-400 mx-auto" />
          <p className="text-zinc-400 text-sm font-medium">Checking authorization...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-[#09090b] text-white">
      {/* GLOW DECORATIONS */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] rounded-full opacity-[0.05] pointer-events-none" style={{background: 'radial-gradient(circle, #10b981, transparent 70%)', filter: 'blur(80px)'}}></div>
      <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] rounded-full opacity-[0.03] pointer-events-none" style={{background: 'radial-gradient(circle, #059669, transparent 70%)', filter: 'blur(60px)'}}></div>

      {/* HEADER NAVBAR */}
      <nav className="border-b border-white/5 bg-[#09090b]/85 backdrop-blur-[12px] sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => router.push('/dashboard')}
              className="p-2 rounded-lg hover:bg-white/5 text-zinc-400 hover:text-white transition-colors"
              title="Go back to Dashboard"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                <Zap className="w-4 h-4 text-emerald-400" />
              </div>
              <span className="font-semibold text-sm tracking-tight">DSA Quest Admin</span>
            </div>
          </div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20 text-emerald-400">
            Email System
          </span>
        </div>
      </nav>

      {/* MAIN CONTAINER */}
      <main className="max-w-7xl mx-auto px-6 py-10 relative z-10">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold tracking-tight text-white mb-2 leading-none">
            Manual Email Dispatcher
          </h1>
          <p className="text-zinc-400 text-sm">
            Draft and send manual notification emails to specific students or run an announcements broadcast.
          </p>
        </div>

        {/* RESULTS FEEDBACK BANNER */}
        {sendResult && (
          <div className={`mb-8 p-4 rounded-xl border flex gap-3.5 items-start ${
            sendResult.success 
              ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-300' 
              : 'bg-red-500/5 border-red-500/20 text-red-300'
          }`}>
            {sendResult.success ? (
              <CheckCircle className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" />
            ) : (
              <XCircle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
            )}
            <div>
              <div className="text-sm font-semibold mb-1">
                {sendResult.success ? 'Emails Dispatched Successfully' : 'Failed to Dispatch Emails'}
              </div>
              <div className="text-xs text-zinc-400 leading-normal">
                {sendResult.message}
              </div>
              {sendResult.success && typeof sendResult.sentCount === 'number' && (
                <div className="text-xs font-mono mt-2 text-zinc-500">
                  Succeeded: {sendResult.sentCount} | Failed: {sendResult.failedCount}
                </div>
              )}
            </div>
          </div>
        )}

        {/* COMPOSER & RECIPIENTS ROW */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* COMPOSER FORM (COL-7) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-[#09090b] border border-white/10 rounded-2xl p-6 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 opacity-[0.05] pointer-events-none" style={{background: 'radial-gradient(circle, #10b981, transparent 70%)'}}></div>
              <h2 className="text-sm font-bold uppercase tracking-widest text-zinc-400 mb-6 flex items-center gap-2">
                <Mail className="w-4 h-4 text-emerald-400" /> Compose Broadcast Message
              </h2>

              <form onSubmit={handleSendEmails} className="space-y-5">
                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-2 ml-1">Email Subject Header</label>
                  <input 
                    type="text" 
                    required 
                    placeholder="Enter email subject line..." 
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-white/[0.02] border border-white/10 text-sm text-zinc-200 placeholder:text-zinc-600 outline-none focus:border-emerald-500/50 focus:bg-white/[0.04] transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-2 ml-1">Email Body Content</label>
                  <textarea 
                    required 
                    rows={12}
                    placeholder="Write the announcement body here. Line breaks will be preserved as paragraphs in the HTML template..." 
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-white/[0.02] border border-white/10 text-sm text-zinc-200 placeholder:text-zinc-600 outline-none focus:border-emerald-500/50 focus:bg-white/[0.04] transition-all font-sans leading-relaxed resize-y"
                  />
                </div>

                <div className="pt-2">
                  <button 
                    type="submit" 
                    disabled={sending || selectedEmails.length === 0}
                    className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-white text-zinc-900 text-sm font-bold hover:bg-zinc-200 transition-all border border-zinc-200 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-white/5 active:scale-[0.99]"
                  >
                    {sending ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Dispatching Announcement...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Send Email to {selectedEmails.length} Recipient(s)
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* RECIPIENTS SELECTOR (COL-5) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-[#09090b] border border-white/10 rounded-2xl p-6 shadow-xl relative overflow-hidden flex flex-col h-[565px]">
              <div className="absolute top-0 right-0 w-32 h-32 opacity-[0.03] pointer-events-none" style={{background: 'radial-gradient(circle, #059669, transparent 70%)'}}></div>
              
              <div className="flex items-center justify-between mb-4 flex-shrink-0">
                <h2 className="text-sm font-bold uppercase tracking-widest text-zinc-400 flex items-center gap-2">
                  <Users className="w-4 h-4 text-emerald-400" /> Recipients Selector
                </h2>
                <span className="text-[10px] bg-zinc-800 px-2 py-0.5 rounded text-zinc-400 font-mono">
                  {selectedEmails.length}/{users.length} selected
                </span>
              </div>

              {/* SEARCH BAR */}
              <div className="relative mb-4 flex-shrink-0">
                <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input 
                  type="text" 
                  placeholder="Search students by name or email..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/[0.02] border border-white/10 text-xs text-zinc-200 placeholder:text-zinc-600 outline-none focus:border-emerald-500/50 transition-all"
                />
              </div>

              {/* QUICK CONTROLS */}
              <div className="flex items-center gap-2 mb-4 flex-shrink-0">
                <button
                  onClick={handleSelectAll}
                  disabled={filteredUsers.length === 0}
                  className="flex-1 py-1.5 rounded bg-white/5 border border-white/5 text-[10px] font-semibold text-zinc-300 hover:bg-white/10 hover:text-white transition-all disabled:opacity-50"
                >
                  Select All Visible
                </button>
                <button
                  onClick={handleDeselectAll}
                  disabled={filteredUsers.length === 0}
                  className="flex-1 py-1.5 rounded bg-white/5 border border-white/5 text-[10px] font-semibold text-zinc-300 hover:bg-white/10 hover:text-white transition-all disabled:opacity-50"
                >
                  Deselect All Visible
                </button>
              </div>

              {/* SCROLLABLE USERS LIST */}
              <div className="flex-1 overflow-y-auto pr-1 space-y-1.5 scrollbar-thin scrollbar-thumb-zinc-800">
                {loadingUsers ? (
                  <div className="h-full flex items-center justify-center py-10">
                    <Loader2 className="w-6 h-6 animate-spin text-zinc-600" />
                  </div>
                ) : filteredUsers.length === 0 ? (
                  <div className="text-center py-12 text-zinc-600 text-xs border border-dashed border-white/5 rounded-xl flex flex-col gap-2 justify-center items-center">
                    <AlertTriangle className="w-5 h-5 text-zinc-700" />
                    No users matching criteria
                  </div>
                ) : (
                  filteredUsers.map(user => {
                    const isSelected = selectedEmails.includes(user.email);
                    const formattedDate = new Date(user.created_at).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                    });

                    return (
                      <div 
                        key={user.id}
                        onClick={() => toggleSelectEmail(user.email)}
                        className={`flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer select-none ${
                          isSelected 
                            ? 'bg-emerald-500/5 border-emerald-500/25 text-white hover:bg-emerald-500/10' 
                            : 'bg-white/[0.01] border-white/5 text-zinc-400 hover:bg-white/[0.03]'
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          {isSelected ? (
                            <CheckSquare className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                          ) : (
                            <Square className="w-4 h-4 text-zinc-700 flex-shrink-0" />
                          )}
                          <div className="min-w-0">
                            <div className="text-xs font-semibold truncate text-zinc-200">
                              {user.full_name || 'Coder'}
                            </div>
                            <div className="text-[10px] truncate text-zinc-500 font-mono mt-0.5">
                              {user.email}
                            </div>
                          </div>
                        </div>
                        <span className="text-[9px] font-mono text-zinc-600 flex-shrink-0 pl-2">
                          {formattedDate}
                        </span>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
