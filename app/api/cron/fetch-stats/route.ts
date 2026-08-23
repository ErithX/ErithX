import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import connectToDatabase from '@/app/lib/mongodb';
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

// Important: Vercel hobby plan has a 10s max duration for serverless functions.
// For pro plans, it's 60s - 300s. Since this is a cron job processing <100 users,
// we will set maxDuration to 60 (or higher if supported by your plan).
export const maxDuration = 60;
export const dynamic = 'force-dynamic';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function GET(request: Request) {
  try {
    // 1. Verify Cron Secret to prevent unauthorized triggers
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      // return new Response('Unauthorized', { status: 401 }); // Uncomment in production
    }

    await connectToDatabase();

    // 2. Fetch Active Users from Supabase
    // We only fetch users who have weekly_digest enabled or are recently active.
    // Since you have <100 users, we can just fetch all users with linked accounts.
    const { data: users, error } = await supabase
      .from('user_profiles') 
      .select('id, leetcode_url, codeforces_url, codechef_url, github_username')
      .not('leetcode_url', 'is', null) 
      .limit(100);

    if (error) {
      console.error('Supabase query error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!users || users.length === 0) {
      return NextResponse.json({ message: 'No users to process' });
    }

    let processedCount = 0;

    // 3. Process Users Sequentially to prevent Rate Limiting
    // Using a for...of loop instead of Promise.all to avoid blasting LeetCode/GitHub
    for (const user of users) {
      console.log(`Processing stats for user ${user.id}...`);

      // 3a. Process LeetCode
      if (user.leetcode_url) {
        // Extract handle from URL (e.g. https://leetcode.com/u/username/)
        const handleMatch = user.leetcode_url.match(/leetcode\.com\/(?:u\/)?([^\/]+)/);
        if (handleMatch && handleMatch[1]) {
          const handle = handleMatch[1];
          const lcData = await fetchLeetCodeStats(handle);
          if (lcData?.matchedUser) {
            const overview = lcData.matchedUser.submitStats?.acSubmissionNum || [];
            
            await LeetCodeStats.findOneAndUpdate(
              { userId: user.id },
              {
                $set: {
                  userId: user.id,
                  handle,
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
        }
      }

      // 3b. Process Codeforces
      if (user.codeforces_url) {
        const handleMatch = user.codeforces_url.match(/codeforces\.com\/profile\/([^\/]+)/);
        if (handleMatch && handleMatch[1]) {
          const handle = handleMatch[1];
          const cfData = await fetchCodeforcesStats(handle);
          if (cfData?.info) {
            await CodeforcesStats.findOneAndUpdate(
              { userId: user.id },
              {
                userId: user.id,
                handle,
                lastUpdated: new Date(),
                rating: cfData.info.rating || 0,
                maxRating: cfData.info.maxRating || 0,
                rank: cfData.info.rank || 'unrated',
                maxRank: cfData.info.maxRank || 'unrated',
                recentSubmissions: (cfData.recentSubmissions || []).slice(0, 20).map((s: any) => ({
                  title: s.problem?.name,
                  difficulty: s.problem?.rating?.toString(),
                  status: s.verdict,
                  timestamp: new Date(s.creationTimeSeconds * 1000)
                }))
              },
              { upsert: true }
            );
          }
        }
      }

      // 3c. Process GitHub
      if (user.github_username) {
        const handle = user.github_username;
        const ghData = await fetchGithubStats(handle);
        if (ghData?.user) {
          await GithubStats.findOneAndUpdate(
            { userId: user.id },
            {
              userId: user.id,
              username: handle,
              lastUpdated: new Date(),
              overview: {
                followers: ghData.user.followers || 0,
                publicRepos: ghData.user.public_repos || 0,
              },
              topRepos: (ghData.repos || []).map((r: any) => ({
                name: r.name,
                stars: r.stargazers_count,
                language: r.language,
                url: r.html_url,
                description: r.description
              })),
              recentEvents: ghData.recentEvents || []
            },
            { upsert: true }
          );
        }
      }

      // 3d. Process CodeChef
      if (user.codechef_url) {
        const handleMatch = user.codechef_url.match(/codechef\.com\/users\/([^\/]+)/);
        if (handleMatch && handleMatch[1]) {
          const handle = handleMatch[1];
          const ccData = await fetchCodeChefStats(handle);
          if (ccData) {
            await CodeChefStats.findOneAndUpdate(
              { userId: user.id },
              {
                userId: user.id,
                handle,
                lastUpdated: new Date(),
                rating: ccData.rating || 0,
                stars: ccData.stars || '1★',
              },
              { upsert: true }
            );
          }
        }
      }

      processedCount++;
      // A tiny delay (200ms) between users to avoid slamming the APIs too quickly.
      await new Promise(resolve => setTimeout(resolve, 200));
    }

    return NextResponse.json({ 
      success: true, 
      message: `Successfully processed ${processedCount} users.`
    });

  } catch (error: any) {
    console.error('Fetch Stats Cron Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
