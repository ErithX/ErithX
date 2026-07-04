export async function fetchContests() {
  try {
    const username = process.env.CLIST_USERNAME || 'debjyoti_018';
    const apiKey = process.env.CLIST_API_KEY || 'd951bbdbb021c2a5723761340bcf7c3788e6d7bb';
    const url = `https://clist.by/api/v4/contest/?upcoming=true&limit=100&order_by=start&username=${username}&api_key=${apiKey}`;
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);
    
    const res = await fetch(url, { 
      cache: "no-store",
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    const data = await res.json();

    if (!res.ok) {
        console.error("CLIST API returned an error:", data);
        return null;
    }

    const now = new Date().getTime();
    const createdAt = new Date().toISOString();

    return (data.objects || []).map(c => {
      const startTime = new Date(c.start + "Z");
      const endTime = c.end ? new Date(c.end + "Z") : new Date(startTime.getTime() + (c.duration * 1000));
      
      let status = "ENDED";
      if (now < startTime.getTime()) {
        status = "UPCOMING";
      } else if (now >= startTime.getTime() && now < endTime.getTime()) {
        status = "LIVE";
      }

      return {
        id: `clist-${c.id}`,
        title: c.event,
        platform: c.resource,
        contestUrl: c.href,
        
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
        durationSeconds: c.duration,
        
        problemCount: null,
        participantCount: null,
        
        status,
        
        createdAt,
        updatedAt: createdAt
      };
    });
  } catch (error) {
    console.error("Clist fetch error aggressively caught:", error.message);
    return null;
  }
}
