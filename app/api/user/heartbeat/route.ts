import { NextResponse } from 'next/server';
import { createClient } from '@/app/lib/supabase/server';

export const runtime = 'nodejs';

export async function POST() {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const now = new Date().toISOString();

    // Update last_seen in user_profiles
    const { error: updateError } = await supabase
      .from('user_profiles')
      .update({ last_seen: now })
      .eq('id', user.id);

    if (updateError) {
      console.error('Heartbeat update error:', updateError);
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, lastSeen: now });
  } catch (error: any) {
    console.error('Heartbeat API error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
