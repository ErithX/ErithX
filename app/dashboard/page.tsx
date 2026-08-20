"use client";

import React, { useState, useEffect, useRef } from 'react';
import { CardType, CardLevel } from '@/components/dashboard/AchievementCard';
import { createClient } from '@/app/lib/supabase/client';

import DashboardNavbar from '@/components/dashboard/DashboardNavbar';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import UserProfileCard from '@/components/dashboard/UserProfileCard';
import UpcomingContestsCard from '@/components/dashboard/UpcomingContestsCard';

// Components hidden for Phase 1
// import AchievementSection from '@/components/dashboard/AchievementSection';
// import ConnectedProfilesCard from '@/components/dashboard/ConnectedProfilesCard';
// import WeeklyReviewCard from '@/components/dashboard/WeeklyReviewCard';
// import SkillMapCard from '@/components/dashboard/SkillMapCard';
// import RecentActivityCard from '@/components/dashboard/RecentActivityCard';

import { useAuthStore } from '@/store/authStore';

export default function DashboardPage() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [currentLevel, setCurrentLevel] = useState<CardLevel>('gold');
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [currentType, setCurrentType] = useState<CardType>('transformation');
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
    <div className="min-h-screen">
      {/* Navbar */}
      <DashboardNavbar 
        user={user} 
        loading={loading} 
        isDropdownOpen={isDropdownOpen} 
        setIsDropdownOpen={setIsDropdownOpen} 
        dropdownRef={dropdownRef} 
        handleLogout={handleLogout} 
      />

      {/* Main */}
      <main className="pt-20 pb-16 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Greeting */}
          <DashboardHeader user={user} />

          {/* Achievement Card Section (Hidden for Phase 1) */}
          {/* 
          <AchievementSection 
            currentLevel={currentLevel} 
            setCurrentLevel={setCurrentLevel} 
            currentType={currentType} 
            setCurrentType={setCurrentType} 
          /> 
          */}

          {/* Two Column */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
            {/* Left 2/3 */}
            <div className="lg:col-span-2 space-y-6">
              {/* Profile + Contributions */}
              <UserProfileCard user={user} />

              {/* Connected Profiles (Hidden for Phase 1) */}
              {/* <ConnectedProfilesCard /> */}

              {/* Weekly Review (Hidden for Phase 1) */}
              {/* <WeeklyReviewCard /> */}
            </div>

            {/* Right 1/3 */}
            <div className="space-y-6">
              {/* Upcoming Contests */}
              <UpcomingContestsCard />

              {/* Skill Map (Hidden for Phase 1) */}
              {/* <SkillMapCard /> */}

              {/* Activity (Hidden for Phase 1) */}
              {/* <RecentActivityCard /> */}
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t border-white/5 py-6 px-6 mt-12">
        <div className="max-w-7xl mx-auto text-center text-[10px] text-zinc-600">© 2025 ErithX. Built for students, backed by pros.</div>
      </footer>
    </div>
  );
}