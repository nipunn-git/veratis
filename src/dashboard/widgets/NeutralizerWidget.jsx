import React from 'react';
import { FileText, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';

export default function NeutralizerWidget({ onOpenNeutralizer }) {
  return (
    <div className="h-full flex flex-col justify-between font-sans">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-zinc-100 pr-16">
          <span className="text-sm font-semibold text-zinc-900 tracking-tight">
            Neutralizer
          </span>
          <span className="text-sm font-semibold text-emerald-700">
            Active
          </span>
        </div>

        {/* Content */}
        <div className="mt-3.5 space-y-1.5">
          <div className="text-xl sm:text-2xl font-semibold text-zinc-900 tracking-tight">
            Framing De-Escalation
          </div>
          <p className="text-sm text-zinc-600 leading-relaxed line-clamp-2">
            Transforms sensationalized headlines, viral messages, and unverified claims into epistemically honest language.
          </p>
        </div>

        {/* Metric Badges */}
        <div className="grid grid-cols-2 gap-2.5 mt-3.5 pt-1">
          <div className="p-2.5 rounded-xl bg-zinc-50 border border-zinc-100">
            <span className="text-xs text-zinc-500 font-semibold block uppercase">Signals</span>
            <span className="text-base font-bold text-zinc-800">7 Categories</span>
          </div>
          <div className="p-2.5 rounded-xl bg-zinc-50 border border-zinc-100">
            <span className="text-xs text-zinc-500 font-semibold block uppercase">Audit</span>
            <span className="text-base font-bold text-zinc-800">3-Layer Model</span>
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="pt-3 border-t border-zinc-100 flex items-center justify-between">
        <span className="text-xs text-zinc-400 flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Epistemic Humility</span>
        </span>
        <button
          onClick={onOpenNeutralizer}
          className="text-sm font-semibold text-zinc-900 hover:text-emerald-700 flex items-center gap-1 cursor-pointer transition-colors"
        >
          <span>Open Neutralizer</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
