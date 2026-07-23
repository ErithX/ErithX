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

export const mapApiContests = (apiContests: ApiContest[]): Contest[] => {
  return apiContests.map((c) => {
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
    const timeStr = sDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', timeZoneName: 'short' });

    let level: 'Beginner' | 'Intermediate' | 'Advanced' = 'Intermediate';
    if (c.difficulty) {
      const diffLower = c.difficulty.toLowerCase();
      if (diffLower.includes('beginner') || diffLower.includes('easy')) level = 'Beginner';
      else if (diffLower.includes('advanced') || diffLower.includes('hard')) level = 'Advanced';
    }

    let domain = 'google.com';
    if (c.contestUrl) {
      try {
        domain = new URL(c.contestUrl).hostname;
      } catch (e) {}
    } else {
      domain = `${platformName.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`;
    }

    return {
      id: parseInt(c.id) || Math.random(),
      platform: platformName,
      platformColor: config.color,
      logo: `https://s2.googleusercontent.com/s2/favicons?domain=${domain}&sz=64`,
      title,
      status,
      statusLabel,
      startDate: sDate.toISOString(),
      time: timeStr,
      duration: Math.floor((c.durationSeconds || 0) / 60),
      level,
      isRecommended: priority === 'Hot' || priority === 'Recommended',
      participants: formatParticipants(c.participantCount),
      url: c.contestUrl || '#',
      category: c.categoryTitle,
      difficulty: c.difficulty,
      priority: priority
    };
  });
};

export const contestFetch = async (): Promise<Contest[] | void> => {
  try {
    const res = await fetch('/api/contests');
    if (!res.ok) throw new Error('API failed');
    const data = await res.json();

    if (!data.success || !data.contests) {
      throw new Error('Invalid data format from /api/contests');
    }

    return mapApiContests(data.contests as ApiContest[]);
  } catch (err) {
    console.error('Fetch error:', err);
    return [];
  }
};
