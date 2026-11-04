import { NextResponse } from 'next/server';
import { requireSuperadmin } from '@/app/lib/superadmin';
import connectToDatabase from '@/app/lib/mongodb';
import { PlatformMetric } from '@/models/PlatformMetric';
import { Resource } from '@/models/Resource';
import { UserActivity } from '@/models/UserActivity';

export const runtime = 'nodejs';

export async function GET() {
  try {
    const adminUser = await requireSuperadmin();
    if (!adminUser) {
      return NextResponse.json({ error: 'Forbidden. Superadmin only.' }, { status: 403 });
    }

    await connectToDatabase();

    // Fetch platform aggregate metrics
    const metrics = await PlatformMetric.find({}).lean();
    const metricsMap = new Map(metrics.map((m: any) => [m.metricKey, m]));

    const calendarSyncs = metricsMap.get('contest_calendar_sync') || { count: 0, platformBreakdown: {} };
    const platformClicks = metricsMap.get('contest_platform_click') || { count: 0, platformBreakdown: {} };
    const pdfDownloadsMetric = metricsMap.get('pdf_download') || { count: 0 };

    // Fetch top downloaded PDF resources
    const topPdfResources = await Resource.find({ pdfDownloads: { $gt: 0 } })
      .sort({ pdfDownloads: -1 })
      .limit(5)
      .select('title slug pdfDownloads category')
      .lean();

    // Fetch recent 50 user-specific activities
    const recentActivities = await UserActivity.find({})
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();

    // Compute 30-day timeline aggregations
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    thirtyDaysAgo.setHours(0, 0, 0, 0);

    const [dailyAggregations, platformAggregations] = await Promise.all([
      UserActivity.aggregate([
        {
          $match: {
            createdAt: { $gte: thirtyDaysAgo }
          }
        },
        {
          $group: {
            _id: {
              date: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
              type: '$type'
            },
            count: { $sum: 1 },
            users: { $addToSet: { $ifNull: ['$userId', '$userEmail'] } }
          }
        },
        {
          $sort: { '_id.date': 1 }
        }
      ]),
      UserActivity.aggregate([
        {
          $match: {
            createdAt: { $gte: thirtyDaysAgo }
          }
        },
        {
          $group: {
            _id: '$platform',
            count: { $sum: 1 }
          }
        },
        {
          $sort: { count: -1 }
        },
        {
          $limit: 10
        }
      ])
    ]);

    // Build unbroken continuous 30-day timeline
    const dayMap: Record<string, any> = {};
    for (let i = 29; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toISOString().split('T')[0];
      dayMap[key] = {
        date: key,
        displayDate: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        total: 0,
        calendarSyncs: 0,
        contestClicks: 0,
        pdfDownloads: 0,
        uniqueUsers: 0,
        _userSet: new Set<string>()
      };
    }

    dailyAggregations.forEach((item: any) => {
      const day = item._id?.date;
      if (day && dayMap[day]) {
        const cnt = item.count || 0;
        dayMap[day].total += cnt;
        if (item._id.type === 'contest_calendar_sync') dayMap[day].calendarSyncs += cnt;
        else if (item._id.type === 'contest_platform_click') dayMap[day].contestClicks += cnt;
        else if (item._id.type === 'pdf_download') dayMap[day].pdfDownloads += cnt;

        if (Array.isArray(item.users)) {
          item.users.forEach((u: string) => {
            if (u) dayMap[day]._userSet.add(u);
          });
        }
      }
    });

    const dailyTrends = Object.values(dayMap).map((d: any) => {
      const uniqueUsers = d._userSet.size;
      delete d._userSet;
      return {
        ...d,
        uniqueUsers
      };
    });

    let totalActions30d = 0;
    let peakDay = { date: 'None', count: 0 };
    const allUsersIn30d = new Set<string>();

    dailyTrends.forEach((d: any) => {
      totalActions30d += d.total;
      if (d.total > peakDay.count) {
        peakDay = { date: d.displayDate, count: d.total };
      }
    });

    recentActivities.forEach((act: any) => {
      if (act.userId || act.userEmail) {
        allUsersIn30d.add(act.userId || act.userEmail);
      }
    });

    const totalPlatformActions = platformAggregations.reduce((acc: number, curr: any) => acc + curr.count, 0) || 1;
    const platformDistribution = platformAggregations
      .filter((p: any) => p._id && p._id.trim() !== '')
      .map((p: any) => ({
        platform: p._id,
        count: p.count,
        percentage: Math.round((p.count / totalPlatformActions) * 100)
      }));

    const formatBreakdown = (raw: any): Record<string, number> => {
      const result: Record<string, number> = {};
      if (!raw || typeof raw !== 'object') return result;

      const entries = raw instanceof Map ? Array.from(raw.entries()) : Object.entries(raw);
      for (const [key, val] of entries) {
        if (typeof val === 'number') {
          result[key] = val;
        } else if (typeof val === 'object' && val !== null) {
          // Flatten nested objects (e.g. { com: 1 })
          const nestedEntries = val instanceof Map ? Array.from(val.entries()) : Object.entries(raw);
          for (const [nKey, nVal] of nestedEntries) {
            if (typeof nVal === 'number') {
              result[`${key}.${nKey}`] = nVal;
            }
          }
        }
      }
      return result;
    };

    return NextResponse.json({
      success: true,
      data: {
        calendarSyncs: {
          total: calendarSyncs.count || 0,
          breakdown: formatBreakdown(calendarSyncs.platformBreakdown)
        },
        platformClicks: {
          total: platformClicks.count || 0,
          breakdown: formatBreakdown(platformClicks.platformBreakdown)
        },
        pdfDownloads: {
          total: pdfDownloadsMetric.count || 0,
          topResources: topPdfResources
        },
        dailyTrends,
        platformDistribution,
        summary: {
          totalActions30d,
          activeUsers30d: allUsersIn30d.size,
          peakDay,
          avgDailyActions: Math.round((totalActions30d / 30) * 10) / 10
        },
        recentActivities: recentActivities.map((act: any) => ({
          id: act._id?.toString(),
          userId: act.userId,
          userEmail: act.userEmail,
          userName: act.userName,
          userAvatar: act.userAvatar,
          type: act.type,
          title: act.title,
          platform: act.platform,
          createdAt: act.createdAt
        }))
      }
    });

  } catch (error: any) {
    console.error('Superadmin metrics error:', error);
    return NextResponse.json({ error: error.message || 'Internal error' }, { status: 500 });
  }
}
