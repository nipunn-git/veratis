import React, { useState, useEffect } from "react";

/**
 * InitialLoader - Full-screen cinematic black preloader
 * Smoothly counts from 0% to 100% while preloading core hero textures,
 * ensuring zero flash of green or unstyled content on page refresh.
 */
export default function InitialLoader({ onComplete }) {
  const [progress, setProgress] = useState(0);
  const [isFading, setIsFading] = useState(false);
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    const assets = [
      "/art-start.png",
      "/art-dark-contour.png",
      "/art-landscape-frag.png",
      "/art-dest-landscape.png",
    ];

    let loadedCount = 0;
    const totalAssets = assets.length;
    let allAssetsLoaded = false;

    assets.forEach((src) => {
      const img = new Image();
      const onDone = () => {
        loadedCount++;
        if (loadedCount >= totalAssets) {
          allAssetsLoaded = true;
        }
      };
      img.onload = onDone;
      img.onerror = onDone;
      img.src = src;
    });

    const startTime = performance.now();
    const DURATION = 900; // ~0.9s smooth cinematic count-up
    let frameId;

    const tick = (now) => {
      const elapsed = now - startTime;
      const timeRatio = Math.min(1, elapsed / DURATION);

      let currentVal = Math.floor(timeRatio * 100);

      // If assets are still loading after 85%, wait until they are finished
      if (!allAssetsLoaded && currentVal > 85) {
        currentVal = 85;
      }

      if (elapsed >= DURATION && allAssetsLoaded) {
        currentVal = 100;
      }

      setProgress(currentVal);

      if (currentVal >= 100) {
        // Hold at 100% briefly so the user sees complete state
        setTimeout(() => {
          setIsFading(true);
          setTimeout(() => {
            setIsDone(true);
            onComplete?.();
          }, 500);
        }, 140);
        return;
      }

      frameId = requestAnimationFrame(tick);
    };

    frameId = requestAnimationFrame(tick);

    return () => {
      if (frameId) cancelAnimationFrame(frameId);
    };
  }, [onComplete]);

  if (isDone) return null;

  return (
    <div
      className={`fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-black text-white select-none transition-opacity duration-500 ease-out ${
        isFading ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
      style={{ backgroundColor: "#000000" }}
    >
      {/* Editorial Eyebrow */}
      <div className="text-[10px] sm:text-xs font-mono tracking-[0.35em] text-neutral-500 uppercase mb-5">
        VERATIS — REALITY INVESTIGATION
      </div>

      {/* Large Crisp Monospace Percentage */}
      <div className="font-mono text-4xl sm:text-5xl md:text-6xl font-light tracking-tight tabular-nums text-white mb-6">
        {progress}%
      </div>

      {/* Sleek Hairline Progress Bar */}
      <div className="w-52 sm:w-64 h-[2px] bg-neutral-900 rounded-full overflow-hidden relative">
        <div
          className="h-full bg-white transition-all duration-75 ease-out rounded-full shadow-[0_0_12px_rgba(255,255,255,0.8)]"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Minimal Telemetry Subtext */}
      <div className="text-[10px] font-mono tracking-[0.25em] text-neutral-600 uppercase mt-5">
        {progress < 45 && "INITIALIZING NEURAL SHADERS..."}
        {progress >= 45 && progress < 85 && "CALIBRATING FORENSIC SPECIMENS..."}
        {progress >= 85 && progress < 100 && "PREPARING INTERFACE..."}
        {progress === 100 && "SYSTEM READY"}
      </div>
    </div>
  );
}
