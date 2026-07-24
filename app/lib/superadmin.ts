import { createClient as createSupabaseAdminClient } from "@supabase/supabase-js";
import { createClient } from "@/app/lib/supabase/server";
import type { ResourceSubmitter } from "@/app/lib/resources/types";

function getSuperadminEmails() {
  return new Set(
    (process.env.SUPERADMIN_EMAILS || "")
      .split(",")
      .map((email) => email.trim().toLowerCase())
      .filter(Boolean),
  );
}

export function isSuperadminEmail(email: string | null | undefined) {
  if (!email) return false;
  return getSuperadminEmails().has(email.toLowerCase());
}

export function toSubmitter(user: {
  id: string;
  email?: string | null;
  user_metadata?: Record<string, any>;
}): ResourceSubmitter {
  return {
    id: user.id,
    email: user.email || null,
    name: user.user_metadata?.full_name || user.user_metadata?.name || null,
    avatarUrl: user.user_metadata?.avatar_url || null,
  };
}

export async function getCurrentUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user;
}

// Central admin gate used by every superadmin API route.
export async function requireSuperadmin() {
  const user = await getCurrentUser();

  if (!user || !isSuperadminEmail(user.email)) {
    return null;
  }

  return user;
}

export function getSupabaseAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error("Supabase admin env vars are missing.");
  }

  return createSupabaseAdminClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
