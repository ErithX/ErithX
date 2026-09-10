import { useEffect, useState } from 'react';

export interface NextSunday {
  label: string;          // "Tonight" | "Sunday, Sep 13"
  fullLabel: string;      // "Tonight at 9:00 PM" | "Sunday, Sep 13 at 9:00 PM"
  elapsed: number;
  isToday: boolean;
}

export function useNextSunday(): NextSunday | null {
  const [state, setState] = useState<NextSunday | null>(null);

  useEffect(() => {
    const now = new Date();
    const day = now.getDay(); // 0 = Sunday, 1 = Monday ... 6 = Saturday
    const hours = now.getHours();

    let daysUntilSunday = (7 - day) % 7;

    // If today is Sunday and 9:00 PM (21:00) has passed, 
    // tonight's review cycle is complete — the next review is next Sunday (+7 days)
    if (day === 0 && hours >= 21) {
      daysUntilSunday = 7;
    }

    const targetDate = new Date(now);
    targetDate.setDate(targetDate.getDate() + daysUntilSunday);

    const isToday = daysUntilSunday === 0;

    let label: string;
    let fullLabel: string;

    if (isToday) {
      label = 'Tonight';
      fullLabel = 'Tonight at 9:00 PM';
    } else if (daysUntilSunday === 1) {
      label = 'Tomorrow';
      fullLabel = 'Tomorrow at 9:00 PM';
    } else {
      label = new Intl.DateTimeFormat('en-US', { weekday: 'long', month: 'short', day: 'numeric' }).format(targetDate);
      fullLabel = `${label} at 9:00 PM`;
    }

    setState({
      label,
      fullLabel,
      elapsed: isToday ? 6 : (day === 0 ? 0 : (day + 6) % 7),
      isToday,
    });
  }, []);

  return state;
}
