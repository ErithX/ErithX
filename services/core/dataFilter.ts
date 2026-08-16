import { LeetCodeStats, CodeforcesStats, GithubStats, CodeChefStats } from '@/models/PlatformStats';

export interface UserFilterConfig {
  id: string; // The user's ID
  is_pro: boolean; // Is the user a paid subscriber?
  admin_note?: string; // Optional note from Superadmin
  previous_recommendation?: string; // Last week's LLM advice to track compliance
  roy_factor?: number; // Ignorance streak
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
    status: deltaSolved > 5 ? (ratingDelta > 0 ? "Thriving" : "Grinding") : (deltaSolved > 0 ? "Active" : "Stagnant"),
    history: rawHistory
  };
}

function getCodeforcesMetrics(cfStats: any, degradeSeverity: string[], totalDegradeScore: { value: number }) {
  if (!cfStats) return null;

  // Wow Factor: Calculate problems solved specifically *this week* from recentSubmissions
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  
  let problemsSolvedThisWeek = 0;
  
  const recentSubs = cfStats.recentSubmissions || [];
  for (const sub of recentSubs) {
    if (new Date(sub.timestamp) > oneWeekAgo && sub.status === "OK") {
      problemsSolvedThisWeek++;
    }
  }

  if (cfStats.rating > 0 && cfStats.rating < (cfStats.maxRating - 100)) {
     degradeSeverity.push(`Codeforces rating (${cfStats.rating}) is significantly below peak (${cfStats.maxRating}).`);
     totalDegradeScore.value += 10;
  }

  return {
    current_rating: cfStats.rating || 0,
    max_rating: cfStats.maxRating || 0,
    rank: cfStats.rank || 'unrated',
    contribution: cfStats.contribution || 0,
    problems_solved_this_week: problemsSolvedThisWeek,
    status: problemsSolvedThisWeek > 0 ? "Active" : "Inactive"
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

  return {
    current_rating: ccStats.rating || 0,
    max_rating: ccStats.maxRating || 0,
    stars: ccStats.stars || '1★',
    global_rank: ccStats.globalRank || 0,
    problems_solved_this_week: problemsSolvedThisWeek,
    status: problemsSolvedThisWeek > 0 ? "Active" : "Inactive"
  };
}

function getGithubMetrics(ghStats: any, degradeSeverity: string[], totalDegradeScore: { value: number }) {
  if (!ghStats) return null;

  const topLang = ghStats.topLanguages && ghStats.topLanguages.length > 0 ? ghStats.topLanguages[0].language : "None";
  const totalContributions = ghStats.overview?.totalContributionsLastYear || 0;
  
  // Weekly and Monthly tracking
  const recentEvents = ghStats.recentEvents || [];
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  const oneMonthAgo = new Date();
  oneMonthAgo.setDate(oneMonthAgo.getDate() - 30);
  
  let contributionsThisWeek = 0;
  let contributionsThisMonth = 0;
  
  for (const event of recentEvents) {
      const eventDate = new Date(event.createdAt);
      if (eventDate > oneWeekAgo) contributionsThisWeek++;
      if (eventDate > oneMonthAgo) contributionsThisMonth++;
  }
  
  if (totalContributions === 0) {
      degradeSeverity.push(`No GitHub contributions in the last year. Zero practical coding.`);
      totalDegradeScore.value += 15;
  } else if (contributionsThisWeek === 0) {
      degradeSeverity.push(`Zero GitHub pushes this week. No project work detected.`);
      totalDegradeScore.value += 10;
  }

  return {
    total_stars: ghStats.overview?.totalStars || 0,
    followers: ghStats.overview?.followers || 0,
    total_contributions_annual: totalContributions,
    contributions_this_week: contributionsThisWeek,
    contributions_this_month: contributionsThisMonth,
    top_language: topLang,
    public_repos: ghStats.overview?.publicRepos || 0,
    status: contributionsThisWeek > 0 ? "Active Builder" : (totalContributions > 100 ? "Consistent Builder (Dormant this week)" : "Dormant")
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

  // json intiializing
  const filteredJSON: any = {
    user_id: userConfig.id,
    plan_type: userConfig.is_pro ? "paid" : "free",
    roy_factor: userConfig.roy_factor ?? 0,
    generated_at: new Date().toISOString(),
    summary: {},
    calculations: {}
  };

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
      filteredJSON.summary.progress_level = "Ghost";
      filteredJSON.calculations.overall_progress_score = 0;
  } else {
      // Base score 100, minus degrade severity
      let progressScore = 100 - totalDegradeScore.value;
      if (progressScore < 0) progressScore = 0;
      
      let trend = "Steady";
      if (progressScore >= 90) trend = "Improving Rapidly";
      else if (progressScore >= 70) trend = "Steady Growth";
      else if (progressScore >= 50) trend = "Stagnant";
      else trend = "Declining";

      filteredJSON.summary.progress_level = trend;
      filteredJSON.calculations.overall_progress_score = progressScore;
      filteredJSON.calculations.active_platforms = activePlatforms;
  }

  // Degrade Report Finalization
  if (degradeSeverity.length > 0) {
    filteredJSON.degrade_report = {
      is_degrading: totalDegradeScore.value > 30,
      severity_score: totalDegradeScore.value,
      severity: degradeSeverity
    };
  } else {
    filteredJSON.degrade_report = {
      is_degrading: false,
      severity_score: 0,
      severity: ["No significant degradation detected. User is on track."]
    };
  }

  // NOTE: Masking layer for Free users is DISABLED per user request for initial traction.
  // All users get the premium deep analysis to maximize the "wow" factor.

  return filteredJSON;
}
