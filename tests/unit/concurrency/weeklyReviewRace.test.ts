import fs from 'node:fs';
import path from 'node:path';

// Bootstrap environment variables for database connections in test runner
for (const envFile of ['.env', '.env.local']) {
  const envPath = path.resolve(process.cwd(), envFile);
  if (fs.existsSync(envPath)) {
    const lines = fs.readFileSync(envPath, 'utf8').split('\n');
    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith('#')) {
        const eqIdx = trimmed.indexOf('=');
        if (eqIdx !== -1) {
          const key = trimmed.slice(0, eqIdx).trim();
          let val = trimmed.slice(eqIdx + 1).trim();
          if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
            val = val.slice(1, -1);
          }
          if (!process.env[key]) {
            process.env[key] = val;
          }
        }
      }
    }
  }
}

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import crypto from 'node:crypto';
import connectToDatabase from '@/app/lib/mongodb';
import AIReview from '@/models/AIReview';
import { UserCoderProfile } from '@/models/UserCoderProfile';
import { User } from '@/models/User';
import * as emailService from '@/app/lib/email/emailService';
import * as reviewerRouter from '@/services/ai/reviewerRouter';
import * as platformFetchers from '@/app/lib/platform-fetchers';
import { processUserReviewHandler } from '@/app/api/qstash/process-user-review/route';

vi.mock('@/services/ai/reviewerRouter', () => ({
  generateWeeklyReview: vi.fn()
}));

vi.mock('@/app/lib/email/emailService', () => ({
  sendWeeklyReviewEmail: vi.fn(),
  markReviewEmailSent: vi.fn()
}));

vi.mock('@/app/lib/platform-fetchers', () => ({
  fetchLeetCodeStats: vi.fn().mockResolvedValue({
    matchedUser: {
      username: 'test_coder',
      submitStats: {
        acSubmissionNum: [
          { difficulty: 'All', count: 150 },
          { difficulty: 'Easy', count: 70 },
          { difficulty: 'Medium', count: 60 },
          { difficulty: 'Hard', count: 20 }
        ]
      },
      profile: { ranking: 50000 },
      submissionCalendar: '{"1730419200": 3}'
    },
    recentAcSubmissionList: []
  }),
  fetchCodeforcesStats: vi.fn().mockResolvedValue({
    info: { handle: 'test_coder', rating: 1350, rank: 'pupil', maxRating: 1400 },
    recentSubmissions: []
  }),
  fetchGithubStats: vi.fn().mockResolvedValue({
    user: { public_repos: 12, followers: 3 },
    repos: [],
    recentEvents: []
  }),
  fetchCodeChefStats: vi.fn().mockResolvedValue({
    rating: 1500,
    stars: '2★'
  })
}));

describe('Weekly Review Concurrency & Race-Condition Suite (FAANG Benchmark)', { timeout: 15000 }, () => {
  let testUserId: string;
  let testCycleKey: string;
  let emailSpy: any;
  let llmSpy: any;

  beforeEach(async () => {
    await connectToDatabase();

    // 1. Generate an isolated, unique test fixture UUID
    testUserId = `test_usr_${crypto.randomUUID().replace(/-/g, '')}`;
    testCycleKey = '20261101';

    // 2. Seed Fake User and Coder Profile in real MongoDB
    await User.create({
      supabaseId: testUserId,
      email: `${testUserId}@erithx-test.internal`,
      name: 'Benchmark Coder',
      role: 'student',
      isPro: false,
      mentorPrefs: {
        goal: 'swe_intern',
        focus: 'dynamic_programming',
        strictness: 'moderate'
      }
    });

    await UserCoderProfile.create({
      userId: testUserId,
      userEmail: `${testUserId}@erithx-test.internal`,
      userName: 'Benchmark Coder',
      platforms: {
        leetcode: {
          handle: 'test_coder',
          totalSolved: 150,
          ranking: 50000,
          activeDays: 14,
          streak: 5
        },
        codeforces: {
          handle: 'test_coder',
          rating: 1350,
          rank: 'pupil'
        },
        github: {
          handle: 'test_coder',
          publicRepos: 12,
          totalStars: 5
        }
      }
    });

    // 3. Spy & Mock Email Dispatch (simulating real 40ms network latency to keep race window open)
    vi.mocked(emailService.sendWeeklyReviewEmail).mockReset();
    emailSpy = vi.mocked(emailService.sendWeeklyReviewEmail).mockImplementation(async () => {
      await new Promise((resolve) => setTimeout(resolve, 40));
      return { success: true, messageId: `msg_${crypto.randomUUID()}` } as any;
    });

    // 4. Spy & Mock LLM Reasoning (returns deterministic synthetic review in 10ms)
    vi.mocked(reviewerRouter.generateWeeklyReview).mockReset();
    llmSpy = vi.mocked(reviewerRouter.generateWeeklyReview).mockImplementation(async () => {
      await new Promise((resolve) => setTimeout(resolve, 10));
      return {
        review_text: 'Solid problem-solving trajectory this week. Keep up the consistency in dynamic programming.',
        hidden_summary: 'Target met: 150 total solves.',
        targets_set: 'Solve 5 medium Graph problems and attend 1 contest.',
        monthly_roadmap: '',
        roy_factor: 1,
        model_used: 'mock-gemini-2.0-flash',
        prompt_tokens: 150
      };
    });

    // 5. Mock external platform API scrapers to avoid live network flakiness
    vi.spyOn(platformFetchers, 'fetchLeetCodeStats').mockResolvedValue({
      matchedUser: {
        username: 'test_coder',
        submitStats: {
          acSubmissionNum: [
            { difficulty: 'All', count: 150 },
            { difficulty: 'Easy', count: 70 },
            { difficulty: 'Medium', count: 60 },
            { difficulty: 'Hard', count: 20 }
          ]
        },
        profile: { ranking: 50000 },
        submissionCalendar: '{"1730419200": 3}'
      },
      recentAcSubmissionList: []
    } as any);

    vi.spyOn(platformFetchers, 'fetchCodeforcesStats').mockResolvedValue({
      info: { handle: 'test_coder', rating: 1350, rank: 'pupil', maxRating: 1400 },
      recentSubmissions: []
    } as any);

    vi.spyOn(platformFetchers, 'fetchGithubStats').mockResolvedValue({
      user: { public_repos: 12, followers: 3 },
      repos: [],
      recentEvents: []
    } as any);
  });

  afterEach(async () => {
    // Teardown: purge all test artifacts from database
    await AIReview.deleteMany({ user_id: testUserId });
    await UserCoderProfile.deleteMany({ userId: testUserId });
    await User.deleteMany({ supabaseId: testUserId });
    vi.restoreAllMocks();
  });

  it('Benchmark 1: Baseline Single Worker Execution (Happy Path)', async () => {
    const req = new Request('http://localhost:3000/api/qstash/process-user-review', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: testUserId, cycleKey: testCycleKey })
    });

    const res = await processUserReviewHandler(req);
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.success).toBe(true);
    expect(emailSpy).toHaveBeenCalledTimes(1);
    expect(llmSpy).toHaveBeenCalledTimes(1);

    const savedReviews = await AIReview.find({ user_id: testUserId, cycle_key: testCycleKey });
    expect(savedReviews.length).toBe(1);
    expect(savedReviews[0].email_sent).toBe(true);
  });

  it('Benchmark 2: Sequential Idempotency (Delayed Retry)', async () => {
    // First execution
    const req1 = new Request('http://localhost:3000/api/qstash/process-user-review', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: testUserId, cycleKey: testCycleKey })
    });
    await processUserReviewHandler(req1);
    expect(emailSpy).toHaveBeenCalledTimes(1);

    // Second execution 5 minutes later (simulated delayed retry)
    const req2 = new Request('http://localhost:3000/api/qstash/process-user-review', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: testUserId, cycleKey: testCycleKey })
    });
    const res2 = await processUserReviewHandler(req2);
    const json2 = await res2.json();

    expect(res2.status).toBe(200);
    expect(json2.status).toBe('already_completed');
    // Crucial check: emailSpy must STILL only have been called 1 time total!
    expect(emailSpy).toHaveBeenCalledTimes(1);
    expect(llmSpy).toHaveBeenCalledTimes(1);
  });

  it('Benchmark 3: Crash Recovery (Worker died before email was sent)', async () => {
    // Simulate Worker 1 saved review to DB, but process crashed before email dispatch
    await AIReview.create({
      user_id: testUserId,
      cycle_key: testCycleKey,
      generated_text: 'Pre-existing generated review',
      targets_set: 'Solve 5 DP problems',
      model_used: 'mock-gemini',
      roy_factor: 1,
      email_sent: false // Email never made it out!
    });

    // Worker 2 (retry) arrives to process the review
    const req = new Request('http://localhost:3000/api/qstash/process-user-review', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: testUserId, cycleKey: testCycleKey })
    });

    const res = await processUserReviewHandler(req);
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.email_status).toBe('Sent successfully');
    // Exactly 1 email recovered
    expect(emailSpy).toHaveBeenCalledTimes(1);
    // ZERO LLM tokens wasted (skipped LLM call entirely!)
    expect(llmSpy).toHaveBeenCalledTimes(0);

    const updated = await AIReview.findOne({ user_id: testUserId, cycle_key: testCycleKey });
    expect(updated?.email_sent).toBe(true);
  });

  it('Benchmark 4: CONCURRENCY RACE STRESS TEST (5 Parallel Workers hitting same user at same ms)', async () => {
    // 5 concurrent workers triggered simultaneously via Promise.all
    const parallelCalls = Array.from({ length: 5 }, () =>
      processUserReviewHandler(
        new Request('http://localhost:3000/api/qstash/process-user-review', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: testUserId, cycleKey: testCycleKey })
        })
      )
    );

    const responses = await Promise.all(parallelCalls);
    const statuses = await Promise.all(responses.map((r) => r.status));

    // Every worker must finish with a 200 HTTP status (no unhandled 500 crashes)
    statuses.forEach((status) => expect(status).toBe(200));

    // STRICT ATOMIC CONCURRENCY INVARIANTS:
    // 1. Exactly 1 email must be delivered (Never 2, 3, 4, or 5!)
    expect(emailSpy).toHaveBeenCalledTimes(1);

    // 2. Exactly 1 AIReview document in MongoDB (Compound unique index must hold)
    const reviewsInDb = await AIReview.find({ user_id: testUserId, cycle_key: testCycleKey });
    expect(reviewsInDb.length).toBe(1);
    expect(reviewsInDb[0].email_sent).toBe(true);
  });

  it('Benchmark 5: Multi-User Interleaved Concurrency (10 Parallel Workers across 2 Users)', async () => {
    const secondUserId = `test_usr_${crypto.randomUUID().replace(/-/g, '')}`;

    await User.create({
      supabaseId: secondUserId,
      email: `${secondUserId}@erithx-test.internal`,
      name: 'Second Coder',
      role: 'student'
    });

    await UserCoderProfile.create({
      userId: secondUserId,
      userEmail: `${secondUserId}@erithx-test.internal`,
      userName: 'Second Coder',
      platforms: { leetcode: { handle: 'second_coder', totalSolved: 80 } }
    });

    try {
      // 5 workers for User 1 and 5 workers for User 2 running interleaved concurrently
      const interleaved = [
        ...Array.from({ length: 5 }, () =>
          processUserReviewHandler(
            new Request('http://localhost:3000/api/qstash/process-user-review', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ userId: testUserId, cycleKey: testCycleKey })
            })
          )
        ),
        ...Array.from({ length: 5 }, () =>
          processUserReviewHandler(
            new Request('http://localhost:3000/api/qstash/process-user-review', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ userId: secondUserId, cycleKey: testCycleKey })
            })
          )
        )
      ];

      await Promise.all(interleaved);

      // Exactly 1 email to User 1 + Exactly 1 email to User 2 = 2 total
      expect(emailSpy).toHaveBeenCalledTimes(2);

      const user1Reviews = await AIReview.find({ user_id: testUserId, cycle_key: testCycleKey });
      const user2Reviews = await AIReview.find({ user_id: secondUserId, cycle_key: testCycleKey });

      expect(user1Reviews.length).toBe(1);
      expect(user2Reviews.length).toBe(1);
    } finally {
      await AIReview.deleteMany({ user_id: secondUserId });
      await UserCoderProfile.deleteMany({ userId: secondUserId });
      await User.deleteMany({ supabaseId: secondUserId });
    }
  });
});
