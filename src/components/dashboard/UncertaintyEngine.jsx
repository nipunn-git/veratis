import React from 'react';
import { HelpCircle, CheckCircle2, AlertTriangle, ShieldAlert } from 'lucide-react';

export default function UncertaintyEngine({ uncertainty }) {
  return (
    <div className="p-6 md:p-8 rounded-3xl bg-[#0c130f] border border-[#1f2d26] shadow-xl">
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#1f2d26] mb-6">
        <div className="flex items-center gap-2 text-xs font-mono text-[#c8f344] uppercase tracking-wider">
          <HelpCircle className="w-4 h-4" />
          <span>UNCERTAINTY ENGINE // EPISTEMIC BOUNDARY MATRIX</span>
        </div>
        <span className="text-xs font-mono text-emerald-400">
          PROBABILISTIC HUMILITY ACTIVE
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Known Pillar */}
        <div className="p-6 rounded-2xl bg-[#080d0a] border border-emerald-500/30 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 font-bold mb-4">
              <CheckCircle2 className="w-4 h-4" />
              <span>WHAT IS KNOWN</span>
            </div>
            <ul className="space-y-3 text-xs font-mono text-[#a4b3a6]">
              {uncertainty.known.map((k, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-emerald-400">✓</span>
                  <span>{k}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="mt-6 pt-3 border-t border-[#18241e] text-[10px] font-mono text-[#526356]">
            Falsifiable & mathematically verified
          </div>
        </div>

        {/* Unknown Pillar */}
        <div className="p-6 rounded-2xl bg-[#080d0a] border border-amber-500/30 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-amber-400 font-bold mb-4">
              <AlertTriangle className="w-4 h-4" />
              <span>WHAT IS UNKNOWN</span>
            </div>
            <ul className="space-y-3 text-xs font-mono text-[#a4b3a6]">
              {uncertainty.unknown.map((u, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-amber-400">?</span>
                  <span>{u}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="mt-6 pt-3 border-t border-[#18241e] text-[10px] font-mono text-[#526356]">
            Requires additional telemetry or sensor access
          </div>
        </div>

        {/* Untestable Pillar */}
        <div className="p-6 rounded-2xl bg-[#080d0a] border border-purple-500/30 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-purple-400 font-bold mb-4">
              <HelpCircle className="w-4 h-4" />
              <span>WHAT IS UNTESTABLE</span>
            </div>
            <ul className="space-y-3 text-xs font-mono text-[#a4b3a6]">
              {uncertainty.untestable.map((t, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-purple-400">∅</span>
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="mt-6 pt-3 border-t border-[#18241e] text-[10px] font-mono text-[#526356]">
            Beyond the scope of optical / acoustic physics
          </div>
        </div>
      </div>
    </div>
  );
}
