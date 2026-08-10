"use client";

import { useEffect, useRef } from 'react';
import { useAuthStore } from '@/store/authStore';

const HEARTBEAT_INTERVAL_MS = 45000; // 45 seconds

export default function UserHeartbeat() {
  const user = useAuthStore((state) => state.user);
  const lastPingRef = useRef<number>(0);

  useEffect(() => {
    if (!user) return;

    const sendHeartbeat = async () => {
      // Don't send if tab is hidden in background
      if (typeof document !== 'undefined' && document.hidden) return;

      const now = Date.now();
      // Minimum 30 seconds between pings to prevent spamming
      if (now - lastPingRef.current < 30000) return;

      try {
        lastPingRef.current = now;
        await fetch('/api/user/heartbeat', { 
          method: 'POST',
          headers: { 'Content-Type': 'application/json' }
        });
      } catch (err) {
        // Silently fail if network glitch
      }
    };

    // Send immediately when user is detected
    sendHeartbeat();

    // Set recurring timer
    const intervalId = setInterval(sendHeartbeat, HEARTBEAT_INTERVAL_MS);

    // Send heartbeat when user comes back to the tab
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        sendHeartbeat();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleVisibilityChange);

    return () => {
      clearInterval(intervalId);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleVisibilityChange);
    };
  }, [user]);

  return null;
}
