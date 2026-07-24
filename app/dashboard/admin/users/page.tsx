"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { Users, Loader2, AlertTriangle, Search, Clock, Mail, Shield } from 'lucide-react';
import { formatLastSeen } from '@/app/lib/lastSeenUtils';

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

  useEffect(() => {
    fetchUsers();
  }, []);

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

  const sortedAndFilteredUsers = useMemo(() => {
    return users
      .filter(user => 
        (user.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false) ||
        (user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false)
      )
      .sort((a, b) => {
        // Sort by lastSignInAt (New to old)
        const timeA = a.lastSignInAt ? new Date(a.lastSignInAt).getTime() : 0;
        const timeB = b.lastSignInAt ? new Date(b.lastSignInAt).getTime() : 0;
        return timeB - timeA;
      });
  }, [users, searchQuery]);

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
        <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight mb-2 flex items-center gap-3">
              <Users className="w-8 h-8 text-blue-500" />
              Users List
              <span className="text-xl font-semibold px-3 py-1 bg-blue-500/10 text-blue-400 rounded-full border border-blue-500/20 ml-2">
                {users.length} Total
              </span>
            </h1>
            <p className="text-zinc-500 text-sm">Manage and monitor platform users sorted by their most recent sign in time.</p>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-blue-500 transition-colors w-full md:w-64"
            />
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
                    <th className="p-4 font-medium">Last Sign In</th>
                    <th className="p-4 font-medium">Joined Date</th>
                    <th className="p-4 font-medium">Provider</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {sortedAndFilteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          {user.avatarUrl ? (
                            <img src={user.avatarUrl} alt="Avatar" className="w-10 h-10 rounded-full border border-white/10 object-cover" />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold border border-blue-500/30">
                              {user.fullName ? user.fullName.charAt(0).toUpperCase() : '?'}
                            </div>
                          )}
                          <div>
                            <div className="font-semibold text-white">{user.fullName || "Unnamed User"}</div>
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
                        <div className="flex flex-col">
                          <span className="text-emerald-400 font-medium">
                            {user.lastSignInAt ? new Date(user.lastSignInAt).toLocaleString() : "Never"}
                          </span>
                          {user.lastSeen && (
                            <span className="text-xs text-zinc-500 mt-1 flex items-center gap-1">
                              <Clock className="w-3 h-3" /> Seen: {formatLastSeen(user.lastSeen)}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="p-4 text-zinc-400">
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
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
