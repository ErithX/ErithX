export async function fetchLeetCodeStats(username: string) {
  const query = `
    query getUserProfile($username: String!) {
      matchedUser(username: $username) {
        username
        submitStats: submitStatsGlobal {
          acSubmissionNum {
            difficulty
            count
            submissions
          }
        }
        profile {
          ranking
          reputation
          starRating
        }
      }
      userContestRanking(username: $username) {
        rating
        globalRanking
      }
      recentAcSubmissionList(username: $username, limit: 20) {
        title
        titleSlug
        timestamp
      }
    }
  `;

  try {
    const res = await fetch('https://leetcode.com/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Referer': 'https://leetcode.com',
      },
      body: JSON.stringify({
        query,
        variables: { username }
      })
    });

    if (!res.ok) return null;
    const data = await res.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching LeetCode stats:', error);
    return null;
  }
}

export async function fetchCodeforcesStats(handle: string) {
  try {
    const [infoRes, ratingRes, statusRes] = await Promise.all([
      fetch(`https://codeforces.com/api/user.info?handles=${handle}`),
      fetch(`https://codeforces.com/api/user.rating?handle=${handle}`),
      fetch(`https://codeforces.com/api/user.status?handle=${handle}&from=1&count=20`)
    ]);

    const info = infoRes.ok ? await infoRes.json() : null;
    const rating = ratingRes.ok ? await ratingRes.json() : null;
    const status = statusRes.ok ? await statusRes.json() : null;

    if (!info || info.status !== 'OK') return null;

    return {
      info: info.result[0],
      ratingHistory: rating?.status === 'OK' ? rating.result : [],
      recentSubmissions: status?.status === 'OK' ? status.result : []
    };
  } catch (error) {
    console.error('Error fetching Codeforces stats:', error);
    return null;
  }
}

export async function fetchGithubStats(username: string) {
  try {
    // Note: In production, pass a GITHUB_TOKEN to avoid 60 req/hr rate limit
    const headers: any = {
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'DSA-Quest-App'
    };
    
    if (process.env.GITHUB_API_TOKEN) {
      headers['Authorization'] = `token ${process.env.GITHUB_API_TOKEN}`;
    }

    const [userRes, reposRes, eventsRes] = await Promise.all([
      fetch(`https://api.github.com/users/${username}`, { headers }),
      fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=10`, { headers }),
      fetch(`https://api.github.com/users/${username}/events/public?per_page=100`, { headers })
    ]);

    if (!userRes.ok) return null;
    
    const user = await userRes.json();
    const repos = reposRes.ok ? await reposRes.json() : [];
    const events = eventsRes.ok ? await eventsRes.json() : [];

    // Filter to only Push and PR events to calculate actual code contributions
    const recentEvents = Array.isArray(events) ? events
      .filter((e: any) => e.type === 'PushEvent' || e.type === 'PullRequestEvent')
      .map((e: any) => ({
        type: e.type,
        repoName: e.repo?.name || '',
        createdAt: e.created_at
      })) : [];

    return {
      user,
      repos,
      recentEvents
    };
  } catch (error) {
    console.error('Error fetching GitHub stats:', error);
    return null;
  }
}

// Basic CodeChef Web Scraper (Since CodeChef doesn't have a public API)
export async function fetchCodeChefStats(handle: string) {
  try {
    const res = await fetch(`https://www.codechef.com/users/${handle}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    
    if (!res.ok) return null;
    const html = await res.text();
    
    // Simple regex parsing for basic stats (rating, stars)
    const ratingMatch = html.match(/<div class="rating-number">(\d+)<\/div>/);
    const starMatch = html.match(/<span class="rating" style="[^"]*">(.*?)<\/span>/);
    
    return {
      handle,
      rating: ratingMatch ? parseInt(ratingMatch[1]) : 0,
      stars: starMatch ? starMatch[1] : '1★'
    };
  } catch (error) {
    console.error('Error fetching CodeChef stats:', error);
    return null;
  }
}
