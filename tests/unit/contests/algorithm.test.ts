import { describe, it, expect } from 'vitest';
import { applyContestRules } from '@/app/api/contests/algorithm';

describe('algorithm - applyContestRules', () => {
  // Reference fixed point in time: 2026-03-01T12:00:00.000Z
  const baseNow = new Date('2026-03-01T12:00:00.000Z');
  const baseNowMs = baseNow.getTime();

  /**
   * Factory producing a valid baseline contest object.
   * By default, has minimal scoring attributes:
   * - Platform: 'other-platform.com' (Weight: 5, Category: 'other')
   * - Title: 'Spring Contest' (Difficulty: Unknown, Weight: 0)
   * - Time Proximity: > 7 days ahead (Weight: 5)
   * - Participant Count: 0 (Weight: 0)
   * - Expected Baseline Priority Score: 5 + 0 + 5 + 0 = 10
   */
  const createContest = (overrides = {}) => ({
    id: 'base-contest-1',
    title: 'Spring Open Contest',
    platform: 'other-platform.com',
    contestUrl: 'https://other-platform.com/contest/1',
    startTime: new Date(baseNowMs + 10 * 24 * 3600 * 1000).toISOString(), // 10 days ahead
    endTime: new Date(baseNowMs + 10 * 24 * 3600 * 1000 + 7200 * 1000).toISOString(),
    durationSeconds: 7200,
    participantCount: 0,
    ...overrides,
  });

  describe('Noise-cutting filters', () => {
    describe('Expiry boundary handling (endTime vs now)', () => {
      it('drops contests where endTime is strictly before now', () => {
        const expired = createContest({
          id: 'expired-by-1ms',
          endTime: new Date(baseNowMs - 1).toISOString(),
        });

        const result = applyContestRules([expired], baseNow);
        expect(result.contests).toHaveLength(0);
        expect(result.filterStats.dropped.ended).toBe(1);
      });

      it('retains contests whose endTime is exactly equal to now', () => {
        // Contract: endMs < nowMs drops; endMs === nowMs is kept
        const endingExactlyNow = createContest({
          id: 'ending-now',
          startTime: new Date(baseNowMs - 7200 * 1000).toISOString(),
          endTime: new Date(baseNowMs).toISOString(),
        });

        const result = applyContestRules([endingExactlyNow], baseNow);
        expect(result.contests).toHaveLength(1);
        expect(result.contests[0].id).toBe('ending-now');
        expect(result.filterStats.dropped.ended).toBe(0);
      });

      it('retains contests whose endTime is in the future', () => {
        const active = createContest({
          id: 'active-future',
          endTime: new Date(baseNowMs + 1000).toISOString(),
        });

        const result = applyContestRules([active], baseNow);
        expect(result.contests).toHaveLength(1);
        expect(result.contests[0].id).toBe('active-future');
      });

      it('drops contests with non-finite or unparseable endTime', () => {
        const invalidEnd = createContest({
          id: 'invalid-end-date',
          endTime: 'not-a-valid-date',
        });

        const result = applyContestRules([invalidEnd], baseNow);
        expect(result.contests).toHaveLength(0);
        expect(result.filterStats.dropped.ended).toBe(1);
      });
    });

    describe('Duration validation', () => {
      it('drops contests with durationSeconds === 0', () => {
        const zeroDuration = createContest({
          id: 'zero-dur',
          durationSeconds: 0,
        });

        const result = applyContestRules([zeroDuration], baseNow);
        expect(result.contests).toHaveLength(0);
        expect(result.filterStats.dropped.zeroDuration).toBe(1);
      });

      it('retains contests with positive durationSeconds', () => {
        const validDuration = createContest({
          id: 'valid-dur',
          durationSeconds: 3600,
        });

        const result = applyContestRules([validDuration], baseNow);
        expect(result.contests).toHaveLength(1);
        expect(result.filterStats.dropped.zeroDuration).toBe(0);
      });
    });

    describe('Character encoding & language filter', () => {
      it('retains ASCII titles', () => {
        const asciiContest = createContest({
          id: 'ascii-title',
          title: 'LeetCode Weekly Contest 400',
        });

        const result = applyContestRules([asciiContest], baseNow);
        expect(result.contests).toHaveLength(1);
        expect(result.filterStats.dropped.nonLatin).toBe(0);
      });

      it('drops titles containing Cyrillic characters', () => {
        const cyrillic = createContest({
          id: 'cyrillic',
          title: 'Квалификационный раунд 2026',
        });

        const result = applyContestRules([cyrillic], baseNow);
        expect(result.contests).toHaveLength(0);
        expect(result.filterStats.dropped.nonLatin).toBe(1);
      });

      it('drops titles containing Japanese / CJK characters', () => {
        const japanese = createContest({
          id: 'japanese',
          title: '東京プログラミングコンテスト',
        });

        const result = applyContestRules([japanese], baseNow);
        expect(result.contests).toHaveLength(0);
        expect(result.filterStats.dropped.nonLatin).toBe(1);
      });

      it('drops titles containing accented Latin characters per 7-bit ASCII regex specification', () => {
        // Implementation uses /[^\x00-\x7F]/, rejecting characters above 0x7F
        const accented = createContest({
          id: 'accented-latin',
          title: 'Concours de Programmation École Polytechnique',
        });

        const result = applyContestRules([accented], baseNow);
        expect(result.contests).toHaveLength(0);
        expect(result.filterStats.dropped.nonLatin).toBe(1);
      });
    });

    describe('Junk keyword filter & exceptions', () => {
      it.each([
        ['test', 'Sample Test Round'],
        ['practice', 'Practice Session 1'],
        ['webinar', 'Competitive Programming Webinar'],
        ['training', 'Spring Training Day 2'],
        ['mirror', 'Div 2 Mirror Round'],
      ])('drops titles matching junk keyword "%s"', (_, title) => {
        const contest = createContest({ title });
        const result = applyContestRules([contest], baseNow);
        expect(result.contests).toHaveLength(0);
        expect(result.filterStats.dropped.junk).toBe(1);
      });

      it('does not falsely match junk keyword substrings within normal words like "Contest"', () => {
        // "Contest" contains "test", but word-boundary \btest\b prevents false positive
        const normalContest = createContest({
          id: 'contest-word',
          title: 'Algorithm Contest Round 1',
        });

        const result = applyContestRules([normalContest], baseNow);
        expect(result.contests).toHaveLength(1);
        expect(result.filterStats.dropped.junk).toBe(0);
      });

      it('preserves qualifying rounds from major branded platforms', () => {
        const leetcodeQual = createContest({
          id: 'lc-qual',
          title: 'LeetCode Biweekly Qualifying Round',
          platform: 'leetcode.com',
        });
        const codeforcesQual = createContest({
          id: 'cf-qual',
          title: 'Codeforces Qualifying Round 2026',
          platform: 'codeforces.com',
        });

        const result = applyContestRules([leetcodeQual, codeforcesQual], baseNow);
        expect(result.contests).toHaveLength(2);
        expect(result.filterStats.dropped.junk).toBe(0);
      });

      it('drops qualifying rounds from non-major or unrecognized platforms', () => {
        const unknownQual = createContest({
          id: 'unknown-qual',
          title: 'Local Club Qualifying Round',
          platform: 'localclub.xyz',
        });

        const result = applyContestRules([unknownQual], baseNow);
        expect(result.contests).toHaveLength(0);
        expect(result.filterStats.dropped.junk).toBe(1);
      });
    });

    describe('University filter & official regional exceptions', () => {
      it.each([
        ['nru itmo', 'NRU ITMO Selection Round'],
        ['olympiads school', 'Olympiads School Selection Contest'],
        ['school cco', 'High School CCO Invitational'],
        ['university', 'Stanford University Open Round'],
        ['college', 'Dartmouth College Challenge'],
        ['campus', 'Spring Campus Challenge'],
        ['institute', 'Technology Institute Cup'],
        ['department', 'Computer Science Department Match'],
        ['faculty', 'Engineering Faculty Round'],
        ['classroom', 'Classroom Coding League'],
      ])('drops internal university contest containing keyword "%s"', (_, title) => {
        const uniContest = createContest({ title });
        const result = applyContestRules([uniContest], baseNow);
        expect(result.contests).toHaveLength(0);
        expect(result.filterStats.dropped.internalUniversity).toBe(1);
      });

      it.each([
        ['icpc', 'Stanford University ICPC Selection Round'],
        ['regional', 'Mid-Atlantic Regional University Contest'],
        ['regionals', 'European Regionals Campus Round'],
        ['world finals', 'ACM ICPC World Finals College Round'],
      ])('preserves university contests when matching official regional keyword "%s"', (_, title) => {
        const officialContest = createContest({ id: 'official-event', title });
        const result = applyContestRules([officialContest], baseNow);
        expect(result.contests).toHaveLength(1);
        expect(result.filterStats.dropped.internalUniversity).toBe(0);
      });

      it('evaluates university filter precedence when major brand qualifying round also matches university', () => {
        // Even if qualifying round exception matches, university filter executes after and drops it
        const brandedUniQualifying = createContest({
          id: 'branded-uni-qual',
          title: 'LeetCode Stanford University Qualifying Round',
          platform: 'leetcode.com',
        });

        const result = applyContestRules([brandedUniQualifying], baseNow);
        expect(result.contests).toHaveLength(0);
        expect(result.filterStats.dropped.internalUniversity).toBe(1);
      });
    });
  });

  describe('Classification & duration partitioning (3 days / 259200s)', () => {
    it('treats duration <= 259200s as standard contest in main feed', () => {
      const contest2Days = createContest({
        id: '2-days',
        durationSeconds: 172800,
        endTime: new Date(baseNowMs + 172800 * 1000).toISOString(),
      });
      const contestExact3Days = createContest({
        id: 'exact-3-days',
        durationSeconds: 259200, // exact boundary
        endTime: new Date(baseNowMs + 259200 * 1000).toISOString(),
      });

      const result = applyContestRules([contest2Days, contestExact3Days], baseNow);
      expect(result.contests).toHaveLength(2);
      expect(result.longTermContests).toHaveLength(0);
      expect(result.contests.every((c) => c.isLongTerm === false)).toBe(true);
      expect(result.filterStats.kept).toBe(2);
      expect(result.filterStats.longTerm).toBe(0);
    });

    it('partitions duration > 259200s into longTermContests', () => {
      const contest3DaysPlus1Sec = createContest({
        id: '3-days-plus-1s',
        durationSeconds: 259201, // 259200 + 1
        endTime: new Date(baseNowMs + 259201 * 1000).toISOString(),
      });
      const monthLongContest = createContest({
        id: 'month-marathon',
        durationSeconds: 30 * 24 * 3600,
        endTime: new Date(baseNowMs + 30 * 24 * 3600 * 1000).toISOString(),
      });

      const result = applyContestRules([contest3DaysPlus1Sec, monthLongContest], baseNow);
      expect(result.contests).toHaveLength(0);
      expect(result.longTermContests).toHaveLength(2);
      expect(result.longTermContests.every((c) => c.isLongTerm === true)).toBe(true);
      expect(result.filterStats.kept).toBe(0);
      expect(result.filterStats.longTerm).toBe(2);
    });
  });

  describe('Priority Scoring (Isolated Dimensions)', () => {
    describe('Platform weight dimension (0 to 40 pts)', () => {
      it.each([
        ['leetcode.com', 'leetcode.com', 40, 'dsa-cp'],
        ['leetcode', 'leetcode', 40, 'dsa-cp'],
        ['codeforces.com', 'codeforces.com', 35, 'dsa-cp'],
        ['codechef.com', 'codechef.com', 30, 'dsa-cp'],
        ['geeksforgeeks.org', 'geeksforgeeks.org', 30, 'dsa-cp'],
        ['gfg', 'gfg', 30, 'dsa-cp'],
        ['hackerrank.com', 'hackerrank.com', 30, 'dsa-cp'],
        ['atcoder.jp', 'atcoder.jp', 25, 'dsa-cp'],
        ['naukri.com/code360', 'naukri.com/code360', 25, 'dsa-cp'],
        ['kaggle.com', 'kaggle.com', 20, 'ai-ml'],
        ['drivendata.org', 'drivendata.org', 20, 'ai-ml'],
        ['ctftime.org', 'ctftime.org', 15, 'cybersecurity'],
        ['other-unknown.com', 'other-unknown.com', 5, 'other'],
      ])('assigns weight %d and category %s for platform "%s"', (_, platform, expectedWeight, expectedCat) => {
        // Using baseline contest: Unknown diff (0), >7d proximity (5), 0 participants (0)
        const contest = createContest({ platform });
        const result = applyContestRules([contest], baseNow);
        const scored = result.contests[0];

        expect(scored.scoreBreakdown.platform).toBe(expectedWeight);
        expect(scored.categoryKey).toBe(expectedCat);
        expect(scored.priorityScore).toBe(expectedWeight + 0 + 5 + 0);
      });
    });

    describe('Difficulty weight dimension (0 to 30 pts)', () => {
      it.each([
        ['Beginner', 'Beginner Friendly Round', 30],
        ['Div 3', 'Codeforces Round Div 3', 30],
        ['Div 4', 'Codeforces Round Div. 4', 30],
        ['Easy', 'Easy Math Challenge', 30],
        ['Biweekly', 'Biweekly Contest 120', 30],
        ['ABC', 'AtCoder Beginner Contest (ABC)', 30],
        ['Starters', 'CodeChef Starters 100', 30],
        ['Basic', 'Basic Data Structures Round', 30],
      ])('assigns Beginner difficulty (30 pts) for title containing "%s"', (_, title, expectedWeight) => {
        const contest = createContest({ title });
        const result = applyContestRules([contest], baseNow);
        const scored = result.contests[0];

        expect(scored.difficulty).toBe('Beginner');
        expect(scored.scoreBreakdown.difficulty).toBe(expectedWeight);
      });

      it.each([
        ['Div 2', 'Codeforces Round Div 2', 20],
        ['Weekly', 'Weekly Contest 400', 20],
        ['Rated', 'Rated Round 888', 20],
        ['Regular', 'Regular Contest 50', 20],
        ['ARC', 'AtCoder Regular Contest (ARC)', 20],
        ['Educational', 'Educational Codeforces Round', 20],
      ])('assigns Intermediate difficulty (20 pts) for title containing "%s"', (_, title, expectedWeight) => {
        const contest = createContest({ title });
        const result = applyContestRules([contest], baseNow);
        const scored = result.contests[0];

        expect(scored.difficulty).toBe('Intermediate');
        expect(scored.scoreBreakdown.difficulty).toBe(expectedWeight);
      });

      it.each([
        ['Div 1', 'Codeforces Round Div 1', 10],
        ['Advanced', 'Advanced Algorithms Round', 10],
        ['Hard', 'Hard Dynamic Programming Cup', 10],
        ['AGC', 'AtCoder Grand Contest (AGC)', 10],
        ['Grand', 'Grand Finals Selection', 10],
        ['Expert', 'Expert Invitational', 10],
      ])('assigns Advanced difficulty (10 pts) for title containing "%s"', (_, title, expectedWeight) => {
        const contest = createContest({ title });
        const result = applyContestRules([contest], baseNow);
        const scored = result.contests[0];

        expect(scored.difficulty).toBe('Advanced');
        expect(scored.scoreBreakdown.difficulty).toBe(expectedWeight);
      });

      it('assigns Unknown difficulty (0 pts) when no difficulty keywords are present', () => {
        const contest = createContest({ title: 'Spring Open Cup' });
        const result = applyContestRules([contest], baseNow);
        const scored = result.contests[0];

        expect(scored.difficulty).toBe('Unknown');
        expect(scored.scoreBreakdown.difficulty).toBe(0);
      });
    });

    describe('Time proximity dimension (5 to 20 pts) & start-time boundaries', () => {
      it('awards 20 pts for contests that have already started (live contests)', () => {
        // startTime was 1 hour ago; endTime is in future
        const liveContest = createContest({
          startTime: new Date(baseNowMs - 3600 * 1000).toISOString(),
          endTime: new Date(baseNowMs + 3600 * 1000).toISOString(),
        });

        const result = applyContestRules([liveContest], baseNow);
        expect(result.contests[0].scoreBreakdown.timeProximity).toBe(20);
      });

      it('awards 20 pts when startTime is exactly equal to now', () => {
        const startingNow = createContest({
          startTime: new Date(baseNowMs).toISOString(),
          endTime: new Date(baseNowMs + 7200 * 1000).toISOString(),
        });

        const result = applyContestRules([startingNow], baseNow);
        expect(result.contests[0].scoreBreakdown.timeProximity).toBe(20);
      });

      it('awards 20 pts when starting within 24 hours', () => {
        const in23Hours = createContest({
          startTime: new Date(baseNowMs + 23 * 3600 * 1000).toISOString(),
        });
        const inExact24Hours = createContest({
          startTime: new Date(baseNowMs + 24 * 3600 * 1000).toISOString(),
        });

        const result = applyContestRules([in23Hours, inExact24Hours], baseNow);
        expect(result.contests[0].scoreBreakdown.timeProximity).toBe(20);
        expect(result.contests[1].scoreBreakdown.timeProximity).toBe(20);
      });

      it('awards 15 pts when starting between 24 hours and 3 days', () => {
        const in24HoursPlus1Ms = createContest({
          startTime: new Date(baseNowMs + 24 * 3600 * 1000 + 1).toISOString(),
        });
        const inExact3Days = createContest({
          startTime: new Date(baseNowMs + 3 * 24 * 3600 * 1000).toISOString(),
        });

        const result = applyContestRules([in24HoursPlus1Ms, inExact3Days], baseNow);
        expect(result.contests[0].scoreBreakdown.timeProximity).toBe(15);
        expect(result.contests[1].scoreBreakdown.timeProximity).toBe(15);
      });

      it('awards 10 pts when starting between 3 days and 7 days', () => {
        const in3DaysPlus1Ms = createContest({
          startTime: new Date(baseNowMs + 3 * 24 * 3600 * 1000 + 1).toISOString(),
        });
        const inExact7Days = createContest({
          startTime: new Date(baseNowMs + 7 * 24 * 3600 * 1000).toISOString(),
        });

        const result = applyContestRules([in3DaysPlus1Ms, inExact7Days], baseNow);
        expect(result.contests[0].scoreBreakdown.timeProximity).toBe(10);
        expect(result.contests[1].scoreBreakdown.timeProximity).toBe(10);
      });

      it('awards 5 pts when starting strictly beyond 7 days', () => {
        const in7DaysPlus1Ms = createContest({
          startTime: new Date(baseNowMs + 7 * 24 * 3600 * 1000 + 1).toISOString(),
        });

        const result = applyContestRules([in7DaysPlus1Ms], baseNow);
        expect(result.contests[0].scoreBreakdown.timeProximity).toBe(5);
      });
    });

    describe('Social proof dimension (0, 5, or 10 pts)', () => {
      it('awards 10 pts when participantCount > 5000', () => {
        const contest = createContest({ participantCount: 5001 });
        const result = applyContestRules([contest], baseNow);
        expect(result.contests[0].scoreBreakdown.socialProof).toBe(10);
      });

      it('awards 5 pts when participantCount is 5000 (boundary)', () => {
        // Contract: count > 5000 is 10; count === 5000 falls through to count > 1000 (5 pts)
        const contest = createContest({ participantCount: 5000 });
        const result = applyContestRules([contest], baseNow);
        expect(result.contests[0].scoreBreakdown.socialProof).toBe(5);
      });

      it('awards 5 pts when participantCount is 1001', () => {
        const contest = createContest({ participantCount: 1001 });
        const result = applyContestRules([contest], baseNow);
        expect(result.contests[0].scoreBreakdown.socialProof).toBe(5);
      });

      it('awards 0 pts when participantCount is 1000 (boundary)', () => {
        // Contract: count > 1000 is 5; count === 1000 falls through to 0 pts
        const contest = createContest({ participantCount: 1000 });
        const result = applyContestRules([contest], baseNow);
        expect(result.contests[0].scoreBreakdown.socialProof).toBe(0);
      });

      it('awards 0 pts for missing, null, negative, or invalid participantCount', () => {
        const cNull = createContest({ participantCount: null });
        const cNeg = createContest({ participantCount: -100 });
        const cStringInvalid = createContest({ participantCount: 'unknown' });

        const result = applyContestRules([cNull, cNeg, cStringInvalid], baseNow);
        expect(result.contests[0].scoreBreakdown.socialProof).toBe(0);
        expect(result.contests[1].scoreBreakdown.socialProof).toBe(0);
        expect(result.contests[2].scoreBreakdown.socialProof).toBe(0);
      });

      it('correctly parses numeric strings for participantCount', () => {
        const cString = createContest({ participantCount: '7500' });
        const result = applyContestRules([cString], baseNow);
        expect(result.contests[0].scoreBreakdown.socialProof).toBe(10);
      });
    });

    describe('Composite Priority Score (0 to 100 max)', () => {
      it('calculates the theoretical maximum of 100 pts correctly', () => {
        // LeetCode (40) + Beginner (30) + <=24h (20) + >5000 participants (10) = 100
        const maxContest = createContest({
          platform: 'leetcode.com',
          title: 'LeetCode Beginner Biweekly Contest',
          startTime: new Date(baseNowMs + 2 * 3600 * 1000).toISOString(),
          participantCount: 8000,
        });

        const result = applyContestRules([maxContest], baseNow);
        expect(result.contests[0].priorityScore).toBe(100);
      });

      it('calculates the theoretical minimum of 10 pts correctly', () => {
        // Other (5) + Unknown (0) + >7d (5) + 0 participants (0) = 10
        const minContest = createContest({
          platform: 'unknown-platform.org',
          title: 'Spring Open Cup',
          startTime: new Date(baseNowMs + 14 * 24 * 3600 * 1000).toISOString(),
          participantCount: 0,
        });

        const result = applyContestRules([minContest], baseNow);
        expect(result.contests[0].priorityScore).toBe(10);
      });
    });
  });

  describe('Sorting & Tie-Breaking Contracts', () => {
    it('sorts contests strictly by priorityScore descending', () => {
      const contestScore10 = createContest({ id: 'score-10', platform: 'unknown.org' }); // 5 + 0 + 5 + 0 = 10
      const contestScore40 = createContest({ id: 'score-40', platform: 'leetcode.com' }); // 40 + 0 + 5 + 0 = 45 -> score-45
      const contestScore85 = createContest({
        id: 'score-85',
        platform: 'codeforces.com', // 35
        title: 'Codeforces Div 2',   // 20
        startTime: new Date(baseNowMs + 3600 * 1000).toISOString(), // 20
        participantCount: 6000,      // 10 -> Total 85
      });

      const result = applyContestRules([contestScore10, contestScore40, contestScore85], baseNow);
      expect(result.contests.map((c) => c.id)).toEqual(['score-85', 'score-40', 'score-10']);
    });

    it('breaks ties between equal priority scores using earliest startTime (ascending)', () => {
      const score80Later = createContest({
        id: 'tie-later',
        platform: 'leetcode.com', // 40
        title: 'Weekly Contest',  // 20
        startTime: new Date(baseNowMs + 5 * 3600 * 1000).toISOString(), // 20 -> Total 80
      });
      const score80Earlier = createContest({
        id: 'tie-earlier',
        platform: 'leetcode.com', // 40
        title: 'Weekly Contest',  // 20
        startTime: new Date(baseNowMs + 2 * 3600 * 1000).toISOString(), // 20 -> Total 80
      });

      // Pass later contest first in input
      const result = applyContestRules([score80Later, score80Earlier], baseNow);
      expect(result.contests[0].id).toBe('tie-earlier');
      expect(result.contests[1].id).toBe('tie-later');
    });

    it('maintains deterministic relative order when both priorityScore and startTime are identical', () => {
      const contestA = createContest({
        id: 'identical-A',
        title: 'Contest A',
        startTime: new Date(baseNowMs + 3600 * 1000).toISOString(),
      });
      const contestB = createContest({
        id: 'identical-B',
        title: 'Contest B',
        startTime: new Date(baseNowMs + 3600 * 1000).toISOString(),
      });

      const result = applyContestRules([contestA, contestB], baseNow);
      expect(result.contests.map((c) => c.id)).toEqual(['identical-A', 'identical-B']);
    });
  });

  describe('Categorization mapping', () => {
    it('populates dsa-cp, ai-ml, and cybersecurity categories with non-long-term contests', () => {
      const dsa = createContest({ id: 'dsa-1', platform: 'leetcode.com' });
      const aiml = createContest({ id: 'aiml-1', platform: 'kaggle.com' });
      const cyber = createContest({ id: 'cyber-1', platform: 'ctftime.org' });

      const result = applyContestRules([dsa, aiml, cyber], baseNow);
      expect(result.categories['dsa-cp'].map((c) => c.id)).toEqual(['dsa-1']);
      expect(result.categories['ai-ml'].map((c) => c.id)).toEqual(['aiml-1']);
      expect(result.categories['cybersecurity'].map((c) => c.id)).toEqual(['cyber-1']);
    });

    it('excludes long-term contests from category arrays', () => {
      const longTermKaggle = createContest({
        id: 'kaggle-marathon',
        platform: 'kaggle.com',
        durationSeconds: 30 * 24 * 3600, // 30 days
        endTime: new Date(baseNowMs + 30 * 24 * 3600 * 1000).toISOString(),
      });

      const result = applyContestRules([longTermKaggle], baseNow);
      expect(result.longTermContests).toHaveLength(1);
      expect(result.categories['ai-ml']).toHaveLength(0);
    });

    it('excludes uncategorized platforms (Other) from category arrays but keeps them in main feed', () => {
      const otherPlatform = createContest({ id: 'other-1', platform: 'unknown-coding.xyz' });

      const result = applyContestRules([otherPlatform], baseNow);
      expect(result.contests).toHaveLength(1);
      expect(result.contests[0].categoryKey).toBe('other');
      expect(result.categories['dsa-cp']).toHaveLength(0);
      expect(result.categories['ai-ml']).toHaveLength(0);
      expect(result.categories['cybersecurity']).toHaveLength(0);
    });
  });

  describe('Edge cases & execution determinism', () => {
    it('handles empty input arrays cleanly', () => {
      const result = applyContestRules([], baseNow);
      expect(result.contests).toEqual([]);
      expect(result.longTermContests).toEqual([]);
      expect(result.filterStats).toEqual({
        raw: 0,
        kept: 0,
        longTerm: 0,
        dropped: {
          ended: 0,
          zeroDuration: 0,
          nonLatin: 0,
          junk: 0,
          internalUniversity: 0,
        },
      });
    });

    it('produces 100% deterministic results across multiple invocations with explicit now', () => {
      const contests = [
        createContest({ id: 'c1', platform: 'leetcode.com', title: 'Contest 1' }),
        createContest({ id: 'c2', platform: 'codeforces.com', title: 'Contest 2' }),
        createContest({ id: 'c3', platform: 'atcoder.jp', title: 'Contest 3' }),
      ];

      const run1 = applyContestRules(contests, baseNow);
      const run2 = applyContestRules(contests, baseNow);

      expect(run1).toEqual(run2);
    });
  });
});
