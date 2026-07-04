export async function fetchContests() {
  try {
    const res = await fetch('https://kontests.net/api/v1/all', { cache: 'no-store' });
    if (!res.ok) throw new Error('API failed');
    const data = await res.json();
    
    return data.map(c => ({
      id: `kontest-${c.name.replace(/\\s+/g, '-')}`,
      platform: c.site,
      title: c.name,
      url: c.url,
      start_time: new Date(c.start_time).toISOString(),
      duration: parseInt(c.duration) || 0,
    }));
  } catch (err) {
    console.log("Kontest fetch error:", err);
    return [];
  }
}
