import React from 'react';
import { Trophy } from 'lucide-react';
import AchievementCard, { CardType, CardLevel } from './AchievementCard';

const levelDescs: Record<CardLevel, string> = {
  bronze: 'The journey begins. 1 contest + 1 platform connected + 3-day streak.',
  silver: 'Not a one-day wonder. 7-day streak + 5 contests + 2 platforms.',
  gold: 'Genuine discipline. 30-day streak + 15 contests + 3 platforms + positive velocity.',
  platinum: 'Competitive performer. 60-day streak + 30 contests + top-10% finish + 3 platforms.',
  diamond: 'Top-tier + well-rounded. 100-day streak + Expert rating + 8/10 breadth + 4 platforms.',
  legendary: 'Exceptional. 365-day streak + mentoring 3 students + 10/10 breadth.'
};

const levels: CardLevel[] = ['bronze', 'silver', 'gold', 'platinum', 'diamond', 'legendary'];

interface AchievementSectionProps {
  currentLevel: CardLevel;
  setCurrentLevel: (level: CardLevel) => void;
  currentType: CardType;
  setCurrentType: (type: CardType) => void;
}

export default function AchievementSection({
  currentLevel,
  setCurrentLevel,
  currentType,
  setCurrentType
}: AchievementSectionProps) {
  
  const cycleCardLevel = () => {
    const idx = levels.indexOf(currentLevel);
    setCurrentLevel(levels[(idx + 1) % levels.length]);
  };

  return (
    <div className="mb-10">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-500 flex items-center gap-2">
          <Trophy className="w-3.5 h-3.5" /> Achievement Card
        </h2>
        <span className="text-[10px] text-zinc-600 mono">dsaquest.io/v/arjun-m</span>
      </div>

      {/* Card Type Tabs */}
      <div className="flex items-center gap-2 mb-5 flex-wrap">
        {[
          { id: 'transformation', label: 'Transformation' },
          { id: 'consistency', label: 'Consistency' },
          { id: 'crossplatform', label: 'Cross-Platform' },
          { id: 'skillmap', label: 'Skill Map' },
          { id: 'milestone', label: 'Milestone' }
        ].map(t => (
          <button 
            key={t.id}
            className={`type-tab px-3 py-1.5 rounded-lg text-[10px] font-semibold uppercase tracking-wider text-zinc-400 border border-transparent hover:text-white transition-all ${currentType === t.id ? 'active' : ''}`}
            onClick={() => setCurrentType(t.id as CardType)}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Featured Card */}
        <div className="lg:col-span-3">
          <AchievementCard level={currentLevel} type={currentType} onCycleLevel={cycleCardLevel} />
          <p className="text-[10px] text-zinc-600 mt-2 text-center">Click card to cycle through levels</p>
        </div>

        {/* Level Selector + Card Collection */}
        <div className="lg:col-span-2 space-y-4">
          {/* Level Dots */}
          <div className="glass rounded-2xl p-5">
            <div className="text-[9px] uppercase tracking-widest text-zinc-600 mb-3">Card Level</div>
            <div className="flex items-center justify-between mb-4">
              {[
                { l: 'bronze', emoji: '🟤', color: 'text-amber-600' },
                { l: 'silver', emoji: '🥈', color: 'text-gray-400' },
                { l: 'gold', emoji: '🥇', color: 'text-yellow-500' },
                { l: 'platinum', emoji: '💎', color: 'text-cyan-400' },
                { l: 'diamond', emoji: '💠', color: 'text-purple-400' },
                { l: 'legendary', emoji: '🏆', color: 'text-red-400' }
              ].map(lvl => (
                <div key={lvl.l} className={`level-dot flex flex-col items-center gap-1 ${currentLevel === lvl.l ? 'active' : ''}`} onClick={() => setCurrentLevel(lvl.l as CardLevel)}>
                  <div className={`w-10 h-10 hex hex-${lvl.l} flex items-center justify-center text-lg`}>{lvl.emoji}</div>
                  <span className={`text-[8px] font-bold uppercase tracking-wider ${lvl.color}`}>{lvl.l}</span>
                </div>
              ))}
            </div>
            <div className="text-[11px] text-zinc-500 leading-relaxed">
              {levelDescs[currentLevel]}
            </div>
          </div>

          {/* Unlock Progress */}
          <div className="glass rounded-2xl p-5">
            <div className="text-[9px] uppercase tracking-widest text-zinc-600 mb-3">Next Unlock: 💎 Platinum</div>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between mb-1"><span className="text-[10px] text-zinc-500">60-Day Streak</span><span className="text-[10px] mono text-zinc-400">23/60</span></div>
                <div className="w-full h-1 rounded-full bg-zinc-800"><div className="h-full rounded-full bg-orange-500" style={{ width: '38%' }}></div></div>
              </div>
              <div>
                <div className="flex justify-between mb-1"><span className="text-[10px] text-zinc-500">30 Contests</span><span className="text-[10px] mono text-emerald-400">18/30 ✓</span></div>
                <div className="w-full h-1 rounded-full bg-zinc-800"><div className="h-full rounded-full bg-emerald-500" style={{ width: '60%' }}></div></div>
              </div>
              <div>
                <div className="flex justify-between mb-1"><span className="text-[10px] text-zinc-500">Top 10% Finish</span><span className="text-[10px] mono text-zinc-600">—</span></div>
                <div className="w-full h-1 rounded-full bg-zinc-800"><div className="h-full rounded-full bg-zinc-700" style={{ width: '0%' }}></div></div>
              </div>
              <div>
                <div className="flex justify-between mb-1"><span className="text-[10px] text-zinc-500">3+ Platforms</span><span className="text-[10px] mono text-emerald-400">3/3 ✓</span></div>
                <div className="w-full h-1 rounded-full bg-zinc-800"><div className="h-full rounded-full bg-emerald-500" style={{ width: '100%' }}></div></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
