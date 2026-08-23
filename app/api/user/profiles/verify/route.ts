import { NextRequest, NextResponse } from 'next/server';

function extractHandle(rawInput: string, platform: 'leetcode' | 'github' | 'codeforces'): string {
  let cleaned = rawInput.trim();
  if (!cleaned) return '';

  // Remove protocol
  cleaned = cleaned.replace(/^https?:\/\//i, '').replace(/^www\./i, '');

  if (platform === 'github') {
    // github.com/username or just username
    const match = cleaned.match(/github\.com\/([a-zA-Z0-9_\-\.]+)/i);
    if (match && match[1]) return match[1].replace(/\/$/, '');
  } else if (platform === 'leetcode') {
    // leetcode.com/u/username or leetcode.com/username or just username
    const match = cleaned.match(/leetcode\.com\/(?:u\/)?([a-zA-Z0-9_\-\.]+)/i);
    if (match && match[1]) return match[1].replace(/\/$/, '');
  } else if (platform === 'codeforces') {
    // codeforces.com/profile/username or codeforces.com/username or just username
    const match = cleaned.match(/codeforces\.com\/(?:profile\/)?([a-zA-Z0-9_\-\.]+)/i);
    if (match && match[1]) return match[1].replace(/\/$/, '');
  }

  // If bare handle was provided, strip any remaining slashes
  return cleaned.split('/')[0].replace(/^@/, '');
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { platform, rawInput } = body;

    if (!platform || !rawInput) {
      return NextResponse.json(
        { success: false, error: 'Platform and rawInput are required.' },
        { status: 400 }
      );
    }

    const handle = extractHandle(rawInput, platform);
    if (!handle) {
      return NextResponse.json(
        { success: false, error: 'Could not extract valid handle from input.' },
        { status: 400 }
      );
    }

    if (platform === 'github') {
      const res = await fetch(`https://api.github.com/users/${encodeURIComponent(handle)}`, {
        headers: {
          'User-Agent': 'DSAQuest-Platform-Verifier',
          'Accept': 'application/vnd.github.v3+json'
        },
        cache: 'no-store'
      });

      if (res.status === 404) {
        return NextResponse.json({
          success: false,
          error: `GitHub user "${handle}" not found.`
        }, { status: 404 });
      }

      if (!res.ok) {
        return NextResponse.json({
          success: false,
          error: `GitHub verification failed with status ${res.status}.`
        }, { status: 502 });
      }

      const data = await res.json();
      return NextResponse.json({
        success: true,
        platform: 'github',
        handle: data.login,
        url: `https://github.com/${data.login}`,
        avatar: data.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.login}`,
        displayName: data.name || data.login,
        statsSummary: {
          publicRepos: data.public_repos || 0,
          followers: data.followers || 0,
          bio: data.bio || ''
        }
      });
    }

    if (platform === 'codeforces') {
      const res = await fetch(`https://codeforces.com/api/user.info?handles=${encodeURIComponent(handle)}`, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
        },
        cache: 'no-store'
      });

      if (!res.ok) {
        return NextResponse.json({
          success: false,
          error: `Codeforces user "${handle}" not found or API unavailable.`
        }, { status: 404 });
      }

      const data = await res.json();
      if (data.status !== 'OK' || !data.result || data.result.length === 0) {
        return NextResponse.json({
          success: false,
          error: `Codeforces user "${handle}" not found.`
        }, { status: 404 });
      }

      const user = data.result[0];
      const avatar = user.titlePhoto?.startsWith('http') 
        ? user.titlePhoto 
        : (user.avatar?.startsWith('http') ? user.avatar : `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.handle}`);

      const fullName = [user.firstName, user.lastName].filter(Boolean).join(' ');

      return NextResponse.json({
        success: true,
        platform: 'codeforces',
        handle: user.handle,
        url: `https://codeforces.com/profile/${user.handle}`,
        avatar,
        displayName: fullName || user.handle,
        statsSummary: {
          rating: user.rating || 0,
          maxRating: user.maxRating || 0,
          rank: user.rank || 'Unranked',
          maxRank: user.maxRank || 'Unranked'
        }
      });
    }

    if (platform === 'leetcode') {
      const graphqlQuery = {
        query: `
          query userPublicProfile($username: String!) {
            matchedUser(username: $username) {
              username
              profile {
                realName
                userAvatar
                ranking
                aboutMe
              }
              submitStatsGlobal {
                acSubmissionNum {
                  difficulty
                  count
                }
              }
            }
            userContestRanking(username: $username) {
              rating
              globalRanking
              attendedContestsCount
              topPercentage
            }
          }
        `,
        variables: { username: handle }
      };

      const res = await fetch('https://leetcode.com/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Referer': 'https://leetcode.com'
        },
        body: JSON.stringify(graphqlQuery),
        cache: 'no-store'
      });

      if (!res.ok) {
        return NextResponse.json({
          success: false,
          error: `LeetCode verification service temporarily unavailable.`
        }, { status: 502 });
      }

      const json = await res.json();
      const matchedUser = json?.data?.matchedUser;

      if (!matchedUser) {
        return NextResponse.json({
          success: false,
          error: `LeetCode user "${handle}" does not exist.`
        }, { status: 404 });
      }

      const contestRanking = json?.data?.userContestRanking;
      const totalSolved = matchedUser.submitStatsGlobal?.acSubmissionNum?.find((s: any) => s.difficulty === 'All')?.count || 0;
      const easySolved = matchedUser.submitStatsGlobal?.acSubmissionNum?.find((s: any) => s.difficulty === 'Easy')?.count || 0;
      const mediumSolved = matchedUser.submitStatsGlobal?.acSubmissionNum?.find((s: any) => s.difficulty === 'Medium')?.count || 0;
      const hardSolved = matchedUser.submitStatsGlobal?.acSubmissionNum?.find((s: any) => s.difficulty === 'Hard')?.count || 0;

      const avatar = matchedUser.profile?.userAvatar?.startsWith('http')
        ? matchedUser.profile.userAvatar
        : `https://api.dicebear.com/7.x/avataaars/svg?seed=${matchedUser.username}`;

      return NextResponse.json({
        success: true,
        platform: 'leetcode',
        handle: matchedUser.username,
        url: `https://leetcode.com/u/${matchedUser.username}`,
        avatar,
        displayName: matchedUser.profile?.realName || matchedUser.username,
        statsSummary: {
          totalSolved,
          easySolved,
          mediumSolved,
          hardSolved,
          contestRating: Math.round(contestRanking?.rating || 0),
          globalRanking: contestRanking?.globalRanking || matchedUser.profile?.ranking || 0,
          attendedContests: contestRanking?.attendedContestsCount || 0
        }
      });
    }

    return NextResponse.json({
      success: false,
      error: `Unsupported platform: ${platform}`
    }, { status: 400 });

  } catch (error: any) {
    console.error('Profile verification error:', error);
    return NextResponse.json({
      success: false,
      error: error.message || 'Internal verification error'
    }, { status: 500 });
  }
}
