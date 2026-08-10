"use client";

import { useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import UserHeartbeat from '@/components/UserHeartbeat';

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const fetchUser = useAuthStore((state) => state.fetchUser);
  const initialized = useAuthStore((state) => state.initialized);

  useEffect(() => {
    if (!initialized) {
      fetchUser();
    }
  }, [fetchUser, initialized]);

  return (
    <>
      <UserHeartbeat />
      {children}
    </>
  );
}

