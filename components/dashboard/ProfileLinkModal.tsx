"use client";

import React, { useState, useEffect, useRef } from 'react';
import { 
  X, Check, AlertCircle, Loader2, Link2, ExternalLink, 
  Trash2, Sparkles, CheckCircle2, ShieldCheck, Github
} from 'lucide-react';

export interface VerifiedPlatformData {
  handle: string;
  url: string;
  verified: boolean;
  avatar?: string;
  displayName?: string;
  statsSummary?: Record<string, any>;
}

interface ProfileLinkModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialPlatforms?: {
    leetcode?: VerifiedPlatformData | null;
    github?: VerifiedPlatformData | null;
    codeforces?: VerifiedPlatformData | null;
  };
  onSaveSuccess: (updatedPlatforms: any) => void;
}

export default function ProfileLinkModal({
  isOpen,
  onClose,
  initialPlatforms = {},
  onSaveSuccess
}: ProfileLinkModalProps) {
  // Input states
  const [leetcodeInput, setLeetcodeInput] = useState('');
  const [githubInput, setGithubInput] = useState('');
  const [codeforcesInput, setCodeforcesInput] = useState('');

  // Verified profile data states
  const [leetcodeData, setLeetcodeData] = useState<VerifiedPlatformData | null>(null);
  const [githubData, setGithubData] = useState<VerifiedPlatformData | null>(null);
  const [codeforcesData, setCodeforcesData] = useState<VerifiedPlatformData | null>(null);

  // Loading states for verification
  const [verifying, setVerifying] = useState<{ [key: string]: boolean }>({});
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSaving, setIsSaving] = useState(false);

  // Initialize from existing verified platforms
  useEffect(() => {
    if (isOpen) {
      if (initialPlatforms.leetcode) {
        setLeetcodeInput(initialPlatforms.leetcode.handle || initialPlatforms.leetcode.url || '');
        setLeetcodeData(initialPlatforms.leetcode);
      } else {
        setLeetcodeInput('');
        setLeetcodeData(null);
      }

      if (initialPlatforms.github) {
        setGithubInput(initialPlatforms.github.handle || initialPlatforms.github.url || '');
        setGithubData(initialPlatforms.github);
      } else {
        setGithubInput('');
        setGithubData(null);
      }

      if (initialPlatforms.codeforces) {
        setCodeforcesInput(initialPlatforms.codeforces.handle || initialPlatforms.codeforces.url || '');
        setCodeforcesData(initialPlatforms.codeforces);
      } else {
        setCodeforcesInput('');
        setCodeforcesData(null);
      }

      setErrors({});
    }
  }, [isOpen, initialPlatforms]);

  // Debounced auto-verifier
  const verifyPlatform = async (platform: 'leetcode' | 'github' | 'codeforces', rawInput: string) => {
    const trimmed = rawInput.trim();
    if (!trimmed) {
      if (platform === 'leetcode') setLeetcodeData(null);
      if (platform === 'github') setGithubData(null);
      if (platform === 'codeforces') setCodeforcesData(null);
      setErrors(prev => ({ ...prev, [platform]: '' }));
      return;
    }

    setVerifying(prev => ({ ...prev, [platform]: true }));
    setErrors(prev => ({ ...prev, [platform]: '' }));

    try {
      const res = await fetch('/api/user/profiles/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ platform, rawInput: trimmed })
      });

      const data = await res.json();

      if (data.success) {
        const verifiedObj: VerifiedPlatformData = {
          handle: data.handle,
          url: data.url,
          verified: true,
          avatar: data.avatar,
          displayName: data.displayName,
          statsSummary: data.statsSummary
        };

        if (platform === 'leetcode') setLeetcodeData(verifiedObj);
        if (platform === 'github') setGithubData(verifiedObj);
        if (platform === 'codeforces') setCodeforcesData(verifiedObj);
        setErrors(prev => ({ ...prev, [platform]: '' }));
      } else {
        if (platform === 'leetcode') setLeetcodeData(null);
        if (platform === 'github') setGithubData(null);
        if (platform === 'codeforces') setCodeforcesData(null);
        setErrors(prev => ({ ...prev, [platform]: data.error || 'Profile not found' }));
      }
    } catch (err: any) {
      setErrors(prev => ({ ...prev, [platform]: 'Network error while verifying' }));
    } finally {
      setVerifying(prev => ({ ...prev, [platform]: false }));
    }
  };

  // Debounce timers
  const leetcodeTimer = useRef<NodeJS.Timeout | null>(null);
  const githubTimer = useRef<NodeJS.Timeout | null>(null);
  const codeforcesTimer = useRef<NodeJS.Timeout | null>(null);

  const handleLeetcodeChange = (val: string) => {
    setLeetcodeInput(val);
    if (leetcodeTimer.current) clearTimeout(leetcodeTimer.current);
    leetcodeTimer.current = setTimeout(() => verifyPlatform('leetcode', val), 400);
  };

  const handleGithubChange = (val: string) => {
    setGithubInput(val);
    if (githubTimer.current) clearTimeout(githubTimer.current);
    githubTimer.current = setTimeout(() => verifyPlatform('github', val), 400);
  };

  const handleCodeforcesChange = (val: string) => {
    setCodeforcesInput(val);
    if (codeforcesTimer.current) clearTimeout(codeforcesTimer.current);
    codeforcesTimer.current = setTimeout(() => verifyPlatform('codeforces', val), 400);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const payload = {
        platforms: {
          leetcode: leetcodeData || (leetcodeInput.trim() ? { handle: leetcodeInput.trim(), url: `https://leetcode.com/u/${leetcodeInput.trim()}`, verified: false } : null),
          github: githubData || (githubInput.trim() ? { handle: githubInput.trim(), url: `https://github.com/${githubInput.trim()}`, verified: false } : null),
          codeforces: codeforcesData || (codeforcesInput.trim() ? { handle: codeforcesInput.trim(), url: `https://codeforces.com/profile/${codeforcesInput.trim()}`, verified: false } : null)
        }
      };

      const res = await fetch('/api/user/profiles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (data.success) {
        onSaveSuccess(data.platforms);
        onClose();
      } else {
        alert(data.error || 'Failed to save profiles');
      }
    } catch (err: any) {
      alert('Error saving profiles: ' + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-zinc-950/90 border border-white/10 rounded-2xl shadow-2xl overflow-hidden backdrop-blur-xl">
        
        {/* Header Ambient Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-24 bg-gradient-to-b from-emerald-500/10 to-transparent pointer-events-none blur-2xl"></div>

        {/* Modal Header */}
        <div className="relative flex items-center justify-between p-6 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Link2 className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                Connect Coding Profiles
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold tracking-wider uppercase">
                  v3 Engine
                </span>
              </h2>
              <p className="text-xs text-zinc-400 mt-0.5">
                Paste your profile link or username. Our edge engine auto-verifies your handle.
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-zinc-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body: Platform Inputs */}
        <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
          
          {/* LEETCODE ROW */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <label className="font-semibold text-zinc-300 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-orange-500"></span>
                LeetCode Profile
              </label>
              {verifying.leetcode && (
                <span className="text-[11px] text-orange-400 flex items-center gap-1">
                  <Loader2 className="w-3 h-3 animate-spin" /> Verifying handle...
                </span>
              )}
            </div>

            <div className="relative">
              <input 
                type="text"
                placeholder="e.g. leetcode.com/u/neal_wu or neal_wu"
                value={leetcodeInput}
                onChange={(e) => handleLeetcodeChange(e.target.value)}
                className={`w-full px-4 py-2.5 rounded-xl bg-white/[0.03] border text-sm text-white placeholder:text-zinc-600 focus:outline-none transition-all ${
                  errors.leetcode 
                    ? 'border-red-500/50 focus:border-red-500' 
                    : leetcodeData 
                    ? 'border-emerald-500/40 focus:border-emerald-500' 
                    : 'border-white/10 focus:border-orange-500/60'
                }`}
              />
              {leetcodeData && (
                <span className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-md">
                  <CheckCircle2 className="w-3.5 h-3.5" /> VERIFIED
                </span>
              )}
            </div>

            {errors.leetcode && (
              <p className="text-[11px] text-red-400 flex items-center gap-1">
                <AlertCircle className="w-3 h-3 shrink-0" /> {errors.leetcode}
              </p>
            )}

            {/* LeetCode Verified Preview Card */}
            {leetcodeData && (
              <div className="p-3 rounded-xl bg-orange-500/[0.04] border border-orange-500/20 flex items-center justify-between animate-in fade-in slide-in-from-top-1 duration-200">
                <div className="flex items-center gap-3 min-w-0">
                  <img 
                    src={leetcodeData.avatar} 
                    alt={leetcodeData.handle}
                    referrerPolicy="no-referrer"
                    className="w-8 h-8 rounded-full bg-zinc-800 border border-orange-500/30 object-cover shrink-0"
                    onError={(e) => {
                      e.currentTarget.src = `https://api.dicebear.com/7.x/avataaars/svg?seed=${leetcodeData.handle}`;
                    }}
                  />
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-white truncate flex items-center gap-2">
                      {leetcodeData.displayName}
                      <span className="text-[10px] text-zinc-500 font-mono font-normal">(@{leetcodeData.handle})</span>
                    </div>
                    <div className="text-[11px] text-zinc-400 flex items-center gap-2 mt-0.5">
                      <span>{leetcodeData.statsSummary?.totalSolved || 0} Solved</span>
                      {(leetcodeData.statsSummary?.contestRating ?? 0) > 0 && (
                        <span>• Rating: <strong className="text-orange-400">{leetcodeData.statsSummary?.contestRating}</strong></span>
                      )}
                    </div>

                  </div>
                </div>
                <a 
                  href={leetcodeData.url} 
                  target="_blank" 
                  rel="noreferrer"
                  className="p-1.5 text-zinc-500 hover:text-white transition-colors shrink-0"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            )}
          </div>

          {/* GITHUB ROW */}
          <div className="space-y-2 pt-2">
            <div className="flex items-center justify-between text-xs">
              <label className="font-semibold text-zinc-300 flex items-center gap-2">
                <Github className="w-3.5 h-3.5 text-purple-400" />
                GitHub Profile
              </label>
              {verifying.github && (
                <span className="text-[11px] text-purple-400 flex items-center gap-1">
                  <Loader2 className="w-3 h-3 animate-spin" /> Verifying handle...
                </span>
              )}
            </div>

            <div className="relative">
              <input 
                type="text"
                placeholder="e.g. github.com/torvalds or torvalds"
                value={githubInput}
                onChange={(e) => handleGithubChange(e.target.value)}
                className={`w-full px-4 py-2.5 rounded-xl bg-white/[0.03] border text-sm text-white placeholder:text-zinc-600 focus:outline-none transition-all ${
                  errors.github 
                    ? 'border-red-500/50 focus:border-red-500' 
                    : githubData 
                    ? 'border-emerald-500/40 focus:border-emerald-500' 
                    : 'border-white/10 focus:border-purple-500/60'
                }`}
              />
              {githubData && (
                <span className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-md">
                  <CheckCircle2 className="w-3.5 h-3.5" /> VERIFIED
                </span>
              )}
            </div>

            {errors.github && (
              <p className="text-[11px] text-red-400 flex items-center gap-1">
                <AlertCircle className="w-3 h-3 shrink-0" /> {errors.github}
              </p>
            )}

            {/* GitHub Verified Preview Card */}
            {githubData && (
              <div className="p-3 rounded-xl bg-purple-500/[0.04] border border-purple-500/20 flex items-center justify-between animate-in fade-in slide-in-from-top-1 duration-200">
                <div className="flex items-center gap-3 min-w-0">
                  <img 
                    src={githubData.avatar} 
                    alt={githubData.handle}
                    referrerPolicy="no-referrer"
                    className="w-8 h-8 rounded-full bg-zinc-800 border border-purple-500/30 object-cover shrink-0"
                  />
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-white truncate flex items-center gap-2">
                      {githubData.displayName}
                      <span className="text-[10px] text-zinc-500 font-mono font-normal">(@{githubData.handle})</span>
                    </div>
                    <div className="text-[11px] text-zinc-400 flex items-center gap-2 mt-0.5">
                      <span>{githubData.statsSummary?.publicRepos || 0} Public Repos</span>
                      <span>• {githubData.statsSummary?.followers || 0} Followers</span>
                    </div>
                  </div>
                </div>
                <a 
                  href={githubData.url} 
                  target="_blank" 
                  rel="noreferrer"
                  className="p-1.5 text-zinc-500 hover:text-white transition-colors shrink-0"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            )}
          </div>

          {/* CODEFORCES ROW */}
          <div className="space-y-2 pt-2">
            <div className="flex items-center justify-between text-xs">
              <label className="font-semibold text-zinc-300 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-500"></span>
                Codeforces Profile
              </label>
              {verifying.codeforces && (
                <span className="text-[11px] text-red-400 flex items-center gap-1">
                  <Loader2 className="w-3 h-3 animate-spin" /> Verifying handle...
                </span>
              )}
            </div>

            <div className="relative">
              <input 
                type="text"
                placeholder="e.g. codeforces.com/profile/tourist or tourist"
                value={codeforcesInput}
                onChange={(e) => handleCodeforcesChange(e.target.value)}
                className={`w-full px-4 py-2.5 rounded-xl bg-white/[0.03] border text-sm text-white placeholder:text-zinc-600 focus:outline-none transition-all ${
                  errors.codeforces 
                    ? 'border-red-500/50 focus:border-red-500' 
                    : codeforcesData 
                    ? 'border-emerald-500/40 focus:border-emerald-500' 
                    : 'border-white/10 focus:border-red-500/60'
                }`}
              />
              {codeforcesData && (
                <span className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-md">
                  <CheckCircle2 className="w-3.5 h-3.5" /> VERIFIED
                </span>
              )}
            </div>

            {errors.codeforces && (
              <p className="text-[11px] text-red-400 flex items-center gap-1">
                <AlertCircle className="w-3 h-3 shrink-0" /> {errors.codeforces}
              </p>
            )}

            {/* Codeforces Verified Preview Card */}
            {codeforcesData && (
              <div className="p-3 rounded-xl bg-red-500/[0.04] border border-red-500/20 flex items-center justify-between animate-in fade-in slide-in-from-top-1 duration-200">
                <div className="flex items-center gap-3 min-w-0">
                  <img 
                    src={codeforcesData.avatar} 
                    alt={codeforcesData.handle}
                    referrerPolicy="no-referrer"
                    className="w-8 h-8 rounded-full bg-zinc-800 border border-red-500/30 object-cover shrink-0"
                    onError={(e) => {
                      e.currentTarget.src = `https://api.dicebear.com/7.x/avataaars/svg?seed=${codeforcesData.handle}`;
                    }}
                  />
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-white truncate flex items-center gap-2">
                      {codeforcesData.displayName}
                      <span className="text-[10px] text-zinc-500 font-mono font-normal">(@{codeforcesData.handle})</span>
                    </div>
                    <div className="text-[11px] text-zinc-400 flex items-center gap-2 mt-0.5">
                      <span>Rank: <strong className="text-red-400 capitalize">{codeforcesData.statsSummary?.rank || 'Unranked'}</strong></span>
                      {(codeforcesData.statsSummary?.rating ?? 0) > 0 && (
                        <span>• Rating: <strong className="text-red-400">{codeforcesData.statsSummary?.rating}</strong></span>
                      )}
                    </div>

                  </div>
                </div>
                <a 
                  href={codeforcesData.url} 
                  target="_blank" 
                  rel="noreferrer"
                  className="p-1.5 text-zinc-500 hover:text-white transition-colors shrink-0"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            )}
          </div>

        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between p-6 border-t border-white/5 bg-white/[0.01]">
          <div className="text-[11px] text-zinc-500 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            Public API sync • Read-only access
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-medium text-zinc-400 hover:text-white hover:bg-white/5 transition-all"
            >
              Cancel
            </button>
            <button 
              onClick={handleSave}
              disabled={isSaving}
              className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs flex items-center gap-1.5 transition-all shadow-lg shadow-emerald-500/20 disabled:opacity-50"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                  Save & Link Profiles
                </>
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
