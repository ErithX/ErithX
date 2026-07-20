import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/app/lib/supabase/server';
import connectToDatabase from '@/app/lib/mongodb';
import { Resource } from '@/models/Resource';
import {User} from '@/models/User'
// Update a document (Auto-save / Publish)
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const supabaseClient = await createClient();
    const { data: { user } } = await supabaseClient.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();
    
    // We must await params in Next.js 15
    const id = (await params).id;

    // Verify ownership
    const existingDoc = await Resource.findById(id);
    if (!existingDoc) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    if (existingDoc.userId !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
//Admin Override logic
    const body = await req.json();
    if(body.overrideAuthorId){
      const superAdmins = (process.env.NEXT_PUBLIC_SUPERADMIN_EMAILS || '').split(',').map(e => e.trim());
      const isSuperAdmin = superAdmins.includes(user.email || '');
      if(isSuperAdmin){
        const fakeUser = await User.findOne({supabaseId : body.overrideAuthorId})

        if(fakeUser){
          body.userId = fakeUser.supabaseId;
          body.authorName = fakeUser.name;
          body.authorEmail = fakeUser.email;
          body.authorImg = fakeUser.avatar;
          body.isPro = fakeUser.isPro; 
          body.isVerified = fakeUser.isVerified;
        }   
      }
        delete body.overrideAuthorId;

    }

    // Generate slug if it doesn't exist and we have a title
    if (!existingDoc.slug && body.title) {
      const baseSlug = body.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
      const randomSuffix = Math.floor(Math.random() * 10000);
      body.slug = `${baseSlug || 'resource'}-${randomSuffix}`;
    }

    const updatedDoc = await Resource.findByIdAndUpdate(
      id,
      { $set: body },
      { returnDocument: 'after' }
    );

    return NextResponse.json(updatedDoc, { status: 200 });
  } catch (error: any) {
    console.error("Update Document API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
