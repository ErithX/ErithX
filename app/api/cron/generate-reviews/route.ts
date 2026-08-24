import { NextResponse } from 'next/server';
import connectToDatabase from '@/app/lib/mongodb';
import { UserCoderProfile } from '@/models/UserCoderProfile';
import { User } from '@/models/User';
import { SystemLog } from '@/models/SystemLog';
import { generateAIContext } from '@/services/core/dataFilter';
import { generateWeeklyReview } from '@/services/ai/reviewerRouter';
import { getLatestUserReview, saveAIReview } from '@/services/ai/reviewStorage';

export const maxDuration = 60; // 60s max execution time for serverless
export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  return NextResponse.json({ status: "Automation currently disabled until QStash migration" }, { status: 200 });
  try {
    // 1. Verify Cron Authorization (Secret check)
    const authHeader = request.headers.get('authorization');
    if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      // In production, uncomment if strict cron auth is required
      // return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();

    // 2. Fetch users who have connected coding profiles
    const profiles = await UserCoderProfile.find({
      $or: [
        { 'platforms.leetcode.handle': { $exists: true, $ne: '' } },
        { 'platforms.github.handle': { $exists: true, $ne: '' } },
        { 'platforms.codeforces.handle': { $exists: true, $ne: '' } },
      ],
    }).limit(50); // Process up to 50 users per run

    if (!profiles || profiles.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'No users with connected coder profiles found.',
        processed: 0,
      });
    }

    let generatedCount = 0;
    const errors: string[] = [];

    // 3. Process each user sequentially
    for (const profile of profiles) {
      const userId = profile.userId;

      try {
        const userSettings = await User.findOne({ supabaseId: userId }).lean();
        const mentorPrefs = userSettings?.mentorPrefs || {};

        // A. Load previous review memory (to evaluate previous goals & active roy_factor)
        const previousReview = await getLatestUserReview(userId);
        const currentRoyFactor = previousReview?.roy_factor || 0;
        const previousTargets = previousReview?.targets_set || '';

        // B. Generate deterministic filtered delta context from platform snapshots
        const filteredPayload = await generateAIContext({
          id: userId,
          is_pro: userSettings?.isPro || false, // Check real isPro status
          roy_factor: currentRoyFactor,
          previous_recommendation: previousTargets,
          career_target: mentorPrefs.goal,
          user_focus: mentorPrefs.focus,
          strictness: mentorPrefs.strictness
        });

        // C. Call LLM Reasoning Engine (Llama 3.3 70B with Gemini fallback)
        const llmResponse = await generateWeeklyReview(filteredPayload);

        // D. Save new review document with updated targets & roy_factor
        await saveAIReview({
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
        });

        generatedCount++;

        // 1.2s delay between users to avoid slamming rate limits
        await new Promise((resolve) => setTimeout(resolve, 1200));
      } catch (err: any) {
        console.error(`Error processing review for user ${userId}:`, err.message);
        errors.push(`User ${userId}: ${err.message}`);
        
        await SystemLog.create({
          level: 'error',
          source: 'cron-generate-reviews',
          message: `Failed to process user ${userId}`,
          meta: { error: err.message, userId }
        });
      }
    }

    await SystemLog.create({
      level: errors.length > 0 ? 'warning' : 'info',
      source: 'cron-generate-reviews',
      message: `Batch completed. Processed ${generatedCount}/${profiles.length} users.`,
      meta: { generatedCount, totalAttempted: profiles.length, errors }
    });

    return NextResponse.json({
      success: true,
      message: `Successfully generated ${generatedCount} weekly reviews.`,
      totalProfiles: profiles.length,
      generatedCount,
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (error: any) {
    console.error('Review Generation Cron Pipeline Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
