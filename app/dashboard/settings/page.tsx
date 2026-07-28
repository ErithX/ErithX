"use client";

import React, { useState, useEffect, useRef } from 'react';
import { createClient } from '@/app/lib/supabase/client';
import DashboardNavbar from '@/components/dashboard/DashboardNavbar';
import { 
  User as UserIcon, Link as LinkIcon, SlidersHorizontal, Bell, 
  Shield, AlertOctagon, CheckCircle, AlertCircle, PlusCircle, X,
  Github, Linkedin, ArrowUpRight, Check, Twitter
} from 'lucide-react';
import ProBadge from '@/components/profile/ProBadge';
import ProfileBanner from '@/components/profile/ProfileBanner';

export default function SettingsPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const [activeSection, setActiveSection] = useState('profile');
  const [toast, setToast] = useState<{message: string, type: 'success'|'error'} | null>(null);
  
  const [extraPlatforms, setExtraPlatforms] = useState<any[]>([]);
  const [isAddPlatformOpen, setIsAddPlatformOpen] = useState(false);
  const addPlatformRef = useRef<HTMLDivElement>(null);

  const [profileForm, setProfileForm] = useState({
    full_name: '',
    bio: '',
    twitter_url: '',
    linkedin_url: ''
  });
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);

  const [notifPrefs, setNotifPrefs] = useState({
    contestAlerts: true,
    weeklyDigest: true,
    productUpdates: false,
  });
  const [savingNotifs, setSavingNotifs] = useState(false);

  const supabase = createClient();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
      if (addPlatformRef.current && !addPlatformRef.current.contains(event.target as Node)) {
        setIsAddPlatformOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['profile', 'connections', 'preferences', 'notifications', 'legal', 'danger'];
      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i]);
        if (el && window.scrollY + 150 >= el.offsetTop) {
          setActiveSection(sections[i]);
          break;
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    if (!user) return;
    fetch('/api/user/profile')
      .then(r => r.json())
      .then(data => {
        if (data.profile) {
          setNotifPrefs({
            contestAlerts: data.profile.email_notifications !== false,
            weeklyDigest: data.profile.weekly_digest !== false,
            productUpdates: data.profile.product_updates === true,
          });
          setProfileForm({
            full_name: data.profile.full_name || '',
            bio: data.profile.bio || ''
          });
        }
      })
      .catch(() => {});
  }, [user]);

  const saveProfile = async () => {
    setIsSavingProfile(true);
    try {
      const res = await fetch('/api/user/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          full_name: profileForm.full_name,
          bio: profileForm.bio
        }),
      });
      if (res.ok) {
        showToast('Profile updated successfully! ✨', 'success');
      } else {
        const errorData = await res.json().catch(() => ({}));
        showToast(errorData.error || 'Failed to update profile', 'error');
      }
    } catch {
      showToast('Failed to update profile', 'error');
    } finally {
      setIsSavingProfile(false);
    }
  };

  const saveNotifPrefs = async (prefs: typeof notifPrefs) => {
    setSavingNotifs(true);
    try {
      const res = await fetch('/api/user/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email_notifications: prefs.contestAlerts,
          weekly_digest: prefs.weeklyDigest,
          product_updates: prefs.productUpdates,
        }),
      });
      if (res.ok) {
        showToast('Notification preferences saved', 'success');
      } else {
        const errorData = await res.json().catch(() => ({}));
        showToast(errorData.error || 'Failed to save preferences', 'error');
      }
    } catch {
      showToast('Failed to save preferences', 'error');
    } finally {
      setSavingNotifs(false);
    }
  };

  const handleDeleteAccount = async () => {
    setIsDeletingAccount(true);
    try {
      const res = await fetch('/api/user/delete', { method: 'DELETE' });
      if (res.ok) {
        showToast('Account deleted. Redirecting...', 'success');
        setTimeout(() => {
          window.location.href = '/';
        }, 1500);
      } else {
        const errorData = await res.json().catch(() => ({}));
        showToast(errorData.error || 'Failed to delete account', 'error');
        setIsDeletingAccount(false);
      }
    } catch {
      showToast('Failed to delete account', 'error');
      setIsDeletingAccount(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/';
  };

  const showToast = (message: string, type: 'success'|'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleAddPlatform = (name: string, id: string, color: string) => {
    if (extraPlatforms.find(p => p.id === id)) {
      showToast(`${name} is already added!`, 'error');
      setIsAddPlatformOpen(false);
      return;
    }
    setExtraPlatforms([...extraPlatforms, { name, id, color }]);
    setIsAddPlatformOpen(false);
    showToast(`${name} field added! ✨`, 'success');
  };

  const handleRemovePlatform = (id: string) => {
    setExtraPlatforms(extraPlatforms.filter(p => p.id !== id));
  };

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      window.scrollTo({ top: el.offsetTop - 100, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-white selection:bg-emerald-800 selection:text-white">
      <style dangerouslySetInnerHTML={{__html: `
        .input-field {
          transition: border-color 150ms ease, box-shadow 150ms ease;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.1);
        }
        .input-field:focus {
          border-color: rgba(16,185,129,0.5);
          box-shadow: 0 0 0 3px rgba(16,185,129,0.1);
          outline: none;
        }
        .toggle-checkbox:checked + .toggle-label {
          background: #10b981;
          border-color: #10b981;
        }
        .toggle-checkbox:checked + .toggle-label .toggle-ball {
          transform: translateX(20px);
          background: #09090b;
        }
        .toggle-checkbox:focus + .toggle-label {
          box-shadow: 0 0 0 3px rgba(16,185,129,0.2);
        }
        .settings-nav-link.active {
          background: rgba(255,255,255,0.05);
          color: #fff;
          border-left-color: #10b981;
        }
        .toast { animation: toastIn 0.3s ease, toastOut 0.3s ease 2.7s forwards; }
        @keyframes toastIn { from { transform: translateY(20px) scale(0.95); opacity:0; } to { transform: translateY(0) scale(1); opacity:1; } }
        @keyframes toastOut { from { opacity:1; } to { opacity:0; } }
      `}} />

      {/* Toast Container */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-2 toast">
          <div 
            className="px-4 py-3 rounded-xl backdrop-blur-md text-xs font-medium flex items-center gap-2" 
            style={{
              background: toast.type === 'success' ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
              border: `1px solid ${toast.type === 'success' ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.2)'}`,
              color: toast.type === 'success' ? '#34d399' : '#fca5a5'
            }}
          >
            {toast.type === 'success' ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
            {toast.message}
          </div>
        </div>
      )}

      <DashboardNavbar 
        user={user} 
        loading={loading} 
        isDropdownOpen={isDropdownOpen} 
        setIsDropdownOpen={setIsDropdownOpen} 
        dropdownRef={dropdownRef} 
        handleLogout={handleLogout} 
      />

      <div className="pt-20 pb-16 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-8">

          {/* LEFT SIDEBAR */}
          <aside className="md:w-56 flex-shrink-0 hidden md:block">
            <div className="sticky top-24">
              <h1 className="text-xl font-semibold tracking-tight mb-6 px-3">Settings</h1>
              <nav className="space-y-1">
                <button onClick={() => scrollTo('profile')} className={`settings-nav-link w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-zinc-400 hover:text-white rounded-md transition-all border-l-2 border-transparent ${activeSection === 'profile' ? 'active' : ''}`}>
                  <UserIcon className="w-3.5 h-3.5" /> Profile
                </button>
                {/* <button onClick={() => scrollTo('connections')} className={`settings-nav-link w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-zinc-400 hover:text-white rounded-md transition-all border-l-2 border-transparent ${activeSection === 'connections' ? 'active' : ''}`}>
                  <LinkIcon className="w-3.5 h-3.5" /> Connections
                </button> */}
                {/* <button onClick={() => scrollTo('preferences')} className={`settings-nav-link w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-zinc-400 hover:text-white rounded-md transition-all border-l-2 border-transparent ${activeSection === 'preferences' ? 'active' : ''}`}>
                  <SlidersHorizontal className="w-3.5 h-3.5" /> Preferences
                </button> */}
                <button onClick={() => scrollTo('notifications')} className={`settings-nav-link w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-zinc-400 hover:text-white rounded-md transition-all border-l-2 border-transparent ${activeSection === 'notifications' ? 'active' : ''}`}>
                  <Bell className="w-3.5 h-3.5" /> Notifications
                </button>
                <div className="pt-4 mt-4 border-t border-white/5"></div>
                {/* <button onClick={() => scrollTo('legal')} className={`settings-nav-link w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-zinc-400 hover:text-white rounded-md transition-all border-l-2 border-transparent ${activeSection === 'legal' ? 'active' : ''}`}>
                  <Shield className="w-3.5 h-3.5" /> Legal & Privacy
                </button> */}
                <button onClick={() => scrollTo('danger')} className={`settings-nav-link w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-red-500/80 hover:text-red-400 rounded-md transition-all border-l-2 border-transparent ${activeSection === 'danger' ? 'active' : ''}`}>
                  <AlertOctagon className="w-3.5 h-3.5" /> Danger Zone
                </button>
              </nav>
            </div>
          </aside>

          {/* RIGHT CONTENT */}
          <main className="flex-1 min-w-0 space-y-8">

            {/* PROFILE SECTION */}
            <section id="profile" className="glass rounded-xl p-6 border border-white/[0.08] bg-white/[0.03]">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-sm font-bold uppercase tracking-widest text-zinc-500 mb-1">Public Profile</h2>
                  <p className="text-xs text-zinc-600">This is how others will see you on the platform.</p>
                </div>
                <ProBadge type="pro" /> {/* Example badge */}
              </div>
              
              <div className="space-y-6">
                {/* Banner Preview (Hidden for now as requested) */}
                {/* <ProfileBanner type="default">...</ProfileBanner> */}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                  {/* Display Name */}
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-zinc-300">Display Name</label>
                    <input 
                      type="text" 
                      value={profileForm.full_name} 
                      onChange={(e) => setProfileForm({...profileForm, full_name: e.target.value})}
                      placeholder="Your Name" 
                      className="input-field w-full px-3 py-2 rounded-lg text-sm text-zinc-200 placeholder:text-zinc-600 transition-all" 
                    />
                  </div>
                  
                  {/* Email */}
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-zinc-300">Email Address <span className="text-[9px] text-zinc-500 ml-1">(Private)</span></label>
                    <input type="email" disabled value={user?.email || ""} className="input-field w-full px-3 py-2 rounded-lg text-sm text-zinc-500 bg-white/[0.01] cursor-not-allowed" />
                  </div>
                </div>

                {/* Bio */}
                <div className="space-y-2">
                  <label className="text-xs font-medium text-zinc-300 flex justify-between">
                    <span>Bio</span>
                    <span className="text-zinc-600">Max 160 chars</span>
                  </label>
                  <textarea 
                    rows={3} 
                    value={profileForm.bio}
                    onChange={(e) => setProfileForm({...profileForm, bio: e.target.value})}
                    placeholder="Software Engineer | Problem Solver | Building the future..." 
                    className="input-field w-full px-3 py-2 rounded-lg text-sm text-zinc-200 placeholder:text-zinc-600 resize-none transition-all"
                  />
                </div>

                {/* SOCIAL URLs HIDDEN FOR NOW */}
                {/* 
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-zinc-300 flex items-center gap-1.5"><Twitter className="w-3.5 h-3.5 text-zinc-400" /> X (Twitter) URL</label>
                    <input type="url" ... />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-zinc-300 flex items-center gap-1.5"><Linkedin className="w-3.5 h-3.5 text-zinc-400" /> LinkedIn URL</label>
                    <input type="url" ... />
                  </div>
                </div> 
                */}

                <div className="flex justify-end pt-4 border-t border-white/5">
                  <button 
                    onClick={saveProfile}
                    disabled={isSavingProfile}
                    className="px-5 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black font-semibold text-xs transition-colors disabled:opacity-50"
                  >
                    {isSavingProfile ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </div>
            </section>

            {/* CONNECTIONS SECTION (HIDDEN FOR FUTURE) */}
            {/* 
            <section id="connections" className="glass rounded-xl p-6 border border-white/[0.08] bg-white/[0.03]">
              ...
            </section>
            */}

            {/* PREFERENCES SECTION (HIDDEN FOR FUTURE) */}
            {/* 
            <section id="preferences" className="glass rounded-xl p-6 border border-white/[0.08] bg-white/[0.03]">
              ...
            </section> 
            */}

            {/* NOTIFICATIONS SECTION */}
            <section id="notifications" className="glass rounded-xl p-6 border border-white/[0.08] bg-white/[0.03]">
              <h2 className="text-sm font-bold uppercase tracking-widest text-zinc-500 mb-1">Email Notifications</h2>
              <p className="text-xs text-zinc-600 mb-6">Manage what emails you receive from DSA Quest.</p>

              <div className="space-y-0">
                <div className="flex items-center justify-between py-4 border-b border-white/5">
                  <div className="pr-4">
                    <div className="text-sm font-medium text-zinc-200">Contest Alerts</div>
                    <div className="text-xs text-zinc-500 mt-0.5">Receive an email when contests are starting soon.</div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="toggle-checkbox sr-only"
                      checked={notifPrefs.contestAlerts}
                      disabled={savingNotifs}
                      onChange={(e) => {
                        const next = { ...notifPrefs, contestAlerts: e.target.checked };
                        setNotifPrefs(next);
                        saveNotifPrefs(next);
                      }}
                    />
                    <div className="toggle-label w-10 h-5 bg-zinc-700 rounded-full border border-white/5 transition-colors duration-200 ease-in-out"></div>
                    <span className="toggle-ball absolute left-0.5 top-0.5 bg-white w-4 h-4 rounded-full transition-transform duration-200 ease-in-out"></span>
                  </label>
                </div>

                <div className="flex items-center justify-between py-4 border-b border-white/5">
                  <div className="pr-4">
                    <div className="text-sm font-medium text-zinc-200">Weekly Digest</div>
                    <div className="text-xs text-zinc-500 mt-0.5">Get your progress review and card updates every Sunday.</div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="toggle-checkbox sr-only"
                      checked={notifPrefs.weeklyDigest}
                      disabled={savingNotifs}
                      onChange={(e) => {
                        const next = { ...notifPrefs, weeklyDigest: e.target.checked };
                        setNotifPrefs(next);
                        saveNotifPrefs(next);
                      }}
                    />
                    <div className="toggle-label w-10 h-5 bg-zinc-700 rounded-full border border-white/5 transition-colors duration-200 ease-in-out"></div>
                    <span className="toggle-ball absolute left-0.5 top-0.5 bg-white w-4 h-4 rounded-full transition-transform duration-200 ease-in-out"></span>
                  </label>
                </div>

                <div className="flex items-center justify-between py-4">
                  <div className="pr-4">
                    <div className="text-sm font-medium text-zinc-200">Product Updates</div>
                    <div className="text-xs text-zinc-500 mt-0.5">News about new features and milestones.</div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="toggle-checkbox sr-only"
                      checked={notifPrefs.productUpdates}
                      disabled={savingNotifs}
                      onChange={(e) => {
                        const next = { ...notifPrefs, productUpdates: e.target.checked };
                        setNotifPrefs(next);
                        saveNotifPrefs(next);
                      }}
                    />
                    <div className="toggle-label w-10 h-5 bg-zinc-700 rounded-full border border-white/5 transition-colors duration-200 ease-in-out"></div>
                    <span className="toggle-ball absolute left-0.5 top-0.5 bg-white w-4 h-4 rounded-full transition-transform duration-200 ease-in-out"></span>
                  </label>
                </div>
              </div>
            </section>

            {/* LEGAL SECTION (HIDDEN FOR FUTURE) */}
            {/* 
            <section id="legal" className="glass rounded-xl p-6 border border-white/[0.08] bg-white/[0.03]">
              ...
            </section>
            */}

            {/* DANGER ZONE */}
            <section id="danger" className="rounded-xl p-6 border border-red-500/10 bg-red-500/[0.02]">
              <h2 className="text-sm font-bold uppercase tracking-widest text-red-500/80 mb-4 flex items-center gap-2">
                <AlertOctagon className="w-4 h-4" /> Danger Zone
              </h2>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="text-sm font-medium text-zinc-200">Delete Account</div>
                  <div className="text-xs text-zinc-500 mt-0.5">Permanently remove all data. This cannot be undone.</div>
                </div>
                <button 
                  onClick={() => setIsDeleteModalOpen(true)} 
                  className="px-4 py-2 rounded-lg bg-red-500/10 border border-red-500/20 text-xs font-medium text-red-400 hover:bg-red-500/20 transition-all whitespace-nowrap"
                >
                  Delete Account
                </button>
              </div>
            </section>

            {/* Save Bar */}
            <div className="flex justify-end pt-4">
              <button 
                onClick={saveProfile}
                disabled={isSavingProfile}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-zinc-900 text-sm font-medium hover:bg-zinc-200 transition-all shadow-lg disabled:opacity-50"
              >
                <Check className="w-4 h-4" /> {isSavingProfile ? 'Saving...' : 'Save Changes'}
              </button>
            </div>

          </main>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#18181b] border border-white/10 rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-2">Delete Account</h3>
            <p className="text-sm text-zinc-400 mb-6">
              Are you sure you want to permanently delete your account? This action cannot be undone and you will lose access to all your saved data. Your shared resources will remain anonymized to prevent broken links.
            </p>
            <div className="flex justify-end gap-3">
              <button 
                onClick={() => setIsDeleteModalOpen(false)}
                disabled={isDeletingAccount}
                className="px-4 py-2 rounded-lg text-sm font-medium text-zinc-300 hover:text-white hover:bg-white/5 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button 
                onClick={handleDeleteAccount}
                disabled={isDeletingAccount}
                className="px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white text-sm font-medium transition-colors shadow-[0_0_15px_rgba(239,68,68,0.3)] disabled:opacity-50 flex items-center gap-2"
              >
                {isDeletingAccount ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Deleting...
                  </>
                ) : (
                  'Yes, Delete My Account'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
