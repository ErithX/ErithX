import React, { RefObject, useState, useEffect, useRef } from 'react';
import { Zap, Bell, LogOut, Settings, Check, XCircle, Info } from 'lucide-react';
import { User } from '@supabase/supabase-js';

interface DashboardNavbarProps {
  user: User | null;
  loading: boolean;
  isDropdownOpen: boolean;
  setIsDropdownOpen: (open: boolean) => void;
  dropdownRef: RefObject<HTMLDivElement | null>;
  handleLogout: () => void;
}

export default function DashboardNavbar({
  user,
  loading,
  isDropdownOpen,
  setIsDropdownOpen,
  dropdownRef,
  handleLogout
}: DashboardNavbarProps) {
  
  // ------------------------------------------------------------------
  // LEARNING NOTE: "Real-Time" without WebSockets (Smart Polling)
  // Instead of setting up a complex Socket.io server which breaks in 
  // Next.js serverless environments, we use a simple "Interval".
  // Every 10 seconds, the browser quietly asks the server: "Any new notifications?"
  // If yes, it updates the UI instantly. This is extremely robust and easy!
  // ------------------------------------------------------------------
  const [notifications, setNotifications] = useState<any[]>([]);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!user) return; // Don't poll if not logged in

    const fetchNotifications = async () => {
      try {
        const res = await fetch('/api/notifications');
        if (res.ok) {
          const data = await res.json();
          setNotifications(data);
        }
      } catch (e) {
        console.error("Failed to fetch notifications", e);
      }
    };

    // Fetch immediately on load
    fetchNotifications();

    // Then set up our "Socket Alternative" - fetch every 10 seconds
    const interval = setInterval(fetchNotifications, 10000);
    return () => clearInterval(interval); // Cleanup on unmount
  }, [user]);

  // Handle clicking outside the notification dropdown to close it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setIsNotifOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const markAllAsRead = async () => {
    if (unreadCount === 0) return;
    try {
      await fetch('/api/notifications', { method: 'PUT' });
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-[#09090b]/90 backdrop-blur-[12px]">
      <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <a href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-zinc-800 flex items-center justify-center">
              <Zap className="w-4 h-4 text-emerald-500" />
            </div>
            <span className="font-semibold text-sm tracking-tight">DSA Quest</span>
          </a>
          <div className="hidden md:flex items-center gap-1">
            <a href="/dashboard" className="px-3 py-1.5 text-xs font-medium text-white bg-white/5 rounded">Dashboard</a>
            <a href="/" className="px-3 py-1.5 text-xs font-medium text-zinc-400 hover:text-white transition-colors rounded">Contests</a>
            <a href="/resources" className="px-3 py-1.5 text-xs font-medium text-zinc-400 hover:text-white transition-colors rounded">Resources</a>
          </div>
        </div>
        <div className="flex items-center gap-3">
          
          {/* Notification Bell Container */}
          <div className="relative" ref={notifRef}>
            <button 
              onClick={() => {
                setIsNotifOpen(!isNotifOpen);
                if (!isNotifOpen) markAllAsRead(); // Mark read when opening
              }}
              className="p-2 rounded-lg hover:bg-white/5 transition-colors text-zinc-400 hover:text-white relative"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              )}
            </button>

            {/* Notification Dropdown Menu */}
            {isNotifOpen && (
              <div className="absolute right-0 mt-2 w-80 max-h-96 overflow-y-auto bg-[#09090b] border border-white/10 rounded-xl shadow-2xl py-2 z-50 animate-in fade-in slide-in-from-top-2">
                <div className="px-4 py-2 border-b border-white/10 flex justify-between items-center sticky top-0 bg-[#09090b]/90 backdrop-blur-sm">
                  <h3 className="text-sm font-semibold text-white">Notifications</h3>
                </div>
                
                {notifications.length === 0 ? (
                  <div className="px-4 py-8 text-center text-zinc-500 text-xs">
                    No notifications yet.
                  </div>
                ) : (
                  <div className="flex flex-col">
                    {notifications.map(notif => (
                      <div key={notif._id} className={`px-4 py-3 border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors ${!notif.isRead ? 'bg-emerald-500/5' : ''}`}>
                        <div className="flex items-start gap-3">
                          <div className="mt-0.5">
                            {notif.type === 'success' && <Check className="w-4 h-4 text-emerald-500" />}
                            {notif.type === 'error' && <XCircle className="w-4 h-4 text-rose-500" />}
                            {notif.type === 'info' && <Info className="w-4 h-4 text-cyan-500" />}
                          </div>
                          <div>
                            <p className="text-xs text-zinc-300 leading-relaxed">{notif.message}</p>
                            <span className="text-[10px] text-zinc-600 mt-1 block">
                              {new Date(notif.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {loading ? (
            <div className="w-6 h-6 border-2 border-white/20 border-t-emerald-500 rounded-full animate-spin"></div>
          ) : user ? (
            <div className="relative" ref={dropdownRef}>
              <button 
                onClick={() => setIsDropdownOpen(!isDropdownOpen)} 
                className="flex items-center gap-2 pl-1 pr-3 py-1 rounded-full hover:bg-white/5 transition-all focus:outline-none"
              >
                <div className="w-8 h-8 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 overflow-hidden shrink-0">
                  {user.user_metadata?.avatar_url ? (
                    <img src={user.user_metadata.avatar_url} alt="Profile" className="w-full h-full rounded-full object-cover" />
                  ) : (
                    <span className="text-xs font-bold">{user.email?.charAt(0).toUpperCase() || 'U'}</span>
                  )}
                </div>
                <span className="text-sm font-medium text-zinc-300">
                  Hi, {user.user_metadata?.full_name?.split(' ')[0] || user.email?.split('@')[0] || 'User'}
                </span>
              </button>
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-[#09090b] border border-white/10 rounded-xl shadow-2xl py-1 z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="px-4 py-3 border-b border-white/10">
                    <p className="text-xs text-white font-medium truncate mb-0.5">{user.user_metadata?.full_name || 'User'}</p>
                    <p className="text-[10px] text-zinc-400 truncate">{user.email}</p>
                  </div>
                  <div className="p-1">
                    <a
                      href="/dashboard/settings"
                      className="w-full text-left px-3 py-2 text-xs text-zinc-300 hover:bg-white/5 rounded-lg transition-colors flex items-center gap-2 mb-1"
                    >
                      <Settings className="w-3.5 h-3.5" />
                      Settings
                    </a>
                    <button 
                      onClick={handleLogout} 
                      className="w-full text-left px-3 py-2 text-xs text-red-400 hover:bg-red-500/10 rounded-lg transition-colors flex items-center gap-2"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : null}
        </div>
      </div>
    </nav>
  );
}
