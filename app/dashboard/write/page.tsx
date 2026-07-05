"use client";

import React, { useState, useEffect, useRef } from 'react';
import { createClient } from '@/app/lib/supabase/client';
import DashboardNavbar from '@/components/dashboard/DashboardNavbar';
import TiptapEditor from '@/components/editor/TiptapEditor';
import { Sparkles, Send } from 'lucide-react';

export default function WritePage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const supabase = createClient();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
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

  const handlePublish = () => {
    console.log("Publishing Article:", { title, content });
    alert("Core Editor Setup Complete! Backend logic will be added in Phase 3.");
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-white selection:bg-emerald-800 selection:text-white">
      <DashboardNavbar 
        user={user} 
        loading={loading} 
        isDropdownOpen={isDropdownOpen} 
        setIsDropdownOpen={setIsDropdownOpen} 
        dropdownRef={dropdownRef} 
        handleLogout={handleLogout} 
      />

      <main className="pt-20 pb-16 px-6">
        <div className="max-w-4xl mx-auto space-y-6">
          
          {/* Header Area */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/5">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-emerald-400" /> New Publication
              </h1>
              <p className="text-sm text-zinc-500 mt-1">Write blogs, study notes, or share resources with the community.</p>
            </div>
            
            <button 
              onClick={handlePublish}
              className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 text-white font-medium hover:bg-emerald-400 transition-colors shadow-[0_0_15px_rgba(16,185,129,0.3)] hover:shadow-[0_0_25px_rgba(16,185,129,0.5)]"
            >
              <Send className="w-4 h-4" /> Publish
            </button>
          </div>

          {/* Title Input */}
          <div>
            <input 
              type="text" 
              placeholder="Article Title..." 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-transparent text-4xl font-bold tracking-tight text-white placeholder:text-zinc-700 border-none focus:outline-none focus:ring-0 py-4"
            />
          </div>

          {/* Core Tiptap Editor */}
          <div className="min-h-[500px]">
            <TiptapEditor content={content} onChange={setContent} />
          </div>

        </div>
      </main>
    </div>
  );
}
