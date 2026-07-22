# DSA Quest Contest Filtering Algorithm
## Strict Rules for Production-Ready Contest Selection

---

## PART 1: STRICT FILTERING RULES

### Phase 1: Hard Filters (Automatic Rejection)
These rules apply FIRST. Any contest failing these is DISCARDED immediately.

```
RULE 1.1: AGE CUTOFF
├─ IF (NOW - contest.start_date) > 500 days
│   THEN reject contest
│   REASON: Archived contests clutter feed, no engagement value
│   EXCEPTION: None (this is absolute)

RULE 1.2: FUTURE BUFFER
├─ IF (contest.start_date - NOW) > 180 days
│   THEN reject contest
│   REASON: Too far ahead, user loses interest in planning
│   EXCEPTION: None (this is absolute)

RULE 1.3: LANGUAGE FILTER
├─ IF contest.event contains Cyrillic, CJK, or non-Latin scripts
│   AND contest.host NOT in ["atcoder.jp", "codeforces.com"]
│   THEN reject contest
│   REASON: DSA Quest audience is English-first
│   EXCEPTION: AtCoder/CF are global, tolerate non-English titles

RULE 1.4: DURATION SANITY CHECK
├─ IF contest.duration == 0 OR contest.duration == NULL
│   THEN reject contest
│   REASON: TopCoder marathons, old SRM data have broken duration
│   EXCEPTION: None (this is absolute)

RULE 1.5: EMPTY PLATFORM DATA
├─ IF contest.host is NULL or ""
│   THEN reject contest
│   REASON: Can't route user to contest page
│   EXCEPTION: None (this is absolute)

RULE 1.6: PLATFORM BLACKLIST
├─ Reject if host in [
│     "ctftime.org",              // CTF contests (security, not DSA)
│     "codility.com",             // Hiring challenges, not skill-building
│     "icfpconference.org",       // Functional prog, niche
│     "contest.yandex.ru",        // Cyrillic-heavy, old data
│     "topcoder.com" (marathons), // Data is unreliable, old format
│     "spoj.com",                 // Deprecated platform, no community
│   ]
│   REASON: Low-signal platforms with stale/irrelevant data
│   EXCEPTION: None (this is absolute)
```

### Phase 2: Soft Filters (Score Modifiers)
Contests passing Phase 1 get scored. Score determines ranking and visibility.

```
RULE 2.1: PROBLEM COUNT INDICATOR
├─ IF n_problems NOT known
│   THEN infer from event name:
│       - "Weekly" | "Short" → assume 3-5 problems (Beginner-friendly)
│       - "Monthly" | "Long"  → assume 6-10 problems (Intermediate)
│       - "Marathon" | "CTF"  → assume 10+ problems (Advanced)
│   ELSE use actual n_problems

RULE 2.2: PARTICIPATION QUALITY THRESHOLD
├─ IF n_statistics NOT known
│   THEN: Set to -1 (unknown state)
│
├─ IF n_statistics == 0
│   THEN: Set score_multiplier = 0.3
│         REASON: No one participated, likely cancelled/test
│
├─ IF 1 <= n_statistics < 50
│   THEN: Set score_multiplier = 0.5
│         REASON: Niche contest, low engagement
│
├─ IF 50 <= n_statistics < 500
│   THEN: Set score_multiplier = 0.8
│         REASON: Small community, still useful
│
├─ IF n_statistics >= 500
│   THEN: Set score_multiplier = 1.0
│         REASON: Healthy participation, high-quality problem set
│
├─ IF n_statistics == -1 (unknown)
│   THEN: Set score_multiplier = 0.6
│         REASON: Assume medium quality
```

### Phase 3: Scoring Algorithm
After filtering, rank remaining contests by calculated SCORE.

```
PSEUDO-CODE:
────────────────────────────────────────────────────────────────

function calculateContestScore(contest, userLevel):
    score = 0
    
    // 1. PLATFORM TIER SCORE (base: 0-100 points)
    platform_tier = getPlatformTier(contest.host)
    score += platform_tier
    // See "PART 2: PLATFORM RANKINGS" for tier mapping
    
    // 2. RECENCY BONUS (0-40 points)
    days_until_start = (contest.start_date - NOW).days
    
    IF days_until_start <= 3:
        score += 40  // URGENT: Within 3 days
    ELSE IF days_until_start <= 7:
        score += 25  // SOON: Within a week
    ELSE IF days_until_start <= 30:
        score += 15  // UPCOMING: Within a month
    ELSE IF days_until_start <= 90:
        score += 5   // FUTURE: Within 3 months
    ELSE:
        score += 0   // Already filtered by Rule 1.2
    
    // 3. DURATION FIT (0-30 points)
    duration_hours = contest.duration / 3600
    
    IF 2 <= duration_hours <= 4:
        score += 30  // IDEAL: Quick competition
    ELSE IF 4 < duration_hours <= 24:
        score += 20  // GOOD: Standard contest
    ELSE IF 24 < duration_hours <= 48:
        score += 10  // LONG: But still manageable
    ELSE:
        score += 0   // Too long or too short
    
    // 4. PROBLEM COUNT MATCH (0-25 points)
    n_problems = inferProblemCount(contest)
    difficulty_level = estimateDifficulty(contest, n_problems)
    
    IF userLevel == "beginner":
        IF n_problems <= 6:
            score += 25
        ELSE IF n_problems <= 10:
            score += 15
        ELSE:
            score += 5
    
    ELSE IF userLevel == "intermediate":
        IF n_problems == 6-10:
            score += 25
        ELSE IF n_problems <= 12:
            score += 15
        ELSE:
            score += 5
    
    ELSE IF userLevel == "advanced":
        IF n_problems >= 10:
            score += 25
        ELSE IF n_problems >= 6:
            score += 15
        ELSE:
            score += 0
    
    // 5. PARTICIPATION MULTIPLIER (×0.3 to ×1.0)
    quality_multiplier = getParticipationMultiplier(contest.n_statistics)
    score *= quality_multiplier
    
    // 6. PAST CONTEST PENALTY (-20 points)
    IF (NOW - contest.end_date).days > 5:
        score -= 20  // User can't participate anymore
    
    // 7. NO-DUPLICATE RULE
    IF contest.id already in user's bookmarks:
        score *= 0  // Don't show again
    
    RETURN max(score, 0)


function getPlatformTier(host):
    // See Part 2 for details
    tier_1 = ["codeforces.com", "codechef.com"]
    tier_2 = ["atcoder.jp", "leetcode.com"]
    tier_3 = ["kaggle.com", "naukri.com/code360", "geeksforgeeks.org"]
    tier_4 = ["hackerrank.com", "hackerearth.com", "dmoj.ca"]
    
    IF host in tier_1:
        RETURN 100
    ELSE IF host in tier_2:
        RETURN 85
    ELSE IF host in tier_3:
        RETURN 70
    ELSE IF host in tier_4:
        RETURN 55
    ELSE:
        RETURN 30  // Unknown platform


function getParticipationMultiplier(n_stats):
    IF n_stats >= 500:
        RETURN 1.0
    ELSE IF n_stats >= 100:
        RETURN 0.8
    ELSE IF n_stats >= 50:
        RETURN 0.6
    ELSE IF n_stats > 0:
        RETURN 0.4
    ELSE IF n_stats == 0 or NULL:
        RETURN 0.5  // Unknown but assume moderate
    ELSE:
        RETURN 0.3  // Definitely failed
────────────────────────────────────────────────────────────────
```

---


```


### Validation Rules Before Clist Response
```
1. Strip all Tier 0 platforms (CTF, Codility, etc)
2. Filter start_date: NOW to NOW+180 days
3. Filter age: (NOW - start) must be < 500 days
4. Verify duration != 0 and duration != NULL
5. Flag n_statistics == NULL as "unknown quality" (-1)
6. Detect non-Latin scripts in event name
```

---

## PART 5: EDGE CASES & HANDLING

```
Edge Case 1: n_statistics = NULL or 0
└─ Treat as "unknown/failed contest"
└─ Apply 0.5x participation_multiplier
└─ Show warning: "Data unavailable"

Edge Case 2: n_problems = NULL
└─ Infer from event name keywords
└─ Default to 0.6x score multiplier (uncertainty penalty)

Edge Case 3: duration = 0 (TopCoder old format)
└─ REJECT this contest (Phase 1, Rule 1.4)
└─ Log: "Contest ID {id} has invalid duration"

Edge Case 4: Contest already finished (end_date < NOW)
└─ Apply -20 point penalty (no longer joinable)
└─ Show as "View Archived" not "Join"

Edge Case 5: User rating not synced yet
└─ Use last_known_rating from cache
└─ Set flag: "Rating data 2 days old"

Edge Case 6: Multiple contests same day
└─ Sort by: score first, then by start_time
└─ Show all in feed (don't suppress)
```

---

## SUMMARY: The 3-Phase Algorithm Flow

```
┌─────────────────┐
│  Get Clist API  │
│  Raw Response   │
└────────┬────────┘
         │
         ▼
┌──────────────────────────────────┐
│ PHASE 1: HARD FILTERS            │
│ - Archive cutoff (500d)          │
│ - Future cutoff (180d)           │
│ - Language filter (Cyrillic)     │
│ - Duration validation (≠0)       │
│ - Platform blacklist (Tier 0)    │
└────────┬─────────────────────────┘
         │
    ✗ REJECT (discard ~80% of Clist data)
         │
         ▼ ✓ PASS
┌──────────────────────────────────┐
│ PHASE 2: QUALITY SCORING         │
│ - Platform tier (100 pts)        │
│ - Recency bonus (0-40 pts)       │
│ - Duration fit (0-30 pts)        │
│ - Problem count (0-25 pts)       │
│ - Participation multiplier       │
│ - Past contest penalty (-20)     │
└────────┬─────────────────────────┘
         │
         ▼
┌──────────────────────────────────┐
│ PHASE 3: RANK & DISPLAY          │
│ - Sort by SCORE descending       │
│ - Return top 20                  │
│ - Group by platform tier         │
│ - Personalize by user level      │
└──────────────────────────────────┘
```