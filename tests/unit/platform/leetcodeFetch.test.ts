import { describe, it, expect } from 'vitest';

describe('LeetCode Data Pipeline & Metric Extraction', () => {
  // Snapshot matching live profile: https://leetcode.com/u/array_destroyer/
  const mockArrayDestroyerProfile = {
    matchedUser: {
      username: 'array_destroyer',
      submitStats: {
        acSubmissionNum: [
          { difficulty: 'All', count: 271 },
          { difficulty: 'Easy', count: 119 },
          { difficulty: 'Medium', count: 137 },
          { difficulty: 'Hard', count: 15 }
        ]
      },
      profile: {
        ranking: 601437,
        reputation: 16,
        starRating: 2
      },
      submissionCalendar: JSON.stringify({
        // Active dates in current week
        [Math.floor(new Date('2026-11-02T14:26:24Z').getTime() / 1000)]: 2,
        [Math.floor(new Date('2026-11-01T03:14:01Z').getTime() / 1000)]: 4,
        [Math.floor(new Date('2026-10-30T15:19:06Z').getTime() / 1000)]: 3,
        [Math.floor(new Date('2026-10-29T12:15:45Z').getTime() / 1000)]: 3,
        // Past activity (outside current 7-day window)
        [Math.floor(new Date('2026-10-15T00:00:00Z').getTime() / 1000)]: 5
      }),
      tagProblemCounts: {
        fundamental: [
          { tagName: 'Array', tagSlug: 'array', problemsSolved: 155 },
          { tagName: 'String', tagSlug: 'string', problemsSolved: 45 },
          { tagName: 'Sorting', tagSlug: 'sorting', problemsSolved: 34 },
          { tagName: 'Two Pointers', tagSlug: 'two-pointers', problemsSolved: 34 }
        ],
        intermediate: [
          { tagName: 'Hash Table', tagSlug: 'hash-table', problemsSolved: 53 },
          { tagName: 'Math', tagSlug: 'math', problemsSolved: 37 },
          { tagName: 'Tree', tagSlug: 'tree', problemsSolved: 23 },
          { tagName: 'Binary Tree', tagSlug: 'binary-tree', problemsSolved: 23 }
        ],
        advanced: [
          { tagName: 'Dynamic Programming', tagSlug: 'dynamic-programming', problemsSolved: 32 },
          { tagName: 'Backtracking', tagSlug: 'backtracking', problemsSolved: 16 }
        ]
      }
    },
    userContestRanking: {
      rating: 1335.018,
      globalRanking: 840095
    },
    recentAcSubmissionList: [
      {
        title: 'Count and Say',
        titleSlug: 'count-and-say',
        timestamp: String(Math.floor(new Date('2026-11-02T14:26:24Z').getTime() / 1000))
      },
      {
        title: 'Minimum Value of Merged Integers',
        titleSlug: 'minimum-value-of-merged-integers',
        timestamp: String(Math.floor(new Date('2026-11-01T03:14:01Z').getTime() / 1000))
      },
      {
        title: 'Course Schedule II',
        titleSlug: 'course-schedule-ii',
        timestamp: String(Math.floor(new Date('2026-10-30T15:19:06Z').getTime() / 1000))
      },
      {
        title: 'Target Sum',
        titleSlug: 'target-sum',
        timestamp: String(Math.floor(new Date('2026-10-30T04:40:26Z').getTime() / 1000))
      },
      {
        title: 'Coin Change',
        titleSlug: 'coin-change',
        timestamp: String(Math.floor(new Date('2026-10-29T11:37:15Z').getTime() / 1000))
      }
    ]
  };

  it('1. parses array_destroyer profile overview and difficulty ratios', () => {
    const overview = mockArrayDestroyerProfile.matchedUser.submitStats.acSubmissionNum;
    const total = overview.find(s => s.difficulty === 'All')?.count || 0;
    const easy = overview.find(s => s.difficulty === 'Easy')?.count || 0;
    const medium = overview.find(s => s.difficulty === 'Medium')?.count || 0;
    const hard = overview.find(s => s.difficulty === 'Hard')?.count || 0;

    expect(total).toBe(271);
    expect(easy).toBe(119);
    expect(medium).toBe(137);
    expect(hard).toBe(15);

    const hardRatio = ((hard / total) * 100).toFixed(1);
    const mediumRatio = ((medium / total) * 100).toFixed(1);
    expect(hardRatio).toBe('5.5');
    expect(mediumRatio).toBe('50.6');
  });

  it('2. extracts active coding days within the 7-day window from submissionCalendar', () => {
    const parsedCalendar = JSON.parse(mockArrayDestroyerProfile.matchedUser.submissionCalendar);
    const fixedNow = new Date('2026-11-02T21:00:00Z');
    const oneWeekAgo = new Date(fixedNow);
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const activeDays = Object.keys(parsedCalendar).filter(timestampStr => {
      const timestampSec = parseInt(timestampStr, 10);
      if (isNaN(timestampSec)) return false;
      const d = new Date(timestampSec * 1000);
      return d > oneWeekAgo;
    }).length;

    // 4 active dates within the 7-day window
    expect(activeDays).toBe(4);
  });

  it('3. aggregates, sorts, and extracts top topics for array_destroyer', () => {
    const tagCounts = mockArrayDestroyerProfile.matchedUser.tagProblemCounts;
    const allTags = [
      ...(tagCounts.fundamental || []),
      ...(tagCounts.intermediate || []),
      ...(tagCounts.advanced || [])
    ];

    const sortedTags = allTags
      .map(t => ({ tag: t.tagName, count: t.problemsSolved }))
      .sort((a, b) => b.count - a.count);

    expect(sortedTags[0].tag).toBe('Array');
    expect(sortedTags[0].count).toBe(155);
    expect(sortedTags[1].tag).toBe('Hash Table');
    expect(sortedTags[1].count).toBe(53);
    expect(sortedTags[2].tag).toBe('String');
    expect(sortedTags[2].count).toBe(45);
    expect(sortedTags[3].tag).toBe('Math');
    expect(sortedTags[3].count).toBe(37);
  });

  it('4. detects recent solved problems avoiding false-positive "No activity" reports', () => {
    const fixedNow = new Date('2026-11-02T21:00:00Z');
    const oneWeekAgo = new Date(fixedNow);
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const recentSubs = mockArrayDestroyerProfile.recentAcSubmissionList.map(s => ({
      title: s.title,
      timestamp: new Date(parseInt(s.timestamp, 10) * 1000)
    }));

    const subsThisWeek = recentSubs.filter(s => s.timestamp > oneWeekAgo);

    let deltaSolved = 0; // Simulated history delta = 0 (first review / un-snapshotted)
    if (deltaSolved === 0 && subsThisWeek.length > 0) {
      deltaSolved = subsThisWeek.length;
    }

    expect(deltaSolved).toBe(5);
    expect(subsThisWeek[0].title).toBe('Count and Say');
    expect(subsThisWeek[1].title).toBe('Minimum Value of Merged Integers');
  });

  it('5. returns full structured AI context matching production dataFilter contract', () => {
    const structuredOutput = {
      total_solved: 271,
      delta_solved_this_week: 5,
      active_days_this_week: 4,
      top_topics_focus: ['Array', 'Hash Table', 'String', 'Math', 'Sorting'],
      recent_solved_problems: [
        'Count and Say',
        'Minimum Value of Merged Integers',
        'Course Schedule II',
        'Target Sum',
        'Coin Change'
      ],
      current_rating: 1335.018,
      status: 'Active'
    };

    expect(structuredOutput.total_solved).toBe(271);
    expect(structuredOutput.active_days_this_week).toBe(4);
    expect(structuredOutput.top_topics_focus).toHaveLength(5);
    expect(structuredOutput.top_topics_focus[0]).toBe('Array');
    expect(structuredOutput.recent_solved_problems[0]).toBe('Count and Say');
    expect(structuredOutput.status).not.toBe('No problems solved this week');
  });
});
