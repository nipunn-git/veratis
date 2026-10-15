import React, { useState, useEffect } from 'react';
import { Activity, CheckCircle, ShieldCheck, Crosshair, Terminal } from 'lucide-react';
import TornadoLoader from '../common/TornadoLoader';

export default function AnalysisProgress({ onComplete, caseName = "UNKNOWN SPECIMEN" }) {
  const [progress, setProgress] = useState(0);
  const [currentStageIdx, setCurrentStageIdx] = useState(0);

  const stages = [
    { label: "INGESTION & HASHING", detail: "Calculating SHA-256 bitstream checksum & extracting sensor EXIF quant tables" },
    { label: "FOURIER 2D DECOMPOSITION", detail: "Isolating high-frequency noise & micro-tiling compression boundaries" },
    { label: "CORNEAL & OPTICAL RAY-TRACING", detail: "Simulating 3D specular vectors and shadow-angle azimuth coherence" },
    { label: "TEMPORAL & PROVENANCE AUDIT", detail: "Querying historical broadcast archives & satellite telemetry logs" },
    { label: "GROUND TRUTH RESOLUTION", detail: "Resolving latent manifolds and computing epistemic uncertainty bounds" }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            onComplete?.();
          }, 450);
          return 100;
        }

        const next = prev + 3;
        const stageIndex = Math.min(stages.length - 1, Math.floor((next / 100) * stages.length));
        setCurrentStageIdx(stageIndex);
        return next;
      });
    }, 60);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div className="p-6 sm:p-10 rounded-3xl bg-white/90 border border-zinc-200/90 shadow-2xl relative overflow-hidden font-sans">
      {/* Background Micro Calibration Grid */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-25" 
        style={{
          backgroundImage: 'radial-gradient(circle, #71717a 1px, transparent 1px)',
          backgroundSize: '24px 24px'
        }} 
      />

      {/* Top Header */}
      <div className="flex items-center justify-between pb-4 border-b border-zinc-200/80 mb-6 font-mono text-xs">
        <div className="flex items-center gap-2 text-zinc-900 font-semibold">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>MULTI-SPECTRAL FORENSIC PIPELINE ACTIVE</span>
        </div>
        <span className="text-zinc-500 font-medium">CASE: {caseName}</span>
      </div>

      {/* Centerpiece: Tornado Top-Down Cyclonic Loader */}
      <div className="py-2">
        <TornadoLoader
          progress={progress}
          stageLabel={`STAGE ${currentStageIdx + 1} OF 5: ${stages[currentStageIdx].label}`}
          stageDetail={stages[currentStageIdx].detail}
          subText="Executing cryptographic bitstream inspection & latent manifold inversion"
          size={240}
        />
      </div>

      {/* Stages Interactive Stepper Checklist */}
      <div className="grid grid-cols-1 sm:grid-cols-5 gap-2.5 font-mono text-[11px] pt-6 border-t border-zinc-200/80 mt-4">
        {stages.map((st, i) => {
          const isDone = i < currentStageIdx;
          const isCurrent = i === currentStageIdx;
          return (
            <div 
              key={i}
              className={`p-2.5 rounded-xl border transition-all flex items-center gap-2 ${
                isDone 
                  ? 'bg-emerald-50/70 border-emerald-200 text-emerald-800' 
                  : isCurrent 
                  ? 'bg-zinc-900 border-zinc-900 text-white shadow-xs' 
                  : 'bg-zinc-50 border-zinc-200/60 text-zinc-400'
              }`}
            >
              <span className={`w-2 h-2 rounded-full shrink-0 ${
                isDone 
                  ? 'bg-emerald-500' 
                  : isCurrent 
                  ? 'bg-emerald-400 animate-ping' 
                  : 'bg-zinc-300'
              }`} />
              <span className="truncate font-semibold">{st.label.split(' ')[0]}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
