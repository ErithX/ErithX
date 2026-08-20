import React, { useState } from 'react';
import { X, Zap, Loader2, GraduationCap, PenTool } from 'lucide-react';
import { createClient } from '@/app/lib/supabase/client';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialRole?: 'student' | 'professional';
}

export default function AuthModal({ isOpen, onClose, initialRole = 'student' }: AuthModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedRole, setSelectedRole] = useState<'student' | 'professional'>(initialRole);
  const supabase = createClient();

  if (!isOpen) return null;

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const nextUrl = selectedRole === 'professional' ? '/dashboard/pro' : '/dashboard';
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback?next=${nextUrl}&role=${selectedRole}`,
        },
      });
      if (error) throw error;
    } catch (err: any) {
      setError(err.message || 'An error occurred during sign in');
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Transparent backdrop with blur */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-md"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative w-full max-w-md bg-[#09090b]/90 border border-white/10 rounded-2xl overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        {/* Glow effect */}
        <div className="absolute top-0 right-0 w-64 h-64 opacity-[0.15] pointer-events-none" style={{background: selectedRole === 'student' ? 'radial-gradient(circle, #10b981, transparent 70%)' : 'radial-gradient(circle, #3b82f6, transparent 70%)'}}></div>
        
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-lg hover:bg-white/10 text-zinc-400 hover:text-white transition-colors z-10"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="p-8">
          <div className="flex items-center gap-2 mb-8">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
              <Zap className="w-4 h-4 text-emerald-400" />
            </div>
            <span className="font-semibold text-lg tracking-tight text-white">ErithX</span>
          </div>

          <h2 className="text-2xl font-medium tracking-tight mb-2 text-white">
            Welcome to ErithX
          </h2>
          <p className="text-sm text-zinc-400 mb-6">
            Track your competitive programming contests and resources all in one place.
          </p>

          <div className="flex items-center gap-3 mb-6">
            <button
              onClick={() => setSelectedRole('student')}
              className={`flex-1 flex flex-col items-center justify-center gap-2 p-3 rounded-xl border transition-all ${
                selectedRole === 'student' 
                  ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-400' 
                  : 'bg-white/[0.02] border-white/10 text-zinc-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              <GraduationCap className="w-5 h-5" />
              <span className="text-xs font-semibold">I'm a Student</span>
            </button>

            <button
              onClick={() => setSelectedRole('professional')}
              className={`flex-1 flex flex-col items-center justify-center gap-2 p-3 rounded-xl border transition-all ${
                selectedRole === 'professional' 
                  ? 'bg-blue-500/10 border-blue-500/50 text-blue-400' 
                  : 'bg-white/[0.02] border-white/10 text-zinc-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              <PenTool className="w-5 h-5" />
              <span className="text-xs font-semibold leading-tight">Continue as creator</span>
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-xs text-red-400">
              {error}
            </div>
          )}

          <button
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-3 py-3 rounded-xl bg-white text-zinc-900 text-sm font-semibold hover:bg-zinc-200 transition-all border border-zinc-200 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin text-zinc-900" />
            ) : (
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  fill="#EA4335"
                />
              </svg>
            )}
            Sign In with Google
          </button>

          <div className="mt-8 pt-6 border-t border-white/5">
            <p className="text-[11px] text-zinc-500 leading-relaxed text-center">
              We value your privacy and never share your data. Signing in is only required to send you regular contests, resources, and updates to help you on your DSA journey.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
