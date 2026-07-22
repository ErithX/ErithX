import { useState, useEffect } from 'react';

// Singleton event emitter for the clock to avoid multiple setIntervals
const clockListeners = new Set<(now: number) => void>();
let clockInterval: NodeJS.Timeout | null = null;

const startClock = () => {
  if (clockInterval) return;
  clockInterval = setInterval(() => {
    const now = Date.now();
    clockListeners.forEach(listener => listener(now));
  }, 1000);
};

export const useGlobalClock = () => {
  // We initialize with null to prevent React Hydration mismatch between Server and Client
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    // Once hydrated on the client, immediately set the time
    setNow(Date.now());
    
    const listener = (time: number) => setNow(time);
    clockListeners.add(listener);
    startClock();
    
    return () => {
      clockListeners.delete(listener);
    };
  }, []);

  return now;
};
