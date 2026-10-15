import React from 'react';
import { Scan, Eye, Activity } from 'lucide-react';

export default function SpectralArtifactsWidget({ currentCase }) {
  return (
    <div className="h-full flex flex-col justify-between font-sans">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between pb-3 border-b border-zinc-100 pr-16">
          <span className="text-sm font-semibold text-zinc-950">
            Spectral artifacts
          </span>
          <span className="text-sm font-semibold text-rose-600">
            Detected
          </span>
        </div>

        {/* Primary Metric */}
        <div className="mt-3">
          <div className="text-4xl font-bold text-zinc-950 tracking-tight">
            64px
          </div>
          <span className="text-sm text-zinc-500 font-medium">Neural face-swap blend boundary</span>
        </div>

        {/* Breakdown Items */}
        <div className="space-y-2 mt-4 text-sm">
          <div className="p-2.5 rounded-xl bg-zinc-50 border border-zinc-100">
            <span className="text-xs text-zinc-400 block font-medium">Fourier high-freq drop</span>
            <span className="font-semibold text-zinc-950 text-sm">-37% pixel variance</span>
          </div>
          <div className="p-2.5 rounded-xl bg-zinc-50 border border-zinc-100">
            <span className="text-xs text-zinc-400 block font-medium">Specular reflection</span>
            <span className="font-semibold text-zinc-950 text-sm">41° source divergence</span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="text-xs text-zinc-500 pt-3 border-t border-zinc-100 flex items-center justify-between">
        <span>Boundary: Inpainting Blend</span>
        <span className="text-emerald-700 font-semibold">Reconstructable</span>
      </div>
    </div>
  );
}
