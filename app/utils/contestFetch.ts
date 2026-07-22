import { Contest } from '@/components/DsaContestCard';
import { getPlatformConfig } from './platformMap';

interface ApiContest {
  id: string;
  title: string;
  platform: string;
  contestUrl?: string;
  startTime: string;
  durationSeconds?: number;
  participantCount?: number | string | null;
  status?: 'ENDED' | 'UPCOMING' | 'LIVE';
  categoryTitle?: string;
  difficulty?: string;
  priorityScore?: number;
}

const formatDuration = (seconds?: number): string => {
  if (!seconds) return 'Unknown duration';

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  if (hours >= 24) {
    const days = Math.floor(hours / 24);
    const remainingHours = hours % 24;
    return remainingHours ? `${days}d ${remainingHours}h` : `${days}d`;
  }

  if (hours > 0) {
    return minutes ? `${hours}h ${minutes}m` : `${hours}h`;
  }

  return `${Math.max(minutes, 1)}m`;
};

const formatParticipants = (count: unknown): string => {
  const value = Number(count);
  if (!Number.isFinite(value) || value <= 0) return '-';
  if (value >= 1000) return `${(value / 1000).toFixed(value >= 10000 ? 0 : 1)}K`;
  return String(value);
};

const getPriorityLabel = (score?: number, fallback?: string): 'Hot' | 'Recommended' | 'More' => {
  if (typeof score === 'number') {
    if (score >= 75) return 'Hot';
    if (score >= 50) return 'Recommended';
    return 'More';
  }

  if (fallback === 'Hot' || fallback === 'Recommended') return fallback;
  return 'More';
};

export const contestFetch = async (): Promise<Contest[] | void> => {
  try {
    const res = await fetch('/api/contests');
    if (!res.ok) throw new Error('API failed');
    const data = await res.json();

    if (!data.success || !data.contests) {
      throw new Error('Invalid data format from /api/contests');
    }

    return (data.contests as ApiContest[]).map((c) => {
      const platformName = c.platform || '';
      const title = c.title || '';
      const config = getPlatformConfig(platformName);
      const priority = getPriorityLabel(c.priorityScore, config.priority);

      const sDate = new Date(c.startTime);
      const now = new Date();

      let status: 'live' | 'today' | 'upcoming' = 'upcoming';
      if (c.status === 'LIVE') {
        status = 'live';
      } else if (sDate.getTime() - now.getTime() < 24 * 60 * 60 * 1000 && sDate.getTime() > now.getTime()) {
        status = 'today';
      }

      const statusLabel = status === 'live' ? 'LIVE NOW!' : status === 'today' ? 'TODAY!' : 'UPCOMING';
      const dateStr = sDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
      const timeStr = sDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', timeZoneName: 'short' });

      return {
        id: c.id,
        platform: platformName,
        platformColor: config.color,
        platformBg: config.bg,
        platformBorder: config.border,
        category: c.categoryTitle || config.category,
        priority,
        priorityScore: c.priorityScore,
        difficulty: c.difficulty || 'Unknown',
        isNonEnglish: false,
        title,
        status,
        statusLabel,
        date: dateStr,
        time: timeStr,
        duration: formatDuration(c.durationSeconds),
        rawStartTime: c.startTime,
        rawDurationSeconds: c.durationSeconds,
        hot: priority === 'Hot',
        participants: formatParticipants(c.participantCount),
        url: c.contestUrl,
      };
    });
  } catch (err) {
    console.log(err);
    return;
  }
};
