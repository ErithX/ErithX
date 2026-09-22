import { NextResponse } from 'next/server';
import { createClient } from '@/app/lib/supabase/server';
import { createClient as createAdminClient } from '@supabase/supabase-js';
import connectToDatabase from '@/app/lib/mongodb';
import { User } from '@/models/User';
import AIReview from '@/models/AIReview';
import { UserCoderProfile } from '@/models/UserCoderProfile';
import { LeetCodeStats, CodeforcesStats, GithubStats, CodeChefStats } from '@/models/PlatformStats';
import { Notification } from '@/models/Notification';
import { UserActivity } from '@/models/UserActivity';

export async function DELETE() {
  try {
    const supabase = await createClient();

    // 1. Verify User Authentication
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 2. Connect to MongoDB
    await connectToDatabase();

    // 3. SOFT DELETE from MongoDB
    // We do NOT delete the document completely because their authored resources, 
    // comments, and upvotes need to reference a valid authorId to prevent crashes.
    // Instead, we anonymize their PII (Personal Identifiable Information) and mark them deleted.
    await User.findOneAndUpdate(
      { supabaseId: user.id },
      { 
        $set: {
          isDeleted: true,
          name: '[Deleted User]',
          email: 'deleted@user.local',
          bio: '',
          avatar: '',
          // clear other personal fields here
        }
      }
    );

    // 3.5. HARD DELETE private associated data
    await Promise.all([
      AIReview.deleteMany({ user_id: user.id }),
      UserCoderProfile.deleteMany({ userId: user.id }),
      LeetCodeStats.deleteMany({ userId: user.id }),
      CodeforcesStats.deleteMany({ userId: user.id }),
      GithubStats.deleteMany({ userId: user.id }),
      CodeChefStats.deleteMany({ userId: user.id }),
      Notification.deleteMany({ userId: user.id }),
      UserActivity.deleteMany({ userId: user.id }),
    ]);

    // 3.8. ANONYMIZE DENORMALIZED DATA (Resources & Comments are kept but PII is scrubbed)
    const { Resource } = await import('@/models/Resource');
    const Comment = (await import('@/models/Comment')).default;

    await Promise.all([
      Resource.updateMany(
        { userId: user.id },
        { 
          $set: { 
            authorName: '[Deleted User]', 
            authorEmail: 'deleted@user.local', 
            authorImg: '' 
          } 
        }
      ),
      Comment.updateMany(
        { userId: user.id },
        { 
          $set: { 
            authorName: '[Deleted User]', 
            authorImg: '' 
          } 
        }
      )
    ]);

    // 4. Delete from Supabase Auth & Public tables
    // We delete the public profile so they don't show up in search/rankings
    await supabase.from('user_profiles').delete().eq('id', user.id);

    // 5. Permanently delete Auth User from Supabase using Admin API
    // This revokes their ability to log in ever again.
    if (process.env.SUPABASE_SERVICE_ROLE_KEY) {
      const supabaseAdmin = createAdminClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY
      );

      const { error: deleteAuthError } = await supabaseAdmin.auth.admin.deleteUser(user.id);

      if (deleteAuthError) {
        console.error('Supabase Auth Deletion Error:', deleteAuthError);
        // We log the error but still return success because the soft delete in DB succeeded
      }
    } else {
      console.warn('SUPABASE_SERVICE_ROLE_KEY not found. Skipping Supabase Auth Deletion.');
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
