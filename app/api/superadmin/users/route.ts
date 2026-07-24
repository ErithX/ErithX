import { NextResponse } from "next/server";
import { getSupabaseAdminClient, requireSuperadmin } from "@/app/lib/superadmin";

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
        avatarUrl: user.user_metadata?.avatar_url || null,
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
