import React from 'react';
import { Share2, Download, ArrowRight, CheckCircle } from 'lucide-react';

export type CardLevel = 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond' | 'legendary';
export type CardType = 'transformation' | 'consistency' | 'crossplatform' | 'skillmap' | 'milestone';

interface AchievementCardProps {
  level: CardLevel;
  type: CardType;
  onCycleLevel?: () => void;
}

const levelNames: Record<CardLevel, string> = {
  bronze: 'Bronze — Initiate',
  silver: 'Silver — Consistent',
  gold: 'Gold — Committed',
  platinum: 'Platinum — Warrior',
  diamond: 'Diamond — Elite',
  legendary: 'Legendary — Master'
};

const cardConfigs: Record<CardLevel, any> = {
  bronze:  {emoji:'🟤',accent:'#cd7f32',rating:'847',streak:'3',contests:'1',delta:'+120',pct:'Top 68%',cls:'card-bronze'},
  silver:  {emoji:'🥈',accent:'#c0c0c0',rating:'1,203',streak:'12',contests:'8',delta:'+310',pct:'Top 42%',cls:'card-silver'},
  gold:    {emoji:'🥇',accent:'#ffd700',rating:'1,743',streak:'23',contests:'18',delta:'+340',pct:'Top 12%',cls:'card-gold'},
  platinum:{emoji:'💎',accent:'#00ced1',rating:'2,104',streak:'67',contests:'34',delta:'+580',pct:'Top 5%',cls:'card-platinum'},
  diamond: {emoji:'💠',accent:'#a855f7',rating:'2,489',streak:'112',contests:'58',delta:'+940',pct:'Top 2%',cls:'card-diamond'},
  legendary:{emoji:'🏆',accent:'#ef4444',rating:'3,102',streak:'389',contests:'94',delta:'+1,847',pct:'Top 0.3%',cls:'card-legendary'}
};

export default function AchievementCard({ level, type, onCycleLevel }: AchievementCardProps) {
  const c = cardConfigs[level];
  const levelTitle = levelNames[level].split('—')[0].trim();
  const levelSubtitle = levelNames[level].split('—')[1]?.trim() || '';

  const renderContent = () => {
    switch (type) {
      case 'transformation':
        return (
          <>
            <div className="text-[10px] uppercase tracking-widest text-zinc-500 mb-3">6-Month Transformation</div>
            <div className="flex items-center justify-between mb-5">
              <div className="text-center">
                <div className="text-2xl font-bold mono" style={{ color: c.accent }}>{level === 'bronze' ? '—' : level === 'silver' ? '847' : '847'}</div>
                <div className="text-[9px] text-zinc-500">Start</div>
              </div>
              <div className="flex-1 mx-4 flex items-center relative">
                <div className="w-full h-px bg-white/10 relative">
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 px-2 py-0.5 rounded text-[9px] font-bold" style={{ background: `${c.accent}20`, color: c.accent }}>{c.delta}</div>
                </div>
                <ArrowRight className="w-4 h-4 flex-shrink-0 absolute right-0 -translate-y-1/2 top-1/2" style={{ color: c.accent }} />
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold mono" style={{ color: c.accent }}>{c.rating}</div>
                <div className="text-[9px] text-zinc-500">Current</div>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div className="text-center p-2.5 rounded-lg bg-black/20 border border-white/5">
                <div className="text-sm font-bold mono" style={{ color: c.accent }}>{c.streak}d</div>
                <div className="text-[8px] uppercase tracking-wider text-zinc-500">Streak</div>
              </div>
              <div className="text-center p-2.5 rounded-lg bg-black/20 border border-white/5">
                <div className="text-sm font-bold mono" style={{ color: c.accent }}>{c.contests}</div>
                <div className="text-[8px] uppercase tracking-wider text-zinc-500">Contests</div>
              </div>
              <div className="text-center p-2.5 rounded-lg bg-black/20 border border-white/5">
                <div className="text-sm font-bold mono" style={{ color: c.accent }}>{c.pct}</div>
                <div className="text-[8px] uppercase tracking-wider text-zinc-500">Velocity</div>
              </div>
            </div>
          </>
        );
      case 'consistency':
        return (
          <>
            <div className="text-[10px] uppercase tracking-widest text-zinc-500 mb-4">Reliability Verified</div>
            <div className="flex items-center justify-center mb-5">
              <div className="relative w-28 h-28">
                <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                  <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="6"/>
                  <circle cx="50" cy="50" r="42" fill="none" stroke={c.accent} strokeWidth="6" strokeLinecap="round" strokeDasharray={`${0.82 * 264} 264`} opacity="0.8"/>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-xl font-bold mono" style={{ color: c.accent }}>82%</div>
                    <div className="text-[7px] uppercase tracking-wider text-zinc-500">Attendance</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="text-center p-2.5 rounded-lg bg-black/20 border border-white/5">
                <div className="text-sm font-bold mono" style={{ color: c.accent }}>18/22</div>
                <div className="text-[8px] uppercase tracking-wider text-zinc-500">Contests</div>
              </div>
              <div className="text-center p-2.5 rounded-lg bg-black/20 border border-white/5">
                <div className="text-sm font-bold mono" style={{ color: c.accent }}>{c.streak}d</div>
                <div className="text-[8px] uppercase tracking-wider text-zinc-500">Streak</div>
              </div>
            </div>
            <div className="mt-3 text-[10px] text-zinc-500 text-center">Never missed a weekend contest in 3 months</div>
          </>
        );
      case 'crossplatform':
        return (
          <>
            <div className="text-[10px] uppercase tracking-widest text-zinc-500 mb-4">Multi-Platform Profile</div>
            <div className="space-y-3 mb-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2"><span className="text-sm">🟠</span><span className="text-xs text-zinc-300">LeetCode</span></div>
                <div className="flex items-center gap-2"><div className="w-24 h-1.5 rounded-full bg-zinc-800"><div className="h-full rounded-full bg-orange-400" style={{ width: '74%' }}></div></div><span className="text-[10px] mono text-zinc-400 w-12 text-right">1,847</span></div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2"><span className="text-sm">🔴</span><span className="text-xs text-zinc-300">Codeforces</span></div>
                <div className="flex items-center gap-2"><div className="w-24 h-1.5 rounded-full bg-zinc-800"><div className="h-full rounded-full bg-red-400" style={{ width: '62%' }}></div></div><span className="text-[10px] mono text-zinc-400 w-12 text-right">1,560</span></div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2"><span className="text-sm">🟢</span><span className="text-xs text-zinc-300">CodeChef</span></div>
                <div className="flex items-center gap-2"><div className="w-24 h-1.5 rounded-full bg-zinc-800"><div className="h-full rounded-full bg-green-400" style={{ width: '73%' }}></div></div><span className="text-[10px] mono text-zinc-400 w-12 text-right">1,823</span></div>
              </div>
            </div>
            <div className="text-center p-3 rounded-lg bg-black/20 border border-white/5">
              <div className="text-[9px] uppercase tracking-widest text-zinc-500 mb-1">Composite Score</div>
              <div className="text-2xl font-bold mono" style={{ color: c.accent }}>{c.rating}</div>
              <div className="text-[10px] text-zinc-500">{c.pct} on DSA Quest</div>
            </div>
          </>
        );
      case 'skillmap':
        return (
          <>
            <div className="text-[10px] uppercase tracking-widest text-zinc-500 mb-4">Skill Profile Verified</div>
            <div className="flex items-end justify-between gap-1.5 h-32 mb-3">
              {[
                { label: 'DP', h: '90%', c: 'bg-emerald-500/80' },
                { label: 'Str', h: '78%', c: 'bg-emerald-500/60' },
                { label: 'Tree', h: '75%', c: 'bg-emerald-500/50' },
                { label: 'Grph', h: '65%', c: 'bg-yellow-500/50' },
                { label: 'Grdy', h: '50%', c: 'bg-yellow-500/40' },
                { label: 'Math', h: '35%', c: 'bg-red-500/40' },
                { label: 'BSrch', h: '82%', c: 'bg-emerald-500/70' },
                { label: 'Stack', h: '45%', c: 'bg-yellow-500/40' },
              ].map(s => (
                <div key={s.label} className="flex-1 flex flex-col items-center gap-1">
                  <div className={`w-full rounded-t ${s.c} prog-animated`} style={{ height: s.h }}></div>
                  <span className="text-[7px] text-zinc-500">{s.label}</span>
                </div>
              ))}
            </div>
            <div className="text-center p-2.5 rounded-lg bg-black/20 border border-white/5">
              <div className="text-sm font-bold" style={{ color: c.accent }}>8/10 categories covered</div>
              <div className="text-[9px] text-zinc-500">Well-rounded problem solver</div>
            </div>
          </>
        );
      case 'milestone':
        return (
          <>
            <div className="text-center my-2">
              <div className="text-4xl mb-2">{c.emoji}</div>
              <div className="text-[10px] uppercase tracking-[0.15em] font-bold" style={{ color: `${c.accent}50` }}>Milestone Unlocked</div>
              <div className="text-xl font-bold mt-1" style={{ color: c.accent }}>Top 10% Finish</div>
              <div className="text-xs text-zinc-400 mt-1">CodeChef Starters 244</div>
            </div>
            <div className="grid grid-cols-2 gap-2 my-4">
              <div className="text-center p-2.5 rounded-lg bg-black/20 border border-white/5">
                <div className="text-sm font-bold mono" style={{ color: c.accent }}>412</div>
                <div className="text-[8px] uppercase tracking-wider text-zinc-500">Rank</div>
              </div>
              <div className="text-center p-2.5 rounded-lg bg-black/20 border border-white/5">
                <div className="text-sm font-bold mono" style={{ color: c.accent }}>23,100</div>
                <div className="text-[8px] uppercase tracking-wider text-zinc-500">Participants</div>
              </div>
            </div>
            <div className="text-center p-2.5 rounded-lg bg-black/20 border border-white/5">
              <div className="text-sm font-bold" style={{ color: c.accent }}>Top 1.8%</div>
              <div className="text-[9px] text-zinc-500">After {c.contests} contests of grinding</div>
            </div>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className={`ach-card ${c.cls} p-6 relative`} onClick={onCycleLevel}>
      <div className="card-glow absolute inset-0 pointer-events-none"></div>
      <div className="card-shine"></div>
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 hex hex-${level} flex items-center justify-center`}>
              <span className="text-xl">{c.emoji}</span>
            </div>
            <div>
              <div className="text-[9px] uppercase tracking-[0.2em] font-bold card-accent-dim">{levelTitle}</div>
              <div className="text-lg font-bold card-accent">{levelSubtitle}</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={(e) => { e.stopPropagation(); alert('Shared'); }} className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors" title="Share">
              <Share2 className="w-3.5 h-3.5 card-accent" style={{ color: c.accent }} />
            </button>
            <button onClick={(e) => { e.stopPropagation(); alert('Downloaded'); }} className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors" title="Download">
              <Download className="w-3.5 h-3.5 card-accent" style={{ color: c.accent }} />
            </button>
          </div>
        </div>
        
        {renderContent()}

        <div className="flex items-center justify-between pt-4 border-t border-white/5 mt-5">
          <div className="flex items-center gap-1.5">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-[9px] text-zinc-500">Verified by DSA Quest</span>
          </div>
          <span className="text-[9px] mono text-zinc-600">dsaquest.io/v/arjun-m</span>
        </div>
      </div>
    </div>
  );
}
