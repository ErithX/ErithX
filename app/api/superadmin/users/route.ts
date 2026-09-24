import { NextResponse } from "next/server";
import { getSupabaseAdminClient, requireSuperadmin } from "@/app/lib/superadmin";
import connectToDatabase from '@/app/lib/mongodb';
import { User } from '@/models/User';
import AIReview from '@/models/AIReview';
import { UserCoderProfile } from '@/models/UserCoderProfile';
import { LeetCodeStats, CodeforcesStats, GithubStats, CodeChefStats } from '@/models/PlatformStats';
import { Notification } from '@/models/Notification';
import { UserActivity } from '@/models/UserActivity';
import { BugReport } from '@/models/BugReport';

export const runtime = "nodejs";

export async function GET() {
  try {
    const adminUser = await requireSuperadmin();

    if (!adminUser) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const supabaseAdmin = getSupabaseAdminClient();
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.listUsers({
      page: 1,
      perPage: 1000,
    });

    if (authError) {
      throw authError;
    }

    // Fetch profile data (including last_seen)
    const { data: profileData, error: profileError } = await supabaseAdmin
      .from('user_profiles')
      .select('id, last_seen');
      
    if (profileError) throw profileError;

    const profileMap = new Map(profileData?.map((p: any) => [p.id, p.last_seen]) || []);

    const users = authData.users
      .map((user: any) => ({
        id: user.id,
        email: user.email,
        fullName:
          user.user_metadata?.full_name || user.user_metadata?.name || null,
        avatarUrl: user.user_metadata?.avatar_url || user.user_metadata?.picture || null,
        createdAt: user.created_at,
        lastSignInAt: user.last_sign_in_at,
        provider: user.app_metadata?.provider || null,
        lastSeen: profileMap.get(user.id) || null,
      }))
      .sort(
        (a: any, b: any) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );

    return NextResponse.json({ success: true, users });
  } catch (error) {
    console.error("Superadmin users error:", error);
    return NextResponse.json(
      { error: "Failed to load users" },
      { status: 500 },
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const adminUser = await requireSuperadmin();

    if (!adminUser) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const targetUserId = searchParams.get('id');

    if (!targetUserId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    const supabaseAdmin = getSupabaseAdminClient();

    // Get user email for email_logs cleanup
    const { data: userData, error: userError } = await supabaseAdmin.auth.admin.getUserById(targetUserId);
    if (userError || !userData.user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    const targetUserEmail = userData.user.email;

    // Connect to MongoDB
    await connectToDatabase();

    // 3. SOFT DELETE from MongoDB
    await User.findOneAndUpdate(
      { supabaseId: targetUserId },
      { 
        $set: {
          isDeleted: true,
          name: '[Deleted User]',
          email: 'deleted@user.local',
          bio: '',
          avatar: '',
        }
      }
    );

    // 3.5. HARD DELETE private associated data
    await Promise.all([
      AIReview.deleteMany({ user_id: targetUserId }),
      UserCoderProfile.deleteMany({ userId: targetUserId }),
      LeetCodeStats.deleteMany({ userId: targetUserId }),
      CodeforcesStats.deleteMany({ userId: targetUserId }),
      GithubStats.deleteMany({ userId: targetUserId }),
      CodeChefStats.deleteMany({ userId: targetUserId }),
      Notification.deleteMany({ userId: targetUserId }),
      UserActivity.deleteMany({ userId: targetUserId }),
      BugReport.deleteMany({ user_id: targetUserId }), 
    ]);

    // 3.8. ANONYMIZE DENORMALIZED DATA
    const { Resource } = await import('@/models/Resource');
    const Comment = (await import('@/models/Comment')).default;

    await Promise.all([
      Resource.updateMany(
        { userId: targetUserId },
        { 
          $set: { 
            authorName: '[Deleted User]', 
            authorEmail: 'deleted@user.local', 
            authorImg: '' 
          } 
        }
      ),
      Comment.updateMany(
        { userId: targetUserId },
        { 
          $set: { 
            authorName: '[Deleted User]', 
            authorImg: '' 
          } 
        }
      )
    ]);

    // 4. Delete from Supabase Auth & Public tables
    await supabaseAdmin.from('user_profiles').delete().eq('id', targetUserId);

    // Clear email logs
    await supabaseAdmin.from('email_logs').delete()
      .or(`user_id.eq.${targetUserId},recipient_email.eq.${targetUserEmail}`);

    const { error: deleteAuthError } = await supabaseAdmin.auth.admin.deleteUser(targetUserId);

    if (deleteAuthError) {
      console.error('Supabase Auth Deletion Error:', deleteAuthError);
    }

    return NextResponse.json({
      success: true,
      message: 'Account soft-deleted and anonymized successfully'
    });
    
  } catch (error) {
    console.error('Delete Account Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

