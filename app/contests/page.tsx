import { Metadata } from 'next';
import ContestBoardClient from './ContestBoardClient';
import { getCachedData, setCachedData } from "@/app/api/contests/cache";
import { fetchContests as fetchClist } from "@/app/api/contests/providers/Clist";
import { fetchContests as fetchMultiScraper } from "@/app/api/contests/providers/MultiScraper";
import { applyContestRules } from "@/app/api/contests/algorithm";
import { mapApiContests } from "@/app/utils/contestFetch";

export const metadata: Metadata = {
  title: 'Coding Contests Dashboard | ErithX',
  description: 'Track live and upcoming coding contests across LeetCode, Codeforces & more. Features 1-click add-to-calendar sync.',
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
