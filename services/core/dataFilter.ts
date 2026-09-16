import { LeetCodeStats, CodeforcesStats, GithubStats, CodeChefStats } from '@/models/PlatformStats';
import { UserActivity } from '@/models/UserActivity';
import { computeTrend } from './trendAnalyzer';
import { detectPatterns } from './patternDetector';

export interface UserFilterConfig {
  id: string; // The user's ID
  is_pro: boolean; // Is the user a paid subscriber?
  admin_note?: string; // Optional note from Superadmin
  previous_recommendation?: string; // Last week's LLM advice to track compliance
  roy_factor?: number; // LLM-decided escalation score (absolute)
  career_target?: string; // User selected career path (FAANG, Startup, etc)
  user_focus?: string; // What the user wants the AI to focus on
  strictness?: string; // Tone of the review
  mentor_id?: string; // Optional mentor ID for progress tracking
  isBaselineReview?: boolean; // True for a user's first-ever review
}

// ----------------------------------------------------------------------
// MODULAR PLATFORM CALCULATORS
// ----------------------------------------------------------------------

function getLeetCodeMetrics(lcStats: any, degradeSeverity: string[], totalDegradeScore: { value: number }, is_pro: boolean) {
  if (!lcStats) return null;

  const history = lcStats.history || [];
  const latest = history[history.length - 1] || null;
  const previous = history.length > 1 ? history[history.length - 2] : null;

  let deltaSolved = 0;
  let ratingDelta = 0;

  if (latest && previous) {
    deltaSolved = (latest.totalSolved || 0) - (previous.totalSolved || 0);
    ratingDelta = (latest.contestRating || 0) - (previous.contestRating || 0);
  }

  const totalSolved = lcStats.overview?.totalSolved || 0;
  const hardCount = lcStats.overview?.hard || 0;
  const hardRatio = totalSolved > 0 ? ((hardCount / totalSolved) * 100).toFixed(1) : "0.0";

  // Wow Factor Logic: Detect if they are just grinding easy problems
  const easyCount = lcStats.overview?.easy || 0;
  const easyRatio = totalSolved > 0 ? ((easyCount / totalSolved) * 100).toFixed(1) : "0.0";

  // Consistency & Streaks from Calendar
  const calendar = lcStats.calendar || {};
  const activeDays = Object.keys(calendar).filter(date => {
      // Filter for last 7 days
      const d = new Date(date);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return d > weekAgo;
  }).length;
  
  const topTopics = (lcStats.topTags || []).slice(0, 3).map((t: any) => t.tag);

  // Degradation rules
  if (history.length > 1) {
    if (deltaSolved === 0) {
      degradeSeverity.push("0 LeetCode problems solved this week.");
      totalDegradeScore.value += 20;
    }
    if (ratingDelta < -10) {
      degradeSeverity.push(`LeetCode rating dropped by ${Math.abs(ratingDelta)} points.`);
      totalDegradeScore.value += 15;
    }
    if (parseFloat(easyRatio) > 80 && deltaSolved > 10) {
       degradeSeverity.push(`High volume of problems solved (${deltaSolved}), but ${easyRatio}% were Easy difficulty.`);
       totalDegradeScore.value += 10;
    }
  }

  // Trend computation (delegated to trendAnalyzer)
  const trend_3_weeks = computeTrend(
    history,
    { solves_per_week: 'totalSolved', hard_per_week: 'hard' },
    { rating_per_week: 'contestRating', active_days_per_week: 'activeDays' }
  );

  // Raw History Payload
  // Paid gets all history. Free gets only the last 2 weeks (snapshots).
  const rawHistory = is_pro ? history : history.slice(-2);

  return {
    total_solved: totalSolved,
    delta_solved_this_week: deltaSolved,
    easy: easyCount,
    medium: lcStats.overview?.medium || 0,
    hard: hardCount,
    hard_ratio: `${hardRatio}%`,
    easy_ratio: `${easyRatio}%`,
    current_rating: lcStats.overview?.contestRating || 0,
    rating_delta: ratingDelta,
    ranking: lcStats.overview?.ranking || 0,
    acceptance_rate: lcStats.overview?.acceptanceRate || 0,
    active_days_this_week: activeDays,
    top_topics_focus: topTopics,
    trend_3_weeks: trend_3_weeks,
    status: deltaSolved > 5 ? (ratingDelta > 0 ? "Thriving" : "High Volume") : (deltaSolved > 0 ? "Active" : "No problems solved this week"),
    history: rawHistory
  };
}

function getCodeforcesMetrics(cfStats: any, degradeSeverity: string[], totalDegradeScore: { value: number }) {
  if (!cfStats) return null;

  // Wow Factor: Calculate problems solved specifically *this week* from recentSubmissions
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  
  let problemsSolvedThisWeek = 0;
  const contestsEnteredThisWeek = new Set<number>();
  
  const recentSubs = cfStats.recentSubmissions || [];
  for (const sub of recentSubs) {
    if (new Date(sub.timestamp) > oneWeekAgo && (sub.status === "OK" || sub.verdict === "OK")) {
      problemsSolvedThisWeek++;
      if (sub.contestId) contestsEnteredThisWeek.add(sub.contestId);
    }
  }

  if (cfStats.rating > 0 && cfStats.rating < (cfStats.maxRating - 100)) {
     degradeSeverity.push(`Codeforces rating (${cfStats.rating}) is significantly below peak (${cfStats.maxRating}).`);
     totalDegradeScore.value += 10;
  }

  // Trend computation (delegated to trendAnalyzer)
  const history = cfStats.history || [];
  const trend_3_weeks = computeTrend(history, {}, { rating_per_week: 'rating' });

  return {
    current_rating: cfStats.rating || 0,
    max_rating: cfStats.maxRating || 0,
    rank: cfStats.rank || 'unrated',
    contribution: cfStats.contribution || 0,
    problems_solved_this_week: problemsSolvedThisWeek,
    contests_entered_this_week: contestsEnteredThisWeek.size,
    trend_3_weeks: trend_3_weeks,
    status: problemsSolvedThisWeek > 0 ? "Active" : "No problems solved this week"
  };
}

function getCodeChefMetrics(ccStats: any, degradeSeverity: string[], totalDegradeScore: { value: number }) {
  if (!ccStats) return null;
  
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  
  let problemsSolvedThisWeek = 0;
  const recentSubs = ccStats.recentSubmissions || [];
  for (const sub of recentSubs) {
    if (new Date(sub.timestamp) > oneWeekAgo && sub.status === "AC") { // AC for Codechef or similar
      problemsSolvedThisWeek++;
    }
  }

  // Trend computation (delegated to trendAnalyzer)
  const history = ccStats.history || [];
  const trend_3_weeks = computeTrend(history, {}, { rating_per_week: 'rating' });

  return {
    current_rating: ccStats.rating || 0,
    max_rating: ccStats.maxRating || 0,
    stars: ccStats.stars || '1★',
    global_rank: ccStats.globalRank || 0,
    problems_solved_this_week: problemsSolvedThisWeek,
    trend_3_weeks: trend_3_weeks,
    status: problemsSolvedThisWeek > 0 ? "Active" : "No problems solved this week"
  };
}

function getGithubMetrics(ghStats: any, degradeSeverity: string[], totalDegradeScore: { value: number }) {
  if (!ghStats) return null;

  const topLang = ghStats.topLanguages && ghStats.topLanguages.length > 0 ? ghStats.topLanguages[0].language : "None";
  const totalContributions = ghStats.overview?.totalContributionsLastYear || 0;
  
  // Weekly tracking only (since payload is now restricted to 7 days)
  const recentEvents = ghStats.recentEvents || [];
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  
  let contributionsThisWeek = 0;
  
  for (const event of recentEvents) {
      const eventDate = new Date(event.createdAt);
      if (eventDate > oneWeekAgo) contributionsThisWeek++;
  }
  
  if (totalContributions === 0) {
      degradeSeverity.push(`No GitHub contributions in the last year.`);
      totalDegradeScore.value += 15;
  } else if (contributionsThisWeek === 0) {
      degradeSeverity.push(`Zero GitHub pushes this week.`);
      totalDegradeScore.value += 10;
  }

  // Trend computation (delegated to trendAnalyzer)
  const history = ghStats.history || [];
  const trend_3_weeks = computeTrend(
    history,
    {},
    { contributions_per_week: 'totalContributions', repos_per_week: 'publicRepos' }
  );

  return {
    total_stars: ghStats.overview?.totalStars || 0,
    followers: ghStats.overview?.followers || 0,
    total_contributions_annual: totalContributions,
    contributions_this_week: contributionsThisWeek,
    top_language: topLang,
    public_repos: ghStats.overview?.publicRepos || 0,
    trend_3_weeks: trend_3_weeks,
    status: contributionsThisWeek > 0 ? "Active Builder" : (totalContributions > 100 ? "Consistent Builder (No activity this week)" : "No activity this week")
  };
}

// ----------------------------------------------------------------------
// 2. MAIN FILTER SERVICE
// ----------------------------------------------------------------------

export async function generateAIContext(userConfig: UserFilterConfig) {
  // fetching raw datas from DB
  const lcStats = await LeetCodeStats.findOne({ userId: userConfig.id }).lean();
  const cfStats = await CodeforcesStats.findOne({ userId: userConfig.id }).lean();
  const ghStats = await GithubStats.findOne({ userId: userConfig.id }).lean();
  const ccStats = await CodeChefStats.findOne({ userId: userConfig.id }).lean();
  
  // fetching platform activity
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  const recentActivities = await UserActivity.find({ 
    userId: userConfig.id,
    createdAt: { $gt: oneWeekAgo }
  }).lean();

  // json intiializing
  const filteredJSON: any = {
    user_id: userConfig.id,
    roy_factor: userConfig.roy_factor ?? 0,
    career_target: userConfig.career_target || 'I want to balance everything',
    user_focus: userConfig.user_focus || '',
    strictness: userConfig.strictness || 'Normal',
    generated_at: new Date().toISOString(),
    calculations: {}
  };

  // First-ever review guard: lets the prompt force roy_factor 0 even for
  // ghost users so a brand-new user never gets escalated unfairly (Bug 3 fix).
  if (userConfig.isBaselineReview) {
    filteredJSON.is_baseline_review = true;
  }

  // my inject review
  if (userConfig.admin_note && userConfig.admin_note.trim() !== '') {
    filteredJSON.admin_note = userConfig.admin_note;
  }
  
  if (userConfig.previous_recommendation) {
    filteredJSON.previous_recommendation = userConfig.previous_recommendation;
  }

  // Pass-by-reference object for tracking the degradation score across modules
  const totalDegradeScore = { value: 0 };
  const degradeSeverity: string[] = [];

  // Leetcode logic 
  filteredJSON.leetcode = getLeetCodeMetrics(lcStats, degradeSeverity, totalDegradeScore, userConfig.is_pro);
  
  // codeforces logic
  filteredJSON.codeforces = getCodeforcesMetrics(cfStats, degradeSeverity, totalDegradeScore);
  
  // codechef logic
  filteredJSON.codechef = getCodeChefMetrics(ccStats, degradeSeverity, totalDegradeScore);
  
  // Github logic
  filteredJSON.github = getGithubMetrics(ghStats, degradeSeverity, totalDegradeScore);

  // Overall Score Calculations (The Wow Factor)
  let activePlatforms = 0;
  if (filteredJSON.leetcode) activePlatforms++;
  if (filteredJSON.codeforces) activePlatforms++;
  if (filteredJSON.codechef) activePlatforms++;
  if (filteredJSON.github) activePlatforms++;

  if (activePlatforms === 0) {
      filteredJSON.calculations.overall_progress_score = 0;
      filteredJSON.calculations.active_platforms = 0;
  } else {
      // Raw score 0-100. The LLM interprets what this means — we do NOT label it.
      let progressScore = 100 - totalDegradeScore.value;
      if (progressScore < 0) progressScore = 0;
      filteredJSON.calculations.overall_progress_score = progressScore;
      filteredJSON.calculations.active_platforms = activePlatforms;
  }

  // On-Platform Behavior
  if (recentActivities.length > 0) {
    const activityTypes = [...new Set(recentActivities.map((a: any) => a.type))];
    filteredJSON.erithx_activity = {
      activities_count: recentActivities.length,
      activity_types: activityTypes
    };
  }

  // Multi-Review Pattern Detection (delegated to patternDetector)
  const patterns = await detectPatterns(userConfig.id);
  if (patterns) {
    filteredJSON.historical_patterns = patterns;
  }

  // Degrade Report Finalization
  if (degradeSeverity.length > 0) {
    filteredJSON.degrade_report = {
      severity_score: totalDegradeScore.value,
      severity: degradeSeverity
    };
  }

  // Weekly Rotation — controls which enrichment the LLM emphasizes.
  // Creates variable reward: some weeks it focuses on trends, other weeks on behavior.
  // The DATA is always complete; only the FOCUS HINT changes.
  const weekNum = getISOWeekNumber(new Date());
  const focusTypes = ['velocity_trends', 'platform_behavior', 'historical_patterns'] as const;
  filteredJSON.review_focus_this_week = focusTypes[weekNum % 3];

  return filteredJSON;
}

// Helper: ISO week number for rotation logic
function getISOWeekNumber(date: Date): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
}
