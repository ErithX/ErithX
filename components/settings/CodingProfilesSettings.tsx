"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Check, Loader2, Plus, X } from 'lucide-react';

export interface VerifiedPlatformData {
  handle: string;
  url: string;
  verified: boolean;
  avatar?: string;
  displayName?: string;
  statsSummary?: Record<string, any>;
}

export default function CodingProfilesSettings() {
  const [platforms, setPlatforms] = useState<{
    leetcode?: VerifiedPlatformData | null;
    github?: VerifiedPlatformData | null;
    codeforces?: VerifiedPlatformData | null;
  }>({});

  const [inputs, setInputs] = useState({
    leetcode: '',
    github: '',
    codeforces: ''
  });

  const [verifying, setVerifying] = useState<{ [key: string]: boolean }>({});
  const [saveStatus, setSaveStatus] = useState<{ [key: string]: 'saving' | 'saved' | 'idle' }>({});
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(true);

  const [otherUrls, setOtherUrls] = useState<string[]>([]);
  const [savingOthers, setSavingOthers] = useState(false);

  // Fetch initial profile handles
  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const res = await fetch('/api/user/profiles');
        if (res.ok) {
          const data = await res.json();
          if (data.success) {
            if (data.platforms) {
              setPlatforms(data.platforms);
              setInputs({
                leetcode: data.platforms.leetcode?.handle || data.platforms.leetcode?.url || '',
                github: data.platforms.github?.handle || data.platforms.github?.url || '',
                codeforces: data.platforms.codeforces?.handle || data.platforms.codeforces?.url || ''
              });
            }
            if (data.otherUrls) {
              setOtherUrls(data.otherUrls);
            }
          }
        }
      } catch (err) {
        console.error('Error fetching linked profiles:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  // Background auto-save helper
  const autoPersist = async (platform: 'leetcode' | 'github' | 'codeforces', verifiedData: VerifiedPlatformData | null) => {
    try {
      setSaveStatus(prev => ({ ...prev, [platform]: 'saving' }));
      if (!verifiedData) {
        await fetch(`/api/user/profiles?platform=${platform}`, { method: 'DELETE' });
        setPlatforms(prev => ({ ...prev, [platform]: null }));
      } else {
        const payload = { platforms: { [platform]: verifiedData } };
        const res = await fetch('/api/user/profiles', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const json = await res.json();
        if (json.success && json.platforms) {
          setPlatforms(json.platforms);
        }
      }
      setSaveStatus(prev => ({ ...prev, [platform]: 'saved' }));
      setTimeout(() => {
        setSaveStatus(prev => ({ ...prev, [platform]: 'idle' }));
      }, 2500);
    } catch (err) {
      console.error('Auto-save error:', err);
      setSaveStatus(prev => ({ ...prev, [platform]: 'idle' }));
    }
  };

  // Debounced auto-verifier & background saver
  const verifyAndSave = async (platform: 'leetcode' | 'github' | 'codeforces', rawVal: string) => {
    const trimmed = rawVal.trim();

    if (!trimmed) {
      setErrors(prev => ({ ...prev, [platform]: '' }));
      setPlatforms(prev => ({ ...prev, [platform]: null }));
      await autoPersist(platform, null);
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

        setPlatforms(prev => ({ ...prev, [platform]: verifiedObj }));
        setInputs(prev => ({ ...prev, [platform]: data.handle }));
        setErrors(prev => ({ ...prev, [platform]: '' }));
        await autoPersist(platform, verifiedObj);
      } else {
        setErrors(prev => ({ ...prev, [platform]: data.error || 'Not found' }));
      }
    } catch (err: any) {
      setErrors(prev => ({ ...prev, [platform]: 'Error' }));
    } finally {
      setVerifying(prev => ({ ...prev, [platform]: false }));
    }
  };

  // Timers for debouncing
  const timerRefs = {
    leetcode: useRef<NodeJS.Timeout | null>(null),
    github: useRef<NodeJS.Timeout | null>(null),
    codeforces: useRef<NodeJS.Timeout | null>(null)
  };

  const handleInputChange = (platform: 'leetcode' | 'github' | 'codeforces', val: string) => {
    setInputs(prev => ({ ...prev, [platform]: val }));
    if (timerRefs[platform].current) clearTimeout(timerRefs[platform].current!);
    timerRefs[platform].current = setTimeout(() => {
      verifyAndSave(platform, val);
    }, 450);
  };

  const saveOtherUrls = async (urls: string[]) => {
    setSavingOthers(true);
    try {
      await fetch('/api/user/profiles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ otherUrls: urls.filter(u => u.trim() !== '') })
      });
    } catch (err) {
      console.error(err);
    } finally {
      setSavingOthers(false);
    }
  };

  const handleAddOther = () => setOtherUrls(prev => [...prev, '']);
  const handleRemoveOther = (index: number) => {
    const next = [...otherUrls];
    next.splice(index, 1);
    setOtherUrls(next);
    saveOtherUrls(next);
  };
  const handleOtherChange = (index: number, val: string) => {
    const next = [...otherUrls];
    next[index] = val;
    setOtherUrls(next);
  };
  const handleOtherBlur = () => saveOtherUrls(otherUrls);

  return (
    <section id="connections" className="max-w-4xl border border-zinc-800 rounded-lg bg-black overflow-hidden font-sans">
      <div className="p-6 md:p-8">
        <h2 className="text-xl font-semibold text-zinc-100">Coding Profiles</h2>
        <p className="text-sm text-zinc-400 mt-1">
          Connect your coding profiles. We use edge verification to validate accounts instantly.
        </p>
        
        {loading ? (
          <div className="mt-8 space-y-6 max-w-md">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-10 rounded-md bg-zinc-900 animate-pulse"></div>
            ))}
          </div>
        ) : (
          <div className="mt-8 space-y-6">
            {/* LeetCode */}
            <div className="max-w-md">
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-zinc-200">LeetCode</label>
                <div className="flex items-center gap-2">
                  {verifying.leetcode && <span className="text-xs text-zinc-500">verifying...</span>}
                  {saveStatus.leetcode === 'saving' && (
                    <Loader2 className="w-3.5 h-3.5 text-zinc-500 animate-spin" />
                  )}
                  {saveStatus.leetcode === 'saved' && (
                    <span className="text-emerald-500 animate-in zoom-in duration-200">
                      <Check className="w-4 h-4" strokeWidth={3} />
                    </span>
                  )}
                </div>
              </div>
              <input
                type="text"
                placeholder="leetcode.com/u/username or username"
                value={inputs.leetcode}
                onChange={(e) => handleInputChange('leetcode', e.target.value)}
                className={`w-full px-3 py-2 rounded-md bg-black border text-sm text-zinc-100 placeholder:text-zinc-600 transition-colors focus:outline-none focus:border-zinc-400 ${
                  errors.leetcode ? 'border-red-500/50 focus:border-red-500' : 'border-zinc-800'
                }`}
              />
              {errors.leetcode && (
                <p className="text-sm text-red-500 mt-1.5">{errors.leetcode}</p>
              )}
            </div>

            {/* GitHub */}
            <div className="max-w-md">
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-zinc-200">GitHub</label>
                <div className="flex items-center gap-2">
                  {verifying.github && <span className="text-xs text-zinc-500">verifying...</span>}
                  {saveStatus.github === 'saving' && (
                    <Loader2 className="w-3.5 h-3.5 text-zinc-500 animate-spin" />
                  )}
                  {saveStatus.github === 'saved' && (
                    <span className="text-emerald-500 animate-in zoom-in duration-200">
                      <Check className="w-4 h-4" strokeWidth={3} />
                    </span>
                  )}
                </div>
              </div>
              <input
                type="text"
                placeholder="github.com/username or username"
                value={inputs.github}
                onChange={(e) => handleInputChange('github', e.target.value)}
                className={`w-full px-3 py-2 rounded-md bg-black border text-sm text-zinc-100 placeholder:text-zinc-600 transition-colors focus:outline-none focus:border-zinc-400 ${
                  errors.github ? 'border-red-500/50 focus:border-red-500' : 'border-zinc-800'
                }`}
              />
              {errors.github && (
                <p className="text-sm text-red-500 mt-1.5">{errors.github}</p>
              )}
            </div>

            {/* Codeforces */}
            <div className="max-w-md">
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-zinc-200">Codeforces</label>
                <div className="flex items-center gap-2">
                  {verifying.codeforces && <span className="text-xs text-zinc-500">verifying...</span>}
                  {saveStatus.codeforces === 'saving' && (
                    <Loader2 className="w-3.5 h-3.5 text-zinc-500 animate-spin" />
                  )}
                  {saveStatus.codeforces === 'saved' && (
                    <span className="text-emerald-500 animate-in zoom-in duration-200">
                      <Check className="w-4 h-4" strokeWidth={3} />
                    </span>
                  )}
                </div>
              </div>
              <input
                type="text"
                placeholder="codeforces.com/profile/username or username"
                value={inputs.codeforces}
                onChange={(e) => handleInputChange('codeforces', e.target.value)}
                className={`w-full px-3 py-2 rounded-md bg-black border text-sm text-zinc-100 placeholder:text-zinc-600 transition-colors focus:outline-none focus:border-zinc-400 ${
                  errors.codeforces ? 'border-red-500/50 focus:border-red-500' : 'border-zinc-800'
                }`}
              />
              {errors.codeforces && (
                <p className="text-sm text-red-500 mt-1.5">{errors.codeforces}</p>
              )}
            </div>

            {/* Custom URLs */}
            <div className="pt-4 border-t border-zinc-800">
              <div className="flex items-center justify-between mb-4 max-w-md">
                <label className="text-sm font-medium text-zinc-200">Other Profiles</label>
                {savingOthers && <Loader2 className="w-3.5 h-3.5 text-zinc-500 animate-spin" />}
              </div>
              
              <div className="space-y-3 max-w-md">
                {otherUrls.map((url, i) => (
                  <div key={i} className="flex items-center gap-2 animate-in fade-in duration-200">
                    <input
                      type="url"
                      placeholder="https://example.com/profile"
                      value={url}
                      onChange={(e) => handleOtherChange(i, e.target.value)}
                      onBlur={handleOtherBlur}
                      className="w-full px-3 py-2 rounded-md bg-black border border-zinc-800 text-sm text-zinc-100 placeholder:text-zinc-600 transition-colors focus:outline-none focus:border-zinc-400"
                    />
                    <button 
                      onClick={() => handleRemoveOther(i)}
                      className="p-2 rounded-md text-zinc-500 hover:text-red-500 hover:bg-zinc-900 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              <button 
                onClick={handleAddOther}
                className="mt-4 flex items-center gap-2 text-xs font-medium text-zinc-400 hover:text-white transition-colors"
              >
                <Plus className="w-3.5 h-3.5" /> Add Profile Link
              </button>
            </div>

          </div>
        )}
      </div>
    </section>
  );
}
