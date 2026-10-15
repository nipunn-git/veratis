import React from 'react';
import { GitBranch, Clock, AlertTriangle, ArrowRight } from 'lucide-react';

export default function PropagationTrailWidget({ currentCase }) {
  const steps = [
    {
      time: '14:00 CET',
      platform: 'Telegram Relay Node',
      label: 'Initial drop from unverified account',
      anomaly: true,
    },
    {
      time: '14:03 CET',
      platform: 'Coordinated Relays',
      label: 'Rapid network amplification (2.4k shares)',
      anomaly: false,
    },
    {
      time: '14:15 CET',
      platform: 'Secondary Media',
      label: 'Picked up without provenance verification',
      anomaly: false,
    },
  ];

  return (
    <div className="h-full flex flex-col justify-between font-sans">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-zinc-400">
              Propagation velocity & provenance
            </span>
          </div>
          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700">
            Anomalous timeline
          </span>
        </div>

        {/* Speed Stat & Contradiction Highlight */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 my-3 items-center">
          <div className="sm:col-span-4">
            <div className="text-3xl font-semibold text-zinc-900 tracking-tight">
              +0.038s
            </div>
            <span className="text-xs text-zinc-500">Relay propagation latency</span>
          </div>

          <div className="sm:col-span-8 p-3 rounded-xl bg-rose-50/70 border border-rose-100 text-xs text-rose-900 leading-relaxed">
            <span className="font-semibold block text-rose-950 mb-0.5">Physical impossibility verified:</span>
            Flight transponder records show Ambassador Vance was airborne over Zurich at the claimed timestamp.
          </div>
        </div>

        {/* 3-Step Horizontal Timeline Track */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          {steps.map((step, idx) => (
            <div key={idx} className="p-3 rounded-xl bg-zinc-50/80 border border-zinc-100 text-xs space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-zinc-900">{step.time}</span>
                {step.anomaly && (
                  <span className="text-[10px] text-rose-600 font-semibold px-1.5 py-0.2 rounded bg-rose-50 border border-rose-200">
                    Origin
                  </span>
                )}
              </div>
              <div className="font-medium text-zinc-700">{step.platform}</div>
              <div className="text-zinc-500 text-[11px] leading-snug">{step.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="text-[11px] text-zinc-400 pt-3 border-t border-zinc-100 flex items-center justify-between">
        <span>Earliest trace: Telegram anonymous relay</span>
        <span className="text-zinc-700 font-medium">Chain verified</span>
      </div>
    </div>
  );
}
