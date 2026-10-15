import React from 'react';
import { Radar, ArrowUpRight } from 'lucide-react';

export default function SyntheticCoherenceWidget({ currentCase }) {
  const scores = currentCase?.radarScores || { visual: 94, contextual: 88, temporal: 92, source: 79, claim: 86 };
  
  const compositeScore = Math.round(
    (scores.visual + scores.contextual + scores.temporal + scores.source + scores.claim) / 5
  );

  const vectors = [
    { label: 'Visual', score: scores.visual },
    { label: 'Context', score: scores.contextual },
    { label: 'Temporal', score: scores.temporal },
    { label: 'Source', score: scores.source },
    { label: 'Claim', score: scores.claim },
  ];

  return (
    <div className="h-full flex flex-col justify-between font-sans">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between pb-3 border-b border-zinc-100 pr-16">
          <span className="text-xs font-medium text-zinc-400">
            Synthetic coherence
          </span>
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-rose-50 text-rose-700">
            Critical
          </span>
        </div>

        {/* Score Display */}
        <div className="flex items-baseline justify-between mt-3">
          <div>
            <div className="text-3xl font-semibold text-zinc-900 tracking-tight">
              {compositeScore}<span className="text-base font-normal text-zinc-400"> / 100</span>
            </div>
            <span className="text-xs text-zinc-500">Anomaly index</span>
          </div>
          <span className="text-xs text-zinc-400">5 orthogonal axes</span>
        </div>

        {/* Mini 5-Vector Meter Bars */}
        <div className="space-y-2 mt-4">
          {vectors.map((vec) => (
            <div key={vec.label} className="text-xs">
              <div className="flex justify-between text-zinc-600 mb-1">
                <span>{vec.label}</span>
                <span className="font-semibold text-zinc-900 tabular-nums">{vec.score}%</span>
              </div>
              <div className="w-full h-1 bg-zinc-100 rounded-full overflow-hidden">
                <div 
                  style={{ width: `${vec.score}%` }}
                  className="h-full bg-zinc-900 rounded-full"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="text-[11px] text-zinc-400 pt-3 border-t border-zinc-100 flex items-center justify-between">
        <span>Cross-modal divergence</span>
        <span className="text-zinc-700 font-medium">96% confidence</span>
      </div>
    </div>
  );
}
