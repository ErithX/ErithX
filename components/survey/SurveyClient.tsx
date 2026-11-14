'use client';

import React, { useState } from 'react';
import { ArrowRight, ArrowLeft } from 'lucide-react';

export interface SurveyOption {
  id: number;
  label: string;
}

export interface SurveyQuestion {
  id: number;
  text: string;
  is_multi: boolean;
  options: SurveyOption[];
}

interface SurveyClientProps {
  questions: SurveyQuestion[];
  userId: string;
  userEmail?: string;
}

export default function SurveyClient({ questions, userId, userEmail }: SurveyClientProps) {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [answers, setAnswers] = useState<Record<number, number | number[]>>({});
  const [freetext, setFreetext] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  const [copiedLinkedIn, setCopiedLinkedIn] = useState<boolean>(false);

  const totalQuestions = questions.length;
  const isFinalStep = currentStep === totalQuestions;
  const currentQ = questions[currentStep];

  const optionLetters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];

  // Handle single-select selection with quick auto-advance
  const handleSingleSelect = (questionId: number, optionId: number) => {
    setAnswers(prev => ({ ...prev, [questionId]: optionId }));
    setTimeout(() => {
      if (currentStep < totalQuestions - 1) {
        setCurrentStep(prev => prev + 1);
      } else {
        setCurrentStep(totalQuestions);
      }
    }, 200);
  };

  // Handle multi-select selection (Max 2 for Q4)
  const handleMultiSelect = (questionId: number, optionId: number) => {
    const current = (answers[questionId] as number[]) || [];
    if (current.includes(optionId)) {
      setAnswers(prev => ({
        ...prev,
        [questionId]: current.filter(id => id !== optionId)
      }));
    } else {
      if (current.length >= 2) return;
      setAnswers(prev => ({
        ...prev,
        [questionId]: [...current, optionId]
      }));
    }
  };

  const canProceed = () => {
    if (!currentQ) return true;
    const ans = answers[currentQ.id];
    if (currentQ.is_multi) {
      return Array.isArray(ans) && ans.length > 0;
    }
    return ans !== undefined;
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      // Build human-readable response map for Formspree & email notifications
      const formattedResponses: Record<string, string> = {};
      questions.forEach((q, idx) => {
        const key = `Q${idx + 1}: ${q.text}`;
        const ans = answers[q.id];
        if (q.is_multi && Array.isArray(ans)) {
          const selected = q.options?.filter(o => ans.includes(o.id)).map(o => o.label) || [];
          formattedResponses[key] = selected.length > 0 ? selected.join(', ') : 'None selected';
        } else if (ans !== undefined) {
          const selected = q.options?.find(o => o.id === ans);
          formattedResponses[key] = selected ? selected.label : String(ans);
        } else {
          formattedResponses[key] = 'Skipped';
        }
      });

      const formspreeEndpoint = process.env.NEXT_PUBLIC_FORMSPREE_SURVEY_URL || 'https://formspree.io/f/mlgqojeq';

      await fetch(formspreeEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          _subject: `ErithX Feedback: ${userEmail || userId || 'Anonymous User'}`,
          ...(userEmail ? { email: userEmail, _replyto: userEmail } : {}),
          userId: userId || 'anonymous',
          submittedAt: new Date().toISOString(),
          ...formattedResponses,
          "If you were building ErithX, what would you change first?": freetext?.trim() || 'Skipped'
        })
      });
    } catch (err) {
      console.error('Failed to submit survey to Formspree:', err);
    } finally {
      setIsSubmitting(false);
      setIsCompleted(true);
    }
  };

  // Tracked share destinations & pre-written posts
  const SHARE_URL = "https://erithx.dev/?ref=share";

  const xShareText = "Just gave feedback on ErithX, a weekly AI review of your coding practice across LeetCode, Codeforces, and GitHub. Useful if you’re prepping for placements.";
  const xShareUrl = `https://x.com/intent/post?text=${encodeURIComponent(xShareText)}&url=${encodeURIComponent(SHARE_URL)}`;

  const linkedInPostText = `I’ve been using ErithX to review my weekly coding practice. It reads my LeetCode, Codeforces, and GitHub activity and shows what to work on next.

Its helping me to stay productive in week, so I just sent feedback.

If you’re preparing for placements, try it: ${SHARE_URL}`;

  const linkedInShareUrl = `https://www.linkedin.com/feed/?shareActive=true&text=${encodeURIComponent(linkedInPostText)}`;

  const handleLinkedInClick = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(linkedInPostText).then(() => {
        setCopiedLinkedIn(true);
        setTimeout(() => setCopiedLinkedIn(false), 3500);
      }).catch(() => {});
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafa] text-neutral-900 flex flex-col font-sans selection:bg-rose-100 selection:text-rose-900">
      {/* Top Navbar */}
      <header className="w-full border-b border-neutral-200/80 bg-white sticky top-0 z-30">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="h-6 w-6 sm:h-7 sm:w-7 rounded bg-neutral-900 text-white font-mono font-bold flex items-center justify-center text-xs sm:text-sm shadow-sm shrink-0">
              E
            </div>
            <div className="flex items-baseline gap-1.5 truncate">
              <span className="font-semibold text-sm sm:text-base tracking-tight text-neutral-900">
                ErithX
              </span>
              <span className="text-neutral-400 font-normal text-xs sm:text-sm truncate">
                / Survey
              </span>
            </div>
          </div>
        </div>

        {/* Top Progress Line - Home Page Red/Rose Gradient */}
        <div className="w-full bg-neutral-100 h-[2px]">
          <div 
            className="bg-gradient-to-r from-rose-500 to-red-600 h-[2px] transition-all duration-300 ease-out"
            style={{ width: `${Math.min(100, ((currentStep + 1) / (totalQuestions + 1)) * 100)}%` }}
          />
        </div>
      </header>

      {/* Main Content Area - Centered & Compact with Zero Scroll */}
      <main className="flex-1 flex flex-col justify-center items-center px-4 sm:px-6 py-4 sm:py-6">
        <div className="w-full max-w-2xl bg-white border border-neutral-200/90 rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.03)] p-5 sm:p-7 relative transition-all">
          
          {!isFinalStep ? (
            /* Question Card */
            <div>
              {/* Minimal Red Question Style [Same as Home Page] */}
              <div className="flex items-center justify-between mb-2.5">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                  <span className="text-[11px] font-mono font-semibold tracking-wider text-rose-500 uppercase">
                    QUESTION {String(currentQ.id).padStart(2, '0')}
                  </span>
                </div>

                {currentQ.is_multi && (
                  <span className="text-[11px] font-medium text-rose-600 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200/80">
                    Pick up to 2
                  </span>
                )}
              </div>

              <h2 className="text-lg sm:text-xl font-bold text-neutral-900 tracking-tight leading-snug mb-4">
                {currentQ.text}
              </h2>

              {/* Options Grid: 2 columns if > 4 options so zero scrolling is needed */}
              <div className={
                currentQ.options?.length > 4 
                  ? "grid grid-cols-1 sm:grid-cols-2 gap-2" 
                  : "space-y-2"
              }>
                {currentQ.options?.map((opt, idx) => {
                  const isSelected = currentQ.is_multi
                    ? ((answers[currentQ.id] as number[]) || []).includes(opt.id)
                    : answers[currentQ.id] === opt.id;

                  const multiCount = ((answers[currentQ.id] as number[]) || []).length;
                  const isMaxReached = currentQ.is_multi && multiCount >= 2 && !isSelected;

                  return (
                    <button
                      key={opt.id}
                      type="button"
                      disabled={isMaxReached}
                      onClick={() => {
                        if (currentQ.is_multi) {
                          handleMultiSelect(currentQ.id, opt.id);
                        } else {
                          handleSingleSelect(currentQ.id, opt.id);
                        }
                      }}
                      className={`w-full text-left py-2 px-3 sm:py-2.5 sm:px-3.5 rounded-xl border transition-all duration-150 flex items-center justify-between group cursor-pointer ${
                        isSelected
                          ? 'border-rose-500 bg-rose-50/50 shadow-xs'
                          : isMaxReached
                          ? 'border-neutral-200 bg-neutral-50/40 opacity-40 cursor-not-allowed'
                          : 'border-neutral-200 hover:border-neutral-400 hover:bg-neutral-50/60 bg-white'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 pr-2">
                        <span 
                          className={`w-5 h-5 rounded-md flex items-center justify-center font-mono text-[11px] font-semibold border shrink-0 ${
                            isSelected
                              ? 'bg-rose-500 text-white border-rose-500'
                              : 'bg-neutral-100 text-neutral-600 border-neutral-300 group-hover:border-neutral-400'
                          }`}
                        >
                          {optionLetters[idx] || (idx + 1)}
                        </span>
                        <span className={`text-xs sm:text-sm font-medium leading-snug ${isSelected ? 'text-rose-950 font-semibold' : 'text-neutral-800'}`}>
                          {opt.label}
                        </span>
                      </div>

                      {/* Clean Minimal Indicator (No generic cheesy SVG checkmarks) */}
                      <div className="pl-1 shrink-0">
                        {currentQ.is_multi ? (
                          <div 
                            className={`w-3.5 h-3.5 rounded border transition-colors flex items-center justify-center ${
                              isSelected
                                ? 'bg-rose-500 border-rose-500'
                                : 'border-neutral-300 bg-white'
                            }`}
                          >
                            {isSelected && <span className="w-1.5 h-1.5 rounded-xs bg-white block" />}
                          </div>
                        ) : (
                          <div 
                            className={`w-3.5 h-3.5 rounded-full border transition-colors flex items-center justify-center ${
                              isSelected
                                ? 'border-rose-500'
                                : 'border-neutral-300 bg-white'
                            }`}
                          >
                            {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-rose-500 block" />}
                          </div>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            /* Final Screen: Genuine Feedback & Community Sharing */
            <div>
              <div className="mb-2">
                <span className="text-[11px] font-mono font-semibold tracking-wider text-rose-500 uppercase">
                  FINAL THOUGHTS
                </span>
              </div>

              <h2 className="text-lg sm:text-xl font-bold text-neutral-900 tracking-tight leading-snug mb-1.5">
                If you were building ErithX, what would you change first?
              </h2>
              <p className="text-neutral-500 text-xs sm:text-sm leading-relaxed mb-4">
                Blunt is welcome. One line is enough, or skip.
              </p>

              {!isCompleted ? (
                <div className="space-y-3 mb-6">
                  <textarea
                    rows={3}
                    value={freetext}
                    onChange={(e) => setFreetext(e.target.value)}
                    placeholder="Weekly reviews feel too generic"
                    className="w-full p-3 text-xs sm:text-sm border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/80 focus:border-transparent transition-all resize-none placeholder:text-neutral-400"
                  />
                  <div className="flex items-center justify-end gap-2.5">
                    <button
                      type="button"
                      onClick={handleSubmit}
                      className="text-xs font-semibold text-neutral-500 hover:text-neutral-800 px-3 py-1.5 cursor-pointer"
                    >
                      Skip
                    </button>
                    <button
                      type="button"
                      disabled={isSubmitting}
                      onClick={handleSubmit}
                      className="px-4 py-2 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-xs sm:text-sm font-semibold transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50 shadow-xs"
                    >
                      {isSubmitting ? 'Sending...' : 'Send Feedback'}
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200/90 text-rose-900 text-xs sm:text-sm font-medium mb-6">
                  ✓ Thanks. We read every response.
                </div>
              )}

              {/* Share on X & LinkedIn (Opens directly in a new browser tab) */}
              <div className="pt-4 border-t border-neutral-200/80">
                <p className="text-xs font-semibold text-neutral-800 mb-1">
                  Share ErithX with your network
                </p>
                <p className="text-[11px] text-neutral-500 mb-3.5">
                  Help other students find distraction-free contest schedules and DSA habit tracking:
                </p>

                <div className="flex items-center gap-2.5">
                  {/* Share on X (Direct new browser tab) */}
                  <a
                    href={xShareUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 px-3 border border-neutral-200 hover:border-neutral-900 bg-white hover:bg-neutral-50 rounded-xl text-xs font-semibold text-neutral-900 transition-all cursor-pointer shadow-2xs"
                  >
                    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                    </svg>
                    <span>Share on X</span>
                  </a>

                  {/* Share on LinkedIn (Direct new browser tab with post text auto-copied) */}
                  <a
                    href={linkedInShareUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={handleLinkedInClick}
                    className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 px-3 border border-neutral-200 hover:border-[#0A66C2] bg-white hover:bg-neutral-50 rounded-xl text-xs font-semibold text-neutral-900 transition-all cursor-pointer shadow-2xs"
                  >
                    <svg className="w-3.5 h-3.5 fill-[#0A66C2]" viewBox="0 0 24 24">
                      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.21a1.64 1.64 0 1 0 0 3.28 1.64 1.64 0 0 0 0-3.28z"/>
                    </svg>
                    <span>Share on LinkedIn</span>
                  </a>
                </div>

                {copiedLinkedIn && (
                  <p className="text-center text-[11px] text-emerald-600 font-medium mt-2">
                    ✓ Post text filled and copied to clipboard!
                  </p>
                )}

                <p className="text-center text-[11px] text-neutral-400 italic mt-4">
                  Thanks. We read every response.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Navigation & Question Counter */}
        {!isFinalStep && (
          <div className="w-full max-w-2xl mt-3.5 flex items-center justify-between px-2">
            <button
              type="button"
              disabled={currentStep === 0}
              onClick={() => setCurrentStep(prev => Math.max(0, prev - 1))}
              className={`flex items-center gap-1.5 text-xs font-semibold py-1 px-3 rounded-lg border transition-all ${
                currentStep === 0
                  ? 'border-neutral-200 text-neutral-300 bg-transparent cursor-not-allowed'
                  : 'border-neutral-300 text-neutral-700 bg-white hover:bg-neutral-50 hover:border-neutral-400 cursor-pointer shadow-xs'
              }`}
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Previous</span>
            </button>

            {/* Requested "1 / 5" Counter at Bottom */}
            <div className="flex items-center gap-1 font-mono text-xs">
              <span className="font-bold text-rose-500 text-sm">
                {currentStep + 1}
              </span>
              <span className="text-neutral-400">/</span>
              <span className="text-neutral-400">
                {totalQuestions}
              </span>
            </div>

            <button
              type="button"
              disabled={!canProceed()}
              onClick={() => {
                if (currentStep < totalQuestions - 1) {
                  setCurrentStep(prev => prev + 1);
                } else {
                  setCurrentStep(totalQuestions);
                }
              }}
              className={`flex items-center gap-1.5 text-xs font-semibold py-1 px-3.5 rounded-lg border transition-all ${
                !canProceed()
                  ? 'border-neutral-200 text-neutral-400 bg-neutral-100 cursor-not-allowed'
                  : 'border-rose-500 text-white bg-rose-500 hover:bg-rose-600 cursor-pointer shadow-xs'
              }`}
            >
              <span>{currentStep === totalQuestions - 1 ? 'Finish' : 'Next'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
