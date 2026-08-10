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

    const formatBreakdown = (raw: any): Record<string, number> => {
      const result: Record<string, number> = {};
      if (!raw || typeof raw !== 'object') return result;

      const entries = raw instanceof Map ? Array.from(raw.entries()) : Object.entries(raw);
      for (const [key, val] of entries) {
        if (typeof val === 'number') {
          result[key] = val;
        } else if (typeof val === 'object' && val !== null) {
          // Flatten nested objects (e.g. { com: 1 })
          const nestedEntries = val instanceof Map ? Array.from(val.entries()) : Object.entries(val);
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
