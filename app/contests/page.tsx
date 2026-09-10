import { Metadata } from 'next';
import ContestBoardClient from './ContestBoardClient';
import { getCachedData, setCachedData } from "@/app/api/contests/cache";
import { fetchContests as fetchClist } from "@/app/api/contests/providers/Clist";
import { fetchContests as fetchMultiScraper } from "@/app/api/contests/providers/MultiScraper";
import { applyContestRules } from "@/app/api/contests/algorithm";
import { mapApiContests } from "@/app/utils/contestFetch";

export const metadata: Metadata = {
  title: {
    absolute: 'Coding Contest Calendar – LeetCode, Codeforces, CodeChef | ErithX',
  },
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

  const contestStructuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebApplication',
        '@id': 'https://erithx.dev/contests#webapp',
        name: 'ErithX Coding Contest Calendar',
        url: 'https://erithx.dev/contests',
        applicationCategory: 'DeveloperApplication',
        operatingSystem: 'All',
        browserRequirements: 'Requires JavaScript. Requires HTML5.',
        description: 'Real-time competitive programming calendar and contest tracker for LeetCode, Codeforces, CodeChef, AtCoder, and more. Features 1-click Google Calendar sync and timezone conversion.',
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'USD',
        },
      },
      {
        '@type': 'ItemList',
        '@id': 'https://erithx.dev/contests#itemlist',
        name: 'Upcoming Coding Contests',
        description: 'Schedule of upcoming competitive programming contests with dates, platforms, and registration links.',
        numberOfItems: initialContests.length,
        itemListOrder: 'https://schema.org/ItemListOrderAscending',
        itemListElement: initialContests.slice(0, 30).map((contest, index) => {
          const startDateObj = new Date(contest.startDate);
          const endDateIso = !isNaN(startDateObj.getTime()) && contest.duration
            ? new Date(startDateObj.getTime() + contest.duration * 60 * 1000).toISOString()
            : undefined;

          return {
            '@type': 'ListItem',
            position: index + 1,
            item: {
              '@type': 'Event',
              name: contest.title,
              description: `${contest.platform} contest: ${contest.title}`,
              startDate: contest.startDate,
              endDate: endDateIso,
              eventAttendanceMode: 'https://schema.org/OnlineEventAttendanceMode',
              eventStatus: 'https://schema.org/EventScheduled',
              url: contest.url,
              organizer: {
                '@type': 'Organization',
                name: contest.platform,
              },
            },
          };
        }),
      },
    ],
  };
  
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contestStructuredData) }}
      />
      <ContestBoardClient initialContests={initialContests} />
    </>
  );
}
