import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { sendWelcomeEmail } from '@/app/lib/email/emailService'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/'

  if (code) {
    const cookieStore = await cookies()
    
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) => {
                cookieStore.set(name, value, options)
              })
            } catch (error) {
              // Handle cookie setting errors
            }
          },
        },
      }
    )

    const { data, error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error && data?.user) {
      // Check if this is a new user (first time login)
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('created_at, role')
        .eq('id', data.user.id)
        .single()

      let finalRole = data.user.user_metadata?.role;
      let finalNext = next;

      if (profile) {
        const createdAt = new Date(profile.created_at)
        const now = new Date()
        const secondsSinceCreation = (now.getTime() - createdAt.getTime()) / 1000
        const isNewUser = secondsSinceCreation < 300; // 5 minute window for OAuth redirect completion

        // Check if user has already received a welcome email
        const { data: welcomeLog } = await supabase
          .from('email_logs')
          .select('id')
          .eq('user_id', data.user.id)
          .eq('email_type', 'welcome')
          .eq('status', 'sent')
          .limit(1)
          .maybeSingle();

        const shouldSendWelcome = (isNewUser || !profile.role) && !welcomeLog;

        if (shouldSendWelcome) {
          console.log('🎉 New user detected! Setting role and sending welcome email...')
          // SECURITY: Validate role to prevent privilege escalation
          const urlRole = searchParams.get('role');
          const allowedRoles = ['student', 'professional'];
          
          if (urlRole && allowedRoles.includes(urlRole)) {
            finalRole = urlRole;
            await supabase.auth.updateUser({ data: { role: urlRole } });
            await supabase.from('user_profiles').update({ 
              role: urlRole,
              mentor_review_enabled: true,
              receive_review_emails: true,
            }).eq('id', data.user.id);
          } else if (!finalRole) {
            // Default to student if no valid role provided
            finalRole = 'student';
            await supabase.auth.updateUser({ data: { role: 'student' } });
            await supabase.from('user_profiles').update({ 
              role: 'student',
              mentor_review_enabled: true,
              receive_review_emails: true,
            }).eq('id', data.user.id);
          }
          
          const userEmail = data.user.email!
          const userName = data.user.user_metadata?.full_name || 'Coder';

          // Send welcome email directly with await to guarantee completion before serverless container freeze
          try {
            const result = await sendWelcomeEmail(userEmail, userName);
            if (result.success && !result.skipped) {
              console.log(`Welcome email sent to ${userEmail}`);
              await supabase.from('email_logs').insert({
                user_id: data.user.id,
                email_type: 'welcome',
                recipient_email: userEmail,
                subject: 'Welcome to ErithX ✨',
                status: 'sent',
                sent_at: new Date().toISOString(),
              });
            } else if (!result.skipped) {
              console.error(`Failed to send welcome email to ${userEmail}:`, result.error);
              await supabase.from('email_logs').insert({
                user_id: data.user.id,
                email_type: 'welcome',
                recipient_email: userEmail,
                subject: 'Welcome to ErithX ✨',
                status: 'failed',
                error_message: JSON.stringify(result.error || 'Unknown error'),
              });
            }
          } catch (err: any) {
            console.error('Welcome email execution error:', err);
          }
        } else {
          console.log('👤 Existing user logging in, ignoring modal role and using existing role')
          // Existing user, use their existing role from the database/metadata
          finalRole = profile.role || data.user.user_metadata?.role || 'student';
        }
      }

      // Determine correct navigation based on final role
      if (finalRole === 'student') {
        finalNext = '/contests';
      } else if (finalRole === 'professional') {
        finalNext = '/resources';
      }

      const forwardedHost = request.headers.get('x-forwarded-host')
      const isLocal = origin.includes('localhost') || origin.includes('127.0.0.1')
      const isLocalEnv = process.env.NODE_ENV === 'development' || isLocal
      
      if (isLocalEnv) {
        return NextResponse.redirect(`${origin}${finalNext}`)
      } else if (forwardedHost) {
        return NextResponse.redirect(`https://${forwardedHost}${finalNext}`)
      } else {
        return NextResponse.redirect(`${origin}${finalNext}`)
      }
    } else {
      console.error('Auth callback error:', error)
    }
  }

  // Return to error page with instructions
  return NextResponse.redirect(`${origin}/auth/auth-code-error`)
}