import React from 'react';
import { ShieldCheck, Check, AlertTriangle, ShieldAlert } from 'lucide-react';

export default function ConsensusRegistryWidget({ currentCase }) {
  return (
    <div className="h-full flex flex-col justify-between font-sans">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between pb-3 border-b border-zinc-100 pr-16">
          <span className="text-xs font-medium text-zinc-400">
            Consensus verification
          </span>
          <span className="flex items-center gap-1.5 text-xs text-emerald-600 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            3 nodes active
          </span>
        </div>

        {/* Big Stat */}
        <div className="mt-3">
          <div className="text-3xl font-semibold text-zinc-900 tracking-tight">
            96.4%
          </div>
          <span className="text-xs text-zinc-500">Truth registry cross-check</span>
        </div>

        {/* Checkpoints */}
        <div className="space-y-2 mt-4 text-xs text-zinc-600">
          <div className="flex items-start gap-2">
            <Check className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
            <span className="leading-snug">SHA-256 cryptographic root confirmed</span>
          </div>
          <div className="flex items-start gap-2">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-500 mt-0.5 shrink-0" />
            <span className="leading-snug">Discrepancy with treaty codex A/78/304</span>
          </div>
          <div className="flex items-start gap-2">
            <ShieldAlert className="w-3.5 h-3.5 text-rose-500 mt-0.5 shrink-0" />
            <span className="leading-snug">Press podium seal corresponds to 2023 archive</span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="text-[11px] text-zinc-400 pt-3 border-t border-zinc-100 flex items-center justify-between">
        <span>Hardware EXIF: Absent</span>
        <span className="text-rose-600 font-medium">Non-authentic</span>
      </div>
    </div>
  );
}
