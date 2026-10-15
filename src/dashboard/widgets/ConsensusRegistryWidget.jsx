import React from 'react';
import { ShieldCheck, Check, AlertTriangle, ShieldAlert } from 'lucide-react';

export default function ConsensusRegistryWidget({ currentCase }) {
  return (
    <div className="h-full flex flex-col justify-between font-sans">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between pb-3 border-b border-zinc-100 pr-16">
          <span className="text-sm font-semibold text-zinc-950">
            Consensus verification
          </span>
          <span className="text-sm font-medium text-zinc-500">
            3 nodes active
          </span>
        </div>

        {/* Big Stat */}
        <div className="mt-3">
          <div className="text-4xl font-bold text-zinc-950 tracking-tight">
            96.4%
          </div>
          <span className="text-sm text-zinc-500 font-medium">Truth registry cross-check</span>
        </div>

        {/* Checkpoints */}
        <div className="space-y-2 mt-4 text-sm text-zinc-700 font-medium">
          <div className="flex items-start gap-2">
            <Check className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
            <span className="leading-snug">SHA-256 cryptographic root confirmed</span>
          </div>
          <div className="flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
            <span className="leading-snug">Discrepancy with treaty codex A/78/304</span>
          </div>
          <div className="flex items-start gap-2">
            <ShieldAlert className="w-4 h-4 text-rose-500 mt-0.5 shrink-0" />
            <span className="leading-snug">Press podium seal corresponds to 2023 archive</span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="text-xs text-zinc-500 pt-3 border-t border-zinc-100 flex items-center justify-between">
        <span>EXIF Signatures: Stripped</span>
        <span className="text-rose-600 font-semibold">Synthetic Provenance</span>
      </div>
    </div>
  );
}
