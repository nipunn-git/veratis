import React, { useState, useEffect } from 'react';

export default function LoadingScreen({ onComplete }) {
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState("INITIALIZING FORENSIC CORES...");
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      onComplete?.();
      return;
    }

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsExiting(true);
            setTimeout(() => {
              onComplete?.();
            }, 850);
          }, 350);
          return 100;
        }

        // Variable increment for cinematic rhythm
        const increment = Math.max(1, Math.floor(Math.random() * 7) + 2);
        const next = Math.min(100, prev + increment);

        if (next < 25) {
          setStatusText("CALIBRATING OPTICAL SPECTRAL MAPPING...");
        } else if (next < 55) {
          setStatusText("PARSING LATENT DIFFUSION NOISE SEEDS...");
        } else if (next < 80) {
          setStatusText("ENGAGING MULTI-AXIS DECEPTION RADAR...");
        } else if (next < 98) {
          setStatusText("COMPUTING EVIDENCE GRAVITY VECTORS...");
        } else {
          setStatusText("REALITY VERIFICATION ENGINE ONLINE.");
        }

        return next;
      });
    }, 45);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div 
      className={`fixed inset-0 z-50 flex flex-col justify-between p-6 md:p-12 bg-[#070a08] transition-all duration-700 ease-[cubic-bezier(0.85,0,0.15,1)] ${
        isExiting ? '-translate-y-full opacity-90' : 'translate-y-0 opacity-100'
      }`}
    >
      {/* Background Reticle Grid */}
      <div className="absolute inset-0 bg-forensic-grid opacity-30 pointer-events-none" />

      {/* Top Bar */}
      <div className="relative z-10 flex items-center justify-between text-xs font-mono uppercase tracking-widest text-[#788279]">
        <div className="flex items-center gap-3">
          <span className="w-2 h-2 rounded-full bg-[#c8f344] animate-pulse" />
          <span>VERATIS SYSTEM OS // BUILD 2.6.4</span>
        </div>
        <div className="hidden sm:flex items-center gap-6">
          <span>LATITUDE: 46.2044° N</span>
          <span>LONGITUDE: 6.1432° E</span>
          <button 
            onClick={() => {
              setIsExiting(true);
              setTimeout(() => onComplete?.(), 400);
            }}
            className="text-[#c8f344] hover:underline underline-offset-4 cursor-pointer"
          >
            [SKIP BOOT]
          </button>
        </div>
      </div>

      {/* Centerpiece: Cinematic Brand & Numbers */}
      <div className="relative z-10 flex flex-col items-center justify-center my-auto text-center">
        <div className="mb-4 text-xs tracking-[0.35em] uppercase text-[#c8f344] font-mono">
          Reality Has a Blind Spot.
        </div>
        
        <h1 className="text-6xl sm:text-8xl md:text-9xl font-display font-extrabold tracking-tighter text-[#f5f4ef] select-none">
          VERATIS
        </h1>

        {/* Counter Display with Slotted Digit Styling */}
        <div className="mt-8 flex items-baseline justify-center font-mono">
          <span className="text-5xl sm:text-7xl font-bold tracking-tight text-[#c8f344]">
            {String(progress).padStart(3, '0')}
          </span>
          <span className="text-xl sm:text-2xl text-[#788279] ml-2 font-light">
            %
          </span>
        </div>

        {/* Cinematic Progress Bar */}
        <div className="w-full max-w-md h-[2px] bg-[#1a2620] mt-6 overflow-hidden rounded-full relative">
          <div 
            className="h-full bg-[#c8f344] transition-all duration-100 ease-out shadow-[0_0_12px_#c8f344]"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Live Forensic Status Message */}
        <p className="mt-5 text-xs font-mono tracking-widest text-[#a4b3a6] animate-pulse uppercase">
          {statusText}
        </p>
      </div>

      {/* Bottom Bar */}
      <div className="relative z-10 flex items-center justify-between text-xs font-mono text-[#788279] border-t border-[#1a2620] pt-4">
        <span>FORENSIC TELEMETRY PROTOCOL</span>
        <span className="text-right">SECURE ENCLAVE ACTIVE</span>
      </div>
    </div>
  );
}
