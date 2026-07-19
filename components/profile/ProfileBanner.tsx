import React from 'react';

interface ProfileBannerProps {
  type?: 'pro' | 'official' | 'default';
  children?: React.ReactNode;
}

export default function ProfileBanner({ type = 'default', children }: ProfileBannerProps) {
  let gradientClass = 'bg-gradient-to-r from-zinc-800 to-zinc-900';
  let borderClass = 'border-white/5';
  
  if (type === 'official') {
    gradientClass = 'bg-gradient-to-r from-emerald-500/10 via-emerald-900/20 to-zinc-900';
    borderClass = 'border-emerald-500/20';
  } else if (type === 'pro') {
    gradientClass = 'bg-gradient-to-r from-cyan-500/10 via-cyan-900/20 to-zinc-900';
    borderClass = 'border-cyan-500/20';
  }

  return (
    <div className={`relative w-full rounded-2xl overflow-hidden border ${borderClass} ${gradientClass} p-6 sm:p-8 flex flex-col justify-end min-h-[120px] transition-all duration-500`}>
      {/* Decorative background glow */}
      {type === 'official' && (
        <div className="absolute top-0 left-0 w-64 h-64 bg-emerald-500/20 rounded-full blur-[80px] -translate-y-1/2 -translate-x-1/2 pointer-events-none" />
      )}
      {type === 'pro' && (
        <div className="absolute top-0 left-0 w-64 h-64 bg-cyan-500/20 rounded-full blur-[80px] -translate-y-1/2 -translate-x-1/2 pointer-events-none" />
      )}
      
      {/* Inner Content (Avatar, Name, etc.) */}
      <div className="relative z-10 flex items-end justify-between w-full">
        {children}
      </div>
    </div>
  );
}
