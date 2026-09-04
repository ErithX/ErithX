"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Users,
  Loader2,
  ShieldAlert,
  Search,
  RefreshCw,
  Clock
} from "lucide-react";
import { formatLastSeen } from "@/app/lib/lastSeenUtils";
import AdminSidebar from "@/components/admin/AdminSidebar";

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

function formatDate(value: string | null) {
  if (!value) return "Never";
  return new Date(value).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export default function SuperadminPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState<'lastActive' | 'newestJoined' | 'oldestJoined' | 'lastLogin'>('lastActive');

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch("/api/superadmin/users");
      if (!response.ok) {
        throw new Error(`Failed to load users (Status: ${response.status})`);
      }
      const data = await response.json();
      setUsers(data.users || []);
    } catch (loadError) {
      setError(
        loadError instanceof Error ? loadError.message : "Failed to load users.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return users;
    return users.filter(
      (u) =>
        (u.fullName && u.fullName.toLowerCase().includes(q)) ||
        (u.email && u.email.toLowerCase().includes(q)) ||
        (u.provider && u.provider.toLowerCase().includes(q))
    );
  }, [users, searchQuery]);

  const sortedUsers = useMemo(() => {
    return [...filteredUsers].sort((a, b) => {
      if (sortOption === 'lastActive') {
        const timeA = a.lastSeen ? new Date(a.lastSeen).getTime() : (a.lastSignInAt ? new Date(a.lastSignInAt).getTime() : 0);
        const timeB = b.lastSeen ? new Date(b.lastSeen).getTime() : (b.lastSignInAt ? new Date(b.lastSignInAt).getTime() : 0);
        return timeB - timeA;
      } else if (sortOption === 'newestJoined') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      } else if (sortOption === 'oldestJoined') {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      } else {
        const timeA = a.lastSignInAt ? new Date(a.lastSignInAt).getTime() : 0;
        const timeB = b.lastSignInAt ? new Date(b.lastSignInAt).getTime() : 0;
        return timeB - timeA;
      }
    });
  }, [filteredUsers, sortOption]);

  return (
    <div className="min-h-screen bg-[#09090b] text-white selection:bg-zinc-800 selection:text-white font-sans flex flex-col">
      {/* Top Header Bar */}
      <header className="border-b border-zinc-800/80 bg-[#09090b]/80 backdrop-blur-xl sticky top-0 z-30 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
          <span className="text-sm font-semibold tracking-tight text-white">ErithX Admin</span>
          <span className="text-zinc-600 font-mono text-xs">/</span>
          <span className="text-xs text-zinc-400 font-medium">Users Directory</span>
        </div>
        <button
          onClick={loadUsers}
          className="text-xs text-zinc-400 hover:text-white flex items-center gap-1.5 transition-colors"
          title="Reload Users"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin text-emerald-400" : ""}`} />
          <span>Refresh</span>
        </button>
      </header>

      {/* Main Split Layout: Sidebar + Workspace */}
      <div className="flex flex-1">
        <AdminSidebar activeTab="resources" />

        <main className="flex-1 p-6 md:p-8 overflow-y-auto max-w-7xl">
          {/* Header & Controls */}
          <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-xl font-bold tracking-tight text-white">Users Directory</h1>
              <p className="text-xs text-zinc-500 mt-0.5">
                {users.length} registered accounts across Google and GitHub authentication
              </p>
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              {/* Search Bar */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search user or email..."
                  className="pl-8 pr-3 py-1.5 rounded-lg border border-zinc-800 bg-black text-xs text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-zinc-700 w-48 sm:w-60"
                />
              </div>

              {/* Sort Selector */}
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value as any)}
                className="rounded-lg border border-zinc-800 bg-black px-3 py-1.5 text-xs text-zinc-300 focus:outline-none focus:border-zinc-700 cursor-pointer"
              >
                <option value="lastActive">Sort: Last Active</option>
                <option value="newestJoined">Sort: Newest</option>
                <option value="oldestJoined">Sort: Oldest</option>
                <option value="lastLogin">Sort: Last Login</option>
              </select>
            </div>
          </div>

          {error && (
            <div className="mb-4 flex items-center gap-2 px-4 py-2.5 rounded-lg bg-rose-950/40 border border-rose-800/80 text-xs font-medium text-rose-300">
              <ShieldAlert className="h-4 w-4 shrink-0" />
              {error}
            </div>
          )}

          {loading ? (
            <div className="p-12 text-center text-zinc-500 bg-zinc-950/40 rounded-xl border border-zinc-800">
              <Loader2 className="mb-2.5 h-6 w-6 animate-spin mx-auto text-emerald-500" />
              <p className="text-xs font-mono">Loading users directory...</p>
            </div>
          ) : (
            <section className="rounded-xl border border-zinc-800 bg-zinc-950/40 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[700px] border-collapse text-left text-xs">
                  <thead>
                    <tr className="border-b border-zinc-800 text-zinc-400 font-semibold bg-zinc-900/40">
                      <th className="py-3 px-4">User</th>
                      <th className="py-3 px-4">Email</th>
                      <th className="py-3 px-4">Signed Up</th>
                      <th className="py-3 px-4">Last Login</th>
                      <th className="py-3 px-4">Last Seen</th>
                      <th className="py-3 px-4">Provider</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-900">
                    {sortedUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-zinc-900/30 transition-colors">
                        <td className="py-3 px-4 font-medium text-white flex items-center gap-2.5">
                          {user.avatarUrl ? (
                            <img
                              src={user.avatarUrl}
                              alt=""
                              className="w-6 h-6 rounded-full border border-zinc-800 object-cover"
                            />
                          ) : (
                            <div className="w-6 h-6 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-[10px] font-bold text-zinc-400">
                              {(user.fullName || user.email || "?").charAt(0).toUpperCase()}
                            </div>
                          )}
                          <span className="truncate max-w-[160px]">{user.fullName || "Unnamed"}</span>
                        </td>
                        <td className="py-3 px-4 text-zinc-400 font-mono text-[11px]">{user.email}</td>
                        <td className="py-3 px-4 text-zinc-500 font-mono text-[11px]">{formatDate(user.createdAt)}</td>
                        <td className="py-3 px-4 text-zinc-500 font-mono text-[11px]">{formatDate(user.lastSignInAt)}</td>
                        <td className="py-3 px-4 text-zinc-400 font-mono text-[11px]">{formatLastSeen(user.lastSeen)}</td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-0.5 rounded text-[10px] bg-zinc-900 border border-zinc-800 text-zinc-300 capitalize">
                            {user.provider || "email"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}
        </main>
      </div>
    </div>
  );
}
