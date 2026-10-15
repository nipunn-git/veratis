import React, { useEffect, useRef } from 'react';

/**
 * TornadoLoader - Top-down cyclonic vortex loader
 * Simulates a satellite/forensic top view of a tornado with inward-spiraling particle physics,
 * angular velocity acceleration near the eye, rotating spiral arms, and isobaric pulse waves.
 */
export default function TornadoLoader({ 
  progress = null, 
  stageLabel = "PROCESSING FORENSIC SPECIMEN", 
  stageDetail = "Synthesizing neural tensor boundaries...",
  subText = null,
  size = 280,
  showTelemetry = true
}) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    // Handle high-DPI displays
    const dpr = window.devicePixelRatio || 1;
    const width = size;
    const height = size;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    const cx = width / 2;
    const cy = height / 2;
    const maxRadius = (width / 2) - 16;
    const eyeRadius = 14;

    // Particle pool for the vortex
    const particleCount = 220;
    const particles = [];

    // Initialize particles along spiral distributions
    for (let i = 0; i < particleCount; i++) {
      const arm = i % 4;
      const armOffset = (arm * Math.PI) / 2;
      const normDist = Math.pow(Math.random(), 0.7); // bias toward inner/mid
      const r = eyeRadius + normDist * (maxRadius - eyeRadius);
      const theta = armOffset + (r / maxRadius) * 4 + (Math.random() - 0.5) * 0.4;
      
      particles.push({
        r,
        theta,
        speedFactor: 0.8 + Math.random() * 0.6,
        size: 1.2 + Math.random() * 1.8,
        alpha: 0.2 + Math.random() * 0.7,
        hueVariant: Math.random() > 0.85 ? 'emerald' : 'zinc',
        trailLength: 3 + Math.floor(Math.random() * 4),
        history: []
      });
    }

    let globalRotation = 0;
    let pulseRadius = eyeRadius;

    const render = () => {
      // Clear with soft fade to give motion blur
      ctx.clearRect(0, 0, width, height);

      globalRotation += 0.025;

      // 1. Draw subtle background radar grid rings
      ctx.strokeStyle = 'rgba(228, 228, 231, 0.7)';
      ctx.lineWidth = 1;
      ctx.setLineDash([2, 4]);

      for (let r = 40; r <= maxRadius; r += 35) {
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Radar crosshair axes
      ctx.beginPath();
      ctx.moveTo(cx - maxRadius, cy);
      ctx.lineTo(cx + maxRadius, cy);
      ctx.moveTo(cx, cy - maxRadius);
      ctx.lineTo(cx, cy + maxRadius);
      ctx.stroke();
      ctx.setLineDash([]);

      // 2. Expanding isobaric pressure rings (vortex pulse)
      pulseRadius += 0.75;
      if (pulseRadius > maxRadius) pulseRadius = eyeRadius;
      const pulseAlpha = Math.max(0, 1 - (pulseRadius / maxRadius)) * 0.35;
      
      ctx.strokeStyle = `rgba(16, 185, 129, ${pulseAlpha})`;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(cx, cy, pulseRadius, 0, Math.PI * 2);
      ctx.stroke();

      // Second offset pulse
      const secondPulse = ((pulseRadius - eyeRadius + (maxRadius - eyeRadius) * 0.5) % (maxRadius - eyeRadius)) + eyeRadius;
      const secondAlpha = Math.max(0, 1 - (secondPulse / maxRadius)) * 0.25;
      ctx.strokeStyle = `rgba(24, 24, 27, ${secondAlpha})`;
      ctx.beginPath();
      ctx.arc(cx, cy, secondPulse, 0, Math.PI * 2);
      ctx.stroke();

      // 3. Draw 4 Logarithmic Spiral Vortex Arms (Satellite clouds)
      for (let arm = 0; arm < 4; arm++) {
        const baseAngle = globalRotation + (arm * Math.PI) / 2;
        ctx.beginPath();
        
        for (let step = 0; step < 50; step++) {
          const t = step / 50;
          const r = eyeRadius + t * (maxRadius - eyeRadius);
          const theta = baseAngle + Math.log(r / eyeRadius + 1) * 2.8;
          const x = cx + r * Math.cos(theta);
          const y = cy + r * Math.sin(theta);
          
          if (step === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }

        const armGradient = ctx.createRadialGradient(cx, cy, eyeRadius, cx, cy, maxRadius);
        armGradient.addColorStop(0, 'rgba(24, 24, 27, 0.45)');
        armGradient.addColorStop(0.4, 'rgba(82, 82, 91, 0.25)');
        armGradient.addColorStop(1, 'rgba(161, 161, 170, 0.0)');
        
        ctx.strokeStyle = armGradient;
        ctx.lineWidth = 2.5;
        ctx.stroke();
      }

      // 4. Update and Draw Spiraling Swarm Particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Physics: Angular velocity is inversely proportional to radius (spins faster near the eye!)
        const angularVelocity = (0.045 + (18 / (p.r + 15))) * p.speedFactor;
        p.theta += angularVelocity;

        // Inward suction towards the tornado eye
        const inwardSpeed = (0.35 + (8 / (p.r + 20))) * p.speedFactor;
        p.r -= inwardSpeed;

        // Save current point into trail history
        const x = cx + p.r * Math.cos(p.theta);
        const y = cy + p.r * Math.sin(p.theta);

        p.history.push({ x, y });
        if (p.history.length > p.trailLength) {
          p.history.shift();
        }

        // Draw particle trail streak
        if (p.history.length > 1) {
          ctx.beginPath();
          ctx.moveTo(p.history[0].x, p.history[0].y);
          for (let h = 1; h < p.history.length; h++) {
            ctx.lineTo(p.history[h].x, p.history[h].y);
          }
          const isEmerald = p.hueVariant === 'emerald';
          ctx.strokeStyle = isEmerald 
            ? `rgba(16, 185, 129, ${p.alpha * 0.7})` 
            : `rgba(24, 24, 27, ${p.alpha * 0.45})`;
          ctx.lineWidth = p.size * 0.8;
          ctx.stroke();
        }

        // Draw particle head
        ctx.beginPath();
        ctx.arc(x, y, p.size, 0, Math.PI * 2);
        if (p.hueVariant === 'emerald') {
          ctx.fillStyle = `rgba(16, 185, 129, ${p.alpha})`;
        } else {
          ctx.fillStyle = `rgba(24, 24, 27, ${p.alpha})`;
        }
        ctx.fill();

        // Respawn when particle gets sucked into the eye
        if (p.r <= eyeRadius + 2) {
          p.r = maxRadius - Math.random() * 15;
          p.theta = Math.random() * Math.PI * 2;
          p.history = [];
        }
      }

      // 5. The Eye of the Tornado (Central calm singularity with high-speed shear ring)
      ctx.beginPath();
      ctx.arc(cx, cy, eyeRadius, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.fill();

      // Eye wall boundary ring
      ctx.lineWidth = 2.5;
      ctx.strokeStyle = '#18181b';
      ctx.stroke();

      // Rotating inner eye reticle
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(globalRotation * 2.5);
      
      ctx.strokeStyle = '#10b981';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(0, 0, eyeRadius - 4, 0, Math.PI * 0.6);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(0, 0, eyeRadius - 4, Math.PI, Math.PI * 1.6);
      ctx.stroke();

      // Center singularity dot
      ctx.beginPath();
      ctx.arc(0, 0, 2.5, 0, Math.PI * 2);
      ctx.fillStyle = '#18181b';
      ctx.fill();

      ctx.restore();

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [size]);

  return (
    <div className="flex flex-col items-center justify-center p-6 text-center select-none font-sans">
      {/* The Tornado Viewport Canvas */}
      <div className="relative flex items-center justify-center">
        <canvas 
          ref={canvasRef} 
          style={{ width: `${size}px`, height: `${size}px` }} 
          className="rounded-full shadow-[0_12px_40px_-8px_rgba(24,24,27,0.12)] border border-zinc-200/90 bg-white/95 backdrop-blur-md"
        />

        {/* Ambient Glow */}
        <div 
          className="absolute inset-0 rounded-full bg-emerald-500/10 blur-xl pointer-events-none -z-10" 
        />

        {/* Outer Circular Degree Ticks */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
          <div className="w-[96%] h-[96%] rounded-full border border-zinc-200/60" />
        </div>
      </div>

      {/* Progress Telemetry Readout */}
      {showTelemetry && (
        <div className="mt-6 space-y-2 max-w-md w-full">
          <div className="flex items-center justify-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span className="text-[11px] font-mono font-semibold uppercase tracking-widest text-zinc-500">
              {stageLabel}
            </span>
          </div>

          <h4 className="text-base sm:text-lg font-semibold text-zinc-900 font-display tracking-tight">
            {stageDetail}
          </h4>

          {subText && (
            <p className="text-xs text-zinc-500 font-sans">
              {subText}
            </p>
          )}

          {/* Smooth Linear Progress Bar */}
          {progress !== null && (
            <div className="pt-2 w-full max-w-xs mx-auto">
              <div className="flex items-center justify-between text-xs font-mono text-zinc-500 mb-1.5 px-0.5">
                <span>VORTEX FLUX CONVERGENCE</span>
                <span className="font-semibold text-zinc-900">{Math.round(progress)}%</span>
              </div>
              <div className="w-full h-1.5 bg-zinc-200/80 rounded-full overflow-hidden p-0.5">
                <div 
                  className="h-full bg-zinc-900 rounded-full transition-all duration-200"
                  style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
                />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
