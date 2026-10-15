import React from 'react';
import { Activity, ArrowRight, Share2, ShieldCheck } from 'lucide-react';

export default function RumorReactorWidget({ onOpenReactor }) {
  return (
    <div className="h-full flex flex-col justify-between font-sans">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-zinc-100 pr-16">
          <span className="text-sm font-semibold text-zinc-900 tracking-tight">
            Rumor Reactor
          </span>
          <span className="text-sm font-semibold text-purple-700">
            Simulator
          </span>
        </div>

        {/* Content */}
        <div className="mt-3.5 space-y-1.5">
          <div className="text-xl sm:text-2xl font-semibold text-zinc-900 tracking-tight">
            Information Propagation
          </div>
          <p className="text-sm text-zinc-600 leading-relaxed line-clamp-2">
            Simulate how a factual claim changes as it cascades through a network of fictional accounts, and test live interventions.
          </p>
        </div>

        {/* Metric Badges */}
        <div className="grid grid-cols-2 gap-2.5 mt-3.5 pt-1">
          <div className="p-2.5 rounded-xl bg-zinc-50 border border-zinc-100">
            <span className="text-xs text-zinc-500 font-semibold block uppercase">Topology</span>
            <span className="text-base font-bold text-zinc-800">16 Accounts</span>
          </div>
          <div className="p-2.5 rounded-xl bg-zinc-50 border border-zinc-100">
            <span className="text-xs text-zinc-500 font-semibold block uppercase">Lab</span>
            <span className="text-base font-bold text-zinc-800">5 Interventions</span>
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="pt-3 border-t border-zinc-100 flex items-center justify-between">
        <span className="text-xs text-zinc-400 flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-purple-600" />
          <span>Pedagogical Model</span>
        </span>
        <button
          onClick={onOpenReactor}
          className="text-sm font-semibold text-zinc-900 hover:text-purple-700 flex items-center gap-1 cursor-pointer transition-colors"
        >
          <span>Open Reactor</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
