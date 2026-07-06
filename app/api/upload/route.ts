import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/app/lib/supabase/server';
import { createClient as createSupabaseAdmin } from '@supabase/supabase-js';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
  try {
    const supabaseClient = await createClient();
    const { data: { user } } = await supabaseClient.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const fileExtension = file.name.split('.').pop();
    // Using the 'Resources' folder in the bucket
    const uniqueFilename = `Resources/${user.id}/${crypto.randomUUID()}.${fileExtension}`;

    // Use Service Role Key to bypass RLS for bucket uploads
    const supabaseAdmin = createSupabaseAdmin(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    let { data, error } = await supabaseAdmin.storage
      .from('editor-assets')
      .upload(uniqueFilename, buffer, {
        contentType: file.type,
        upsert: false
      });

    // If bucket doesn't exist, create it and retry upload
    if (error && error.message.includes('Bucket not found')) {
      const { error: bucketError } = await supabaseAdmin.storage.createBucket('editor-assets', {
        public: true,
        fileSizeLimit: 10485760, // 10MB
      });
      
      if (!bucketError) {
        // Retry upload
        const retryResult = await supabaseAdmin.storage
          .from('editor-assets')
          .upload(uniqueFilename, buffer, {
            contentType: file.type,
            upsert: false
          });
        data = retryResult.data;
        error = retryResult.error;
      }
    }

    if (error) {
      console.error("Supabase Upload Error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const { data: { publicUrl } } = supabaseAdmin.storage
      .from('editor-assets')
      .getPublicUrl(data.path);

    return NextResponse.json({ url: publicUrl, path: data.path }, { status: 200 });

  } catch (error: any) {
    console.error("Upload API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
