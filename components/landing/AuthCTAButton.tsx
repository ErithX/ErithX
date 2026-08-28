"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';
import AuthModal from '@/components/AuthModal';

interface AuthCTAButtonProps {
  children: React.ReactNode;
  className?: string;
}

export default function AuthCTAButton({ children, className = '' }: AuthCTAButtonProps) {
  const { user } = useAuthStore();
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  return (
    <>
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
      {user ? (
        <Link 
          href={user?.user_metadata?.role === 'professional' ? '/dashboard/pro' : '/dashboard'} 
          className={className}
        >
          {children}
        </Link>
      ) : (
        <button 
          onClick={() => setIsAuthOpen(true)} 
          className={className}
        >
          {children}
        </button>
      )}
    </>
  );
}
