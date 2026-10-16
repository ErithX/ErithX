import { NextResponse } from 'next/server';
import { verifySignatureAppRouter } from '@upstash/qstash/nextjs';
import connectToDatabase from '@/app/lib/mongodb';
import { UserCoderProfile } from '@/models/UserCoderProfile';
import { User } from '@/models/User';
import { SystemLog } from '@/models/SystemLog';
import AIReview from '@/models/AIReview';
import { generateAIContext } from '@/services/core/dataFilter';
import { generateWeeklyReview } from '@/services/ai/reviewerRouter';
import { getLatestUserReview, saveAIReview, markReviewEmailSent } from '@/services/ai/reviewStorage';
import { sendWeeklyReviewEmail } from '@/app/lib/email/emailService';
import { calculateCycleKey } from '@/app/lib/algorithms/cycleAnchor';
import { 
  LeetCodeStats, 
  CodeforcesStats, 
  GithubStats, 
  CodeChefStats 
} from '@/models/PlatformStats';
import { 
  fetchLeetCodeStats, 
  fetchCodeforcesStats, 
  fetchGithubStats,
  fetchCodeChefStats
} from '@/app/lib/platform-fetchers';

export const maxDuration = 60; // 60s max execution time per user for serverless
export const dynamic = 'force-dynamic';

async function handler(request: Request) {
  try {
    const body = await request.json();
    const userId = body.userId;
    const cycleKey = body.cycleKey || calculateCycleKey();

    if (!userId) {
      return NextResponse.json({ error: 'Missing userId in payload' }, { status: 400 });
    }

    await connectToDatabase();

    
    // PHASE GUARD: Idempotency & Duplicate Prevention

    const existingReview = await AIReview.findOne({ user_id: userId, cycle_key: cycleKey });

    if (existingReview) {
      // Branch A: Review was generated AND email was already delivered.
      if (existingReview.email_sent) {
        return NextResponse.json({ 
          success: true, 
          message: `Review already generated and email already delivered for user ${userId} in cycle ${cycleKey}. Skipping.`,
          status: 'already_completed',
          cycleKey
        });
      }

      // Branch B: Review was generated earlier, but email failed/timed out.
      // SKIP scraping and SKIP Gemini LLM call! Only recover email delivery.
      console.log(`[Worker] Review exists for ${userId} in cycle ${cycleKey} but email not sent. Recovering email delivery...`);

      const userSettings = await User.findOne({ supabaseId: userId }).lean();
      const profile = await UserCoderProfile.findOne({ userId });
      const targetEmail = userSettings?.email || profile?.userEmail;
      const targetName = userSettings?.name?.split(' ')[0] || 'Developer';

      let emailStatus = 'Not attempted';
      if (targetEmail) {
        const res = await sendWeeklyReviewEmail(targetEmail, targetName, existingReview.generated_text);
        if (res.success) {
          await markReviewEmailSent(existingReview._id.toString());
          emailStatus = 'Sent successfully';
        } else {
          emailStatus = res.skipped ? 'Skipped by service' : 'Failed to send';
        }
      } else {
        emailStatus = 'Missing target email';
      }

      return NextResponse.json({
        success: true,
        message: `Recovered email delivery for user ${userId} in cycle ${cycleKey}.`,
        email_status: emailStatus,
        cycleKey
      });
    }

    // ----------------------------------------------------------------------
    // NORMAL WORKER PIPELINE (Review does not exist yet)
    // ----------------------------------------------------------------------

    // 1. Fetch user profile and settings
    const profile = await UserCoderProfile.findOne({ userId });
    const userSettings = await User.findOne({ supabaseId: userId }).lean();
    
    if (!profile) {
      return NextResponse.json({ error: 'Coder profile not found' }, { status: 404 });
    }

    const mentorPrefs = userSettings?.mentorPrefs || {};
    
    // 2. Fetch all platforms concurrently
    const fetchPromises: Promise<any>[] = [];

    // 2a. LeetCode
    if (profile.platforms?.leetcode?.handle) {
      fetchPromises.push(
        fetchLeetCodeStats(profile.platforms.leetcode.handle).then(async (lcData) => {
          if (lcData?.matchedUser) {
            const overview = lcData.matchedUser.submitStats?.acSubmissionNum || [];
            await LeetCodeStats.findOneAndUpdate(
              { userId },
              {
                $set: {
                  userId,
                  handle: profile.platforms.leetcode.handle,
                  lastUpdated: new Date(),
                  overview: {
                    totalSolved: overview.find((s: any) => s.difficulty === 'All')?.count || 0,
                    easy: overview.find((s: any) => s.difficulty === 'Easy')?.count || 0,
                    medium: overview.find((s: any) => s.difficulty === 'Medium')?.count || 0,
                    hard: overview.find((s: any) => s.difficulty === 'Hard')?.count || 0,
                    contestRating: lcData.userContestRanking?.rating || 0,
                    ranking: lcData.matchedUser.profile?.ranking || 0
                  },
                  recentSubmissions: (lcData.recentAcSubmissionList || []).map((s: any) => ({
                    title: s.title,
                    timestamp: new Date(parseInt(s.timestamp) * 1000)
                  }))
                },
                $push: {
                  history: {
                    date: new Date(),
                    totalSolved: overview.find((s: any) => s.difficulty === 'All')?.count || 0,
                    contestRating: lcData.userContestRanking?.rating || 0
                  }
                }
              },
              { upsert: true }
            );
          }
        }).catch(err => console.error(`LeetCode fetch error for ${userId}:`, err))
      );
    }

    // 2b. GitHub
    if (profile.platforms?.github?.handle) {
      fetchPromises.push(
        fetchGithubStats(profile.platforms.github.handle).then(async (ghData) => {
          if (ghData && ghData.user) {
            await GithubStats.findOneAndUpdate(
              { userId },
              {
                $set: {
                  userId,
                  username: profile.platforms.github.handle,
                  lastUpdated: new Date(),
                  overview: {
                    publicRepos: ghData.user.public_repos || 0,
                    followers: ghData.user.followers || 0,
                    totalContributionsLastYear: ghData.recentEvents?.length || 0
                  }
                },
                $push: {
                  recentEvents: {
                    $each: (ghData.recentEvents || []).map((e: any) => ({
                      type: e.type,
                      repoName: e.repo?.name || '',
                      createdAt: new Date(e.created_at)
                    })).slice(0, 10)
                  }
                }
              },
              { upsert: true }
            );
          }
        }).catch(err => console.error(`GitHub fetch error for ${userId}:`, err))
      );
    }

    // 2c. Codeforces
    if (profile.platforms?.codeforces?.handle) {
      fetchPromises.push(
        fetchCodeforcesStats(profile.platforms.codeforces.handle).then(async (cfData) => {
          if (cfData && cfData.info) {
            const userStats = cfData.info;
            await CodeforcesStats.findOneAndUpdate(
              { userId },
              {
                $set: {
                  userId,
                  handle: profile.platforms.codeforces.handle,
                  lastUpdated: new Date(),
                  rating: userStats.rating || 0,
                  maxRating: userStats.maxRating || 0,
                  rank: userStats.rank || 'unrated',
                  maxRank: userStats.maxRank || 'unrated',
                  contribution: userStats.contribution || 0,
                  recentSubmissions: (cfData.recentSubmissions || []).map((s: any) => ({
                    title: s.problem?.name || '',
                    difficulty: s.problem?.rating ? String(s.problem.rating) : '',
                    status: s.verdict || '',
                    contestId: s.contestId || 0,
                    timestamp: new Date((s.creationTimeSeconds || 0) * 1000)
                  }))
                }
              },
              { upsert: true }
            );
          }
        }).catch(err => console.error(`Codeforces fetch error for ${userId}:`, err))
      );
    }

    // 2d. CodeChef
    if (profile.platforms?.codechef?.handle) {
      fetchPromises.push(
        fetchCodeChefStats(profile.platforms.codechef.handle).then(async (ccData) => {
          if (ccData) {
            await CodeChefStats.findOneAndUpdate(
              { userId },
              {
                $set: {
                  userId,
                  handle: profile.platforms.codechef.handle,
                  lastUpdated: new Date(),
                  rating: ccData.rating || 0,
                  stars: ccData.stars || '1★'
                }
              },
              { upsert: true }
            );
          }
        }).catch(err => console.error(`CodeChef fetch error for ${userId}:`, err))
      );
    }
    
    // Wait for all data fetching to complete (Takes ~3-5 seconds parallel instead of ~15s sequentially)
    await Promise.allSettled(fetchPromises);

    // 3. AI Generation Phase
    
    // A. Load previous review memory (to evaluate previous goals & active roy_factor)
    const previousReview = await getLatestUserReview(userId);
    const currentRoyFactor = previousReview?.roy_factor || 0;
    const previousTargets = previousReview?.targets_set || '';

    // B. Generate deterministic filtered delta context from platform snapshots
    const userAdminNote = body.adminNote || profile?.pendingAdminNote;
    let finalAdminNote = userAdminNote;
    if (!finalAdminNote && !previousReview) {
      finalAdminNote = "First Review / Baseline Diagnostic: This user recently connected their profile. Welcome them warmly to ErithX. Do NOT criticize them for 0 delta or inactivity this week since tracking just began. Instead, evaluate their lifetime stats (total solved, rating, easy/medium/hard ratio) and prescribe their first weekly targets.";
    }

    const filteredPayload = await generateAIContext({
      id: userId,
      is_pro: userSettings?.isPro || false,
      roy_factor: currentRoyFactor,
      previous_recommendation: previousTargets,
      career_target: mentorPrefs.goal,
      user_focus: mentorPrefs.focus,
      strictness: mentorPrefs.strictness,
      admin_note: finalAdminNote,
      isBaselineReview: !previousReview
    });

    // C. Call LLM Reasoning Engine (Gemini/Llama)
    const llmResponse = await generateWeeklyReview(filteredPayload);

    // D. Save new review document with cycle_key & compound unique index protection
    let savedReview;
    try {
      savedReview = await saveAIReview({
        userId,
        cycleKey,
        reviewText: llmResponse.review_text,
        hiddenSummary: llmResponse.hidden_summary,
        targetsSet: llmResponse.targets_set,
        previousTargets: previousTargets || undefined,
        royFactor: llmResponse.roy_factor,
        modelUsed: llmResponse.model_used,
        promptTokensUsed: llmResponse.prompt_tokens,
        statsSnapshot: filteredPayload,
        adminNote: finalAdminNote
      });
    } catch (saveErr: any) {
      // If MongoDB returns duplicate key error (code 11000), another worker just created it
      if (saveErr.code === 11000) {
        console.warn(`[Worker] Duplicate key (11000) caught for user ${userId} in cycle ${cycleKey}. Recovering saved review.`);
        savedReview = await AIReview.findOne({ user_id: userId, cycle_key: cycleKey });
      } else {
        throw saveErr;
      }
    }

    // Clear consumed pendingAdminNote
    if (profile?.pendingAdminNote) {
      await UserCoderProfile.updateOne({ userId }, { $set: { pendingAdminNote: '' } });
    }

    // 4. Trigger Email
    let emailStatus = "Not attempted";
    const targetEmail = userSettings?.email || profile.userEmail;
    const targetName = userSettings?.name?.split(' ')[0] || 'Developer';

    if (targetEmail) {
      const res = await sendWeeklyReviewEmail(targetEmail, targetName, llmResponse.review_text);
      if (res.success) {
        if (savedReview?._id) {
          await markReviewEmailSent(savedReview._id.toString());
        }
        emailStatus = "Sent successfully";
      } else {
        emailStatus = res.skipped ? "Skipped by service" : "Failed to send";
      }
    } else {
      console.warn(`No target email found for userId: ${userId}`);
      emailStatus = "Missing target email";
    }

    return NextResponse.json({ 
      success: true, 
      cycleKey,
      message: `Processed ${userId} successfully.`,
      email_status: emailStatus 
    });
  } catch (err: any) {
    console.error(`Error processing QStash webhook:`, err.message);
    
    await SystemLog.create({
      level: 'error',
      source: 'qstash-worker-reviews',
      message: `Failed to process user review in worker`,
      meta: { error: err.message }
    });

    // We return a 500 so QStash knows the job failed and schedules a retry
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// verifySignatureAppRouter checks the Upstash-Signature header 
// to ensure only QStash can call this endpoint
export const POST = process.env.NODE_ENV === 'development' 
  ? handler 
  : verifySignatureAppRouter(handler);
