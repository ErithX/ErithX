import { NextRequest, NextResponse } from 'next/server';
import { requireSuperadmin } from '@/app/lib/superadmin';
import connectToDatabase from '@/app/lib/mongodb';
import { UserCoderProfile } from '@/models/UserCoderProfile';
import { User } from '@/models/User';
import { generateAIContext } from '@/services/core/dataFilter';
import { generateWeeklyReview } from '@/services/ai/reviewerRouter';
import { getLatestUserReview, saveAIReview } from '@/services/ai/reviewStorage';
import { sendWeeklyReviewEmail } from '@/app/lib/email/emailService';
import { 
  LeetCodeStats, 
  CodeforcesStats, 
  GithubStats 
} from '@/models/PlatformStats';
import { 
  fetchLeetCodeStats, 
  fetchCodeforcesStats, 
  fetchGithubStats 
} from '@/app/lib/platform-fetchers';

export const maxDuration = 60;
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const admin = await requireSuperadmin();
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized: Superadmin access required.' }, { status: 403 });
    }

    const { userId, adminNote, sendEmail } = await req.json();
    if (!userId) {
      return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
    }

    await connectToDatabase();

    // 1. Fetch user profile and settings
    const profile = await UserCoderProfile.findOne({ userId });
    const userSettings = await User.findOne({ supabaseId: userId }).lean();
    
    if (!profile) {
      return NextResponse.json({ error: 'Coder profile not found for user' }, { status: 404 });
    }

    const mentorPrefs = userSettings?.mentorPrefs || {};

    // 2. Fetch all platforms concurrently to get fresh live stats
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
                  handle: profile.platforms.github.handle,
                  lastUpdated: new Date(),
                  overview: {
                    publicRepos: ghData.user.public_repos || 0,
                    followers: ghData.user.followers || 0,
                    totalContributions: ghData.recentEvents?.length || 0
                  }
                },
                $push: {
                  history: {
                    date: new Date(),
                    publicRepos: ghData.user.public_repos || 0,
                    followers: ghData.user.followers || 0,
                    totalContributions: ghData.recentEvents?.length || 0
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
                  overview: {
                    rating: userStats.rating || 0,
                    maxRating: userStats.maxRating || 0,
                    rank: userStats.rank || 'unrated'
                  }
                },
                $push: {
                  history: {
                    date: new Date(),
                    rating: userStats.rating || 0
                  }
                }
              },
              { upsert: true }
            );
          }
        }).catch(err => console.error(`Codeforces fetch error for ${userId}:`, err))
      );
    }

    await Promise.allSettled(fetchPromises);

    // 3. AI Generation Phase
    const previousReview = await getLatestUserReview(userId);
    const currentRoyFactor = previousReview?.roy_factor || 0;
    const previousTargets = previousReview?.targets_set || '';

    // Final Admin Note decision:
    const userAdminNote = adminNote || profile?.pendingAdminNote;
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
      admin_note: finalAdminNote
    });

    const llmResponse = await generateWeeklyReview(filteredPayload);

    const savedReview = await saveAIReview({
      userId,
      reviewText: llmResponse.review_text,
      hiddenSummary: llmResponse.hidden_summary,
      targetsSet: llmResponse.targets_set,
      previousTargets: previousTargets || undefined,
      royFactorUpdate: llmResponse.roy_factor_update,
      currentRoyFactor,
      modelUsed: llmResponse.model_used,
      promptTokensUsed: llmResponse.prompt_tokens,
      statsSnapshot: filteredPayload,
      adminNote: finalAdminNote
    });

    // Clear consumed pendingAdminNote
    if (profile?.pendingAdminNote) {
      await UserCoderProfile.updateOne({ userId }, { $set: { pendingAdminNote: '' } });
    }

    // 4. Optional Email Sending
    let emailStatus = "Skipped (Draft Mode)";
    if (sendEmail === true) {
      const targetEmail = userSettings?.email || profile.userEmail;
      const targetName = userSettings?.name?.split(' ')[0] || 'Developer';
      if (targetEmail) {
        const res = await sendWeeklyReviewEmail(targetEmail, targetName, llmResponse.hidden_summary);
        emailStatus = res.success ? "Sent successfully" : "Failed to send";
        if (res.success) {
          savedReview.email_sent = true;
          savedReview.email_sent_at = new Date();
          await savedReview.save();
        }
      }
    }

    return NextResponse.json({
      success: true,
      review: {
        id: savedReview._id.toString(),
        generatedText: savedReview.generated_text,
        targetsSet: savedReview.targets_set,
        hiddenSummary: savedReview.hidden_summary,
        modelUsed: savedReview.model_used,
        promptTokensUsed: savedReview.prompt_tokens_used,
        adminNote: savedReview.admin_note,
        emailSent: savedReview.email_sent,
        createdAt: savedReview.created_at
      },
      statsSnapshot: filteredPayload,
      emailStatus
    });
  } catch (err: any) {
    console.error('Error generating review manually:', err);
    return NextResponse.json({ error: err.message || 'Internal error' }, { status: 500 });
  }
}
