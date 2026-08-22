import { NextResponse } from "next/server";
import connectToDatabase from "@/app/lib/mongodb";
import { User } from "@/models/User";

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const supabaseId = searchParams.get('supabaseId');

        if (!supabaseId) {
            return NextResponse.json({ error: 'Supabase ID is required' }, { status: 400 });
        }

        await connectToDatabase();
        const user = await User.findOne({ supabaseId });
        
        if (!user) {
            return NextResponse.json({ error: 'user not found' }, { status: 404 });
        }
        return NextResponse.json(user, { status: 200 })
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const data = await request.json();
        const {
            supabaseId,
            name,
            email,
            avatar,
            bio,
            twitterUrl,
            linkedinUrl,
            mentorPrefs
        } = data;
        
        if (!supabaseId) {
            return NextResponse.json({ error: 'Supabase ID is required' }, { status: 400 });
        }
        
        await connectToDatabase();
        const updateUser = await User.findOneAndUpdate(
            { supabaseId }, 
            {
                name,
                email,
                avatar,
                bio,
                twitterUrl,
                linkedinUrl,
                ...(mentorPrefs ? { mentorPrefs } : {})
            }, 
            {
                new: true,
                upsert: true
            }
        );
        
        return NextResponse.json(updateUser, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
