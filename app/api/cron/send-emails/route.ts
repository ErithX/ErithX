// app/api/cron/send-emails/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { sendDailyContestDigest } from "@/app/lib/email/emailService";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  },
);

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get("authorization");
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      console.log("Unauthorized cron request");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.log("Starting daily email cron job...");

    // Step 1: Fetch users with email notifications enabled
    const { data: users, error: usersError } = await supabaseAdmin
      .from("user_profiles")
      .select("id, email, full_name, email_notifications, weekly_digest, product_updates")
      .or("email_notifications.eq.true,weekly_digest.eq.true");

    if (usersError) {
      console.error("Error fetching users:", usersError);
      return NextResponse.json(
        { error: "Failed to fetch users" },
        { status: 500 },
      );
    }

    if (!users || users.length === 0) {
      console.log("No users with email notifications enabled");
      return NextResponse.json({
        success: true,
        message: "No users to send emails to",
        userCount: 0,
      });
    }

    console.log(`Found ${users.length} users with notifications enabled`);

    // Step 2: Fetch contests directly (avoid self-fetching /api/contests)
    let contests: any[] = [];
    try {
      const { fetchContests: fetchClist } = await import("../../contests/providers/Clist");
      const { fetchContests: fetchMultiScraper } = await import("../../contests/providers/MultiScraper");
      const { applyContestRules } = await import("../../contests/algorithm");

      let rawContests = await fetchClist();
      if (!rawContests || rawContests.length === 0) {
        rawContests = await fetchMultiScraper();
      }

      if (rawContests && rawContests.length > 0) {
        const processed = applyContestRules(rawContests);
        contests = processed.contests || [];
      }
    } catch (fetchError) {
      console.error("Failed to fetch contests directly, trying HTTP fallback:", fetchError);

      // Fallback: self-fetch if direct import fails
      try {
        const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
        const contestsResponse = await fetch(`${appUrl}/api/contests`, {
          cache: "no-store",
        });

        if (contestsResponse.ok) {
          const contestsData = await contestsResponse.json();
          if (contestsData.success) {
            contests = contestsData.contests || [];
          }
        }
      } catch (httpError) {
        console.error("HTTP fallback also failed:", httpError);
      }
    }

    // Filter contests starting in next 24 hours (use startTime - camelCase)
    const now = new Date();
    const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);

    const upcomingContests = contests.filter((contest: any) => {
      const startTime = new Date(contest.startTime);
      return startTime >= now && startTime <= tomorrow;
    });

    console.log(`Found ${upcomingContests.length} contests in next 24 hours`);

    // Step 3: Send emails
    const emailResults = {
      sent: 0,
      failed: 0,
      skipped: 0,
      errors: [] as string[],
    };

    for (const user of users) {
      try {
        if (user.weekly_digest === false) {
          console.log(`Skipping digest for ${user.email} - weekly_digest disabled`);
          emailResults.skipped++;
          continue;
        }

        const result = await sendDailyContestDigest(
          user.email,
          user.full_name || "Coder",
          upcomingContests,
        );

        if (result.success) {
          emailResults.sent++;

          await supabaseAdmin.from("email_logs").insert({
            user_id: user.id,
            email_type: "daily_digest",
            recipient_email: user.email,
            subject: `${upcomingContests.length} contest${upcomingContests.length > 1 ? "s" : ""} starting soon on DSA Quest`,
            status: "sent",
            sent_at: new Date().toISOString(),
            contests_count: upcomingContests.length,
          });
        } else if ("skipped" in result && result.skipped) {
          emailResults.skipped++;
        } else {
          emailResults.failed++;
          emailResults.errors.push(
            `${user.email}: ${JSON.stringify(result)}`,
          );

          await supabaseAdmin.from("email_logs").insert({
            user_id: user.id,
            email_type: "daily_digest",
            recipient_email: user.email,
            subject: "Daily Contest Digest",
            status: "failed",
            error_message: JSON.stringify(result),
          });
        }
      } catch (error) {
        console.error(`Error sending to ${user.email}:`, error);
        emailResults.failed++;
        emailResults.errors.push(
          `${user.email}: ${error instanceof Error ? error.message : "Unknown error"}`,
        );
      }
    }

    console.log(`Cron completed: ${emailResults.sent} sent, ${emailResults.failed} failed, ${emailResults.skipped} skipped`);

    return NextResponse.json({
      success: true,
      message: "Email cron job completed",
      userCount: users.length,
      contestCount: upcomingContests.length,
      results: emailResults,
    });
  } catch (error) {
    console.error("Cron job error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  return GET(request);
}
