import { NextResponse } from 'next/server';
import { createClient } from '@/app/lib/supabase/server';
import connectToDatabase from '@/app/lib/mongodb';
import { BugReport } from '@/models/BugReport';

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { message, page } = body;

    if (!message || message.trim() === '') {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    await connectToDatabase();
    await BugReport.create({
      user_id: user.id,
      email: user.email,
      message,
      page: page || "Unknown",
      status: "open"
    });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("Bug report error:", err);
    return NextResponse.json({ error: err.message || "Internal error" }, { status: 500 });
  }
}
