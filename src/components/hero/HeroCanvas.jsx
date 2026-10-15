import React, { useEffect, useRef, useState, useCallback } from 'react';

/**
 * STAGES OF THE VERATIS CINEMATIC HERO ANIMATION
 * Cycle Duration: ~9.5 seconds
 * 0.0s - 2.0s: STAGE A — THE DARK CANVAS (Emergence of deep contour lines & ambient drift)
 * 2.0s - 3.8s: STAGE B — TWO SIGNALS CONVERGE (Human organic & AI synthetic streams approach)
 * 3.8s - 5.2s: STAGE C — THE VERIFICATION PULSE (Cyan energy burst, portal shockwave, outward curl)
 * 5.2s - 7.5s: STAGE D — THE REVEAL (Particles reassemble into precision digital fingerprint & verified core)
 * 7.5s - 9.5s: STAGE E — THE TRUST STATE (Breathing trust state, live telemetry, seamless loop reset)
 */

const STAGE_CONFIGS = [
  { id: 'A', label: '01 // DARK CANVAS', shortLabel: '01 CANVAS', title: 'Atmospheric Signal Emergence', range: [0, 2.0] },
  { id: 'B', label: '02 // CONVERGENCE', shortLabel: '02 CONVERGE', title: 'Human & Synthetic Signals Align', range: [2.0, 3.8] },
  { id: 'C', label: '03 // VERIFICATION PULSE', shortLabel: '03 PULSE', title: 'Energy Climax & Deception Scan', range: [3.8, 5.2] },
  { id: 'D', label: '04 // SIGNATURE REVEAL', shortLabel: '04 REVEAL', title: 'Fingerprint Core Reconstruction', range: [5.2, 7.5] },
  { id: 'E', label: '05 // TRUST ACTIVE', shortLabel: '05 TRUSTED', title: 'Verified Signal Established', range: [7.5, 9.5] },
];

const TOTAL_CYCLE_DURATION = 9.5; // in seconds

export default function HeroCanvas({ onStageChange, isInteractive = true }) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);

  // Animation timeline state
  const [currentStageId, setCurrentStageId] = useState('A');
  const [isPaused, setIsPaused] = useState(false);
  const [manualTime, setManualTime] = useState(null);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [fps, setFps] = useState(60);

  // Mouse parallax coordinates (-1 to 1)
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0, isHovering: false });

  // References for animation frame
  const animStateRef = useRef({
    startTime: performance.now(),
    lastFrameTime: performance.now(),
    frameCount: 0,
    fpsTimer: performance.now(),
    pulseParticles: [],
    coreParticles: [],
    ambientParticles: [],
    concentricRings: [],
    contourWaves: [],
  });

  // Check reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handler = (e) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  // Pre-generate biometric fingerprint target nodes for Stage D & E
  const generateFingerprintNodes = useCallback((cx, cy, scale) => {
    const nodes = [];
    // 9 concentric biometric dermal ridges
    const ridgeCount = 10;
    const baseRadius = 14 * scale;
    const ridgeGap = 13 * scale;

    for (let r = 1; r <= ridgeCount; r++) {
      const radiusX = baseRadius + r * ridgeGap;
      const radiusY = (baseRadius + r * ridgeGap) * 1.32; // Oval biometric shape
      // Calculate perimeter approximation
      const perimeter = 2 * Math.PI * Math.sqrt((radiusX * radiusX + radiusY * radiusY) / 2);
      const pointsOnRidge = Math.floor(perimeter / (9 * scale));

      for (let i = 0; i < pointsOnRidge; i++) {
        const angle = (i / pointsOnRidge) * Math.PI * 2;
        
        // Skip bottom area of outer ridges to simulate natural arch pattern
        if (r > 6 && angle > 0.8 * Math.PI && angle < 1.2 * Math.PI) continue;

        // Dermal whorl wave perturbation
        const whorlNoise = Math.sin(angle * 3 + r * 0.4) * (2.8 * scale);
        const rx = radiusX + whorlNoise;
        const ry = radiusY + whorlNoise * 0.8;

        const targetX = cx + Math.cos(angle) * rx;
        const targetY = cy + Math.sin(angle) * ry;

        nodes.push({
          x: targetX,
          y: targetY,
          baseX: targetX,
          baseY: targetY,
          ridge: r,
          angle: angle,
          alpha: 0.35 + (r / ridgeCount) * 0.55,
          size: r % 2 === 0 ? 1.5 * scale : 1.1 * scale,
          color: r <= 3 ? '#ffffff' : r <= 7 ? '#20D9FF' : '#77BFFF',
          pulsePhase: Math.random() * Math.PI * 2,
        });
      }
    }

    // Add central verification glyph: Precision minimal Checkmark inside core
    const checkmarkPoints = [
      { x: -14 * scale, y: 2 * scale },
      { x: -9 * scale, y: 8 * scale },
      { x: -4 * scale, y: 14 * scale },
      { x: 0 * scale, y: 8 * scale },
      { x: 6 * scale, y: -1 * scale },
      { x: 12 * scale, y: -10 * scale },
      { x: 18 * scale, y: -18 * scale },
    ];

    checkmarkPoints.forEach((pt, idx) => {
      nodes.push({
        x: cx + pt.x,
        y: cy + pt.y,
        baseX: cx + pt.x,
        baseY: cy + pt.y,
        ridge: 0,
        isCheckmark: true,
        checkIndex: idx,
        alpha: 0.95,
        size: 2.2 * scale,
        color: '#FFFFFF',
        pulsePhase: idx * 0.4,
      });
    });

    return nodes;
  }, []);

  // Initialize Canvas simulation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animId;
    const state = animStateRef.current;

    // Handle high-DPI retina displays
    const handleResize = () => {
      const container = containerRef.current;
      if (!container || !canvas) return;
      const rect = container.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);

      const w = rect.width;
      const h = rect.height;
      const cx = w * 0.5;
      const cy = h * 0.48;
      const scale = Math.min(w / 700, 1.15);

      // Initialize Ambient Drifting Particles (80 particles)
      state.ambientParticles = Array.from({ length: 90 }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.25,
        vy: -0.15 - Math.random() * 0.35,
        size: 0.75 + Math.random() * 1.5,
        depth: 0.2 + Math.random() * 0.8,
        alpha: 0.15 + Math.random() * 0.45,
        color: Math.random() > 0.4 ? '#20D9FF' : '#77BFFF',
      }));

      // Initialize Fingerprint Core Nodes
      state.coreParticles = generateFingerprintNodes(cx, cy, scale);

      // Initialize Pulse Energy Fragments (550 particles)
      state.pulseParticles = Array.from({ length: 550 }, (_, i) => {
        const angle = (i / 550) * Math.PI * 2 + (Math.random() - 0.5) * 0.2;
        const speed = 2.5 + Math.random() * 6.5;
        const distance = 40 + Math.random() * 220;
        return {
          id: i,
          angle,
          speed,
          distance,
          currentDist: 0,
          size: 1 + Math.random() * 2.2,
          color: i % 4 === 0 ? '#FFFFFF' : i % 2 === 0 ? '#20D9FF' : '#77BFFF',
          alpha: 0.8 + Math.random() * 0.2,
          curveFactor: (Math.random() - 0.5) * 1.8,
        };
      });
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    // =========================================================================
    // MAIN RENDER LOOP
    // =========================================================================
    const render = (now) => {
      const container = containerRef.current;
      if (!container || !canvas) return;

      const rect = container.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;
      const cx = w * 0.5;
      const cy = h * 0.48;
      const scale = Math.min(w / 700, 1.15);

      // FPS tracking
      state.frameCount++;
      if (now - state.fpsTimer >= 1000) {
        setFps(Math.round((state.frameCount * 1000) / (now - state.fpsTimer)));
        state.frameCount = 0;
        state.fpsTimer = now;
      }

      // Smooth mouse parallax lerp
      const m = mouseRef.current;
      m.x += (m.targetX - m.x) * 0.06;
      m.y += (m.targetY - m.y) * 0.06;

      // Calculate time progress within cycle (0 to TOTAL_CYCLE_DURATION)
      let cycleTime;
      if (prefersReducedMotion) {
        cycleTime = 7.8; // Static settled Stage E
      } else if (manualTime !== null) {
        cycleTime = manualTime;
      } else {
        const elapsed = (now - state.startTime) / 1000;
        cycleTime = elapsed % TOTAL_CYCLE_DURATION;
      }

      // Determine active stage
      let activeStage = STAGE_CONFIGS[0];
      for (const st of STAGE_CONFIGS) {
        if (cycleTime >= st.range[0] && cycleTime < st.range[1]) {
          activeStage = st;
          break;
        }
      }
      if (activeStage.id !== currentStageId) {
        setCurrentStageId(activeStage.id);
        onStageChange?.(activeStage);
      }

      // Clear Canvas
      ctx.clearRect(0, 0, w, h);

      // Save for mouse parallax transformation
      ctx.save();
      const pxOffset = m.x * 16;
      const pyOffset = m.y * 12;
      ctx.translate(pxOffset * 0.35, pyOffset * 0.35);

      // =======================================================================
      // LAYER 1: ATMOSPHERIC AMBIENT GLOW & DRIFT PARTICLES
      // =======================================================================
      // Dynamic center glow reacting to stages
      let centralGlowIntensity = 0.08;
      if (activeStage.id === 'B') centralGlowIntensity = 0.16;
      if (activeStage.id === 'C') centralGlowIntensity = 0.38;
      if (activeStage.id === 'D' || activeStage.id === 'E') centralGlowIntensity = 0.22;

      const radialGlow = ctx.createRadialGradient(cx, cy, 10, cx, cy, 320 * scale);
      radialGlow.addColorStop(0, `rgba(32, 217, 255, ${centralGlowIntensity})`);
      radialGlow.addColorStop(0.35, `rgba(119, 191, 255, ${centralGlowIntensity * 0.45})`);
      radialGlow.addColorStop(0.7, 'rgba(5, 11, 20, 0.1)');
      radialGlow.addColorStop(1, 'rgba(5, 11, 20, 0)');
      ctx.fillStyle = radialGlow;
      ctx.fillRect(0, 0, w, h);

      // Ambient drifting particles with z-depth parallax
      state.ambientParticles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.y < -10) p.y = h + 10;
        if (p.x < -10) p.x = w + 10;
        if (p.x > w + 10) p.x = -10;

        const pX = p.x + pxOffset * p.depth;
        const pY = p.y + pyOffset * p.depth;

        ctx.beginPath();
        ctx.arc(pX, pY, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.fill();
      });
      ctx.globalAlpha = 1.0;

      // =======================================================================
      // STAGE A & B: CONVERGING SIGNALS & CONTOUR WAVE TRACES
      // Left = Human / Organic Signal | Right = AI / Synthetic Signal
      // (Visual homage to Michelangelo Creation of Adam hands reaching center)
      // =======================================================================
      if (cycleTime < 5.0) {
        // Progression of convergence: 0 = far apart, 1 = touching at center
        let convProgress = 0;
        if (cycleTime <= 2.0) {
          // Stage A: Emergence from darkness
          convProgress = (cycleTime / 2.0) * 0.25;
        } else if (cycleTime <= 3.8) {
          // Stage B: Accelerated approach toward center
          const t = (cycleTime - 2.0) / 1.8;
          // Cubic ease-in-out
          convProgress = 0.25 + 0.75 * (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
        } else {
          // Stage C: Overlapping at climax
          convProgress = 1.0;
        }

        // Calculate fingertips / signal heads positions
        const leftOriginX = w * 0.05;
        const rightOriginX = w * 0.95;
        const leftTipX = leftOriginX + (cx - 24 * scale - leftOriginX) * convProgress;
        const rightTipX = rightOriginX - (rightOriginX - (cx + 24 * scale)) * convProgress;
        const signalY = cy;

        // Draw Left Signal Stream (Human / Organic - Flowing harmonic curves)
        const leftRibbonCount = 9;
        ctx.lineWidth = 1.2;
        for (let r = 0; r < leftRibbonCount; r++) {
          const offset = (r - (leftRibbonCount - 1) / 2) * (7 * scale);
          const ribbonAlpha = Math.max(0.08, (1 - Math.abs(offset) / (32 * scale)) * (0.3 + convProgress * 0.65));
          
          ctx.beginPath();
          ctx.strokeStyle = r % 2 === 0 ? '#20D9FF' : '#77BFFF';
          ctx.globalAlpha = ribbonAlpha;

          // Multi-harmonic bezier spline
          const cp1x = leftOriginX + (leftTipX - leftOriginX) * 0.35;
          const cp1y = signalY + offset + Math.sin(cycleTime * 3 + r) * (18 * scale * (1 - convProgress * 0.5));
          const cp2x = leftOriginX + (leftTipX - leftOriginX) * 0.75;
          const cp2y = signalY + offset * 0.4 + Math.cos(cycleTime * 2.5 + r * 0.8) * (12 * scale * (1 - convProgress * 0.5));

          ctx.moveTo(leftOriginX, signalY + offset * 1.5);
          ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, leftTipX, signalY + offset * 0.15);
          ctx.stroke();

          // Particle beads traveling along human signal contour
          const beadT = (cycleTime * 0.8 + r * 0.11) % 1;
          const bx = Math.pow(1 - beadT, 3) * leftOriginX +
            3 * Math.pow(1 - beadT, 2) * beadT * cp1x +
            3 * (1 - beadT) * Math.pow(beadT, 2) * cp2x +
            Math.pow(beadT, 3) * leftTipX;
          const by = Math.pow(1 - beadT, 3) * (signalY + offset * 1.5) +
            3 * Math.pow(1 - beadT, 2) * beadT * cp1y +
            3 * (1 - beadT) * Math.pow(beadT, 2) * cp2y +
            Math.pow(beadT, 3) * (signalY + offset * 0.15);

          ctx.beginPath();
          ctx.arc(bx, by, 1.3 * scale, 0, Math.PI * 2);
          ctx.fillStyle = '#FFFFFF';
          ctx.globalAlpha = ribbonAlpha * 0.9;
          ctx.fill();
        }

        // Draw Right Signal Stream (AI / Synthetic - Precision algorithmic lattice)
        const rightRibbonCount = 9;
        for (let r = 0; r < rightRibbonCount; r++) {
          const offset = (r - (rightRibbonCount - 1) / 2) * (7 * scale);
          const ribbonAlpha = Math.max(0.08, (1 - Math.abs(offset) / (32 * scale)) * (0.3 + convProgress * 0.65));

          ctx.beginPath();
          ctx.strokeStyle = r % 2 === 0 ? '#20D9FF' : '#FFFFFF';
          ctx.globalAlpha = ribbonAlpha;

          // Algorithmic stepped interpolation
          const cp1x = rightOriginX - (rightOriginX - rightTipX) * 0.35;
          const cp1y = signalY + offset + Math.cos(cycleTime * 3.5 + r) * (14 * scale * (1 - convProgress * 0.5));
          const cp2x = rightOriginX - (rightOriginX - rightTipX) * 0.75;
          const cp2y = signalY + offset * 0.4 + Math.sin(cycleTime * 3 + r * 0.9) * (10 * scale * (1 - convProgress * 0.5));

          ctx.moveTo(rightOriginX, signalY + offset * 1.5);
          ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, rightTipX, signalY + offset * 0.15);
          ctx.stroke();

          // Data packets traveling along AI synthetic signal
          const packetT = (cycleTime * 0.9 + r * 0.13) % 1;
          const px = Math.pow(1 - packetT, 3) * rightOriginX +
            3 * Math.pow(1 - packetT, 2) * packetT * cp1x +
            3 * (1 - packetT) * Math.pow(packetT, 2) * cp2x +
            Math.pow(packetT, 3) * rightTipX;
          const py = Math.pow(1 - packetT, 3) * (signalY + offset * 1.5) +
            3 * Math.pow(1 - packetT, 2) * packetT * cp1y +
            3 * (1 - packetT) * Math.pow(packetT, 2) * cp2y +
            Math.pow(packetT, 3) * (signalY + offset * 0.15);

          ctx.beginPath();
          ctx.arc(px, py, 1.4 * scale, 0, Math.PI * 2);
          ctx.fillStyle = '#20D9FF';
          ctx.globalAlpha = ribbonAlpha * 0.95;
          ctx.fill();
        }

        // Fingertip tension glow & spark arcs when close
        if (convProgress > 0.5) {
          const gap = rightTipX - leftTipX;
          const tensionAlpha = Math.min(1.0, (1 - gap / (140 * scale)) * 1.4);

          // Electrostatic tension arc
          ctx.beginPath();
          ctx.strokeStyle = '#FFFFFF';
          ctx.lineWidth = 1.6;
          ctx.globalAlpha = tensionAlpha;
          ctx.moveTo(leftTipX, signalY);
          const jitterY = (Math.random() - 0.5) * 8 * scale;
          ctx.quadraticCurveTo((leftTipX + rightTipX) / 2, signalY + jitterY, rightTipX, signalY);
          ctx.stroke();

          // Finger tip beacons
          ctx.beginPath();
          ctx.arc(leftTipX, signalY, 3 * scale, 0, Math.PI * 2);
          ctx.arc(rightTipX, signalY, 3 * scale, 0, Math.PI * 2);
          ctx.fillStyle = '#20D9FF';
          ctx.shadowColor = '#20D9FF';
          ctx.shadowBlur = 12;
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      }

      // =======================================================================
      // STAGE C: THE VERIFICATION PULSE & PORTAL BURST (3.8s to 5.2s)
      // Climax: Cyan-white energy burst, concentric scanning rings & shockwave
      // (Faithful recreation of reference screenshots 2 & 3 jagged circular portal!)
      // =======================================================================
      if (cycleTime >= 3.8 && cycleTime < 6.5) {
        const pulseElapsed = cycleTime - 3.8;
        const pulseProgress = Math.min(1.0, pulseElapsed / 1.4);

        // 1. Initial White Flash at convergence (first 0.35s)
        if (pulseElapsed < 0.35) {
          const flashAlpha = (1 - pulseElapsed / 0.35) * 0.75;
          const flashGlow = ctx.createRadialGradient(cx, cy, 0, cx, cy, 180 * scale);
          flashGlow.addColorStop(0, `rgba(255, 255, 255, ${flashAlpha})`);
          flashGlow.addColorStop(0.3, `rgba(32, 217, 255, ${flashAlpha * 0.8})`);
          flashGlow.addColorStop(1, 'rgba(5, 11, 20, 0)');
          ctx.fillStyle = flashGlow;
          ctx.fillRect(0, 0, w, h);
        }

        // 2. Expanding Concentric Scanning Rings with tick marks
        const ringCount = 3;
        for (let ri = 0; ri < ringCount; ri++) {
          const ringDelay = ri * 0.16;
          if (pulseElapsed > ringDelay) {
            const rT = (pulseElapsed - ringDelay) / 1.1;
            if (rT <= 1) {
              const ringRadius = (20 + rT * 260) * scale;
              const ringAlpha = (1 - rT) * 0.7;

              ctx.beginPath();
              ctx.arc(cx, cy, ringRadius, 0, Math.PI * 2);
              ctx.strokeStyle = ri === 0 ? '#FFFFFF' : '#20D9FF';
              ctx.lineWidth = ri === 0 ? 1.8 : 1.0;
              ctx.globalAlpha = ringAlpha;
              ctx.setLineDash(ri === 1 ? [4, 6] : []);
              ctx.stroke();
              ctx.setLineDash([]);

              // Fine radar ticks on outer ring
              if (ri === 1) {
                const tickCount = 24;
                for (let k = 0; k < tickCount; k++) {
                  const angle = (k / tickCount) * Math.PI * 2;
                  const x1 = cx + Math.cos(angle) * (ringRadius - 4 * scale);
                  const y1 = cy + Math.sin(angle) * (ringRadius - 4 * scale);
                  const x2 = cx + Math.cos(angle) * (ringRadius + 4 * scale);
                  const y2 = cy + Math.sin(angle) * (ringRadius + 4 * scale);
                  ctx.beginPath();
                  ctx.moveTo(x1, y1);
                  ctx.lineTo(x2, y2);
                  ctx.strokeStyle = '#20D9FF';
                  ctx.lineWidth = 1;
                  ctx.globalAlpha = ringAlpha * 0.8;
                  ctx.stroke();
                }
              }
            }
          }
        }

        // 3. Jagged Contour Perimeter Boundary (Direct homage to screenshots 2 & 3!)
        const portalRadius = Math.min(180 * scale, pulseElapsed * 160 * scale);
        const jaggedPoints = 72;
        ctx.beginPath();
        for (let j = 0; j <= jaggedPoints; j++) {
          const angle = (j / jaggedPoints) * Math.PI * 2;
          // Perlin-like jagged step noise
          const noise = Math.sin(angle * 12 + pulseElapsed * 6) * 7 * scale +
            Math.cos(angle * 24) * 4 * scale;
          const jr = Math.max(0, portalRadius + noise);
          const jx = cx + Math.cos(angle) * jr;
          const jy = cy + Math.sin(angle) * jr;

          if (j === 0) ctx.moveTo(jx, jy);
          else ctx.lineTo(jx, jy);
        }
        ctx.closePath();
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
        ctx.lineWidth = 1.2;
        ctx.globalAlpha = Math.max(0, 0.8 - pulseProgress * 0.7);
        ctx.stroke();

        // 4. Outward Bursting Fragments that curve back inward
        state.pulseParticles.forEach((p) => {
          // Outward ballistic motion with drag
          const r = p.distance * Math.sin(pulseProgress * Math.PI * 0.85);
          // Curling vortex effect
          const currentAngle = p.angle + pulseProgress * p.curveFactor;
          const px = cx + Math.cos(currentAngle) * r * scale;
          const py = cy + Math.sin(currentAngle) * r * scale;

          const particleAlpha = Math.max(0, (1 - pulseProgress * 0.85) * p.alpha);

          ctx.beginPath();
          ctx.arc(px, py, p.size * scale, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.globalAlpha = particleAlpha;
          ctx.fill();
        });
      }

      // =======================================================================
      // STAGE D & E: THE REVEAL & THE TRUST STATE (5.2s to 9.5s)
      // The settled Veratis signature: Biometric Digital Fingerprint Core &
      // Precision Integrated Checkmark with Orbiting Satellites
      // =======================================================================
      if (cycleTime >= 4.8) {
        // Assembly transition (4.8s to 6.2s: assemble | 6.2s to 8.8s: breathe | 8.8s+: dissolve)
        let assembleT = 0;
        let dissolveT = 0;

        if (cycleTime < 6.2) {
          // Stage D Assembly
          const t = (cycleTime - 4.8) / 1.4;
          // Smooth quintic out
          assembleT = 1 - Math.pow(1 - t, 5);
        } else if (cycleTime <= 8.6) {
          // Stage E Settled & Breathing
          assembleT = 1.0;
        } else {
          // Dissolve back to Stage A for seamless looping
          assembleT = 1.0;
          dissolveT = (cycleTime - 8.6) / 0.9;
        }

        const overallAlpha = (1 - dissolveT);

        // Breathing cycle: subtle 0.03 scale breathing expansion
        const breath = Math.sin(cycleTime * 1.8) * 0.025;
        const currentScale = scale * (1 + breath);

        // Render Biometric Fingerprint Dermal Ridges (Continuous hairline curves)
        const ridgeCount = 10;
        const baseRadius = 14 * currentScale;
        const ridgeGap = 13 * currentScale;

        for (let r = 1; r <= ridgeCount; r++) {
          const rx = baseRadius + r * ridgeGap;
          const ry = (baseRadius + r * ridgeGap) * 1.32;
          const ridgeAlpha = Math.min(1.0, assembleT) * (0.15 + (r / ridgeCount) * 0.45) * overallAlpha;

          ctx.beginPath();
          // Draw oval ridge with whorl deformation
          const steps = 64;
          for (let s = 0; s <= steps; s++) {
            const angle = (s / steps) * Math.PI * 2;
            
            // Skip bottom opening of arch
            if (r > 6 && angle > 0.85 * Math.PI && angle < 1.15 * Math.PI) continue;

            const whorlNoise = Math.sin(angle * 3 + r * 0.4) * (2.8 * currentScale);
            const ptX = cx + Math.cos(angle) * (rx + whorlNoise);
            const ptY = cy + Math.sin(angle) * (ry + whorlNoise * 0.8);

            if (s === 0 || (r > 6 && angle <= 0.85 * Math.PI && s > 0 && ((s-1)/steps)*Math.PI*2 > 1.15 * Math.PI)) {
              ctx.moveTo(ptX, ptY);
            } else {
              ctx.lineTo(ptX, ptY);
            }
          }

          ctx.strokeStyle = r <= 3 ? '#FFFFFF' : r <= 7 ? '#20D9FF' : '#77BFFF';
          ctx.lineWidth = r % 2 === 0 ? 1.4 : 0.9;
          ctx.globalAlpha = ridgeAlpha;
          ctx.stroke();
        }

        // Render Fingerprint Nodes / Minutiae Points
        state.coreParticles.forEach((node) => {
          // Interpolate from scattered position into biometric anchor
          const scatterAngle = node.angle || 0;
          const scatterRadius = (260 + (node.ridge || 1) * 30) * currentScale;
          const startX = cx + Math.cos(scatterAngle) * scatterRadius;
          const startY = cy + Math.sin(scatterAngle) * scatterRadius;

          const targetX = cx + (node.baseX - cx) * (1 + breath);
          const targetY = cy + (node.baseY - cy) * (1 + breath);

          const curX = startX + (targetX - startX) * assembleT;
          const curY = startY + (targetY - startY) * assembleT;

          // Pulse sequencing for Stage E
          let pulseGlow = 0;
          if (activeStage.id === 'E') {
            pulseGlow = Math.sin(cycleTime * 3 + node.pulsePhase) * 0.3;
          }

          ctx.beginPath();
          ctx.arc(curX, curY, (node.size || 1.2) * (1 + pulseGlow * 0.4), 0, Math.PI * 2);
          ctx.fillStyle = node.color;
          ctx.globalAlpha = Math.max(0.1, (node.alpha + pulseGlow) * assembleT * overallAlpha);
          ctx.fill();
        });

        // Precision Verified Checkmark / Core Nexus inside center
        if (assembleT > 0.4) {
          const checkAlpha = Math.min(1.0, (assembleT - 0.4) / 0.6) * overallAlpha;

          // Central glowing ring enclosing verified checkmark
          ctx.beginPath();
          ctx.arc(cx, cy, 26 * currentScale, 0, Math.PI * 2);
          ctx.strokeStyle = '#20D9FF';
          ctx.lineWidth = 1.8;
          ctx.globalAlpha = checkAlpha * 0.85;
          ctx.shadowColor = '#20D9FF';
          ctx.shadowBlur = 16;
          ctx.stroke();
          ctx.shadowBlur = 0;

          // Verified Checkmark geometry
          ctx.beginPath();
          ctx.moveTo(cx - 11 * currentScale, cy + 1 * currentScale);
          ctx.lineTo(cx - 3 * currentScale, cy + 9 * currentScale);
          ctx.lineTo(cx + 12 * currentScale, cy - 8 * currentScale);
          ctx.strokeStyle = '#FFFFFF';
          ctx.lineWidth = 2.6;
          ctx.lineCap = 'round';
          ctx.lineJoin = 'round';
          ctx.globalAlpha = checkAlpha * 0.95;
          ctx.shadowColor = '#20D9FF';
          ctx.shadowBlur = 12;
          ctx.stroke();
          ctx.shadowBlur = 0;
        }

        // Precision Scanning Sweep Beam (Stage E)
        if (activeStage.id === 'E') {
          const sweepAngle = (cycleTime * 1.5) % (Math.PI * 2);
          const sweepRadius = 175 * currentScale;

          const sweepGrad = ctx.createRadialGradient(cx, cy, 10, cx, cy, sweepRadius);
          sweepGrad.addColorStop(0, 'rgba(32, 217, 255, 0.18)');
          sweepGrad.addColorStop(1, 'rgba(32, 217, 255, 0)');

          ctx.save();
          ctx.beginPath();
          ctx.moveTo(cx, cy);
          ctx.arc(cx, cy, sweepRadius, sweepAngle - 0.45, sweepAngle);
          ctx.closePath();
          ctx.fillStyle = sweepGrad;
          ctx.globalAlpha = 0.5 * overallAlpha;
          ctx.fill();
          ctx.restore();
        }

        // Orbiting Data Nodes / Satellites
        const satelliteCount = 4;
        for (let s = 0; s < satelliteCount; s++) {
          const orbitRadius = (165 + s * 14) * currentScale;
          const orbitSpeed = (0.6 + s * 0.15) * (s % 2 === 0 ? 1 : -1);
          const satAngle = cycleTime * orbitSpeed + (s * Math.PI) / 2;
          const satX = cx + Math.cos(satAngle) * orbitRadius;
          const satY = cy + Math.sin(satAngle) * (orbitRadius * 0.65); // Elliptical 3D orbit

          ctx.beginPath();
          ctx.arc(satX, satY, 1.8 * scale, 0, Math.PI * 2);
          ctx.fillStyle = s % 2 === 0 ? '#FFFFFF' : '#20D9FF';
          ctx.globalAlpha = 0.85 * assembleT * overallAlpha;
          ctx.shadowColor = '#20D9FF';
          ctx.shadowBlur = 8;
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      }

      // =======================================================================
      // MOUSE FORENSIC RETICLE OVERLAY (Interactive Proximity Glow)
      // =======================================================================
      if (isInteractive && m.isHovering) {
        const mouseCanvasX = (m.x + 1) * 0.5 * w;
        const mouseCanvasY = (m.y + 1) * 0.5 * h;

        // Subtle reticle circle
        ctx.beginPath();
        ctx.arc(mouseCanvasX, mouseCanvasY, 28 * scale, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(32, 217, 255, 0.4)';
        ctx.lineWidth = 1;
        ctx.setLineDash([3, 5]);
        ctx.stroke();
        ctx.setLineDash([]);

        // Crosshair ticks
        const chLen = 6 * scale;
        ctx.beginPath();
        ctx.moveTo(mouseCanvasX - chLen, mouseCanvasY);
        ctx.lineTo(mouseCanvasX + chLen, mouseCanvasY);
        ctx.moveTo(mouseCanvasX, mouseCanvasY - chLen);
        ctx.lineTo(mouseCanvasX, mouseCanvasY + chLen);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      ctx.restore();

      // Continue animation frame loop
      if (!isPaused) {
        animId = requestAnimationFrame(render);
      }
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    };
  }, [prefersReducedMotion, manualTime, isPaused, isInteractive, generateFingerprintNodes, onStageChange, currentStageId]);

  // Pointer interactions
  const handlePointerMove = (e) => {
    const container = containerRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    // Normalize to -1 to 1 range
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const y = ((e.clientY - rect.top) / rect.height) * 2 - 1;
    mouseRef.current.targetX = Math.max(-1, Math.min(1, x));
    mouseRef.current.targetY = Math.max(-1, Math.min(1, y));
    mouseRef.current.isHovering = true;
  };

  const handlePointerLeave = () => {
    mouseRef.current.targetX = 0;
    mouseRef.current.targetY = 0;
    mouseRef.current.isHovering = false;
  };

  // Jump to specific stage
  const handleStageSelect = (stage) => {
    setManualTime(stage.range[0] + 0.1);
    setCurrentStageId(stage.id);
    onStageChange?.(stage);
    // Auto-resume continuous playback after 2.5s if scrubbed
    setTimeout(() => {
      setManualTime(null);
      animStateRef.current.startTime = performance.now() - (stage.range[0] + 0.1) * 1000;
    }, 2800);
  };

  return (
    <div 
      ref={containerRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className="relative w-full h-full min-h-[500px] md:min-h-[620px] lg:min-h-[700px] flex items-center justify-center select-none overflow-visible"
    >
      {/* Native High-Performance 2D Canvas */}
      <canvas 
        ref={canvasRef}
        className="w-full h-full block cursor-crosshair touch-none"
      />

      {/* Atmospheric Vignette Gradient Blending Canvas into Dark Midnight Navy (#050B14) */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_75%_75%_at_50%_50%,transparent_45%,#050B14_100%)]" />

      {/* TOP RIGHT: Live Forensic Telemetry Badge (Hidden on small mobile to prevent header overlap) */}
      <div className="hidden sm:flex absolute top-14 right-4 md:top-14 md:right-6 z-20 pointer-events-none flex-col items-end gap-1.5 font-mono text-[10px] md:text-[11px] tracking-wider text-[#77BFFF]">
        <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-[#050B14]/85 border border-[#20D9FF]/25 backdrop-blur-md shadow-[0_0_15px_rgba(32,217,255,0.12)]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#20D9FF] animate-pulse" />
          <span className="text-[#E1F4FF] font-semibold">SIGNAL TELEMETRY</span>
          <span className="text-[#20D9FF]/60">•</span>
          <span className="text-[#20D9FF]">{fps} FPS</span>
        </div>
        <div className="text-[9px] text-[#77BFFF]/70 uppercase hidden md:block">
          RESOLUTION: SUB-PIXEL VECTOR // LATENCY: 1.2MS
        </div>
      </div>

      {/* BOTTOM CENTER: Interactive Stage Scrubber & State Indicator */}
      <div className="absolute bottom-4 inset-x-4 md:bottom-6 md:inset-x-8 z-20 flex flex-col items-center gap-2 pointer-events-auto">
        {/* Status Callout (Stage E Trust State badge) */}
        {currentStageId === 'E' && (
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-[#20D9FF]/10 border border-[#20D9FF]/40 text-[#20D9FF] text-[10px] md:text-[11px] font-mono tracking-widest uppercase shadow-[0_0_20px_rgba(32,217,255,0.2)] animate-pulse mb-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#20D9FF]" />
            <span>TRUST SIGNAL ESTABLISHED</span>
          </div>
        )}

        {/* 5-Stage Interactive Navigation Pills */}
        <div className="flex items-center gap-1 sm:gap-1.5 p-1 sm:p-1.5 rounded-2xl bg-[#050B14]/90 border border-white/10 backdrop-blur-xl shadow-2xl max-w-full overflow-hidden">
          {STAGE_CONFIGS.map((stage) => {
            const isActive = currentStageId === stage.id;
            return (
              <button
                key={stage.id}
                onClick={() => handleStageSelect(stage)}
                title={stage.title}
                className={`relative px-2 py-1 sm:px-2.5 sm:py-1.5 rounded-xl text-[9px] sm:text-[10px] md:text-[11px] font-mono tracking-wider transition-all duration-300 flex items-center gap-1 sm:gap-1.5 cursor-pointer whitespace-nowrap ${
                  isActive 
                    ? 'bg-[#20D9FF]/15 text-[#E1F4FF] border border-[#20D9FF]/60 shadow-[0_0_12px_rgba(32,217,255,0.25)]' 
                    : 'text-[#77BFFF]/60 hover:text-[#E1F4FF] hover:bg-white/5 border border-transparent'
                }`}
              >
                <span className={`w-1 h-1 rounded-full ${isActive ? 'bg-[#20D9FF]' : 'bg-transparent'}`} />
                <span className="hidden xl:inline">{stage.label}</span>
                <span className="xl:hidden">{stage.shortLabel}</span>
              </button>
            );
          })}

          {/* Pause / Play Toggle Button */}
          <button
            onClick={() => setIsPaused(!isPaused)}
            className="px-2 py-1 rounded-lg text-[#77BFFF]/70 hover:text-[#E1F4FF] hover:bg-white/5 transition-colors text-[9px] sm:text-[10px] font-mono"
            title={isPaused ? 'Resume Animation' : 'Pause Animation'}
          >
            {isPaused ? '▶' : '⏸'}
          </button>
        </div>
      </div>
    </div>
  );
}
