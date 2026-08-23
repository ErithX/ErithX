"use client";

import React, { useState, useEffect, useRef } from 'react';
import { createClient } from '@/app/lib/supabase/client';
import DashboardNavbar from '@/components/dashboard/DashboardNavbar';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import WeeklyReviewCard from '@/components/dashboard/WeeklyReviewCard';
import GiveBackCard from '@/components/dashboard/GiveBackCard';
import UpcomingContestsCard from '@/components/dashboard/UpcomingContestsCard';
import ConnectedProfilesStatus from '@/components/dashboard/ConnectedProfilesStatus';
import AccountSettingsCard from '@/components/dashboard/AccountSettingsCard';
import { useAuthStore } from '@/store/authStore';

export default function DashboardPage() {
  const { user, loading } = useAuthStore();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const supabase = createClient();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Redirect professional users to the pro dashboard
  useEffect(() => {
    if (!loading && user?.user_metadata?.role === 'professional') {
      window.location.href = '/dashboard/pro';
    }
  }, [user, loading]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen bg-[#09090b] grid-bg">
      {/* Navbar */}
      <DashboardNavbar 
        user={user} 
        loading={loading} 
        isDropdownOpen={isDropdownOpen} 
        setIsDropdownOpen={setIsDropdownOpen} 
        dropdownRef={dropdownRef} 
        handleLogout={handleLogout} 
      />

      {/* Main Content */}
      <main className="relative pt-24 pb-20 z-10">
        <div className="max-w-7xl mx-auto px-6">
          
          {/* Header */}
          <DashboardHeader user={user} />

          {/* Dashboard Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            
            {/* Left Column (2/3 width) */}
            <div className="lg:col-span-2 flex flex-col gap-6">
              <WeeklyReviewCard />
              <GiveBackCard />
            </div>

            {/* Right Column (1/3 width) - Sticky */}
            <div className="flex flex-col gap-5 lg:sticky lg:top-20">
              <UpcomingContestsCard />
              <ConnectedProfilesStatus />
              <AccountSettingsCard />
            </div>

          </div>
        </div>
      </main>
      
      {/* Footer */}
      <footer className="border-t border-white/5 py-6 px-6 mt-12">
        <div className="max-w-7xl mx-auto text-center text-[10px] text-zinc-600">
          © {new Date().getFullYear()} DSA Quest. Built for students, backed by pros.
        </div>
      </footer>
    </div>
  );
}