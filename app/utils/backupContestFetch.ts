import { Contest } from '@/components/DsaContestCard';

export const backupContestFetch = async (): Promise<Contest[] | void> => {
  try {
    const res = await fetch('https://kontests.net/api/v1/all');
    if (!res.ok) throw new Error('API failed');
    const data = await res.json();
    
    return data.slice(0, 12).map((c: any, index: number) => {
      let platformColor = '#3b82f6';
      let platformBg = 'rgba(59,130,246,0.1)';
      let platformBorder = 'rgba(59,130,246,0.2)';
      let platform = c.site.toLowerCase();
      
      if (platform.includes('codechef')) { platformColor = '#f97316'; platformBg = 'rgba(249,115,22,0.1)'; platformBorder = 'rgba(249,115,22,0.2)'; }
      else if (platform.includes('codeforces')) { platformColor = '#ef4444'; platformBg = 'rgba(239,68,68,0.1)'; platformBorder = 'rgba(239,68,68,0.2)'; }
      else if (platform.includes('leetcode')) { platformColor = '#eab308'; platformBg = 'rgba(234,179,8,0.1)'; platformBorder = 'rgba(234,179,8,0.2)'; }
      else if (platform.includes('hackerrank')) { platformColor = '#22c55e'; platformBg = 'rgba(34,197,94,0.1)'; platformBorder = 'rgba(34,197,94,0.2)'; }

      const status = c.status === 'CODING' ? 'live' : c.in_24_hours === 'Yes' ? 'today' : 'upcoming';
      const statusLabel = status === 'live' ? 'LIVE NOW!' : status === 'today' ? 'TODAY!' : 'UPCOMING';
      
      const sDate = new Date(c.start_time);
      const dateStr = sDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
      const timeStr = sDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', timeZoneName: 'short' });
      
      return {
        id: index + 100,
        platform: c.site,
        platformColor,
        platformBg,
        platformBorder,
        title: c.name,
        status,
        statusLabel,
        date: dateStr,
        time: timeStr,
        duration: c.duration ? `${Math.round(c.duration / 3600)}h` : 'Unknown',
        hot: status === 'live' || status === 'today',
        participants: '—'
      };
    });
  } catch (err) {
    console.log(err);
    return;
  }
};
