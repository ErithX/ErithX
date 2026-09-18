import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { mapApiContests, contestFetch } from '@/app/utils/contestFetch';

describe('contestFetch - mapApiContests & contestFetch', () => {
  const fixedNow = new Date('2026-03-01T12:00:00.000Z');

  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(fixedNow);
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  const createApiContest = (overrides = {}) => ({
    id: '12345',
    title: 'Weekly Contest 400',
    platform: 'leetcode',
    contestUrl: 'https://leetcode.com/contest/weekly-400',
    startTime: '2026-03-01T18:00:00.000Z', // 6 hours ahead (today)
    durationSeconds: 5400, // 90 minutes
    participantCount: 2500,
    status: 'UPCOMING' as const,
    categoryTitle: 'DSA & CP',
    difficulty: 'Intermediate',
    priorityScore: 65,
    ...overrides,
  });

  describe('Duration conversion', () => {
    it('converts durationSeconds to whole duration in minutes', () => {
      const contest = createApiContest({ durationSeconds: 7200 });
      const [mapped] = mapApiContests([contest]);
      expect(mapped.duration).toBe(120);
    });

    it('floors partial minutes when durationSeconds is not an exact multiple of 60', () => {
      const contest = createApiContest({ durationSeconds: 5459 }); // 90.98 minutes -> 90
      const [mapped] = mapApiContests([contest]);
      expect(mapped.duration).toBe(90);
    });

    it('handles durations less than 60 seconds by flooring to 0', () => {
      const contest = createApiContest({ durationSeconds: 45 });
      const [mapped] = mapApiContests([contest]);
      expect(mapped.duration).toBe(0);
    });

    it('handles missing, zero, or null durationSeconds by defaulting to 0', () => {
      const contestZero = createApiContest({ durationSeconds: 0 });
      const contestUndefined = createApiContest({ durationSeconds: undefined });
      const [mappedZero, mappedUndefined] = mapApiContests([contestZero, contestUndefined]);
      expect(mappedZero.duration).toBe(0);
      expect(mappedUndefined.duration).toBe(0);
    });
  });

  describe('Status classification and boundary behavior', () => {
    it('sets status to live and statusLabel to LIVE NOW! when status is explicitly LIVE regardless of start time', () => {
      const contestPast = createApiContest({
        status: 'LIVE',
        startTime: '2026-03-01T11:00:00.000Z',
      });
      const contestFuture = createApiContest({
        status: 'LIVE',
        startTime: '2026-03-02T18:00:00.000Z',
      });
      const [mappedPast, mappedFuture] = mapApiContests([contestPast, contestFuture]);
      expect(mappedPast.status).toBe('live');
      expect(mappedPast.statusLabel).toBe('LIVE NOW!');
      expect(mappedFuture.status).toBe('live');
      expect(mappedFuture.statusLabel).toBe('LIVE NOW!');
    });

    it('sets status to today and statusLabel to TODAY! for contests starting immediately in the next second', () => {
      const contest = createApiContest({
        status: 'UPCOMING',
        startTime: new Date(fixedNow.getTime() + 1000).toISOString(), // now + 1s
      });
      const [mapped] = mapApiContests([contest]);
      expect(mapped.status).toBe('today');
      expect(mapped.statusLabel).toBe('TODAY!');
    });

    it('sets status to today and statusLabel to TODAY! at upper boundary (24h - 1ms)', () => {
      const contest = createApiContest({
        status: 'UPCOMING',
        startTime: new Date(fixedNow.getTime() + 24 * 60 * 60 * 1000 - 1).toISOString(),
      });
      const [mapped] = mapApiContests([contest]);
      expect(mapped.status).toBe('today');
      expect(mapped.statusLabel).toBe('TODAY!');
    });

    it('sets status to upcoming and statusLabel to UPCOMING at exact 24h threshold', () => {
      const contest = createApiContest({
        status: 'UPCOMING',
        startTime: new Date(fixedNow.getTime() + 24 * 60 * 60 * 1000).toISOString(),
      });
      const [mapped] = mapApiContests([contest]);
      expect(mapped.status).toBe('upcoming');
      expect(mapped.statusLabel).toBe('UPCOMING');
    });

    it('sets status to upcoming for contests starting beyond 24 hours in the future', () => {
      const contest = createApiContest({
        status: 'UPCOMING',
        startTime: new Date(fixedNow.getTime() + 48 * 60 * 60 * 1000).toISOString(),
      });
      const [mapped] = mapApiContests([contest]);
      expect(mapped.status).toBe('upcoming');
      expect(mapped.statusLabel).toBe('UPCOMING');
    });

    it('falls through to upcoming when startTime is exactly now and status is not LIVE', () => {
      // Contract observation: sDate > now is strictly false when sDate == now, so it falls through to 'upcoming'
      const contest = createApiContest({
        status: 'UPCOMING',
        startTime: fixedNow.toISOString(),
      });
      const [mapped] = mapApiContests([contest]);
      expect(mapped.status).toBe('upcoming');
      expect(mapped.statusLabel).toBe('UPCOMING');
    });

    it('falls through to upcoming when startTime is in the past and status is not LIVE', () => {
      // Contract observation: past contests without LIVE flag fall through to 'upcoming'
      const contest = createApiContest({
        status: 'UPCOMING',
        startTime: new Date(fixedNow.getTime() - 3600 * 1000).toISOString(), // 1h ago
      });
      const [mapped] = mapApiContests([contest]);
      expect(mapped.status).toBe('upcoming');
      expect(mapped.statusLabel).toBe('UPCOMING');
    });
  });

  describe('Participant count formatting', () => {
    it.each([
      [0, '-'],
      [-1, '-'],
      [-500, '-'],
      [null, '-'],
      [undefined, '-'],
      ['', '-'],
      ['invalid-string', '-'],
      [NaN, '-'],
    ])('formats non-positive or invalid count %s as "-"', (raw, expected) => {
      const contest = createApiContest({ participantCount: raw });
      const [mapped] = mapApiContests([contest]);
      expect(mapped.participants).toBe(expected);
    });

    it.each([
      [1, '1'],
      [42, '42'],
      [450, '450'],
      [999, '999'],
      ['500', '500'],
    ])('formats counts < 1000 as plain string numbers (%s -> %s)', (raw, expected) => {
      const contest = createApiContest({ participantCount: raw });
      const [mapped] = mapApiContests([contest]);
      expect(mapped.participants).toBe(expected);
    });

    it.each([
      [1000, '1.0K'],
      [1050, '1.1K'],
      [1500, '1.5K'],
      [2560, '2.6K'],
      [9999, '10.0K'],
      ['1500', '1.5K'],
    ])('formats counts between 1000 and 9999 with 1 decimal place and K (%s -> %s)', (raw, expected) => {
      const contest = createApiContest({ participantCount: raw });
      const [mapped] = mapApiContests([contest]);
      expect(mapped.participants).toBe(expected);
    });

    it.each([
      [10000, '10K'],
      [14200, '14K'],
      [14800, '15K'],
      [99999, '100K'],
      [100000, '100K'],
      ['25000', '25K'],
    ])('formats counts >= 10000 with 0 decimal places and K (%s -> %s)', (raw, expected) => {
      const contest = createApiContest({ participantCount: raw });
      const [mapped] = mapApiContests([contest]);
      expect(mapped.participants).toBe(expected);
    });
  });

  describe('Difficulty level resolution', () => {
    it.each([
      ['Beginner', 'Beginner'],
      ['beginner', 'Beginner'],
      ['Easy', 'Beginner'],
      ['easy', 'Beginner'],
      ['Easy Round #5', 'Beginner'],
      ['Super Beginner Contest', 'Beginner'],
    ])('resolves "%s" to Beginner level', (inputDiff, expectedLevel) => {
      const contest = createApiContest({ difficulty: inputDiff });
      const [mapped] = mapApiContests([contest]);
      expect(mapped.level).toBe(expectedLevel);
    });

    it.each([
      ['Advanced', 'Advanced'],
      ['advanced', 'Advanced'],
      ['Hard', 'Advanced'],
      ['hard', 'Advanced'],
      ['Hard Div 1', 'Advanced'],
      ['Super Advanced Tournament', 'Advanced'],
    ])('resolves "%s" to Advanced level', (inputDiff, expectedLevel) => {
      const contest = createApiContest({ difficulty: inputDiff });
      const [mapped] = mapApiContests([contest]);
      expect(mapped.level).toBe(expectedLevel);
    });

    it.each([
      ['Intermediate'],
      ['Medium'],
      ['Div 2'],
      ['All Levels'],
      ['Open'],
      [''],
      [undefined],
    ])('defaults "%s" to Intermediate level', (inputDiff) => {
      const contest = createApiContest({ difficulty: inputDiff });
      const [mapped] = mapApiContests([contest]);
      expect(mapped.level).toBe('Intermediate');
    });

    it('gives Beginner precedence over Advanced when both keywords are present', () => {
      const contest = createApiContest({ difficulty: 'Easy to Hard' });
      const [mapped] = mapApiContests([contest]);
      expect(mapped.level).toBe('Beginner');
    });
  });

  describe('Priority and recommendation resolution', () => {
    it.each([
      [75, 'Hot', true],
      [75.1, 'Hot', true],
      [90, 'Hot', true],
      [100, 'Hot', true],
    ])('resolves priorityScore %s to Hot with isRecommended=true', (score, expectedPriority, expectedRec) => {
      const contest = createApiContest({ priorityScore: score });
      const [mapped] = mapApiContests([contest]);
      expect(mapped.priority).toBe(expectedPriority);
      expect(mapped.isRecommended).toBe(expectedRec);
    });

    it.each([
      [50, 'Recommended', true],
      [60, 'Recommended', true],
      [74.9, 'Recommended', true],
    ])('resolves priorityScore %s to Recommended with isRecommended=true', (score, expectedPriority, expectedRec) => {
      const contest = createApiContest({ priorityScore: score });
      const [mapped] = mapApiContests([contest]);
      expect(mapped.priority).toBe(expectedPriority);
      expect(mapped.isRecommended).toBe(expectedRec);
    });

    it.each([
      [49.9, 'More', false],
      [25, 'More', false],
      [0, 'More', false],
      [-10, 'More', false],
    ])('resolves priorityScore %s to More with isRecommended=false', (score, expectedPriority, expectedRec) => {
      const contest = createApiContest({ priorityScore: score });
      const [mapped] = mapApiContests([contest]);
      expect(mapped.priority).toBe(expectedPriority);
      expect(mapped.isRecommended).toBe(expectedRec);
    });

    it('maps NaN priorityScore to More with isRecommended=false', () => {
      const contest = createApiContest({ priorityScore: NaN });
      const [mapped] = mapApiContests([contest]);
      expect(mapped.priority).toBe('More');
      expect(mapped.isRecommended).toBe(false);
    });

    it.each([
      ['leetcode', 'Hot', true],
      ['atcoder', 'Recommended', true],
      ['spoj', 'More', false],
      ['unknown_platform', 'More', false],
    ])('falls back to platform priority for "%s" when priorityScore is undefined (%s)', (platform, expectedPriority, expectedRec) => {
      const contest = createApiContest({ platform, priorityScore: undefined });
      const [mapped] = mapApiContests([contest]);
      expect(mapped.priority).toBe(expectedPriority);
      expect(mapped.isRecommended).toBe(expectedRec);
    });
  });

  describe('Favicon and URL extraction', () => {
    it('extracts hostname from a valid contestUrl for Google favicon service', () => {
      const contest = createApiContest({ contestUrl: 'https://codeforces.com/contest/999' });
      const [mapped] = mapApiContests([contest]);
      expect(mapped.logo).toBe('https://s2.googleusercontent.com/s2/favicons?domain=codeforces.com&sz=64');
      expect(mapped.url).toBe('https://codeforces.com/contest/999');
    });

    it('extracts subdomain hostname correctly from contestUrl', () => {
      const contest = createApiContest({ contestUrl: 'https://practice.geeksforgeeks.org/contest/potd' });
      const [mapped] = mapApiContests([contest]);
      expect(mapped.logo).toBe('https://s2.googleusercontent.com/s2/favicons?domain=practice.geeksforgeeks.org&sz=64');
      expect(mapped.url).toBe('https://practice.geeksforgeeks.org/contest/potd');
    });

    it('falls back to google.com domain when contestUrl is malformed', () => {
      const contest = createApiContest({ contestUrl: 'invalid-url-without-protocol' });
      const [mapped] = mapApiContests([contest]);
      expect(mapped.logo).toBe('https://s2.googleusercontent.com/s2/favicons?domain=google.com&sz=64');
      expect(mapped.url).toBe('invalid-url-without-protocol');
    });

    it('falls back to normalized platform domain and "#" url when contestUrl is missing', () => {
      const contest = createApiContest({ platform: 'LeetCode', contestUrl: undefined });
      const [mapped] = mapApiContests([contest]);
      expect(mapped.logo).toBe('https://s2.googleusercontent.com/s2/favicons?domain=leetcode.com&sz=64');
      expect(mapped.url).toBe('#');
    });

    it('cleans special characters from platform name for fallback domain', () => {
      const contest = createApiContest({ platform: 'Code 360 (Naukri)!', contestUrl: undefined });
      const [mapped] = mapApiContests([contest]);
      expect(mapped.logo).toBe('https://s2.googleusercontent.com/s2/favicons?domain=code360naukri.com&sz=64');
    });
  });

  describe('ID parsing and fallback behavior', () => {
    it('parses numeric string IDs as integers', () => {
      const contest = createApiContest({ id: '98765' });
      const [mapped] = mapApiContests([contest]);
      expect(mapped.id).toBe(98765);
      expect(typeof mapped.id).toBe('number');
    });

    it('falls back to a random number when ID is non-numeric', () => {
      const contest = createApiContest({ id: 'clist-abc' });
      const [mapped] = mapApiContests([contest]);
      expect(typeof mapped.id).toBe('number');
      expect(Number.isFinite(mapped.id)).toBe(true);
      expect(mapped.id).toBeGreaterThan(0);
      expect(mapped.id).toBeLessThan(1);
    });

    it('falls back to a random number when ID is "0" because 0 is falsy in parseInt(c.id) || Math.random()', () => {
      // Contract observation: '0' becomes 0 which is falsy, triggering Math.random()
      const contest = createApiContest({ id: '0' });
      const [mapped] = mapApiContests([contest]);
      expect(typeof mapped.id).toBe('number');
      expect(mapped.id).not.toBe(0);
      expect(Number.isFinite(mapped.id)).toBe(true);
    });
  });

  describe('Complete Contest view-model contract', () => {
    it('populates all view-model properties with expected types and values', () => {
      const contest = createApiContest({
        id: '1234',
        title: 'Biweekly Contest 120',
        platform: 'leetcode',
        categoryTitle: 'DSA & CP',
        difficulty: 'Medium',
        priorityScore: 80,
      });

      const [mapped] = mapApiContests([contest]);

      expect(mapped).toMatchObject({
        id: 1234,
        platform: 'leetcode',
        platformColor: '#eab308',
        logo: 'https://s2.googleusercontent.com/s2/favicons?domain=leetcode.com&sz=64',
        title: 'Biweekly Contest 120',
        status: 'today',
        statusLabel: 'TODAY!',
        duration: 90,
        level: 'Intermediate',
        isRecommended: true,
        participants: '2.5K',
        url: 'https://leetcode.com/contest/weekly-400',
        category: 'DSA & CP',
        difficulty: 'Medium',
        priority: 'Hot',
      });
      expect(mapped.startDate).toBe('2026-03-01T18:00:00.000Z');
      expect(typeof mapped.time).toBe('string');
      expect(mapped.time.length).toBeGreaterThan(0);
    });

    it('returns an empty array when given an empty array', () => {
      expect(mapApiContests([])).toEqual([]);
    });

    it('maps multiple contests preserving input array order', () => {
      const c1 = createApiContest({ id: '1', title: 'Contest 1' });
      const c2 = createApiContest({ id: '2', title: 'Contest 2' });
      const [m1, m2] = mapApiContests([c1, c2]);
      expect(m1.id).toBe(1);
      expect(m1.title).toBe('Contest 1');
      expect(m2.id).toBe(2);
      expect(m2.title).toBe('Contest 2');
    });
  });

  describe('contestFetch API integration', () => {
    it('fetches /api/contests and returns mapped contests on successful response', async () => {
      const fakeContests = [createApiContest({ id: '101', title: 'Fetched Contest' })];
      const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, contests: fakeContests }),
      } as Response);

      const result = await contestFetch();

      expect(fetchSpy).toHaveBeenCalledWith('/api/contests');
      expect(result).toHaveLength(1);
      expect(result?.[0]?.title).toBe('Fetched Contest');
      expect(result?.[0]?.id).toBe(101);
    });

    it('returns empty array when API response ok is false', async () => {
      vi.spyOn(console, 'error').mockImplementation(() => {});
      vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
        ok: false,
        status: 500,
      } as Response);

      const result = await contestFetch();
      expect(result).toEqual([]);
    });

    it('returns empty array when API returns data.success = false', async () => {
      vi.spyOn(console, 'error').mockImplementation(() => {});
      vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: false }),
      } as Response);

      const result = await contestFetch();
      expect(result).toEqual([]);
    });

    it('returns empty array when API returns response missing contests array', async () => {
      vi.spyOn(console, 'error').mockImplementation(() => {});
      vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, contests: null }),
      } as Response);

      const result = await contestFetch();
      expect(result).toEqual([]);
    });

    it('returns empty array when network fetch throws an error', async () => {
      vi.spyOn(console, 'error').mockImplementation(() => {});
      vi.spyOn(globalThis, 'fetch').mockRejectedValueOnce(new Error('Network offline'));

      const result = await contestFetch();
      expect(result).toEqual([]);
    });
  });
});
