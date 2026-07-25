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
        const isNewUser = secondsSinceCreation < 10;

        if (isNewUser) {
          console.log('🎉 New user detected! Setting role and sending welcome email...')
          // SECURITY: Validate role to prevent privilege escalation
          const urlRole = searchParams.get('role');
          const allowedRoles = ['student', 'professional'];
          
          if (urlRole && allowedRoles.includes(urlRole)) {
            finalRole = urlRole;
            await supabase.auth.updateUser({ data: { role: urlRole } });
            await supabase.from('user_profiles').update({ role: urlRole }).eq('id', data.user.id);
          } else if (!finalRole) {
            // Default to student if no valid role provided
            finalRole = 'student';
            await supabase.auth.updateUser({ data: { role: 'student' } });
            await supabase.from('user_profiles').update({ role: 'student' }).eq('id', data.user.id);
          }
          
          const userEmail = data.user.email!
          const userName = data.user.user_metadata?.full_name || 'Coder'

          // Send welcome email (don't wait for it)
          sendWelcomeEmail(userEmail, userName)
            .then((result) => {
              if (result.success) {
                console.log(`✅ Welcome email sent to ${userEmail}`)
                supabase.from('email_logs').insert({
                  user_id: data.user.id,
                  email_type: 'welcome',
                  recipient_email: userEmail,
                  subject: 'Welcome to DSA Quest! 🚀',
                  status: 'sent',
                  sent_at: new Date().toISOString(),
                })
              } else {
                console.error(`❌ Failed to send welcome email to ${userEmail}`)
                supabase.from('email_logs').insert({
                  user_id: data.user.id,
                  email_type: 'welcome',
                  recipient_email: userEmail,
                  subject: 'Welcome to DSA Quest! 🚀',
                  status: 'failed',
                  error_message: JSON.stringify(result.error),
                })
              }
            })
            .catch((err) => console.error('❌ Welcome email error:', err))
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