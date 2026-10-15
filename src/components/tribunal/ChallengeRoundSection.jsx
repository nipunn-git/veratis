import React, { useState } from 'react';
import { Swords, ShieldAlert, Cpu, Scale, ArrowRight, Check } from 'lucide-react';

export default function ChallengeRoundSection({ challengeRound }) {
  const [activeStep, setActiveStep] = useState('both'); // 'skeptic' | 'forensic' | 'both'

  if (!challengeRound) return null;

  return (
    <div className="rounded-3xl bg-white border border-zinc-200/90 shadow-sm overflow-hidden font-sans">
      {/* Header */}
      <div className="p-5 sm:p-6 bg-gradient-to-r from-zinc-900 via-zinc-950 to-zinc-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-white/10 text-rose-400 shrink-0 border border-white/10">
            <Swords className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-semibold tracking-wider text-rose-400 uppercase">
                STAGE 02 // CROSS-EXAMINATION
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/15 text-zinc-300 font-mono">
                INTER-AGENT CHALLENGE
              </span>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight mt-0.5">
              The Challenge Round
            </h3>
          </div>
        </div>

        <p className="text-xs text-zinc-400 max-w-md sm:text-right">
          The Skeptic aggressively interrogates the Forensic Analyst's assertions to eliminate confirmation bias.
        </p>
      </div>

      {/* Cross-Examination Exchange */}
      <div className="p-6 sm:p-8 space-y-6 bg-zinc-50/50">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
          {/* Box 1: The Skeptic's Interrogation */}
          <div className="p-6 rounded-2xl bg-white border border-rose-200/80 shadow-xs flex flex-col justify-between space-y-4 relative">
            <div className="flex items-center gap-2.5 pb-3 border-b border-rose-100">
              <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0" />
              <span className="text-xs font-mono font-bold text-rose-900 tracking-wider uppercase">
                THE SKEPTIC'S CHALLENGE ASSERTION
              </span>
            </div>
            <p className="text-sm sm:text-base text-zinc-800 leading-relaxed font-sans italic">
              "{challengeRound.skepticAssertion}"
            </p>
            <div className="text-[11px] font-mono text-zinc-400 pt-2 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
              <span>Target: Ruling out benign codec compression / non-malicious artifacts</span>
            </div>
          </div>

          {/* Box 2: The Forensic Analyst's Evidentiary Response */}
          <div className="p-6 rounded-2xl bg-white border border-sky-200/80 shadow-xs flex flex-col justify-between space-y-4 relative">
            <div className="flex items-center gap-2.5 pb-3 border-b border-sky-100">
              <Cpu className="w-4 h-4 text-sky-600 shrink-0" />
              <span className="text-xs font-mono font-bold text-sky-900 tracking-wider uppercase">
                FORENSIC ANALYST'S EVIDENTIARY REBUTTAL
              </span>
            </div>
            <p className="text-sm sm:text-base text-zinc-800 leading-relaxed font-sans">
              "{challengeRound.forensicResponse}"
            </p>
            <div className="text-[11px] font-mono text-zinc-400 pt-2 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-sky-500" />
              <span>Method: Localized DCT quantization & mathematical frequency variance</span>
            </div>
          </div>
        </div>

        {/* Adjudicator's Ruling Note */}
        {challengeRound.adjudicatorNote && (
          <div className="p-4 sm:p-5 rounded-2xl bg-emerald-50/70 border border-emerald-200/70 text-emerald-950 flex items-start gap-3.5">
            <div className="p-1.5 rounded-xl bg-emerald-100 text-emerald-800 shrink-0 mt-0.5">
              <Scale className="w-4 h-4" />
            </div>
            <div className="space-y-1">
              <span className="text-xs font-mono font-bold tracking-wider text-emerald-900 uppercase block">
                ADJUDICATOR INTERIM RULING
              </span>
              <p className="text-xs sm:text-sm text-emerald-900/90 leading-relaxed font-sans">
                {challengeRound.adjudicatorNote}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
