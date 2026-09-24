import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createServerClient } from '@supabase/ssr'
import { sendWelcomeEmail } from '@/app/lib/email/emailService'
import { getSupabaseAdminClient } from '@/app/lib/superadmin'

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
      const user = data.user
      const userEmail = user.email
      const userName = user.user_metadata?.full_name || user.user_metadata?.name || 'Coder'

      // Role management: stored in Supabase Auth user_metadata
      const urlRole = searchParams.get('role')
      const allowedRoles = ['student', 'professional', 'creator']
      let finalRole = user.user_metadata?.role

      if (!finalRole) {
        finalRole = urlRole && allowedRoles.includes(urlRole) ? urlRole : 'student'
        await supabase.auth.updateUser({ data: { role: finalRole } }).catch(() => {})
      }

      // Initialize admin client with service role key (bypasses RLS for system logs & flags)
      const adminSupabase = getSupabaseAdminClient()

      // Enable mentor review flags in user_profiles
      try {
        await adminSupabase.from('user_profiles').update({
          mentor_review_enabled: true,
          receive_review_emails: true,
        }).eq('id', user.id)
      } catch (err) {
        console.error('Failed to update user_profiles flags:', err)
      }

      // Strict Idempotency & Fresh Registration Guard:
      // Only dispatch welcome email for fresh signups (< 15 minutes old) and never sent before
      const accountCreatedAt = user.created_at ? new Date(user.created_at).getTime() : 0
      const accountAgeMs = Date.now() - accountCreatedAt
      const isNewRegistration = accountCreatedAt > 0 && accountAgeMs < 15 * 60 * 1000
      
      const superAdmins = (process.env.NEXT_PUBLIC_SUPERADMIN_EMAILS || '').split(',').map(e => e.trim());
      const isSuperAdmin = userEmail ? superAdmins.includes(userEmail) : false;

      console.log(`[WELCOME EMAIL GATE] user=${userEmail} accountAgeMs=${accountAgeMs} isNewRegistration=${isNewRegistration} isSuperAdmin=${isSuperAdmin} hasEmail=${!!userEmail}`)

      // Superadmins bypass the 15-minute age lock for testing purposes, but are still protected by email_logs
      if (userEmail && (isNewRegistration || isSuperAdmin)) {
        try {
          const { data: welcomeLog, error: logQueryError } = await adminSupabase
            .from('email_logs')
            .select('id')
            .or(`user_id.eq.${user.id},recipient_email.eq.${userEmail}`)
            .eq('email_type', 'welcome')
            .eq('status', 'sent')
            .limit(1)
            .maybeSingle()

          console.log(`[WELCOME EMAIL LOG CHECK] existingLog=${JSON.stringify(welcomeLog)} queryError=${JSON.stringify(logQueryError)}`)

          if (!welcomeLog) {
            console.log(`[WELCOME EMAIL] Dispatching welcome email to new user: ${userEmail}`)
            const result = await sendWelcomeEmail(userEmail, userName)
            console.log(`[WELCOME EMAIL RESULT] success=${result?.success} skipped=${result?.skipped} error=${JSON.stringify(result?.error)}`)

            if (result?.success && !result?.skipped) {
              console.log(`[WELCOME EMAIL] Sent successfully to ${userEmail}`)
              const { error: insertErr } = await adminSupabase.from('email_logs').insert({
                user_id: user.id,
                email_type: 'welcome',
                recipient_email: userEmail,
                subject: `Hey ${userName || 'Coder'} — a quick note before your first Sunday review`,
                status: 'sent',
                sent_at: new Date().toISOString(),
              })
              if (insertErr) console.error('[WELCOME EMAIL] Failed to insert sent log:', insertErr)
            } else if (result?.skipped) {
              console.warn(`[WELCOME EMAIL] Skipped by emailService (kill switch or no API key). skipped=${result?.skipped} error=${JSON.stringify(result?.error)}`)
              // Still log the skip so we know it happened
              await adminSupabase.from('email_logs').insert({
                user_id: user.id,
                email_type: 'welcome',
                recipient_email: userEmail,
                subject: `Hey ${userName || 'Coder'} — a quick note before your first Sunday review`,
                status: 'skipped',
                error_message: JSON.stringify(result?.error || 'Kill switch or missing API key'),
              }).then(({ error }) => { if (error) console.error('[WELCOME EMAIL] Failed to insert skip log:', error) })
            } else {
              console.error(`[WELCOME EMAIL] Failed to send to ${userEmail}:`, result?.error)
              await adminSupabase.from('email_logs').insert({
                user_id: user.id,
                email_type: 'welcome',
                recipient_email: userEmail,
                subject: `Hey ${userName || 'Coder'} — a quick note before your first Sunday review`,
                status: 'failed',
                error_message: JSON.stringify(result?.error || 'Unknown error'),
              })
            }
          } else {
            console.log(`[WELCOME EMAIL] Skipping duplicate welcome email for ${userEmail} (already sent). logId=${welcomeLog?.id}`)
          }
        } catch (emailErr) {
          console.error('[WELCOME EMAIL] Error in welcome email workflow:', emailErr)
        }
      } else {
        console.log(`[WELCOME EMAIL GATE] Skipped. Conditions not met: userEmail=${!!userEmail} isNewRegistration=${isNewRegistration} isSuperAdmin=${isSuperAdmin}`)
      }

      // Determine correct navigation based on final role
      let finalNext = next
      if (finalRole === 'student') {
        finalNext = '/contests'
      } else if (finalRole === 'professional' || finalRole === 'creator') {
        finalNext = '/resources'
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