"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { Users, Loader2, AlertTriangle, Search, Clock, Mail, Shield, Activity, CalendarPlus, Swords, Download, Sparkles } from 'lucide-react';
import { formatLastSeen } from '@/app/lib/lastSeenUtils';


function formatTimeAgo(dateStr: string) {
  if (!dateStr) return 'Just now';
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

interface AdminUser {
  id: string;
  email: string | null;
  fullName: string | null;
  avatarUrl: string | null;
  createdAt: string;
  lastSignInAt: string | null;
  provider: string | null;
  lastSeen: string | null;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'lastActive' | 'newestJoined' | 'oldestJoined' | 'lastSignIn'>('lastActive');
  const [metrics, setMetrics] = useState<any>(null);
  const [activityFilter, setActivityFilter] = useState<'all' | 'contest_calendar_sync' | 'contest_platform_click' | 'pdf_download'>('all');

  useEffect(() => {
    fetchUsers();
    fetchMetrics();
  }, []);

  const fetchMetrics = async () => {
    try {
      const res = await fetch('/api/superadmin/metrics');
      if (res.ok) {
        const json = await res.json();
        setMetrics(json.data);
      }
    } catch (e) {
      console.error('Failed to fetch metrics', e);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/superadmin/users');
      if (!res.ok) {
        if (res.status === 403) {
          setError("Forbidden. You do not have superadmin privileges.");
        } else {
          setError("Failed to load users");
        }
        setLoading(false);
        return;
      }
      const data = await res.json();
      setUsers(data.users || []);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const filteredActivities = useMemo(() => {
    if (!metrics?.recentActivities) return [];
    if (activityFilter === 'all') return metrics.recentActivities;
    return metrics.recentActivities.filter((act: any) => act.type === activityFilter);
  }, [metrics, activityFilter]);

  const sortedAndFilteredUsers = useMemo(() => {
    return users
      .filter(user => 
        (user.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false) ||
        (user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false)
      )
      .sort((a, b) => {
        if (sortBy === 'lastActive') {
          const timeA = a.lastSeen ? new Date(a.lastSeen).getTime() : (a.lastSignInAt ? new Date(a.lastSignInAt).getTime() : 0);
          const timeB = b.lastSeen ? new Date(b.lastSeen).getTime() : (b.lastSignInAt ? new Date(b.lastSignInAt).getTime() : 0);
          return timeB - timeA;
        } else if (sortBy === 'newestJoined') {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        } else if (sortBy === 'oldestJoined') {
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        } else {
          const timeA = a.lastSignInAt ? new Date(a.lastSignInAt).getTime() : 0;
          const timeB = b.lastSignInAt ? new Date(b.lastSignInAt).getTime() : 0;
          return timeB - timeA;
        }
      });
  }, [users, searchQuery, sortBy]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#09090b] text-zinc-500">
        <Loader2 className="w-6 h-6 animate-spin mr-2" />
        <span className="animate-pulse font-mono text-sm">Loading users...</span>
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
    <div className="min-h-screen bg-[#09090b] text-white p-6 md:p-12 selection:bg-blue-800 selection:text-white">
      <div className="max-w-6xl mx-auto">
        {/* Engagement Analytics Cards */}
        {metrics && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {/* Calendar Syncs */}
            <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/10 hover:border-cyan-500/30 transition-all">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold uppercase tracking-widest text-zinc-400">Calendar Syncs</span>
                <span className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 text-xs font-bold">1-Click</span>
              </div>
              <div className="text-3xl font-black text-white mb-2">{metrics.calendarSyncs?.total || 0}</div>
              <div className="flex flex-wrap gap-1.5 text-[10px]">
                {metrics.calendarSyncs?.breakdown && Object.entries(metrics.calendarSyncs.breakdown).map(([plat, count]: [string, any]) => (
                  <span key={plat} className="px-2 py-0.5 rounded bg-white/5 text-zinc-300 border border-white/5">
                    {plat}: <strong className="text-cyan-400">{String(typeof count === 'number' ? count : (typeof count === 'object' && count ? Object.values(count)[0] : count))}</strong>
                  </span>
                ))}
              </div>
            </div>

            {/* Outbound Contest Clicks */}
            <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/10 hover:border-emerald-500/30 transition-all">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold uppercase tracking-widest text-zinc-400">Contest Joins</span>
                <span className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 text-xs font-bold">Outbound</span>
              </div>
              <div className="text-3xl font-black text-white mb-2">{metrics.platformClicks?.total || 0}</div>
              <div className="flex flex-wrap gap-1.5 text-[10px]">
                {metrics.platformClicks?.breakdown && Object.entries(metrics.platformClicks.breakdown).map(([plat, count]: [string, any]) => (
                  <span key={plat} className="px-2 py-0.5 rounded bg-white/5 text-zinc-300 border border-white/5">
                    {plat}: <strong className="text-emerald-400">{String(typeof count === 'number' ? count : (typeof count === 'object' && count ? Object.values(count)[0] : count))}</strong>
                  </span>
                ))}
              </div>
            </div>

            {/* PDF Blueprint Downloads */}
            <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/10 hover:border-purple-500/30 transition-all">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold uppercase tracking-widest text-zinc-400">PDF Downloads</span>
                <span className="p-2 rounded-lg bg-purple-500/10 text-purple-400 text-xs font-bold">Blueprints</span>
              </div>
              <div className="text-3xl font-black text-white mb-2">{metrics.pdfDownloads?.total || 0}</div>
              <div className="text-[10px] text-zinc-500">
                {metrics.pdfDownloads?.topResources?.length > 0 ? (
                  <span className="truncate block">Top: {metrics.pdfDownloads.topResources[0]?.title} ({metrics.pdfDownloads.topResources[0]?.pdfDownloads})</span>
                ) : (
                  <span>Verified Blueprint Downloads</span>
                )}
              </div>
            </div>
          </div>
        )}

        {/* LIVE USER INTENT ACTIVITY STREAM */}
        {metrics?.recentActivities && (
          <section className="mb-12 p-6 rounded-2xl bg-white/[0.02] border border-white/10">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Activity className="w-5 h-5 text-emerald-400" />
                  Live User Intent Stream
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                </h2>
                <p className="text-xs text-zinc-500">Real-time log of users clicking Add to Calendar, Joining Contests, & Downloading PDFs.</p>
              </div>

              {/* Filter Tabs */}
              <div className="flex items-center gap-1.5 bg-black/40 p-1 rounded-xl border border-white/5 overflow-x-auto text-xs">
                <button
                  onClick={() => setActivityFilter('all')}
                  className={`px-3 py-1 rounded-lg font-medium transition-all ${activityFilter === 'all' ? 'bg-white/10 text-white shadow-sm' : 'text-zinc-400 hover:text-white'}`}
                >
                  All ({metrics.recentActivities.length})
                </button>
                <button
                  onClick={() => setActivityFilter('pdf_download')}
                  className={`px-3 py-1 rounded-lg font-medium transition-all ${activityFilter === 'pdf_download' ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' : 'text-zinc-400 hover:text-white'}`}
                >
                  📥 PDFs
                </button>
                <button
                  onClick={() => setActivityFilter('contest_calendar_sync')}
                  className={`px-3 py-1 rounded-lg font-medium transition-all ${activityFilter === 'contest_calendar_sync' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' : 'text-zinc-400 hover:text-white'}`}
                >
                  📅 Calendar
                </button>
                <button
                  onClick={() => setActivityFilter('contest_platform_click')}
                  className={`px-3 py-1 rounded-lg font-medium transition-all ${activityFilter === 'contest_platform_click' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'text-zinc-400 hover:text-white'}`}
                >
                  ⚔️ Contests
                </button>
              </div>
            </div>

            {/* Activities List */}
            {filteredActivities.length === 0 ? (
              <div className="py-8 text-center text-zinc-500 text-xs border border-white/5 border-dashed rounded-xl">
                No recent actions recorded in this category yet.
              </div>
            ) : (
              <div className="space-y-2.5 max-h-96 overflow-y-auto pr-1">
                {filteredActivities.map((act: any) => {
                  const avatarSrc = act.userAvatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${act.userEmail || act.userId || 'guest'}`;
                  const isGuest = !act.userId;

                  let badgeColor = 'bg-white/5 text-zinc-300 border-white/10';
                  let icon = <Sparkles className="w-3.5 h-3.5" />;
                  let actionLabel = 'Interacted';

                  if (act.type === 'pdf_download') {
                    badgeColor = 'bg-purple-500/10 text-purple-400 border-purple-500/30';
                    icon = <Download className="w-3.5 h-3.5 text-purple-400" />;
                    actionLabel = 'Downloaded Blueprint PDF';
                  } else if (act.type === 'contest_calendar_sync') {
                    badgeColor = 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30';
                    icon = <CalendarPlus className="w-3.5 h-3.5 text-cyan-400" />;
                    actionLabel = 'Synced to Google Calendar';
                  } else if (act.type === 'contest_platform_click') {
                    badgeColor = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
                    icon = <Swords className="w-3.5 h-3.5 text-emerald-400" />;
                    actionLabel = 'Participated in Contest';
                  }

                  return (
                    <div 
                      key={act.id} 
                      className="flex items-center justify-between p-3 rounded-xl bg-white/[0.015] border border-white/5 hover:border-white/15 transition-all text-xs"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <img 
                          src={avatarSrc} 
                          alt="User" 
                          referrerPolicy="no-referrer"
                          className="w-8 h-8 rounded-full border border-white/10 object-cover bg-zinc-800 shrink-0"
                          onError={(e) => {
                            e.currentTarget.src = `https://api.dicebear.com/7.x/avataaars/svg?seed=${act.userEmail || 'guest'}`;
                          }}
                        />
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-semibold text-white truncate">{act.userName}</span>
                            <span className="text-[11px] text-zinc-500 truncate">({act.userEmail})</span>
                            {isGuest && (
                              <span className="text-[9px] px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400 border border-zinc-700">GUEST</span>
                            )}
                          </div>
                          <div className="text-[11px] text-zinc-400 flex items-center gap-1.5 mt-0.5 truncate">
                            <span className="font-medium text-zinc-300 truncate">"{act.title}"</span>
                            {act.platform && <span className="text-zinc-500">• {act.platform}</span>}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 shrink-0 ml-3">
                        <span className={`px-2.5 py-1 rounded-full text-[11px] font-medium border flex items-center gap-1.5 ${badgeColor}`}>
                          {icon}
                          <span className="hidden sm:inline">{actionLabel}</span>
                        </span>
                        <span className="text-[10px] text-zinc-500 whitespace-nowrap">{formatTimeAgo(act.createdAt)}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        )}

        <header className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight mb-2 flex items-center gap-3">
              <Users className="w-8 h-8 text-blue-500" />
              Users List
              <span className="text-xl font-semibold px-3 py-1 bg-blue-500/10 text-blue-400 rounded-full border border-blue-500/20 ml-2">
                {users.length} Total
              </span>
            </h1>
            <p className="text-zinc-500 text-sm">Manage and monitor platform users with live activity and registration tracking.</p>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-zinc-300 focus:outline-none focus:border-blue-500 transition-colors w-full sm:w-auto cursor-pointer"
            >
              <option value="lastActive" className="bg-zinc-900 text-white">Sort: Last Active</option>
              <option value="newestJoined" className="bg-zinc-900 text-white">Sort: Newest Joined</option>
              <option value="oldestJoined" className="bg-zinc-900 text-white">Sort: Oldest Joined</option>
              <option value="lastSignIn" className="bg-zinc-900 text-white">Sort: Last Login</option>
            </select>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <input
                type="text"
                placeholder="Search name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-blue-500 transition-colors w-full"
              />
            </div>
          </div>
        </header>


        {sortedAndFilteredUsers.length === 0 ? (

          <div className="flex flex-col items-center justify-center py-20 bg-white/5 rounded-2xl border border-white/10 border-dashed text-zinc-500">
            <Users className="w-12 h-12 mb-4 text-blue-500/50" />
            <p>No users found.</p>
          </div>
        ) : (
          <div className="bg-white/[0.02] border border-white/10 rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-white/5 border-b border-white/10 text-zinc-400">
                  <tr>
                    <th className="p-4 font-medium">User</th>
                    <th className="p-4 font-medium">Contact</th>
                    <th className="p-4 font-medium">Activity Status</th>
                    <th className="p-4 font-medium">Last Login</th>
                    <th className="p-4 font-medium">Joined Date</th>
                    <th className="p-4 font-medium">Provider</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {sortedAndFilteredUsers.map((user) => {
                    const isOnline = user.lastSeen && (Date.now() - new Date(user.lastSeen).getTime()) < 90000;
                    const avatarSrc = user.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email || user.id}`;
                    return (
                      <tr key={user.id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="relative">
                              <img 
                                src={avatarSrc} 
                                alt="Avatar" 
                                referrerPolicy="no-referrer"
                                className="w-10 h-10 rounded-full border border-white/10 object-cover bg-zinc-800"
                                onError={(e) => {
                                  e.currentTarget.src = `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email || user.id}`;
                                }}
                              />
                              {isOnline && (
                                <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-[#09090b] rounded-full shadow-[0_0_8px_rgba(16,185,129,0.8)]" title="Online now" />
                              )}
                            </div>
                            <div>
                              <div className="font-semibold text-white flex items-center gap-2">
                                {user.fullName || "Unnamed User"}
                              </div>
                              <div className="text-xs text-zinc-500 font-mono" title="User ID">{user.id.substring(0, 8)}...</div>
                            </div>
                          </div>
                        </td>

                        <td className="p-4">
                          <div className="flex items-center gap-2 text-zinc-300">
                            <Mail className="w-4 h-4 text-zinc-500" />
                            {user.email || "No email"}
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-1.5 font-medium text-xs">
                            {formatLastSeen(user.lastSeen)}
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="text-zinc-300 text-xs font-mono">
                            {user.lastSignInAt ? new Date(user.lastSignInAt).toLocaleString() : "Never"}
                          </div>
                        </td>
                        <td className="p-4 text-zinc-400 text-xs">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </td>
                        <td className="p-4">

                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 w-max ${
                          user.provider === "google"
                            ? "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                            : user.provider === "github"
                              ? "bg-zinc-800 text-zinc-300 border border-zinc-700"
                              : "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                        }`}>
                          {user.provider === "google" && <span className="w-1.5 h-1.5 rounded-full bg-rose-400"></span>}
                          {user.provider === "github" && <span className="w-1.5 h-1.5 rounded-full bg-zinc-400"></span>}
                          <span className="capitalize">{user.provider || "unknown"}</span>
                        </span>
                      </td>
                    </tr>
                  );
                })}

                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
