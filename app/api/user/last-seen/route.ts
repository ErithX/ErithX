import { NextResponse } from 'next/server';
import { createClient } from '@/app/lib/supabase/server';

export const dynamic = 'force-dynamic';

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

    const { error: updateError } = await supabase
      .from('user_profiles')
      .update({ last_seen: now })
      .eq('id', user.id);

    if (updateError) {
      console.error('Failed to update last_seen:', updateError);
      return NextResponse.json(
        { error: 'Failed to update last_seen' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, last_seen: now });
  } catch (error) {
    console.error('last-seen POST error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
