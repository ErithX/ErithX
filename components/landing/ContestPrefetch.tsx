'use client';

import { useEffect } from 'react';

export default function ContestPrefetch() {
  useEffect(() => {
    // Prefetch contests and resources only after the browser finishes initial rendering and becomes idle
    const prefetch = () => {
      try {
        fetch('/api/contests', { priority: 'low' }).catch(() => {});
        fetch('/api/resources', { priority: 'low' }).catch(() => {});
      } catch {
        // Silently ignore prefetch network errors
      }
    };

    if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
      const handle = (window as Window & { requestIdleCallback: (cb: () => void, opts?: { timeout: number }) => number; cancelIdleCallback: (id: number) => void }).requestIdleCallback(prefetch, { timeout: 3500 });
      return () => (window as Window & { cancelIdleCallback: (id: number) => void }).cancelIdleCallback(handle);
    } else {
      const timer = setTimeout(prefetch, 2500);
      return () => clearTimeout(timer);
    }
  }, []);

  return null;
}
