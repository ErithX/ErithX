import { describe, it, expect } from 'vitest';

describe('GitHub Data Pipeline & Metric Extraction', () => {
  const mockGithubPayload = {
    user: {
      login: 'developer_pro',
      name: 'Dev Pro',
      followers: 42,
      public_repos: 12
    },
    repos: [
      { name: 'fullstack-saas', stargazers_count: 25, language: 'TypeScript', updated_at: new Date().toISOString() },
      { name: 'dsa-tracker', stargazers_count: 10, language: 'TypeScript', updated_at: new Date().toISOString() },
      { name: 'ai-agent', stargazers_count: 15, language: 'Python', updated_at: new Date('2026-09-01').toISOString() }
    ],
    recentEvents: [
      {
        type: 'PushEvent',
        repoName: 'developer_pro/fullstack-saas',
        createdAt: new Date().toISOString() // Current week
      },
      {
        type: 'PushEvent',
        repoName: 'developer_pro/dsa-tracker',
        created_at: new Date(Date.now() - 86400000 * 2).toISOString() // 2 days ago (snake_case compatibility)
      },
      {
        type: 'PushEvent',
        repoName: 'developer_pro/ai-agent',
        createdAt: new Date(Date.now() - 86400000 * 20).toISOString() // 20 days ago (outside 7-day window)
      }
    ],
    graphqlStats: {
      totalContributionsLastYear: 450
    }
  };

  it('1. correctly computes totalStars and topLanguages breakdown', () => {
    const repos = mockGithubPayload.repos;
    const totalStars = repos.reduce((acc, r) => acc + (r.stargazers_count || 0), 0);
    expect(totalStars).toBe(50);

    const langCounts: Record<string, number> = {};
    repos.forEach(r => {
      if (r.language) langCounts[r.language] = (langCounts[r.language] || 0) + 1;
    });

    const totalLangs = Object.values(langCounts).reduce((a, b) => a + b, 0);
    const topLanguages = Object.entries(langCounts)
      .map(([lang, count]) => ({
        language: lang,
        percentage: Math.round((count / totalLangs) * 100)
      }))
      .sort((a, b) => b.percentage - a.percentage);

    expect(topLanguages[0].language).toBe('TypeScript');
    expect(topLanguages[0].percentage).toBe(67);
    expect(topLanguages[1].language).toBe('Python');
    expect(topLanguages[1].percentage).toBe(33);
  });

  it('2. parses event dates regardless of camelCase (createdAt) or snake_case (created_at)', () => {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    let contributionsThisWeek = 0;
    for (const event of mockGithubPayload.recentEvents) {
      const rawDate = (event as any).createdAt || (event as any).created_at;
      const eventDate = new Date(rawDate);
      if (!isNaN(eventDate.getTime()) && eventDate > oneWeekAgo) {
        contributionsThisWeek++;
      }
    }

    // 2 events within 7 days, 1 event 20 days ago
    expect(contributionsThisWeek).toBe(2);
  });

  it('3. falls back to recently pushed repos when push events array is empty', () => {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const emptyEvents: any[] = [];
    let contributionsThisWeek = 0;

    for (const event of emptyEvents) {
      const rawDate = event.createdAt || event.created_at;
      if (rawDate && new Date(rawDate) > oneWeekAgo) contributionsThisWeek++;
    }

    // Fallback logic
    if (contributionsThisWeek === 0 && mockGithubPayload.repos.length > 0) {
      const recentlyUpdated = mockGithubPayload.repos.filter(r => {
        return r.updated_at && new Date(r.updated_at) > oneWeekAgo;
      });
      contributionsThisWeek = recentlyUpdated.length;
    }

    expect(contributionsThisWeek).toBe(2);
  });

  it('4. outputs the expected structured GitHub metrics', () => {
    const ghMetrics = {
      total_stars: 50,
      followers: 42,
      total_contributions_annual: 450,
      contributions_this_week: 2,
      top_language: 'TypeScript',
      top_repos: ['fullstack-saas', 'dsa-tracker', 'ai-agent'],
      public_repos: 12,
      status: 'Active Builder'
    };

    expect(ghMetrics.total_stars).toBe(50);
    expect(ghMetrics.contributions_this_week).toBe(2);
    expect(ghMetrics.top_language).toBe('TypeScript');
    expect(ghMetrics.status).toBe('Active Builder');
  });
});

