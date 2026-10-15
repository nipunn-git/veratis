import React from 'react';
import { CheckCircle2, AlertOctagon, HelpCircle, GitFork } from 'lucide-react';

export default function DisagreementMatrix({ matrix }) {
  if (!matrix) return null;

  return (
    <div className="rounded-3xl bg-white border border-zinc-200/90 shadow-sm overflow-hidden font-sans">
      {/* Header */}
      <div className="p-5 sm:p-6 bg-zinc-50/80 border-b border-zinc-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-zinc-200/70 text-zinc-900 shrink-0">
            <GitFork className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-mono font-semibold tracking-wider text-zinc-500 uppercase">
              STAGE 03 // COMPARE FINDINGS
            </span>
            <h3 className="text-lg sm:text-xl font-bold text-zinc-900 tracking-tight mt-0.5">
              Agreement & Disagreement Points
            </h3>
          </div>
        </div>
        <p className="text-xs text-zinc-500 max-w-sm sm:text-right">
          A clear side-by-side view showing where the AI experts agree, where they differ, and what is still unconfirmed.
        </p>
      </div>

      {/* 3-Column Matrix */}
      <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-3 gap-6 items-start divide-y md:divide-y-0 md:divide-x divide-zinc-100">
        {/* Column 1: Core Consensus */}
        <div className="space-y-4 pt-4 md:pt-0">
          <div className="flex items-center gap-2 pb-2 border-b border-zinc-100">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <h4 className="text-xs font-mono font-bold text-zinc-900 uppercase tracking-wider">
              What They Agree On ({matrix.agreements?.length || 0})
            </h4>
          </div>
          <ul className="space-y-2 text-xs sm:text-sm text-zinc-600">
            {matrix.agreements?.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2.5 leading-relaxed p-2.5 rounded-xl bg-emerald-50/40 border border-emerald-100/50">
                <span className="text-emerald-600 font-bold mt-0.5">•</span>
                <span className="text-zinc-800">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Column 2: Conflicting Interpretations */}
        <div className="space-y-4 pt-4 md:pt-0 md:pl-6">
          <div className="flex items-center gap-2 pb-2 border-b border-zinc-100">
            <AlertOctagon className="w-4 h-4 text-amber-600 shrink-0" />
            <h4 className="text-xs font-mono font-bold text-zinc-900 uppercase tracking-wider">
              Where They Disagree ({matrix.disagreements?.length || 0})
            </h4>
          </div>
          <ul className="space-y-2 text-xs sm:text-sm text-zinc-600">
            {matrix.disagreements?.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2.5 leading-relaxed p-2.5 rounded-xl bg-amber-50/40 border border-amber-100/50">
                <span className="text-amber-600 font-bold mt-0.5">•</span>
                <span className="text-zinc-800">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Column 3: Unresolved Questions */}
        <div className="space-y-4 pt-4 md:pt-0 md:pl-6">
          <div className="flex items-center gap-2 pb-2 border-b border-zinc-100">
            <HelpCircle className="w-4 h-4 text-purple-600 shrink-0" />
            <h4 className="text-xs font-mono font-bold text-zinc-900 uppercase tracking-wider">
              Still Unknown ({matrix.unresolvedQuestions?.length || 0})
            </h4>
          </div>
          <ul className="space-y-2 text-xs sm:text-sm text-zinc-600">
            {matrix.unresolvedQuestions?.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2.5 leading-relaxed p-2.5 rounded-xl bg-purple-50/40 border border-purple-100/50">
                <span className="text-purple-600 font-bold mt-0.5">•</span>
                <span className="text-zinc-800">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
