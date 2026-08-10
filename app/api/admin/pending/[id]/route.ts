import { NextResponse, NextRequest } from 'next/server';
import { createClient } from '@/app/lib/supabase/server';
import connectToDatabase from '@/app/lib/mongodb';
import { Resource } from '@/models/Resource';
import { Notification } from '@/models/Notification'; // <-- Imported Notification model

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    // SUPERADMIN Check
    const superAdmins = (process.env.NEXT_PUBLIC_SUPERADMIN_EMAILS || '').split(',').map(e => e.trim());
    if (!user || !superAdmins.includes(user.email || '')) {
      return NextResponse.json({ error: 'Forbidden. Superadmin only.' }, { status: 403 });
    }

    await connectToDatabase();
    
    // In Next 15, we await params
    const id = (await params).id;
    const body = await req.json();

    // Body should contain { status: 'published' | 'rejected', rejectionReason?: string }
    const { status, rejectionReason } = body;

    if (!['published', 'rejected'].includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }

    const updateFields: any = { 
      status, 
      rejectionReason: status === 'rejected' ? rejectionReason : '' 
    };

    // When publishing, refresh createdAt so feed calculates relative time from the actual publish moment
    if (status === 'published') {
      updateFields.createdAt = new Date();
    }

    const updatedDoc = await Resource.findByIdAndUpdate(
      id,
      { $set: updateFields },
      { returnDocument: 'after' }
    );

    if (!updatedDoc) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 });
    }


    // ------------------------------------------------------------------
    // LEARNING NOTE: Triggering Notifications!
    // Now that the document status has successfully changed, we want to 
    // alert the author. We simply insert a new Notification into the DB 
    // linked to the author's userId.
    // ------------------------------------------------------------------
    const notificationMessage = status === 'published' 
      ? `Congratulations! Your post "${updatedDoc.title}" has been approved and published.`
      : `Your post "${updatedDoc.title}" was rejected. Reason: ${rejectionReason}`;
      
    await Notification.create({
      userId: updatedDoc.userId, // We alert the person who wrote the document
      message: notificationMessage,
      type: status === 'published' ? 'success' : 'error',
      relatedDocumentId: id // So they can click the notification to view the document
    });

    return NextResponse.json(updatedDoc, { status: 200 });
  } catch (error: any) {
    console.error("Admin Action API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
