import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/app/lib/supabase/server';
import { createClient as createSupabaseAdmin } from '@supabase/supabase-js';
import crypto from 'crypto';
import sharp from 'sharp';

export async function POST(req: NextRequest) {
  try {
    const supabaseClient = await createClient();
    const { data: { user } } = await supabaseClient.auth.getUser();

    // if (!user) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }

    const formData = await req.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // SECURITY: Validate file type and size before processing
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'application/pdf'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: 'Invalid file type. Only images and PDFs are allowed.' }, { status: 400 });
    }

    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      return NextResponse.json({ error: 'File size exceeds 10MB limit.' }, { status: 400 });
    }

    let buffer = Buffer.from(await file.arrayBuffer());
    let fileExtension = file.name.split('.').pop()?.replace(/[^a-zA-Z0-9]/g, '') || 'bin';
    let contentType = file.type;

    // Optimize images with sharp before uploading
    if (file.type.startsWith('image/')) {
      buffer = await sharp(buffer)
        .resize({ width: 1920, height: 1080, fit: 'inside', withoutEnlargement: true }) // Max 1080p
        .webp({ quality: 80 }) // Convert to WebP with 80% quality
        .toBuffer();
      
      fileExtension = 'webp';
      contentType = 'image/webp';
    }

    const uniqueFilename = `Resources/${user.id}/${crypto.randomUUID()}.${fileExtension}`;

    // Use Service Role Key to bypass RLS for bucket uploads
    const supabaseAdmin = createSupabaseAdmin(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    let { data, error } = await supabaseAdmin.storage
      .from('editor-assets')
      .upload(uniqueFilename, buffer, {
        contentType: contentType,
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
            contentType: contentType,
            upsert: false
          });
        data = retryResult.data;
        error = retryResult.error;
      }
    }

    if (error || !data) {
      console.error("Supabase Upload Error:", error);
      return NextResponse.json({ error: error?.message || 'Upload failed' }, { status: 500 });
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
