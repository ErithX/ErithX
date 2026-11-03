import { describe, it, expect } from 'vitest';
import { fetchLeetCodeStats } from '@/app/lib/platform-fetchers';

describe('LeetCode Live Integration Check (Real API)', () => {
  it('connects to live LeetCode GraphQL and verifies array_destroyer profile', async () => {
    // Hits the real, live https://leetcode.com/graphql endpoint
    const data = await fetchLeetCodeStats('array_destroyer');

    expect(data).not.toBeNull();
    expect(data.matchedUser).toBeDefined();
    expect(data.matchedUser.username).toBe('array_destroyer');

    // 1. Verify Submit Stats
    const acSubmissions = data.matchedUser.submitStats?.acSubmissionNum || [];
    const totalSolved = acSubmissions.find((s: any) => s.difficulty === 'All')?.count || 0;
    expect(totalSolved).toBeGreaterThan(200); // Live account has 270+ solves

    // 2. Verify Submission Calendar
    expect(typeof data.matchedUser.submissionCalendar).toBe('string');
    const parsedCalendar = JSON.parse(data.matchedUser.submissionCalendar);
    expect(Object.keys(parsedCalendar).length).toBeGreaterThan(0);

    // 3. Verify Tag Counts
    expect(data.matchedUser.tagProblemCounts).toBeDefined();
    const fundamentalTags = data.matchedUser.tagProblemCounts.fundamental || [];
    expect(fundamentalTags.length).toBeGreaterThan(0);

    // 4. Verify Recent Submissions
    expect(Array.isArray(data.recentAcSubmissionList)).toBe(true);
    expect(data.recentAcSubmissionList.length).toBeGreaterThan(0);
  }, 10000); // 10s timeout for network call
});

