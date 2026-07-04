export async function fetchContests() {
  const results = await Promise.allSettled([
    fetchCodeChef(),
    fetchCodeforces(),
    fetchGeeksforGeeks(),
    fetchLeetCode(),
    fetchHackerEarth(),
    fetchAtCoder(),
    /* fetchTopCoder(), */
    fetchHackerRank(),
    fetchClist(),
    fetchSPOJ()
  ]);

  return results
    .filter(r => r.status === 'fulfilled')
    .flatMap(r => r.value)
    .sort((a, b) => new Date(a.startTime) - new Date(b.startTime));
}

function formatContest(id, platform, title, url, startTimeStr, durationSeconds) {
  const startTime = new Date(startTimeStr);
  const endTime = new Date(startTime.getTime() + (durationSeconds * 1000));
  const now = new Date().getTime();
  const createdAt = new Date().toISOString();

  let status = "ENDED";
  if (now < startTime.getTime()) {
    status = "UPCOMING";
  } else if (now >= startTime.getTime() && now < endTime.getTime()) {
    status = "LIVE";
  }

  return {
    id,
    title,
    platform,
    contestUrl: url,
    startTime: startTime.toISOString(),
    endTime: endTime.toISOString(),
    durationSeconds: durationSeconds || 0,
    problemCount: null,
    participantCount: null,
    status,
    createdAt,
    updatedAt: createdAt
  };
}

async function fetchCodeChef() {
  try {
    const res = await fetch(
      "https://www.codechef.com/api/list/contests/all?sort_by=START&sorting_order=asc",
      { cache: "no-store" }
    );
    const data = await res.json();
    const contestsData = [
      ...(data.present_contests || []),
      ...(data.future_contests || []),
    ];

    return contestsData.map((c) => {
      const duration = Math.floor(
        (new Date(c.contest_end_date_iso) - new Date(c.contest_start_date_iso)) / 1000
      );
      return formatContest(
        `codechef-${c.contest_code}`,
        "CodeChef",
        c.contest_name,
        `https://www.codechef.com/${c.contest_code}`,
        c.contest_start_date_iso,
        duration
      );
    });
  } catch (error) {
    console.error("CodeChef fetch error:", error);
    return [];
  }
}

async function fetchCodeforces() {
  try {
    const res = await fetch("https://codeforces.com/api/contest.list", {
      cache: "no-store",
    });
    const data = await res.json();
    const now = Date.now() / 1000;

    return data.result
      .filter((c) => c.startTimeSeconds + c.durationSeconds > now)
      .map((c) => formatContest(
        `codeforces-${c.id}`,
        "Codeforces",
        c.name,
        `https://codeforces.com/contests/${c.id}`,
        new Date(c.startTimeSeconds * 1000).toISOString(),
        c.durationSeconds
      ));
  } catch (error) {
    console.error("Codeforces fetch error:", error);
    return [];
  }
}

async function fetchGeeksforGeeks() {
  try {
    const res = await fetch(
      "https://practiceapi.geeksforgeeks.org/api/vr/events/?type=contest&sub_type=upcoming",
      { cache: "no-store" }
    );
    const data = await res.json();

    return (data.results?.upcoming || []).map((c) => {
      const duration = Math.floor(
        (new Date(c.end_time) - new Date(c.start_time)) / 1000
      );
      return formatContest(
        `gfg-${c.slug}`,
        "GeeksforGeeks",
        c.name,
        `https://practice.geeksforgeeks.org/contest/${c.slug}`,
        new Date(c.start_time).toISOString(),
        duration
      );
    });
  } catch (error) {
    console.error("GeeksforGeeks fetch error:", error);
    return [];
  }
}

async function fetchLeetCode() {
  try {
    const res = await fetch("https://leetcode.com/graphql", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: `{ allContests { title titleSlug startTime duration } }`,
      }),
      cache: "no-store",
    });
    const data = await res.json();
    const now = Date.now() / 1000;

    return (data.data?.allContests || [])
      .filter((c) => c.startTime + c.duration > now)
      .map((c) => formatContest(
        `leetcode-${c.titleSlug}`,
        "LeetCode",
        c.title,
        `https://leetcode.com/contest/${c.titleSlug}`,
        new Date(c.startTime * 1000).toISOString(),
        c.duration
      ));
  } catch (error) {
    console.error("LeetCode fetch error:", error);
    return [];
  }
}

async function fetchHackerEarth() {
  try {
    const res = await fetch(
      "https://www.hackerearth.com/challenges/competitive/",
      { cache: "no-store" }
    );
    const html = await res.text();
    const slugMatches = html.matchAll(
      /\/challenges\/competitive\/([^\/'"]+)\//g
    );
    const slugs = [...new Set([...slugMatches].map((m) => m[1]))];

    const contests = [];
    for (const slug of slugs.slice(0, 10)) {
      try {
        const detailsRes = await fetch(
          `https://www.hackerearth.com/challengesapp/api/events/${slug}/?only_meta=false`,
          { cache: "no-store" }
        );
        const details = await detailsRes.json();

        const startDate = new Date(details.start_date);
        const endDate = new Date(details.end_date);

        if (endDate <= new Date()) continue;

        contests.push(formatContest(
          `hackerearth-${slug}`,
          "HackerEarth",
          details.title || details.name,
          `https://www.hackerearth.com/challenges/competitive/${slug}/`,
          startDate.toISOString(),
          Math.floor((endDate - startDate) / 1000)
        ));
      } catch (error) {
        console.error(`HackerEarth contest ${slug} error:`, error);
      }
    }
    return contests;
  } catch (error) {
    console.error("HackerEarth fetch error:", error);
    return [];
  }
}

async function fetchAtCoder() {
  try {
    const res = await fetch("https://atcoder.jp/contests/?lang=en", {
      cache: "no-store",
    });
    const html = await res.text();

    const contests = [];
    const tableRegex = /<tbody>([\s\S]*?)<\/tbody>/g;
    const rowRegex =
      /<tr>[\s\S]*?<td class="text-center">.*?<\/td>[\s\S]*?<td class="text-center"><a href="\/contests\/([^"]+)">([^<]+)<\/a><\/td>[\s\S]*?<td class="text-center"><time[^>]*>([^<]+)<\/time><\/td>[\s\S]*?<td class="text-center">(\d+):(\d+)<\/td>/g;

    const tables = [...html.matchAll(tableRegex)];
    if (tables[1]) {
      const matches = [...tables[1][1].matchAll(rowRegex)];

      for (const match of matches) {
        const [, contestId, title, startTime, hours, minutes] = match;
        const duration = parseInt(hours) * 3600 + parseInt(minutes) * 60;

        contests.push(formatContest(
          `atcoder-${contestId}`,
          "AtCoder",
          title.trim(),
          `https://atcoder.jp/contests/${contestId}`,
          new Date(startTime).toISOString(),
          duration
        ));
      }
    }

    return contests;
  } catch (error) {
    console.error("AtCoder fetch error:", error);
    return [];
  }
}

async function fetchHackerRank() {
  try {
    const res = await fetch(
      "https://www.hackerrank.com/rest/contests/upcoming?offset=0&limit=20",
      {
        cache: "no-store",
        headers: { Accept: "application/json" },
      }
    );
    const data = await res.json();

    return (data.models || []).map((c) => formatContest(
      `hackerrank-${c.slug}`,
      "HackerRank",
      c.name,
      `https://www.hackerrank.com/contests/${c.slug}`,
      new Date(c.epoch_starttime * 1000).toISOString(),
      c.epoch_endtime - c.epoch_starttime
    ));
  } catch (error) {
    console.error("HackerRank fetch error:", error);
    return [];
  }
}

async function fetchClist() {
  try {
    const username = process.env.CLIST_USERNAME || 'debjyoti_018';
    const apiKey = process.env.CLIST_API_KEY || 'd951bbdbb021c2a5723761340bcf7c3788e6d7bb';
    const res = await fetch(
      `https://clist.by/api/v4/contest/?upcoming=true&format_time=true&limit=100&order_by=start&username=${username}&api_key=${apiKey}`,
      {
        cache: "no-store",
        headers: { Accept: "application/json" },
      }
    );

    if (!res.ok) {
      console.log("CLIST API returned an error - skipping fallback partial fetch");
      return [];
    }

    const data = await res.json();

    return (data.objects || [])
      .filter((c) => ["SPOJ", "CodeSignal", "TechGig"].includes(c.resource))
      .map((c) => formatContest(
        `clist-${c.id}`,
        c.resource,
        c.event,
        c.href,
        new Date(c.start).toISOString(),
        c.duration
      ));
  } catch (error) {
    console.error("CLIST fetch error in MultiScraper:", error);
    return [];
  }
}

async function fetchSPOJ() {
  try {
    const res = await fetch('https://www.spoj.com/contests/', {
      cache: 'no-store'
    });
    const html = await res.text();
    
    const contests = [];
    const rowRegex = /<tr>[\s\S]*?<td><a href="\/([^"]+)\/">([^<]+)<\/a><\/td>[\s\S]*?<td>([^<]+)<\/td>[\s\S]*?<td>([^<]+)<\/td>/g;
    
    const matches = [...html.matchAll(rowRegex)];
    
    for (const match of matches) {
      const [, contestId, title, startTime] = match;
      
      if (new Date(startTime) > new Date()) {
        contests.push(formatContest(
          `spoj-${contestId}`,
          "SPOJ",
          title.trim(),
          `https://www.spoj.com/${contestId}/`,
          new Date(startTime).toISOString(),
          0
        ));
      }
    }
    
    return contests;
  } catch (error) {
    console.error('SPOJ fetch error:', error);
    return [];
  }
}
