import { Contest } from '@/components/DsaContestCard';
import { getPlatformConfig } from './platformMap';

export const contestFetch = async (): Promise<Contest[] | void> => {
  try {
    const res = await fetch('/api/contests');
    if (!res.ok) throw new Error('API failed');
    const data = await res.json();
    
    if (!data.success || !data.contests) {
      throw new Error('Invalid data format from /api/contests');
    }

    return data.contests.map((c: any, index: number) => {
      const platformName = c.platform || '';
      const title = c.title || '';
      const config = getPlatformConfig(platformName);
      
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

      // Infer difficulty
      let difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'Unknown' = 'Unknown';
      const titleLower = title.toLowerCase();
      if (/(div\.?\s*1|grand|agc|icpc|ioi|hard|expert|advanced)/i.test(titleLower)) {
        difficulty = 'Advanced';
      } else if (/(div\.?\s*2|regular|arc|playground)/i.test(titleLower)) {
        difficulty = 'Intermediate';
      } else if (/(beginner|abc|div\.?\s*[34]|educational|starters|basic|easy)/i.test(titleLower)) {
        difficulty = 'Beginner';
      }

      // Check for Non-English characters (Cyrillic, Hiragana, Katakana, CJK)
      const isNonEnglish = /[\u0400-\u04FF\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FFF]/.test(title);
      
      return {
        id: index + 100,
        platform: platformName,
        platformColor: config.color,
        platformBg: config.bg,
        platformBorder: config.border,
        category: config.category,
        priority: config.priority,
        difficulty,
        isNonEnglish,
        title,
        status,
        statusLabel,
        date: dateStr,
        time: timeStr,
        duration: c.durationSeconds ? `${Math.round(c.durationSeconds / 3600)}h` : 'Unknown',
        hot: config.priority === 'Hot',
        participants: '—',
        url: c.contestUrl
      };
    });
  } catch (err) {
    console.log(err);
    return;
  }
};
