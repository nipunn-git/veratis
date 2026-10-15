import React from 'react';
import { CheckCircle2 } from 'lucide-react';

export default function EvalScoreWidget() {
  return (
    <div className="h-full flex flex-col justify-between">
      {/* Top Header */}
      <div>
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-mono tracking-wider text-zinc-500 uppercase font-semibold">
            EVAL SCORE
          </span>
          <div className="flex items-center gap-1 font-mono text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded shadow-xs">
            <span>↑ 0.03</span>
          </div>
        </div>

        <div className="flex items-baseline gap-2 mt-1">
          <span className="text-3xl sm:text-4xl font-mono font-bold text-zinc-900 tracking-tight">
            0.91
          </span>
          <span className="text-xs font-mono text-zinc-500">/ 1.00</span>
        </div>
      </div>

      {/* Evaluation Gauges */}
      <div className="mt-6 space-y-2.5">
        <div className="space-y-1">
          <div className="flex justify-between text-[10px] font-mono">
            <span className="text-zinc-600 font-medium">Precision (ROC-AUC)</span>
            <span className="text-zinc-900 font-bold">96.4%</span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-zinc-100 border border-zinc-200/80 overflow-hidden">
            <div className="w-[96.4%] h-full bg-zinc-900 rounded-full" />
          </div>
        </div>

        <div className="space-y-1">
          <div className="flex justify-between text-[10px] font-mono">
            <span className="text-zinc-600 font-medium">Recall (Synthetic Catch)</span>
            <span className="text-zinc-900 font-bold">93.8%</span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-zinc-100 border border-zinc-200/80 overflow-hidden">
            <div className="w-[93.8%] h-full bg-zinc-600 rounded-full" />
          </div>
        </div>

        <div className="flex justify-between items-center text-[10px] font-mono text-zinc-500 pt-1 font-medium">
          <span>Benchmark: v4.2 Enclave</span>
          <span className="text-emerald-700 font-semibold flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Optimal
          </span>
        </div>
      </div>
    </div>
  );
}
