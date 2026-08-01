# 🏆 DSA Quest: Achievement Card System Rules & AI Specifications

## 1. Overview of the 30 Cards (The "Why")

### The Problem with Existing Platforms
Today, a student writes "Proficient in DSA" on their resume, links 4 different profiles (LeetCode, Codeforces, GitHub), and hopes the recruiter checks them. Recruiters *don't check* because it takes too much time, and "streaks" on other platforms don't prove reliability—they just prove you clicked a button daily.

### The DSA Quest Solution: 30 Verifiable Stories
Our system generates **30 distinct Achievement Cards** (6 Tiers × 5 Story Types). 

**Why they are needed:** They transform scattered, unverified data into a single, visually striking, recruiter-ready asset. 
**Their Speciality:** Every card features a `proof_snapshot` and a verification URL (`dsaquest.io/v/xyz`). If a student shares a "Platinum Cross-Platform Card," a recruiter can click the link and verify that the student's LeetCode, Codeforces, and CodeChef data was synced via API and met our strict thresholds. **It cannot be faked.**

---

## 2. Categorization with Features

The system is a matrix. Users progress through **6 Tiers** (based on overall commitment and skill), and at each tier, they can display **5 different Story Types** (based on what they want to highlight to a recruiter).

### The 6 Tiers (Progression Levels)
1.  **🟤 Bronze (Initiate):** Proves you have started the journey.
2.  **🥈 Silver (Consistent):** Proves you are not a one-day wonder.
3.  **🥇 Gold (Committed):** Proves genuine discipline (30+ days) and positive growth.
4.  **💎 Platinum (Warrior):** Proves competitive performance under pressure.
5.  **💠 Diamond (Elite):** Proves top-tier rating and well-rounded knowledge.
6.  **🏆 Legendary (Master):** Proves exceptional year-long consistency and mentorship.

### The 5 Story Types (Card Variations)
1.  **The Transformation Card:** Focuses on rating growth over time (Velocity).
2.  **The Consistency Card:** Focuses on attendance rates (Reliability).
3.  **The Cross-Platform Card:** Focuses on aggregated scores across multiple sites (Versatility).
4.  **The Skill Map Card:** Focuses on problem categories solved (Breadth).
5.  **The Milestone Card:** Focuses on a specific, rare event (Peak Performance).

---

## 3. Strict Branches of Rules (The 30 Cards In-Depth)

*Note for Backend/AI: These rules are strict. A user must meet ALL criteria in the "Unlock Filter" to generate the card. The "Data Shown" is the immutable `proof_snapshot` rendered on the card.*

### 🟤 BRONZE TIER (Level 1)
*Purpose: Getting the student hooked. Showing them that their first steps are recognized.*

1. **Bronze Transformation**
   - **Unlock Filter:** 3-day streak + 1 contest attended + 1 platform connected.
   - **Data Shown:** Starting rating → Current rating (even if 0 → 800).
   - **Business Value:** "I have officially started my coding journey."

2. **Bronze Consistency**
   - **Unlock Filter:** 3-day streak + 1 contest attended + 1 platform connected.
   - **Data Shown:** 100% attendance rate (1/1 contests attended while registered).
   - **Business Value:** "I signed up and actually showed up."

3. **Bronze Cross-Platform**
   - **Unlock Filter:** 3-day streak + 1 contest attended + 1 platform connected.
   - **Data Shown:** Single platform score and handle.
   - **Business Value:** "My profile is verified and linked."

4. **Bronze Skill Map**
   - **Unlock Filter:** 3-day streak + 1 contest attended + 1 platform connected.
   - **Data Shown:** First category uncovered (e.g., "Math: 1 problem solved").
   - **Business Value:** "I have begun categorizing my practice."

5. **Bronze Milestone**
   - **Unlock Filter:** Attended 1st contest.
   - **Data Shown:** Contest name, date, and participation status.
   - **Business Value:** "I entered the arena for the first time."

---

### 🥈 SILVER TIER (Level 2)
*Purpose: Filtering out the quitters. Proving a habit is forming.*

6. **Silver Transformation**
   - **Unlock Filter:** 7-day streak + 5 contests attended + 2 platforms connected.
   - **Data Shown:** Rating delta over the 7 days (e.g., +50 rating).
   - **Business Value:** "I am actively growing week-over-week."

7. **Silver Consistency**
   - **Unlock Filter:** 7-day streak + 5 contests attended + 2 platforms connected.
   - **Data Shown:** Attendance rate (e.g., 5/5 = 100% or 5/6 = 83%).
   - **Business Value:** "I manage my schedule across multiple platforms."

8. **Silver Cross-Platform**
   - **Unlock Filter:** 7-day streak + 5 contests attended + 2 platforms connected.
   - **Data Shown:** Normalized scores for 2 platforms + early Composite Score.
   - **Business Value:** "I am not siloed to just LeetCode or just Codeforces."

9. **Silver Skill Map**
   - **Unlock Filter:** 7-day streak + 5 contests attended + 2 platforms connected.
   - **Data Shown:** 2-3 categories unlocked.
   - **Business Value:** "I am expanding beyond basic math/arrays."

10. **Silver Milestone**
    - **Unlock Filter:** First time solving a problem rated > 1200 in a contest.
    - **Data Shown:** Problem name, rating, and solve time.
    - **Business Value:** "I can solve non-trivial problems under pressure."

---

### 🥇 GOLD TIER (Level 3)
*Purpose: The first major flex. This is what students put on their LinkedIn to get internships.*

11. **Gold Transformation**
    - **Unlock Filter:** 30-day streak + 15 contests attended + 3 platforms connected + Positive 30-day Velocity (`rating_delta > 0`).
    - **Data Shown:** 30-day start rating → 30-day end rating + Total Delta.
    - **Business Value:** "I am a fast learner. I improved my rating by X in just one month."

12. **Gold Consistency**
    - **Unlock Filter:** 30-day streak + 15 contests attended + 3 platforms connected.
    - **Data Shown:** Consistency Rate > 80% across 30 days.
    - **Business Value:** "I am highly reliable. I show up to work/contests every single week." (Recruiters love this).

13. **Gold Cross-Platform**
    - **Unlock Filter:** 30-day streak + 15 contests attended + 3 platforms connected.
    - **Data Shown:** 3 platform ratings + Composite Score (e.g., 1400) + "Top 30%" on DSA Quest.
    - **Business Value:** "I am a well-rounded competitive programmer, verified across the big 3 platforms."

14. **Gold Skill Map**
    - **Unlock Filter:** 30-day streak + 15 contests attended + 3 platforms connected.
    - **Data Shown:** 5/10 categories covered with > 5 problems solved each.
    - **Business Value:** "I have a solid foundation. I won't get stuck on basic graph or DP questions."

15. **Gold Milestone**
    - **Unlock Filter:** First time ranking in the Top 25% of any contest.
    - **Data Shown:** Contest name, exact rank, total participants (e.g., Rank 500 / 2000).
    - **Business Value:** "I beat 75% of competitive programmers in a live setting."

---

### 💎 PLATINUM TIER (Level 4)
*Purpose: Proving performance, not just participation. This is for serious placement prep.*

16. **Platinum Transformation**
    - **Unlock Filter:** 60-day streak + 30 contests attended + 3 platforms + Achieved Top 10% in any contest.
    - **Data Shown:** Massive rating delta over 60 days.
    - **Business Value:** "I didn't just maintain; I climbed into the top 10%."

17. **Platinum Consistency**
    - **Unlock Filter:** 60-day streak + 30 contests attended.
    - **Data Shown:** 85%+ attendance rate over 2 months.
    - **Business Value:** "I have the discipline required for a full-time SDE role."

18. **Platinum Cross-Platform**
    - **Unlock Filter:** 60-day streak + 30 contests attended + 3 platforms + Top 10% finish.
    - **Data Shown:** High composite score (e.g., 1800+) across CF/LC/CC.
    - **Business Value:** "I am a top-tier competitor across the global ecosystem."

19. **Platinum Skill Map**
    - **Unlock Filter:** 60-day streak + 30 contests attended.
    - **Data Shown:** 7/10 categories covered + accuracy > 60%.
    - **Business Value:** "I can handle complex system design and advanced DSA topics."

20. **Platinum Milestone**
    - **Unlock Filter:** Achieved Top 10% in any contest.
    - **Data Shown:** Rank, Total Participants, Problem solved count.
    - **Business Value:** "I am a clutch performer. I deliver under strict time limits."

---

### 💠 DIAMOND TIER (Level 5)
*Purpose: Elite status. Recruiters for FAANG-tier companies will actively seek these students out.*

21. **Diamond Transformation**
    - **Unlock Filter:** 100-day streak + 50 contests + 4 platforms + Reached "Expert" tier (CF >= 1600 / LC >= 2000).
    - **Data Shown:** Journey from Novice to Expert in < 4 months.
    - **Business Value:** "I learn at an elite pace. I am ready for FAANG interviews."

22. **Diamond Consistency**
    - **Unlock Filter:** 100-day streak + 50 contests.
    - **Data Shown:** 90%+ attendance over 100 days.
    - **Business Value:** "My work ethic is undeniable. I do not burn out."

23. **Diamond Cross-Platform**
    - **Unlock Filter:** 4 platforms connected + Expert tier on at least one.
    - **Data Shown:** 4 platform scores + Composite Score > 2000.
    - **Business Value:** "I dominate every platform I touch."

24. **Diamond Skill Map**
    - **Unlock Filter:** Solved 5+ problems in 8/10 DSA categories.
    - **Data Shown:** Radar chart showing mastery of almost all topics.
    - **Business Value:** "There is no DSA topic I cannot tackle in an interview."

25. **Diamond Milestone**
    - **Unlock Filter:** Reached "Expert" tier on any major platform.
    - **Data Shown:** The exact contest where they crossed the threshold.
    - **Business Value:** "I am officially in the top 5-10% of global competitive programmers."

---

### 🏆 LEGENDARY TIER (Level 6)
*Purpose: Aspirational. These students become our platform ambassadors.*

26. **Legendary Transformation**
    - **Unlock Filter:** 365-day streak + 100 contests + 10/10 skill breadth + mentored 3 users.
    - **Data Shown:** Year-long growth graph.
    - **Business Value:** "I am a master of my craft and a leader in my community."

27. **Legendary Consistency**
    - **Unlock Filter:** 365-day streak + 100 contests.
    - **Data Shown:** 365 days of unbroken activity.
    - **Business Value:** "I have the ultimate dedication. I show up every single day for a year."

28. **Legendary Cross-Platform**
    - **Unlock Filter:** 4 platforms connected + Expert tier + 365-day streak.
    - **Data Shown:** Elite composite score across all platforms.
    - **Business Value:** "I am a versatile, elite developer."

29. **Legendary Skill Map**
    - **Unlock Filter:** 10/10 categories covered with 20+ problems each.
    - **Data Shown:** Perfect radar chart.
    - **Business Value:** "Absolute DSA mastery. No blind spots."

30. **Legendary Milestone**
    - **Unlock Filter:** Mentored 3 active users who reached Silver tier.
    - **Data Shown:** Mentor badge + Mentees' success count.
    - **Business Value:** "I don't just succeed alone; I elevate my team. I have leadership qualities."