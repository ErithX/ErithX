'use client';

import { useEffect } from 'react';

export default function ClientLastSeenUpdater() {
  useEffect(() => {
    // We only want this to run in the browser
    if (typeof window === 'undefined') return;

    let isUpdating = false;

    const updateLastSeen = async () => {
      if (isUpdating) return;
      isUpdating = true;
      try {
        await fetch('/api/user/last-seen', {
          method: 'POST',
          // Prevent caching so the timestamp is always fresh
          cache: 'no-store',
        });
      } catch (error) {
        console.error('Failed to update last seen:', error);
      } finally {
        isUpdating = false;
      }
    };

    // 1. Update immediately on mount
    updateLastSeen();

    // 2. Setup polling interval (e.g., every 45 seconds)
    const interval = setInterval(updateLastSeen, 45 * 1000);

    // 3. Listen for visibility changes (tab hidden, window minimized)
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        // Use sendBeacon for more reliable delivery when navigating away
        if (navigator.sendBeacon) {
          navigator.sendBeacon('/api/user/last-seen');
        } else {
          updateLastSeen();
        }
      } else if (document.visibilityState === 'visible') {
        updateLastSeen();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Cleanup
    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  return null; // This component doesn't render anything
}
