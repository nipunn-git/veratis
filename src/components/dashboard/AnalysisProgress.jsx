import React, { useState, useEffect } from 'react';
import { Activity, CheckCircle, ShieldCheck, Crosshair, Terminal } from 'lucide-react';

export default function AnalysisProgress({ onComplete, caseName = "UNKNOWN SPECIMEN" }) {
  const [progress, setProgress] = useState(0);
  const [currentStageIdx, setCurrentStageIdx] = useState(0);

  const stages = [
    { label: "INGESTION & HASHING", detail: "Calculating SHA-256 bitstream checksum & extracting EXIF quant tables" },
    { label: "FOURIER 2D DECOMPOSITION", detail: "Isolating high-frequency noise & micro-tiling compression boundaries" },
    { label: "CORNEAL & OPTICAL RAY-TRACING", detail: "Simulating 3D light vectors and shadow-angle azimuth coherence" },
    { label: "TEMPORAL & TRANSIT CROSS-CHECK", detail: "Querying ADS-B satellite logs and historical broadcast archives" },
    { label: "GRAVITY WEIGHING & EPISTEMIC RESOLUTION", detail: "Resolving competing hypotheses and computing uncertainty bounds" }
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
    }, 55);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div className="p-8 md:p-12 rounded-3xl bg-[#0c130f] border border-[#1f2d26] shadow-2xl relative overflow-hidden">
      {/* Background Reticle Grid */}
      <div className="absolute inset-0 bg-forensic-grid opacity-25 pointer-events-none" />

      {/* Top Header */}
      <div className="flex items-center justify-between pb-6 border-b border-[#1f2d26] mb-8 font-mono text-xs">
        <div className="flex items-center gap-2.5 text-[#c8f344]">
          <Activity className="w-4 h-4 animate-spin" />
          <span>MULTI-SPECTRAL FORENSIC PIPELINE RUNNING</span>
        </div>
        <span className="text-[#788279]">CASE: {caseName}</span>
      </div>

      {/* Progress Counter & Bar */}
      <div className="mb-10 text-center">
        <div className="text-6xl sm:text-7xl font-mono font-bold text-[#c8f344] mb-3">
          {progress}%
        </div>
        <div className="w-full h-2 rounded-full bg-[#16221a] overflow-hidden p-0.5 border border-[#273d2f] max-w-xl mx-auto">
          <div 
            className="h-full bg-[#c8f344] rounded-full transition-all duration-75 shadow-[0_0_12px_#c8f344]"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Current Stage Telemetry */}
      <div className="p-6 rounded-2xl bg-[#080d0a] border border-[#1f2d26] mb-8">
        <div className="flex items-center justify-between font-mono text-xs mb-2">
          <span className="text-[#c8f344] font-bold">
            STAGE {currentStageIdx + 1} OF 5: {stages[currentStageIdx].label}
          </span>
          <span className="text-[#788279]">ACTIVE THREAD</span>
        </div>
        <p className="text-sm font-mono text-[#a4b3a6]">
          {stages[currentStageIdx].detail}
        </p>
      </div>

      {/* Stages Checklist */}
      <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 font-mono text-[11px]">
        {stages.map((st, i) => {
          const isDone = i < currentStageIdx;
          const isCurrent = i === currentStageIdx;
          return (
            <div 
              key={i}
              className={`p-3 rounded-xl border flex items-center gap-2 ${
                isDone 
                  ? 'bg-[#121c16] border-[#293d32] text-emerald-400' 
                  : isCurrent 
                  ? 'bg-[#18251e] border-[#c8f344] text-[#c8f344]' 
                  : 'bg-[#090d0b] border-[#18241e] text-[#526356]'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${isDone ? 'bg-emerald-400' : isCurrent ? 'bg-[#c8f344] animate-ping' : 'bg-[#293d32]'}`} />
              <span className="truncate">{st.label.split(' ')[0]}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
