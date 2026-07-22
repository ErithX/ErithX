import { NextResponse } from "next/server";
import { getCachedData, setCachedData } from "./cache";

import { fetchContests as fetchClist } from "./providers/Clist";
import { fetchContests as fetchMultiScraper } from "./providers/MultiScraper";
import { applyContestRules } from "./algorithm";

export async function GET() {
  try {
    const cachedData = getCachedData();
    if (cachedData) {
      console.log("CACHE HIT");
      return NextResponse.json({
        ...cachedData,
        cached: true,
      });
    }

    console.log("CACHE MISS → fetching fresh data");
    
    // First try CLIST (Primary)
    let contests = await fetchClist();
    let source = "Clist";

    // If CLIST fails or returns empty/null, Fallback to MultiScraper
    if (!contests || contests.length === 0) {
      console.log("CLIST failed or empty, falling back to MultiScraper...");
      contests = await fetchMultiScraper();
      source = "MultiScraper";
    }

    const processed = applyContestRules(contests);

    const response = {
      success: true,
      source,
      contests: processed.contests,
      longTermContests: processed.longTermContests,
      categories: processed.categories,
      filterStats: processed.filterStats,
      lastUpdated: new Date().toISOString(),
    };

    setCachedData(response);

    return NextResponse.json({
      ...response,
      cached: false,
    });
  } catch (error) {
    console.error("Error fetching contests:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch contests",
      },
      { status: 500 }
    );
  }
}
