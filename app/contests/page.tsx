import { Metadata } from 'next';
import ContestBoardClient from './ContestBoardClient';
import { getCachedData, setCachedData } from "@/app/api/contests/cache";
import { fetchContests as fetchClist } from "@/app/api/contests/providers/Clist";
import { fetchContests as fetchMultiScraper } from "@/app/api/contests/providers/MultiScraper";
import { applyContestRules } from "@/app/api/contests/algorithm";
import { mapApiContests } from "@/app/utils/contestFetch";

export const metadata: Metadata = {
  title: 'Coding Contest Calendar – LeetCode, Codeforces, CodeChef | ErithX',
  description: 'Track upcoming coding contests across LeetCode, Codeforces, CodeChef, AtCoder and more. Add contests to Google Calendar in one click and get email reminders before they start. Built for engineering students.',
  keywords: [
    "DSA contest today", "DSA contest online", "DSA contest platform", "CodeChef DSA contest", 
    "DSA contest GFG", "DSA coding contest", "DSA contest tracker online", "coding contest tracker", 
    "coding competition", "LeetCode contest calendar with Google sync", 
    "Codeforces contest calendar with email reminder", "track coding contests in one place", 
    "coding contest tracker for students", "add coding contests to Google Calendar", 
    "LeetCode Codeforces contest tracker", "best contest calendar for DSA students", 
    "weekly coding contest schedule for students", "AtCoder contest calendar for students", 
    "HackerRank coding contest schedule"
  ].join(", "),
};

export const revalidate = 60; // Revalidate every 60 seconds

async function getInitialContests() {
  try {
    const cachedData = getCachedData();
    if (cachedData && cachedData.contests) {
      return mapApiContests(cachedData.contests as any);
    }

    let contests = await fetchClist();
    
    if (!contests || contests.length === 0) {
      contests = await fetchMultiScraper();
    }

    const processed = applyContestRules(contests);
    
    setCachedData({
      success: true,
      contests: processed.contests,
      longTermContests: processed.longTermContests,
      categories: processed.categories,
      filterStats: processed.filterStats,
      lastUpdated: new Date().toISOString(),
    });

    return mapApiContests(processed.contests as any);
  } catch (error) {
    console.error("Failed to fetch initial contests:", error);
    return [];
  }
}

export default async function ContestsPage() {
  const initialContests = await getInitialContests();
  
  return (
    <ContestBoardClient initialContests={initialContests} />
  );
}
