"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { createClient } from '@/app/lib/supabase/client';
import DashboardNavbar from '@/components/dashboard/DashboardNavbar';
import { 
  User as UserIcon, Link as LinkIcon, SlidersHorizontal, Bell, 
  Shield, AlertOctagon, CheckCircle, AlertCircle, PlusCircle, X,
  Github, Linkedin, ArrowUpRight, Check, Twitter, Loader2, Sparkles, Bot, Info, ArrowRight
} from 'lucide-react';
import ProBadge from '@/components/profile/ProBadge';
import ProfileBanner from '@/components/profile/ProfileBanner';
import CodingProfilesSettings from '@/components/settings/CodingProfilesSettings';

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

  const [socialSaveStatus, setSocialSaveStatus] = useState<{twitter: 'idle'|'saving'|'saved'|'error', linkedin: 'idle'|'saving'|'saved'|'error'}>({twitter: 'idle', linkedin: 'idle'});
  const [socialErrors, setSocialErrors] = useState<{twitter: string, linkedin: string}>({twitter: '', linkedin: ''});
  const socialTimers = useRef<{twitter: NodeJS.Timeout | null, linkedin: NodeJS.Timeout | null}>({twitter: null, linkedin: null});

  const [notifPrefs, setNotifPrefs] = useState({
    mentorReview: false,
    contestAlerts: true,
    weeklyDigest: true,
    productUpdates: false,
  });
  const [savingNotifs, setSavingNotifs] = useState(false);

  // UI Only State for new settings
  const [mentorPrefs, setMentorPrefs] = useState({
    goal: 'Balanced Growth',
    focus: '',
    strictness: 'Normal'
  });
  const [accountInfo] = useState({
    status: 'active', // active | inactive | pending
    lastVisit: '2026-08-16T10:00:00Z',
    plan: 'free',
    daysRemaining: 0,
    quota: '3/4 Reviews Used',
    inactivityDays: 12
  });
  const [isSavingMentor, setIsSavingMentor] = useState(false);

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
            mentorReview: data.profile.mentor_review_enabled !== false,
          });
          setProfileForm({
            full_name: data.profile.full_name || '',
            bio: data.profile.bio || '',
            twitter_url: data.profile.twitter_url || '',
            linkedin_url: data.profile.linkedin_url || ''
          });
          if (data.profile.mentorPrefs) {
            setMentorPrefs({
              goal: data.profile.mentorPrefs.goal || 'Balanced Generalist',
              focus: data.profile.mentorPrefs.focus || '',
              strictness: data.profile.mentorPrefs.strictness || 'Normal'
            });
          }
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
          bio: profileForm.bio,
          twitter_url: profileForm.twitter_url,
          linkedin_url: profileForm.linkedin_url
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

  const saveMentorPrefs = async () => {
    setIsSavingMentor(true);
    try {
      const res = await fetch('/api/user/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mentorPrefs
        }),
      });
      if (res.ok) {
        showToast('Mentor configuration saved! 🤖', 'success');
      } else {
        showToast('Failed to save mentor config', 'error');
      }
    } catch {
      showToast('Failed to save mentor config', 'error');
    } finally {
      setIsSavingMentor(false);
    }
  };

  const saveSocialToBackend = async (platform: 'twitter' | 'linkedin', url: string) => {
    setSocialSaveStatus(prev => ({ ...prev, [platform]: 'saving' }));
    try {
      const payload = platform === 'twitter' ? { twitter_url: url } : { linkedin_url: url };
      const res = await fetch('/api/user/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        setSocialSaveStatus(prev => ({ ...prev, [platform]: 'saved' }));
        setTimeout(() => setSocialSaveStatus(prev => ({ ...prev, [platform]: 'idle' })), 2500);
      } else {
        setSocialSaveStatus(prev => ({ ...prev, [platform]: 'error' }));
      }
    } catch {
      setSocialSaveStatus(prev => ({ ...prev, [platform]: 'error' }));
    }
  };

  const validateAndSaveSocial = async (platform: 'twitter' | 'linkedin', url: string) => {
    const trimmed = url.trim();
    if (!trimmed) {
      setSocialErrors(prev => ({ ...prev, [platform]: '' }));
      saveSocialToBackend(platform, '');
      return;
    }

    let isValid = false;
    if (platform === 'twitter') {
      isValid = /^(https?:\/\/)?(www\.)?(twitter\.com|x\.com)\/[A-Za-z0-9_]{1,15}\/?$/.test(trimmed) || /^[A-Za-z0-9_]{1,15}$/.test(trimmed);
    } else {
      isValid = /^(https?:\/\/)?(www\.)?linkedin\.com\/in\/[A-Za-z0-9_-]+\/?$/.test(trimmed) || /^[A-Za-z0-9_-]+$/.test(trimmed);
    }

    if (!isValid) {
      setSocialErrors(prev => ({ ...prev, [platform]: 'Invalid URL format' }));
      setSocialSaveStatus(prev => ({ ...prev, [platform]: 'error' }));
      return;
    }

    setSocialErrors(prev => ({ ...prev, [platform]: '' }));
    saveSocialToBackend(platform, trimmed);
  };

  const handleSocialChange = (platform: 'twitter' | 'linkedin', val: string) => {
    setProfileForm(prev => ({ ...prev, [`${platform}_url`]: val }));
    if (socialTimers.current[platform]) clearTimeout(socialTimers.current[platform]!);
    socialTimers.current[platform] = setTimeout(() => {
      validateAndSaveSocial(platform, val);
    }, 500);
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
    <div className="min-h-screen bg-[#09090b] text-white selection:bg-zinc-800 selection:text-white font-sans">
      <style dangerouslySetInnerHTML={{__html: `
        .toggle-checkbox:checked + .toggle-label {
          background: #10b981;
          border-color: #10b981;
          box-shadow: 0 0 12px rgba(16, 185, 129, 0.4);
        }
        .toggle-checkbox:checked ~ .toggle-ball {
          transform: translateX(20px);
          background: #000;
        }
        .toggle-checkbox:focus + .toggle-label {
          box-shadow: 0 0 0 2px rgba(255,255,255,0.2);
        }
        .settings-nav-link.active {
          background: rgba(255,255,255,0.05);
          color: #fff;
        }
        .toast { animation: toastIn 0.3s ease, toastOut 0.3s ease 2.7s forwards; }
        @keyframes toastIn { from { transform: translateY(20px) scale(0.95); opacity:0; } to { transform: translateY(0) scale(1); opacity:1; } }
        @keyframes toastOut { from { opacity:1; } to { opacity:0; } }
      `}} />

      {/* Toast Container */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-2 toast">
          <div 
            className="px-4 py-3 rounded-md border text-sm font-medium flex items-center gap-2 shadow-lg bg-black" 
            style={{
              borderColor: toast.type === 'success' ? '#27272a' : '#ef4444',
              color: toast.type === 'success' ? '#fff' : '#f87171'
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

      <div className="pt-24 pb-16 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-8">

          {/* LEFT SIDEBAR */}
          <aside className="md:w-56 flex-shrink-0 hidden md:block">
            <div className="sticky top-28">
              <h1 className="text-2xl font-medium tracking-tight mb-6 px-3">Settings</h1>
              <nav className="space-y-1">
                <button onClick={() => scrollTo('profile')} className={`settings-nav-link w-full flex items-center gap-2.5 px-3 py-2 text-sm font-medium text-zinc-400 hover:text-white rounded-md transition-all ${activeSection === 'profile' ? 'active' : ''}`}>
                  Profile
                </button>
                <button onClick={() => scrollTo('ai-mentor')} className={`settings-nav-link w-full flex items-center gap-2.5 px-3 py-2 text-sm font-medium text-zinc-400 hover:text-white rounded-md transition-all ${activeSection === 'ai-mentor' ? 'active' : ''}`}>
                  AI Mentor Engine
                </button>
                <button onClick={() => scrollTo('connections')} className={`settings-nav-link w-full flex items-center gap-2.5 px-3 py-2 text-sm font-medium text-zinc-400 hover:text-white rounded-md transition-all ${activeSection === 'connections' ? 'active' : ''}`}>
                  Coding Profiles
                </button>
                <button onClick={() => scrollTo('subscription')} className={`settings-nav-link w-full flex items-center gap-2.5 px-3 py-2 text-sm font-medium text-zinc-400 hover:text-white rounded-md transition-all ${activeSection === 'subscription' ? 'active' : ''}`}>
                  Subscription
                </button>
                <button onClick={() => scrollTo('email-prefs')} className={`settings-nav-link w-full flex items-center gap-2.5 px-3 py-2 text-sm font-medium text-zinc-400 hover:text-white rounded-md transition-all ${activeSection === 'email-prefs' ? 'active' : ''}`}>
                  Email Preferences
                </button>
                <div className="pt-4 mt-4 border-t border-zinc-800"></div>
                <Link href="/terms" className="settings-nav-link w-full flex items-center gap-2.5 px-3 py-2 text-sm font-medium text-zinc-400 hover:text-white rounded-md transition-all">
                  Terms of Service
                </Link>
                <Link href="/privacy" className="settings-nav-link w-full flex items-center gap-2.5 px-3 py-2 text-sm font-medium text-zinc-400 hover:text-white rounded-md transition-all">
                  Privacy Policy
                </Link>
                <button onClick={() => scrollTo('danger')} className={`settings-nav-link w-full flex items-center gap-2.5 px-3 py-2 text-sm font-medium text-red-500/80 hover:text-red-400 rounded-md transition-all ${activeSection === 'danger' ? 'active' : ''}`}>
                  Danger Zone
                </button>
              </nav>
            </div>
          </aside>

          {/* RIGHT CONTENT */}
          <main className="flex-1 min-w-0 space-y-8 pb-20">

            {/* PROFILE SECTION */}
            <section id="profile" className="max-w-4xl border border-zinc-800 rounded-lg bg-black overflow-hidden">
              <div className="p-6 md:p-8">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-medium text-zinc-100">Public Profile</h2>
                    <p className="text-sm text-zinc-400 mt-1">This is how others will see you on the platform.</p>
                  </div>
                  <ProBadge type="pro" />
                </div>
                
                <div className="space-y-6 mt-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Display Name */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-zinc-200">Display Name</label>
                      <input 
                        type="text" 
                        value={profileForm.full_name} 
                        onChange={(e) => setProfileForm({...profileForm, full_name: e.target.value})}
                        placeholder="Your Name" 
                        className="w-full px-3 py-2 rounded-md bg-black border border-zinc-800 text-sm text-zinc-100 placeholder:text-zinc-600 transition-colors focus:outline-none focus:border-zinc-400"
                      />
                    </div>
                    
                    {/* Email */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-zinc-200">Email Address <span className="text-xs text-zinc-500 ml-1">(Private)</span></label>
                      <input type="email" disabled value={user?.email || ""} className="w-full px-3 py-2 rounded-md bg-zinc-900 border border-zinc-800 text-sm text-zinc-500 cursor-not-allowed" />
                    </div>
                  </div>

                  {/* Bio */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-zinc-200 flex justify-between">
                      <span>Bio</span>
                      <span className="text-zinc-500 text-xs mt-0.5">Max 160 chars</span>
                    </label>
                    <textarea 
                      rows={3} 
                      value={profileForm.bio}
                      onChange={(e) => setProfileForm({...profileForm, bio: e.target.value})}
                      placeholder="Software Engineer | Problem Solver | Building the future..." 
                      className="w-full px-3 py-2 rounded-md bg-black border border-zinc-800 text-sm text-zinc-100 placeholder:text-zinc-600 resize-none transition-colors focus:outline-none focus:border-zinc-400"
                    />
                  </div>

                  {/* SOCIAL URLs */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="text-sm font-medium text-zinc-200 flex items-center gap-1.5">X (Twitter) URL</label>
                        <div className="flex items-center gap-2">
                          {socialSaveStatus.twitter === 'saving' && <Loader2 className="w-3.5 h-3.5 text-zinc-500 animate-spin" />}
                          {socialSaveStatus.twitter === 'saved' && <span className="text-emerald-500 animate-in zoom-in duration-200"><Check className="w-4 h-4" strokeWidth={3} /></span>}
                        </div>
                      </div>
                      <input 
                        type="text" 
                        value={profileForm.twitter_url}
                        onChange={(e) => handleSocialChange('twitter', e.target.value)}
                        placeholder="https://x.com/username or username"
                        className={`w-full px-3 py-2 rounded-md bg-black border text-sm text-zinc-100 placeholder:text-zinc-600 transition-colors focus:outline-none focus:border-zinc-400 ${socialErrors.twitter ? 'border-red-500/50 focus:border-red-500' : 'border-zinc-800'}`}
                      />
                      {socialErrors.twitter && <p className="text-sm text-red-500">{socialErrors.twitter}</p>}
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="text-sm font-medium text-zinc-200 flex items-center gap-1.5">LinkedIn URL</label>
                        <div className="flex items-center gap-2">
                          {socialSaveStatus.linkedin === 'saving' && <Loader2 className="w-3.5 h-3.5 text-zinc-500 animate-spin" />}
                          {socialSaveStatus.linkedin === 'saved' && <span className="text-emerald-500 animate-in zoom-in duration-200"><Check className="w-4 h-4" strokeWidth={3} /></span>}
                        </div>
                      </div>
                      <input 
                        type="text" 
                        value={profileForm.linkedin_url}
                        onChange={(e) => handleSocialChange('linkedin', e.target.value)}
                        placeholder="https://linkedin.com/in/username or username"
                        className={`w-full px-3 py-2 rounded-md bg-black border text-sm text-zinc-100 placeholder:text-zinc-600 transition-colors focus:outline-none focus:border-zinc-400 ${socialErrors.linkedin ? 'border-red-500/50 focus:border-red-500' : 'border-zinc-800'}`}
                      />
                      {socialErrors.linkedin && <p className="text-sm text-red-500">{socialErrors.linkedin}</p>}
                    </div>
                  </div> 
                </div>
              </div>
              <div className="px-6 py-4 border-t border-zinc-800 bg-zinc-900/30 flex items-center justify-end">
                <button 
                  onClick={saveProfile}
                  disabled={isSavingProfile}
                  className="px-4 py-2 rounded-md bg-white text-black text-sm font-medium hover:bg-zinc-200 transition-colors disabled:opacity-50"
                >
                  {isSavingProfile ? 'Saving...' : 'Save'}
                </button>
              </div>
            </section>

            {/* AI MENTOR CONFIGURATION */}
            <section id="ai-mentor" className="max-w-4xl border border-zinc-800 rounded-lg bg-black overflow-hidden relative">
              <div className="p-6 md:p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div>
                    <h2 className="text-xl font-medium text-white">AI Mentor Configuration</h2>
                    <p className="text-sm text-zinc-400 mt-0.5">Calibrate how the senior engineering LLM analyzes your progress.</p>
                  </div>
                </div>

                <div className="space-y-8 mt-8">
                  {/* Reactivation Status */}
                  <div className="p-5 rounded-xl bg-zinc-900/50 border border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h3 className="text-sm font-medium text-zinc-200">Review Status</h3>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`px-2.5 py-1 text-xs font-medium rounded-full border ${
                        accountInfo.status === 'active' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                        accountInfo.status === 'pending' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                        'bg-red-500/10 text-red-400 border-red-500/20'
                      }`}>
                        {accountInfo.status.charAt(0).toUpperCase() + accountInfo.status.slice(1)}
                      </span>
                      {accountInfo.status === 'inactive' && (
                        <button className="px-3 py-1.5 rounded-lg bg-white text-black text-xs font-semibold hover:bg-zinc-200 transition-colors">
                          Request Reactivation
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Goal / Focus Preference */}
                  <div className="space-y-3">
                    <label className="text-sm font-medium text-zinc-200">Primary Career Target</label>
                    <p className="text-xs text-zinc-500">The mentor will tailor problem recommendations and strictness to this path.</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
                      {['FAANG / Top Product', 'Startups & Building', 'Competitive Programming', 'Balanced Generalist', 'Custom Path'].map(goal => (
                        <label key={goal} className={`flex items-center p-4 border rounded-xl cursor-pointer transition-all ${mentorPrefs.goal === goal ? 'bg-zinc-800 border-zinc-600' : 'bg-black border-zinc-800 hover:border-zinc-700'}`}>
                          <input 
                            type="radio" 
                            name="career-goal" 
                            value={goal}
                            checked={mentorPrefs.goal === goal}
                            onChange={(e) => setMentorPrefs({...mentorPrefs, goal: e.target.value})}
                            className="text-white bg-zinc-900 border-zinc-700 focus:ring-white focus:ring-offset-zinc-900"
                          />
                          <span className={`ml-3 text-sm ${mentorPrefs.goal === goal ? 'text-white font-medium' : 'text-zinc-400'}`}>{goal}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Personal Focus Area */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <label className="text-sm font-medium text-zinc-200">Current Focus Area</label>
                        {accountInfo.plan === 'free' && (
                          <div className="group relative flex items-center">
                            <Info className="w-4 h-4 text-zinc-500 cursor-help hover:text-zinc-300 transition-colors" />
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 rounded-lg bg-zinc-800 text-xs text-zinc-300 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-xl border border-zinc-700 z-10 text-center">
                              Pro unlocks 600 characters and higher LLM priority.
                            </div>
                          </div>
                        )}
                      </div>
                      <ProBadge type="pro" />
                    </div>
                    <p className="text-xs text-zinc-500">Provide direct context on what you are struggling with to guide the AI Review.</p>
                    <div className="relative">
                      <textarea 
                        rows={3} 
                        maxLength={accountInfo.plan === 'free' ? 160 : 600}
                        value={mentorPrefs.focus}
                        onChange={(e) => setMentorPrefs({...mentorPrefs, focus: e.target.value})}
                        placeholder="e.g., I am focusing heavily on Graph Data Structures for the next three weeks." 
                        className="w-full px-4 py-3 rounded-xl bg-zinc-900/40 border border-zinc-800 text-sm text-zinc-100 placeholder:text-zinc-600 resize-none transition-colors focus:outline-none focus:border-zinc-500"
                      />
                    </div>
                    <div className="flex justify-end items-center text-[11px] text-zinc-500 mt-2">
                      <span className={mentorPrefs.focus.length >= 160 ? "text-amber-500" : ""}>{mentorPrefs.focus.length} / {accountInfo.plan === 'free' ? '160' : '600'} characters</span>
                    </div>
                  </div>

                  {/* Strictness Level */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-6 mt-4 border-t border-zinc-800/50">
                    <label className="text-sm font-medium text-zinc-200">Preferred Tone</label>
                    <div className="flex items-center gap-1 p-1 rounded-full bg-zinc-900/50 border border-zinc-800/80">
                      {['Soft', 'Normal', 'Direct'].map(level => (
                        <button 
                          key={level}
                          onClick={() => setMentorPrefs({...mentorPrefs, strictness: level})}
                          className={`px-4 py-1.5 rounded-full text-xs font-medium transition-colors ${
                            mentorPrefs.strictness === level 
                              ? 'bg-white text-black shadow-sm' 
                              : 'text-zinc-400 hover:text-zinc-200'
                          }`}
                        >
                          {level}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <div className="px-6 py-4 border-t border-zinc-800 bg-zinc-900/30 flex items-center justify-end">
                <button 
                  onClick={saveMentorPrefs}
                  disabled={isSavingMentor}
                  className="px-4 py-2 rounded-md bg-white text-black text-sm font-medium hover:bg-zinc-200 transition-colors disabled:opacity-50"
                >
                  {isSavingMentor ? 'Saving...' : 'Save Configuration'}
                </button>
              </div>
            </section>

            {/* CODING PROFILES / CONNECTIONS SECTION */}
            <CodingProfilesSettings />

            {/* SUBSCRIPTION & USAGE SECTION */}
            <section id="subscription" className="max-w-4xl border border-zinc-800 rounded-lg bg-black overflow-hidden">
              <div className="p-6 md:p-8">
                <h2 className="text-xl font-medium text-zinc-100 mb-6">Account & Subscription</h2>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 rounded-xl bg-zinc-900/30 border border-zinc-800/50">
                    <div className="text-xs text-zinc-500 mb-1">Current Plan</div>
                    <div className="text-lg font-semibold text-white capitalize">{accountInfo.plan}</div>
                  </div>
                  <div className="p-4 rounded-xl bg-zinc-900/30 border border-zinc-800/50">
                    <div className="text-xs text-zinc-500 mb-1">Days Until Inactive</div>
                    <div className="text-lg font-semibold text-emerald-400">{accountInfo.inactivityDays} Days</div>
                  </div>
                  <div className="p-4 rounded-xl bg-zinc-900/30 border border-zinc-800/50">
                    <div className="text-xs text-zinc-500 mb-1">Subscription</div>
                    <div className="text-sm font-medium text-zinc-400 mt-1">No active subscription</div>
                  </div>
                </div>

                <div className="mt-6 flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-zinc-900 to-black border border-zinc-800">
                  <div>
                    <h4 className="text-sm font-medium text-zinc-200">Upgrade to Pro</h4>
                    <p className="text-xs text-zinc-500 mt-0.5">Unlock brutal feedback, unlimited tracking, and deep historical analytics.</p>
                  </div>
                  <button className="px-5 py-2.5 rounded-full bg-white text-black text-xs font-semibold hover:bg-zinc-200 transition-colors whitespace-nowrap shadow-[0_0_15px_rgba(255,255,255,0.1)] flex items-center gap-2">
                    View Plans
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </section>

            {/* EMAIL PREFERENCES SECTION */}
            <section id="email-prefs" className="max-w-4xl border border-zinc-800 rounded-lg bg-black overflow-hidden">
              <div className="p-6 md:p-8">
                <h2 className="text-xl font-medium text-zinc-100">Email Preferences</h2>
                <p className="text-sm text-zinc-400 mt-1 mb-8">Manage what emails you receive from DSA Quest.</p>

                <div className="space-y-0">
                  
                  {/* AI Mentor Trigger */}
                  <div className="flex items-center justify-between py-4 border-b border-zinc-800">
                    <div className="pr-4">
                      <div className="text-sm font-medium text-zinc-200">
                        Receive Mentor Feedback Emails
                      </div>
                      <div className="text-sm text-zinc-500 mt-0.5">Allow the AI Senior Engineer to email you weekly reality checks.</div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="toggle-checkbox sr-only"
                        checked={notifPrefs.mentorReview}
                        disabled={savingNotifs}
                        onChange={(e) => {
                          const next = { ...notifPrefs, mentorReview: e.target.checked };
                          setNotifPrefs(next);
                          // saveNotifPrefs(next); // Implement later
                        }}
                      />
                      <div className="toggle-label w-10 h-5 bg-zinc-800 rounded-full border border-zinc-700 transition-colors duration-200 ease-in-out"></div>
                      <span className="toggle-ball absolute left-0.5 top-0.5 bg-zinc-400 w-4 h-4 rounded-full transition-transform duration-200 ease-in-out"></span>
                    </label>
                  </div>
                  <div className="flex items-center justify-between py-4 border-b border-zinc-800">
                    <div className="pr-4">
                      <div className="text-sm font-medium text-zinc-200">Contest Alerts</div>
                      <div className="text-sm text-zinc-500 mt-0.5">Receive an email when contests are starting soon.</div>
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
                      <div className="toggle-label w-10 h-5 bg-zinc-800 rounded-full border border-zinc-700 transition-colors duration-200 ease-in-out"></div>
                      <span className="toggle-ball absolute left-0.5 top-0.5 bg-zinc-400 w-4 h-4 rounded-full transition-transform duration-200 ease-in-out"></span>
                    </label>
                  </div>

                  <div className="flex items-center justify-between py-4 border-b border-zinc-800">
                    <div className="pr-4">
                      <div className="text-sm font-medium text-zinc-200">Weekly Digest</div>
                      <div className="text-sm text-zinc-500 mt-0.5">Get your progress review and card updates every Sunday.</div>
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
                      <div className="toggle-label w-10 h-5 bg-zinc-800 rounded-full border border-zinc-700 transition-colors duration-200 ease-in-out"></div>
                      <span className="toggle-ball absolute left-0.5 top-0.5 bg-zinc-400 w-4 h-4 rounded-full transition-transform duration-200 ease-in-out"></span>
                    </label>
                  </div>

                  <div className="flex items-center justify-between py-4">
                    <div className="pr-4">
                      <div className="text-sm font-medium text-zinc-200">Product Updates</div>
                      <div className="text-sm text-zinc-500 mt-0.5">News about new features and milestones.</div>
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
                      <div className="toggle-label w-10 h-5 bg-zinc-800 rounded-full border border-zinc-700 transition-colors duration-200 ease-in-out"></div>
                      <span className="toggle-ball absolute left-0.5 top-0.5 bg-zinc-400 w-4 h-4 rounded-full transition-transform duration-200 ease-in-out"></span>
                    </label>
                  </div>
                </div>
              </div>
            </section>

            {/* DANGER ZONE */}
            <section id="danger" className="max-w-4xl border border-red-900/50 rounded-lg bg-black overflow-hidden">
              <div className="p-6 md:p-8">
                <h2 className="text-xl font-medium text-red-500 mb-4">
                  Danger Zone
                </h2>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="text-sm font-medium text-zinc-200">Delete Account</div>
                    <div className="text-sm text-zinc-500 mt-0.5">Permanently remove all data. This cannot be undone.</div>
                  </div>
                  <button 
                    onClick={() => setIsDeleteModalOpen(true)} 
                    className="px-4 py-2 rounded-md bg-red-950/40 border border-red-900/50 text-sm font-medium text-red-500 hover:bg-red-900/40 transition-colors whitespace-nowrap shrink-0"
                  >
                    Delete Account
                  </button>
                </div>
              </div>
            </section>

          </main>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-black border border-zinc-800 rounded-xl p-6 max-w-md w-full shadow-2xl">
            <h3 className="text-lg font-medium text-white mb-2">Delete Account</h3>
            <p className="text-sm text-zinc-400 mb-6">
              Are you sure you want to permanently delete your account? This action cannot be undone and you will lose access to all your saved data. Your shared resources will remain anonymized.
            </p>
            <div className="flex justify-end gap-3">
              <button 
                onClick={() => setIsDeleteModalOpen(false)}
                disabled={isDeletingAccount}
                className="px-4 py-2 rounded-md text-sm font-medium text-zinc-400 hover:text-white hover:bg-zinc-900 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button 
                onClick={handleDeleteAccount}
                disabled={isDeletingAccount}
                className="px-4 py-2 rounded-md bg-red-600 hover:bg-red-700 text-white text-sm font-medium transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {isDeletingAccount ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Deleting...
                  </>
                ) : (
                  'Delete Account'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
