"use client";

import React, { useState, useEffect, useRef } from 'react';
import { createClient } from '@/app/lib/supabase/client';
import DashboardNavbar from '@/components/dashboard/DashboardNavbar';
import { 
  User as UserIcon, Link as LinkIcon, SlidersHorizontal, Bell, 
  Shield, AlertOctagon, CheckCircle, AlertCircle, PlusCircle, X,
  Github, Linkedin, ArrowUpRight, Check
} from 'lucide-react';

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
                {/* <button onClick={() => scrollTo('profile')} className={`settings-nav-link w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-zinc-400 hover:text-white rounded-md transition-all border-l-2 border-transparent ${activeSection === 'profile' ? 'active' : ''}`}>
                  <UserIcon className="w-3.5 h-3.5" /> Profile
                </button> */}
                <button onClick={() => scrollTo('connections')} className={`settings-nav-link w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-zinc-400 hover:text-white rounded-md transition-all border-l-2 border-transparent ${activeSection === 'connections' ? 'active' : ''}`}>
                  <LinkIcon className="w-3.5 h-3.5" /> Connections
                </button>
                <button onClick={() => scrollTo('preferences')} className={`settings-nav-link w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-zinc-400 hover:text-white rounded-md transition-all border-l-2 border-transparent ${activeSection === 'preferences' ? 'active' : ''}`}>
                  <SlidersHorizontal className="w-3.5 h-3.5" /> Preferences
                </button>
                <button onClick={() => scrollTo('notifications')} className={`settings-nav-link w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-zinc-400 hover:text-white rounded-md transition-all border-l-2 border-transparent ${activeSection === 'notifications' ? 'active' : ''}`}>
                  <Bell className="w-3.5 h-3.5" /> Notifications
                </button>
                <div className="pt-4 mt-4 border-t border-white/5"></div>
                <button onClick={() => scrollTo('legal')} className={`settings-nav-link w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-zinc-400 hover:text-white rounded-md transition-all border-l-2 border-transparent ${activeSection === 'legal' ? 'active' : ''}`}>
                  <Shield className="w-3.5 h-3.5" /> Legal & Privacy
                </button>
                <button onClick={() => scrollTo('danger')} className={`settings-nav-link w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-red-500/80 hover:text-red-400 rounded-md transition-all border-l-2 border-transparent ${activeSection === 'danger' ? 'active' : ''}`}>
                  <AlertOctagon className="w-3.5 h-3.5" /> Danger Zone
                </button>
              </nav>
            </div>
          </aside>

          {/* RIGHT CONTENT */}
          <main className="flex-1 min-w-0 space-y-8">

            {/* PROFILE SECTION (Hidden for now) */}
            {/* 
            <section id="profile" className="glass rounded-xl p-6 border border-white/[0.08] bg-white/[0.03]">
              <h2 className="text-sm font-bold uppercase tracking-widest text-zinc-500 mb-1">Profile</h2>
              <p className="text-xs text-zinc-600 mb-6">This is how others will see you on the platform.</p>
              
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-4 border-b border-white/5">
                  <div>
                    <div className="text-sm font-medium text-zinc-200">Avatar</div>
                    <div className="text-xs text-zinc-500 mt-0.5">JPG, PNG or GIF. Max 1MB.</div>
                  </div>
                  <div className="flex items-center gap-3">
                    {user?.user_metadata?.avatar_url ? (
                      <img src={user.user_metadata.avatar_url} className="w-10 h-10 rounded-full object-cover border border-white/10" alt="Avatar" />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold text-lg overflow-hidden shrink-0">
                        {user?.user_metadata?.full_name ? user.user_metadata.full_name.charAt(0).toUpperCase() : 'U'}
                      </div>
                    )}
                    <button className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-zinc-300 hover:bg-white/10 transition-all">Upload</button>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-4 border-b border-white/5">
                  <div>
                    <div className="text-sm font-medium text-zinc-200">Display Name</div>
                    <div className="text-xs text-zinc-500 mt-0.5">Your public name.</div>
                  </div>
                  <input type="text" defaultValue={user?.user_metadata?.full_name || "Coder"} className="input-field w-full sm:w-72 px-3 py-1.5 rounded-lg text-sm text-zinc-200 placeholder:text-zinc-600 mono" />
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-4">
                  <div>
                    <div className="text-sm font-medium text-zinc-200">Email Address</div>
                    <div className="text-xs text-zinc-500 mt-0.5">Used for alerts and weekly reviews.</div>
                  </div>
                  <input type="email" defaultValue={user?.email || ""} className="input-field w-full sm:w-72 px-3 py-1.5 rounded-lg text-sm text-zinc-200 placeholder:text-zinc-600 mono" />
                </div>
              </div>
            </section>
            */}

            {/* CONNECTIONS SECTION */}
            <section id="connections" className="glass rounded-xl p-6 border border-white/[0.08] bg-white/[0.03]">
              <h2 className="text-sm font-bold uppercase tracking-widest text-zinc-500 mb-1">Connected Accounts</h2>
              <p className="text-xs text-zinc-600 mb-6">Link your profiles to verify your achievement cards.</p>

              <div className="space-y-0">
                {/* LeetCode */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-4 border-b border-white/5">
                  <div className="flex items-center gap-3">
                    <span className="w-5 h-5 rounded-full bg-yellow-500/20 flex items-center justify-center text-[9px] text-yellow-400 font-bold">L</span>
                    <div>
                      <div className="text-sm font-medium text-zinc-200">LeetCode</div>
                      <div className="text-xs text-zinc-500 mt-0.5">Sync rating and solved problems.</div>
                    </div>
                  </div>
                  <input type="text" placeholder="username" className="input-field w-full sm:w-72 px-3 py-1.5 rounded-lg text-sm text-zinc-200 placeholder:text-zinc-600 mono" />
                </div>

                {/* Codeforces */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-4 border-b border-white/5">
                  <div className="flex items-center gap-3">
                    <span className="w-5 h-5 rounded-full bg-red-500/20 flex items-center justify-center text-[9px] text-red-400 font-bold">C</span>
                    <div>
                      <div className="text-sm font-medium text-zinc-200">Codeforces</div>
                      <div className="text-xs text-zinc-500 mt-0.5">Sync rating and contest history.</div>
                    </div>
                  </div>
                  <input type="text" placeholder="username" className="input-field w-full sm:w-72 px-3 py-1.5 rounded-lg text-sm text-zinc-200 placeholder:text-zinc-600 mono" />
                </div>

                {/* Dynamic CP Inputs */}
                {extraPlatforms.map(p => (
                  <div key={p.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-4 border-b border-white/5">
                    <div className="flex items-center gap-3">
                      <span className="w-5 h-5 rounded-full flex items-center justify-center text-[8px] text-black font-bold" style={{background: p.color}}></span>
                      <div>
                        <div className="text-sm font-medium text-zinc-200">{p.name}</div>
                        <div className="text-xs text-zinc-500 mt-0.5">Sync profile data.</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 w-full sm:w-72">
                      <input type="text" placeholder="username" className="input-field flex-1 px-3 py-1.5 rounded-lg text-sm text-zinc-200 placeholder:text-zinc-600 mono" />
                      <button onClick={() => handleRemovePlatform(p.id)} className="p-1.5 text-zinc-500 hover:text-red-400 transition-colors">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}

                {/* Add More Dropdown */}
                <div className="relative pt-4 pb-6" ref={addPlatformRef}>
                  <button onClick={() => setIsAddPlatformOpen(!isAddPlatformOpen)} className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-emerald-400 hover:text-emerald-300 transition-colors">
                    <PlusCircle className="w-3.5 h-3.5" /> Add Platform
                  </button>
                  
                  {isAddPlatformOpen && (
                    <div className="absolute z-20 w-56 mt-2 bg-[#18181b] border border-white/10 rounded-lg shadow-xl p-1.5">
                      <button onClick={() => handleAddPlatform('CodeChef', 'codechef', '#f97316')} className="w-full flex items-center gap-3 px-3 py-2 rounded-md hover:bg-white/5 text-xs text-zinc-300 transition-colors">
                        <span className="w-2 h-2 rounded-full bg-orange-500"></span> CodeChef
                      </button>
                      <button onClick={() => handleAddPlatform('AtCoder', 'atcoder', '#64748b')} className="w-full flex items-center gap-3 px-3 py-2 rounded-md hover:bg-white/5 text-xs text-zinc-300 transition-colors">
                        <span className="w-2 h-2 rounded-full bg-slate-400"></span> AtCoder
                      </button>
                      <button onClick={() => handleAddPlatform('GeeksforGeeks', 'gfg', '#22c55e')} className="w-full flex items-center gap-3 px-3 py-2 rounded-md hover:bg-white/5 text-xs text-zinc-300 transition-colors">
                        <span className="w-2 h-2 rounded-full bg-green-500"></span> GeeksforGeeks
                      </button>
                    </div>
                  )}
                </div>

                {/* GitHub & LinkedIn in same horizon at the end */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-white/5">
                  <div className="flex flex-col gap-3 p-4 rounded-xl border border-white/5 bg-white/[0.02]">
                    <div className="flex items-center gap-2">
                      <Github className="w-5 h-5 text-white" />
                      <div>
                        <div className="text-sm font-medium text-zinc-200">GitHub</div>
                        <div className="text-[10px] text-zinc-500 mt-0.5">Track open source contributions.</div>
                      </div>
                    </div>
                    <input type="text" placeholder="username" className="input-field w-full px-3 py-1.5 rounded-lg text-sm text-zinc-200 placeholder:text-zinc-600 mono" />
                  </div>
                  
                  <div className="flex flex-col gap-3 p-4 rounded-xl border border-white/5 bg-white/[0.02]">
                    <div className="flex items-center gap-2">
                      <Linkedin className="w-5 h-5 text-[#3b82f6]" />
                      <div>
                        <div className="text-sm font-medium text-zinc-200">LinkedIn</div>
                        <div className="text-[10px] text-zinc-500 mt-0.5">Share milestone cards directly.</div>
                      </div>
                    </div>
                    <input type="text" placeholder="username" className="input-field w-full px-3 py-1.5 rounded-lg text-sm text-zinc-200 placeholder:text-zinc-600 mono" />
                  </div>
                </div>

              </div>
            </section>

            {/* PREFERENCES SECTION */}
            <section id="preferences" className="glass rounded-xl p-6 border border-white/[0.08] bg-white/[0.03]">
              <h2 className="text-sm font-bold uppercase tracking-widest text-zinc-500 mb-1">Contest Preferences</h2>
              <p className="text-xs text-zinc-600 mb-6">Customize which platforms you want to track.</p>

              <div className="space-y-6">
                <div className="py-4 border-b border-white/5">
                  <div className="mb-3">
                    <div className="text-sm font-medium text-zinc-200">Favorite Platforms</div>
                    <div className="text-xs text-zinc-500 mt-0.5">Only receive alerts for these platforms.</div>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-4">
                    {['LeetCode', 'Codeforces', 'CodeChef', 'AtCoder', 'HackerRank', 'GeeksforGeeks'].map((plat, idx) => (
                      <label key={plat} className="flex items-center gap-2 p-2.5 rounded-lg bg-white/[0.02] border border-white/5 cursor-pointer hover:bg-white/[0.04] transition-colors">
                        <input type="checkbox" className="w-3.5 h-3.5 rounded bg-zinc-800 border-zinc-600 text-emerald-600 focus:ring-emerald-500 focus:ring-offset-0" defaultChecked={idx < 2} />
                        <span className="text-xs text-zinc-300">{plat}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-4">
                  <div>
                    <div className="text-sm font-medium text-zinc-200">Default Alert Time</div>
                    <div className="text-xs text-zinc-500 mt-0.5">When to send email alerts before a contest.</div>
                  </div>
                  <select className="input-field w-full sm:w-48 px-3 py-1.5 rounded-lg text-sm text-zinc-200 mono focus:border-emerald-500/50 focus:ring-0">
                    <option>30 minutes before</option>
                    <option>1 hour before</option>
                    <option>2 hours before</option>
                    <option>1 day before</option>
                  </select>
                </div>
              </div>
            </section>

            {/* NOTIFICATIONS SECTION */}
            <section id="notifications" className="glass rounded-xl p-6 border border-white/[0.08] bg-white/[0.03]">
              <h2 className="text-sm font-bold uppercase tracking-widest text-zinc-500 mb-1">Email Notifications</h2>
              <p className="text-xs text-zinc-600 mb-6">Manage what emails you receive from DSA Quest.</p>

              <div className="space-y-0">
                <div className="flex items-center justify-between py-4 border-b border-white/5">
                  <div className="pr-4">
                    <div className="text-sm font-medium text-zinc-200">Contest Alerts</div>
                    <div className="text-xs text-zinc-500 mt-0.5">Receive an email before a contest starts.</div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="toggle-checkbox sr-only" defaultChecked />
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
                    <input type="checkbox" className="toggle-checkbox sr-only" defaultChecked />
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
                    <input type="checkbox" className="toggle-checkbox sr-only" />
                    <div className="toggle-label w-10 h-5 bg-zinc-700 rounded-full border border-white/5 transition-colors duration-200 ease-in-out"></div>
                    <span className="toggle-ball absolute left-0.5 top-0.5 bg-white w-4 h-4 rounded-full transition-transform duration-200 ease-in-out"></span>
                  </label>
                </div>
              </div>
            </section>

            {/* LEGAL SECTION */}
            <section id="legal" className="glass rounded-xl p-6 border border-white/[0.08] bg-white/[0.03]">
              <h2 className="text-sm font-bold uppercase tracking-widest text-zinc-500 mb-1">Legal & Privacy</h2>
              <p className="text-xs text-zinc-600 mb-6">Read our policies and terms.</p>
              <div className="space-y-2">
                <a href="#" className="flex items-center justify-between p-3 rounded-lg hover:bg-white/5 transition-colors group border-b border-white/5">
                  <span className="text-sm text-zinc-300">Privacy Policy</span>
                  <ArrowUpRight className="w-4 h-4 text-zinc-600 group-hover:text-zinc-400" />
                </a>
                <a href="#" className="flex items-center justify-between p-3 rounded-lg hover:bg-white/5 transition-colors group border-b border-white/5">
                  <span className="text-sm text-zinc-300">Terms & Conditions</span>
                  <ArrowUpRight className="w-4 h-4 text-zinc-600 group-hover:text-zinc-400" />
                </a>
                <a href="#" className="flex items-center justify-between p-3 rounded-lg hover:bg-white/5 transition-colors group">
                  <span className="text-sm text-zinc-300">Data Deletion Policy</span>
                  <ArrowUpRight className="w-4 h-4 text-zinc-600 group-hover:text-zinc-400" />
                </a>
              </div>
            </section>

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
                  onClick={() => showToast('Account deletion requires confirmation', 'error')} 
                  className="px-4 py-2 rounded-lg bg-red-500/10 border border-red-500/20 text-xs font-medium text-red-400 hover:bg-red-500/20 transition-all whitespace-nowrap"
                >
                  Delete Account
                </button>
              </div>
            </section>

            {/* Save Bar */}
            <div className="flex justify-end pt-4">
              <button 
                onClick={() => showToast('Settings saved successfully! 🎉', 'success')} 
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-zinc-900 text-sm font-medium hover:bg-zinc-200 transition-all shadow-lg"
              >
                <Check className="w-4 h-4" /> Save Changes
              </button>
            </div>

          </main>
        </div>
      </div>
    </div>
  );
}
