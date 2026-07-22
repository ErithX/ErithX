const MAX_MAIN_DURATION_SECONDS = 3 * 24 * 60 * 60;

const CATEGORY = {
  DSA_CP: { key: "dsa-cp", title: "DSA & CP" },
  AI_ML: { key: "ai-ml", title: "AI / ML" },
  CYBER: { key: "cybersecurity", title: "Cybersecurity (CTF)" },
  OTHER: { key: "other", title: "Other" },
};

const PLATFORM_WEIGHTS = [
  { match: ["leetcode.com", "leetcode"], weight: 40, category: CATEGORY.DSA_CP },
  { match: ["codeforces.com", "codeforces"], weight: 35, category: CATEGORY.DSA_CP },
  { match: ["codechef.com", "codechef"], weight: 30, category: CATEGORY.DSA_CP },
  { match: ["geeksforgeeks.org", "geeksforgeeks", "gfg"], weight: 30, category: CATEGORY.DSA_CP },
  { match: ["hackerrank.com", "hackerrank"], weight: 30, category: CATEGORY.DSA_CP },
  { match: ["atcoder.jp", "atcoder"], weight: 25, category: CATEGORY.DSA_CP },
  { match: ["naukri.com/code360", "code360"], weight: 25, category: CATEGORY.DSA_CP },
  { match: ["kaggle.com", "kaggle"], weight: 20, category: CATEGORY.AI_ML },
  { match: ["drivendata.org", "drivendata"], weight: 20, category: CATEGORY.AI_ML },
  { match: ["ctftime.org", "ctftime"], weight: 15, category: CATEGORY.CYBER },
];

const JUNK_KEYWORDS = /\b(test|practice|webinar|training|mirror|qualifying round)\b/i;
const MAJOR_BRAND_KEYWORDS = /\b(leetcode|codeforces|codechef|atcoder|geeksforgeeks|gfg|hackerrank|kaggle|ctftime|icpc)\b/i;
const INTERNAL_UNIVERSITY_KEYWORDS =
  /\b(nru\s+itmo|itmo\s+training|olympiads?\s+school|school\s+cco|university|college|campus|institute|department|faculty|classroom)\b/i;
const OFFICIAL_REGIONAL_KEYWORDS = /\b(icpc|regional|regionals|world\s+finals)\b/i;

function normalizePlatform(platform = "") {
  return String(platform)
    .toLowerCase()
    .replace(/^https?:\/\//, "")
    .replace(/^www\./, "")
    .trim();
}

function getPlatformInfo(platform) {
  const normalized = normalizePlatform(platform);
  const found = PLATFORM_WEIGHTS.find(({ match }) =>
    match.some((entry) => normalized.includes(entry))
  );

  return {
    weight: found?.weight ?? 5,
    category: found?.category ?? CATEGORY.OTHER,
  };
}

function getDifficulty(title = "") {
  if (/\b(beginner|div\.?\s*[34]|easy|biweekly|abc|starters|basic)\b/i.test(title)) {
    return { label: "Beginner", weight: 30 };
  }

  if (/\b(div\.?\s*2|weekly|rated|regular|arc|educational)\b/i.test(title)) {
    return { label: "Intermediate", weight: 20 };
  }

  if (/\b(div\.?\s*1|advanced|hard|agc|grand|expert)\b/i.test(title)) {
    return { label: "Advanced", weight: 10 };
  }

  return { label: "Unknown", weight: 0 };
}

function getTimeProximity(startTime, nowMs) {
  const startsInMs = new Date(startTime).getTime() - nowMs;

  if (startsInMs <= 24 * 60 * 60 * 1000) return 20;
  if (startsInMs <= 3 * 24 * 60 * 60 * 1000) return 15;
  if (startsInMs <= 7 * 24 * 60 * 60 * 1000) return 10;
  return 5;
}

function getSocialProof(participantCount) {
  const count = Number(participantCount) || 0;
  if (count > 5000) return 10;
  if (count > 1000) return 5;
  return 0;
}

function getDropReason(contest, nowMs) {
  const title = contest.title || "";
  const platform = contest.platform || "";
  const durationSeconds = Number(contest.durationSeconds) || 0;
  const endMs = new Date(contest.endTime).getTime();

  if (!Number.isFinite(endMs) || endMs < nowMs) return "ended";
  if (durationSeconds === 0) return "zeroDuration";
  if (/[^\x00-\x7F]/.test(title)) return "nonLatin";

  const isQualifyingRound = /\bqualifying round\b/i.test(title);
  if (JUNK_KEYWORDS.test(title) && !(isQualifyingRound && MAJOR_BRAND_KEYWORDS.test(`${title} ${platform}`))) {
    return "junk";
  }

  if (
    INTERNAL_UNIVERSITY_KEYWORDS.test(title) &&
    !OFFICIAL_REGIONAL_KEYWORDS.test(title)
  ) {
    return "internalUniversity";
  }

  return null;
}

function scoreContest(contest, nowMs) {
  const platform = getPlatformInfo(contest.platform);
  const difficulty = getDifficulty(contest.title);
  const timeProximity = getTimeProximity(contest.startTime, nowMs);
  const socialProof = getSocialProof(contest.participantCount);
  const priorityScore = platform.weight + difficulty.weight + timeProximity + socialProof;

  return {
    ...contest,
    categoryKey: platform.category.key,
    categoryTitle: platform.category.title,
    difficulty: difficulty.label,
    priorityScore,
    scoreBreakdown: {
      platform: platform.weight,
      difficulty: difficulty.weight,
      timeProximity,
      socialProof,
    },
    isLongTerm: Number(contest.durationSeconds) > MAX_MAIN_DURATION_SECONDS,
  };
}

function sortByStudentPriority(a, b) {
  if (b.priorityScore !== a.priorityScore) return b.priorityScore - a.priorityScore;
  return new Date(a.startTime).getTime() - new Date(b.startTime).getTime();
}

export function applyContestRules(contests = [], now = new Date()) {
  const nowMs = now.getTime();
  const stats = {
    raw: contests.length,
    kept: 0,
    longTerm: 0,
    dropped: {
      ended: 0,
      zeroDuration: 0,
      nonLatin: 0,
      junk: 0,
      internalUniversity: 0,
    },
  };

  const filtered = [];
  const longTermContests = [];

  for (const contest of contests) {
    const reason = getDropReason(contest, nowMs);
    if (reason) {
      stats.dropped[reason] += 1;
      continue;
    }

    const scored = scoreContest(contest, nowMs);
    if (scored.isLongTerm) {
      longTermContests.push(scored);
      continue;
    }

    filtered.push(scored);
  }

  filtered.sort(sortByStudentPriority);
  longTermContests.sort(sortByStudentPriority);

  stats.kept = filtered.length;
  stats.longTerm = longTermContests.length;

  const categories = {
    [CATEGORY.DSA_CP.key]: filtered.filter((contest) => contest.categoryKey === CATEGORY.DSA_CP.key),
    [CATEGORY.AI_ML.key]: filtered.filter((contest) => contest.categoryKey === CATEGORY.AI_ML.key),
    [CATEGORY.CYBER.key]: filtered.filter((contest) => contest.categoryKey === CATEGORY.CYBER.key),
  };

  return {
    contests: filtered,
    longTermContests,
    categories,
    filterStats: stats,
  };
}
