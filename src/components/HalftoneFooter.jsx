import React, { useRef, useEffect, useState } from 'react';
import { ArrowUp, Terminal, Shield, Globe } from 'lucide-react';

export default function HalftoneFooter({ onStartInvestigation }) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [particles, setParticles] = useState([]);
  const mouseRef = useRef({ x: -1000, y: -1000, isHovered: false });
  const shockwavesRef = useRef([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    let animationFrameId;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
      initHalftone(rect.width, rect.height);
    };

    // Initialize halftone particle grid sampled from the VERATIS text
    const initHalftone = (width, height) => {
      // Offscreen canvas to render clean bold text
      const offCanvas = document.createElement('canvas');
      offCanvas.width = width;
      offCanvas.height = height;
      const offCtx = offCanvas.getContext('2d');

      offCtx.fillStyle = '#ffffff';
      const fontSize = Math.min(width * 0.22, 190);
      offCtx.font = `900 ${fontSize}px "Syne", "Space Grotesk", sans-serif`;
      offCtx.textAlign = 'center';
      offCtx.textBaseline = 'bottom';
      // Draw wordmark flush to bottom with only a tiny crop so it's fully visible in normal viewport
      offCtx.fillText('VERATIS', width / 2, height + fontSize * 0.04);

      const imgData = offCtx.getImageData(0, 0, width, height).data;
      const step = Math.max(7, Math.floor(width / 130)); // Halftone dot spacing
      const newParticles = [];

      for (let y = 0; y < height; y += step) {
        for (let x = 0; x < width; x += step) {
          const index = (y * width + x) * 4;
          const alpha = imgData[index + 3];
          if (alpha > 40) {
            const normalizedBrightness = alpha / 255;
            newParticles.push({
              origX: x,
              origY: y,
              x: x,
              y: y,
              vx: 0,
              vy: 0,
              radius: (step * 0.42) * normalizedBrightness,
              baseRadius: (step * 0.42) * normalizedBrightness,
              brightness: normalizedBrightness,
              colorShift: 0
            });
          }
        }
      }

      particlesRef.current = newParticles;
    };

    const particlesRef = { current: [] };
    resize();
    window.addEventListener('resize', resize);

    // Animation Loop with Spring Physics and Shockwaves
    const render = () => {
      const rect = canvas.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;

      ctx.clearRect(0, 0, width, height);

      const mouse = mouseRef.current;
      const parts = particlesRef.current;

      // Update shockwaves
      shockwavesRef.current = shockwavesRef.current.filter((wave) => {
        wave.radius += wave.speed;
        wave.alpha -= 0.02;
        return wave.alpha > 0 && wave.radius < Math.max(width, height);
      });

      // Physics loop
      for (let i = 0; i < parts.length; i++) {
        const p = parts[i];

        // 1. Mouse Repulsion with spring dampening
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const maxDist = 90;

        if (dist < maxDist && dist > 0) {
          const force = (1 - dist / maxDist) * 8.5;
          p.vx += (dx / dist) * force;
          p.vy += (dy / dist) * force;
          p.colorShift = Math.min(1, p.colorShift + 0.15);
        } else {
          p.colorShift = Math.max(0, p.colorShift - 0.03);
        }

        // 2. Shockwave Impulse from clicks
        for (let j = 0; j < shockwavesRef.current.length; j++) {
          const wave = shockwavesRef.current[j];
          const wdx = p.x - wave.x;
          const wdy = p.y - wave.y;
          const wDist = Math.sqrt(wdx * wdx + wdy * wdy);
          const diff = Math.abs(wDist - wave.radius);

          if (diff < 28) {
            const waveForce = (1 - diff / 28) * wave.power * wave.alpha;
            p.vx += (wdx / (wDist || 1)) * waveForce;
            p.vy += (wdy / (wDist || 1)) * waveForce;
            p.colorShift = 1;
          }
        }

        // 3. Return Spring force to home position
        const homeDx = p.origX - p.x;
        const homeDy = p.origY - p.y;
        p.vx += homeDx * 0.12;
        p.vy += homeDy * 0.12;

        // Dampening
        p.vx *= 0.78;
        p.vy *= 0.78;

        p.x += p.vx;
        p.y += p.vy;

        // Draw Halftone Dot
        const r = Math.max(0.8, p.baseRadius * (1 + p.colorShift * 0.35));
        ctx.beginPath();
        ctx.arc(p.x, p.y, r, 0, Math.PI * 2);

        if (p.colorShift > 0.1) {
          // Glow electric chartreuse when active
          ctx.fillStyle = `rgba(200, 243, 68, ${0.4 + p.colorShift * 0.6})`;
        } else {
          // Subtle muted sage / bone when idle
          ctx.fillStyle = `rgba(164, 179, 166, ${0.28 * p.brightness})`;
        }
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  // Mouse Handlers
  const handleMouseMove = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    mouseRef.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      isHovered: true
    };
  };

  const handleMouseLeave = () => {
    mouseRef.current = { x: -1000, y: -1000, isHovered: false };
  };

  const handleClick = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    shockwavesRef.current.push({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      radius: 0,
      speed: 12,
      power: 16,
      alpha: 1.0
    });
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer 
      ref={containerRef}
      className="relative bg-[#050705] border-t border-[#18241e] pt-20 overflow-hidden select-none"
    >
      {/* Background Reticle Grid */}
      <div className="absolute inset-0 bg-forensic-grid opacity-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Studio Coordinate & Back-to-Top Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-8 border-b border-[#18241e] text-xs font-mono text-[#788279]">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-[#c8f344]">
              <span className="w-2 h-2 rounded-full bg-[#c8f344] animate-pulse" />
              <span>STATION: VERATIS CORE // ONLINE</span>
            </span>
            <span className="hidden sm:inline-block">|</span>
            <span className="hidden sm:inline-block">COORDINATES: 46.2044° N, 6.1432° E</span>
          </div>

          <button
            onClick={scrollToTop}
            className="flex items-center gap-2 text-[#a4b3a6] hover:text-[#c8f344] transition-colors cursor-pointer group"
          >
            <span>BACK TO ZENITH</span>
            <ArrowUp className="w-3.5 h-3.5 transition-transform group-hover:-translate-y-1" />
          </button>
        </div>

        {/* Editorial Link Columns */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-16 text-xs font-mono">
          <div>
            <h4 className="text-[#f5f4ef] font-bold uppercase tracking-widest mb-4">
              [METHODOLOGY]
            </h4>
            <ul className="space-y-2.5 text-[#788279]">
              <li><a href="#problem" className="hover:text-[#c8f344] transition-colors">The Blind Spot</a></li>
              <li><a href="#process" className="hover:text-[#c8f344] transition-colors">Forensic Pipeline</a></li>
              <li><a href="#features" className="hover:text-[#c8f344] transition-colors">Multi-Axis Radar</a></li>
              <li><a href="#showcase" className="hover:text-[#c8f344] transition-colors">Interactive Specimen Lab</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-[#f5f4ef] font-bold uppercase tracking-widest mb-4">
              [SIGNATURE ENGINES]
            </h4>
            <ul className="space-y-2.5 text-[#788279]">
              <li><span className="text-[#a4b3a6]">Deception Radar v2.6</span></li>
              <li><span className="text-[#a4b3a6]">Evidence Autopsy</span></li>
              <li><span className="text-[#a4b3a6]">Reality Timeline</span></li>
              <li><span className="text-[#a4b3a6]">Evidence Gravity Map</span></li>
              <li><span className="text-[#a4b3a6]">Uncertainty Engine</span></li>
            </ul>
          </div>

          <div>
            <h4 className="text-[#f5f4ef] font-bold uppercase tracking-widest mb-4">
              [STANDARDS & PROVENANCE]
            </h4>
            <ul className="space-y-2.5 text-[#788279]">
              <li><span className="text-[#a4b3a6]">Zero-Trust Architecture</span></li>
              <li><span className="text-[#a4b3a6]">C2PA Cryptographic Stamping</span></li>
              <li><span className="text-[#a4b3a6]">Fourier Spectrum Verification</span></li>
              <li><span className="text-[#a4b3a6]">Open Source Dossier Protocol</span></li>
            </ul>
          </div>

          <div>
            <h4 className="text-[#f5f4ef] font-bold uppercase tracking-widest mb-4">
              [FORENSIC ACCESS]
            </h4>
            <p className="text-[#a4b3a6] leading-relaxed mb-4">
              Designed for investigative journalists, OSINT researchers, and media verification desks.
            </p>
            <button
              onClick={onStartInvestigation}
              className="px-4 py-2 rounded-lg bg-[#18251e] hover:bg-[#c8f344] hover:text-[#070a08] text-[#c8f344] border border-[#293d32] transition-all duration-200 cursor-pointer font-bold tracking-wider"
            >
              LAUNCH CONSOLE →
            </button>
          </div>
        </div>

        {/* Studio Micro-statement */}
        <div className="pt-4 pb-2 border-t border-[#121c16] flex flex-wrap items-center justify-between gap-4 text-[11px] font-mono text-[#526356]">
          <span>VERATIS MEDIA VERIFICATION LABS // SYSTEM REVISION 2026.10</span>
          <span>REALITY HAS A BLIND SPOT. WE SHINE THE LASER.</span>
        </div>
      </div>

      {/* Halftone Wordmark Canvas Stage (Inspired by 21st.dev reference by Kedhareswer Naidu) */}
      <div className="relative w-full h-[220px] sm:h-[280px] md:h-[320px] mt-4 -mb-2 overflow-hidden">
        <canvas
          ref={canvasRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          onClick={handleClick}
          className="w-full h-full cursor-crosshair block"
          title="Hover to displace particles, click to emit shockwave"
        />
        
        {/* Subtle Bottom Fade */}
        <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-[#050705] to-transparent pointer-events-none" />
      </div>
    </footer>
  );
}
