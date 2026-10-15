import React from 'react';
import { Scan, Eye, Activity } from 'lucide-react';

export default function SpectralArtifactsWidget({ currentCase }) {
  return (
    <div className="h-full flex flex-col justify-between font-sans">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between pb-3 border-b border-zinc-100 pr-16">
          <span className="text-xs font-medium text-zinc-400">
            Spectral artifacts
          </span>
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-rose-50 text-rose-700">
            Detected
          </span>
        </div>

        {/* Primary Metric */}
        <div className="mt-3">
          <div className="text-3xl font-semibold text-zinc-900 tracking-tight">
            64px
          </div>
          <span className="text-xs text-zinc-500">Neural face-swap blend boundary</span>
        </div>

        {/* Breakdown Items */}
        <div className="space-y-2 mt-4 text-xs">
          <div className="p-2 rounded-xl bg-zinc-50 border border-zinc-100">
            <span className="text-[11px] text-zinc-400 block">Fourier high-freq drop</span>
            <span className="font-semibold text-zinc-900">-37% pixel variance</span>
          </div>
          <div className="p-2 rounded-xl bg-zinc-50 border border-zinc-100">
            <span className="text-[11px] text-zinc-400 block">Specular reflection</span>
            <span className="font-semibold text-zinc-900">41° source divergence</span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="text-[11px] text-zinc-500 pt-3 border-t border-zinc-100 flex items-center justify-between">
        <span>Boundary Type: Inpainting Blend</span>
        <span className="text-emerald-700 font-medium">Reconstructable</span>
      </div>
    </div>
  );
}
