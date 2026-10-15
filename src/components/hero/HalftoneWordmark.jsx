import React, { useRef, useEffect } from 'react';

const PRESETS = {
  night: { background: "#0c0c0b", ink: "#e9e4da", warm: "#e9762b" },
  paper: { background: "#efebe3", ink: "#17150f", warm: "#c2361c" },
  ember: { background: "#160a06", ink: "#f2c48c", warm: "#ff5a1f" },
  cobalt: { background: "#0d1b4d", ink: "#dfe7ff", warm: "#ffcd3c" }
};

const DEFAULT_FONT = '"Inter Tight", "Inter Variable", "Inter", "Helvetica Neue", Arial, system-ui, sans-serif';
const DEFAULT_MONO = '"JetBrains Mono", "SF Mono", ui-monospace, Menlo, Consolas, monospace';

function hexToRgb(hex) {
  if (hex === "transparent" || !hex) return null;
  const match = /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i.exec((hex || "").trim());
  if (!match) return null;
  const full = match[1].length === 3 ? match[1].split("").map(c => c + c).join("") : match[1];
  return [parseInt(full.slice(0, 2), 16), parseInt(full.slice(2, 4), 16), parseInt(full.slice(4, 6), 16)];
}

function calculateRadius(brightness, gap) {
  const b = brightness < 0 ? 0 : brightness > 1 ? 1 : brightness;
  return Math.sqrt(b) * gap * 0.56;
}

function updatePhysics(x, y, vx, vy, origX, origY, mouseX, mouseY, radius) {
  const dx = x - mouseX;
  const dy = y - mouseY;
  const distSq = dx * dx + dy * dy;
  if (radius > 0 && distSq < radius * radius) {
    const dist = Math.sqrt(distSq) + 0.001;
    const force = (1 - dist / radius) * 2.6;
    vx += (dx / dist) * force;
    vy += (dy / dist) * force;
  }
  vx = (vx + (origX - x) * 0.05) * 0.84;
  vy = (vy + (origY - y) * 0.05) * 0.84;
  return [x + vx, y + vy, vx, vy];
}

function calculateColorWeight(x, y, origX, origY, maxDist) {
  const dist = Math.hypot(x - origX, y - origY);
  return Math.min(1, dist / maxDist);
}

function fitFontSize(textWidth, targetWidth) {
  return textWidth > 0 ? (targetWidth / textWidth) * 100 : 0;
}

export default function HalftoneWordmark({
  wordmark = "VERATIS",
  label = "",
  meta = "",
  columns = [],
  backToTop = false,
  preset = "night",
  palette,
  dotGap = 5,
  radius = 85,
  crop = 0.16,
  grain = 0.2,
  interactive = true,
  fontFamily = DEFAULT_FONT,
  fontWeight = 800,
  monoFamily = DEFAULT_MONO,
  height = "clamp(160px, 25vh, 240px)",
  className = ""
}) {
  const colors = { ...(PRESETS[preset] || PRESETS.night), ...(palette || {}) };
  const rootRef = useRef(null);
  const canvasRef = useRef(null);
  const stateRef = useRef({
    colors,
    dotGap,
    radius,
    crop,
    grain,
    interactive,
    fontFamily,
    fontWeight,
    wordmark
  });
  stateRef.current = {
    colors,
    dotGap,
    radius,
    crop,
    grain,
    interactive,
    fontFamily,
    fontWeight,
    wordmark
  };

  const effectKey = [
    wordmark,
    dotGap,
    crop,
    grain,
    fontFamily,
    fontWeight,
    colors.background,
    colors.ink,
    colors.warm
  ].join("|");

  useEffect(() => {
    const root = rootRef.current;
    const canvas = canvasRef.current;
    if (!root || !canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let width = 0;
    let heightPx = 0;
    let dpr = 1;
    let mouseX = -1e5;
    let mouseY = -1e5;
    let animId = 0;
    let isVisible = true;
    let needsRedraw = true;
    let ripple = { x: 0, y: 0, t: -1 };
    let particles = new Float32Array(0);
    let particleCount = 0;
    let noiseCanvas = null;

    const inkRgb = hexToRgb(stateRef.current.colors.ink) || [255, 255, 255];
    const warmRgb = hexToRgb(stateRef.current.colors.warm) || [213, 237, 154];

    const setup = () => {
      const cfg = stateRef.current;
      const rect = root.getBoundingClientRect();
      width = Math.max(1, Math.round(rect.width));
      heightPx = Math.max(1, Math.round(rect.height));
      dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(heightPx * dpr);

      const offCanvas = document.createElement("canvas");
      offCanvas.width = width;
      offCanvas.height = heightPx;
      const offCtx = offCanvas.getContext("2d", { willReadFrequently: true });
      if (!offCtx) return;

      offCtx.font = `${cfg.fontWeight} 100px ${cfg.fontFamily}`;
      const text = cfg.wordmark || " ";
      const initialWidth = offCtx.measureText(text).width;
      const fittedSize = fitFontSize(initialWidth, width * 1.02);

      offCtx.font = `${cfg.fontWeight} ${fittedSize}px ${cfg.fontFamily}`;
      const metrics = offCtx.measureText(text);
      const ascent = metrics.actualBoundingBoxAscent || fittedSize * 0.72;
      const cropOffset = Math.max(0, Math.min(0.6, cfg.crop));

      offCtx.fillStyle = "#000";
      offCtx.textBaseline = "alphabetic";
      const topPadding = 12;
      const topY = Math.max(topPadding, heightPx - ascent * (1 - cropOffset));
      const baselineY = topY + ascent;
      offCtx.fillText(text, (width - metrics.width) / 2, baselineY);

      const imgData = offCtx.getImageData(0, 0, width, heightPx).data;
      const step = Math.max(3, cfg.dotGap);
      const cols = Math.ceil(width / step);
      const rows = Math.ceil(heightPx / step);
      const rawParticles = [];

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          let sumAlpha = 0;
          for (let sy = 0; sy < 3; sy++) {
            for (let sx = 0; sx < 3; sx++) {
              const sampleX = Math.min(width - 1, Math.floor(c * step + (sx + 0.5) * step / 3));
              const sampleY = Math.min(heightPx - 1, Math.floor(r * step + (sy + 0.5) * step / 3));
              sumAlpha += imgData[(sampleY * width + sampleX) * 4 + 3];
            }
          }
          const brightness = sumAlpha / 2295;
          if (brightness < 0.06) continue;

          const px = c * step + step / 2;
          const py = r * step + step / 2;
          // [x, y, vx, vy, origX, origY, radius]
          rawParticles.push(px, py, 0, 0, px, py, calculateRadius(brightness, step));
        }
      }

      particles = new Float32Array(rawParticles);
      particleCount = rawParticles.length / 7;

      noiseCanvas = document.createElement("canvas");
      noiseCanvas.width = 256;
      noiseCanvas.height = 256;
      const nCtx = noiseCanvas.getContext("2d");
      if (nCtx) {
        const nData = nCtx.createImageData(256, 256);
        for (let i = 0; i < nData.data.length; i += 4) {
          const val = Math.random() * 255;
          nData.data[i] = nData.data[i + 1] = nData.data[i + 2] = val;
          nData.data[i + 3] = Math.random() < 0.5 ? 0 : 255;
        }
        nCtx.putImageData(nData, 0, 0);
      }

      needsRedraw = true;
    };

    const drawFrame = (time) => {
      const cfg = stateRef.current;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      if (cfg.colors.background === "transparent" || cfg.colors.background === "none") {
        ctx.clearRect(0, 0, width, heightPx);
      } else {
        ctx.fillStyle = cfg.colors.background;
        ctx.fillRect(0, 0, width, heightPx);
      }

      const activeRadius = cfg.interactive && !prefersReducedMotion ? Math.max(0, cfg.radius) : 0;
      const rippleElapsed = ripple.t < 0 ? 1e9 : time - ripple.t;
      const rippleDist = rippleElapsed * 0.9;
      let isMoving = false;

      for (let i = 0; i < particleCount; i++) {
        const offset = i * 7;
        let x = particles[offset];
        let y = particles[offset + 1];
        let vx = particles[offset + 2];
        let vy = particles[offset + 3];
        const origX = particles[offset + 4];
        const origY = particles[offset + 5];

        if (!prefersReducedMotion) {
          if (rippleElapsed < 900) {
            const rx = origX - ripple.x;
            const ry = origY - ripple.y;
            const rDist = Math.sqrt(rx * rx + ry * ry) + 0.001;
            const waveStrength = 1 - Math.min(1, Math.abs(rDist - rippleDist) / 26);
            if (waveStrength > 0) {
              const push = waveStrength * 3.2 * (1 - rippleElapsed / 900);
              vx += (rx / rDist) * push;
              vy += (ry / rDist) * push;
            }
          }

          const [newX, newY, newVx, newVy] = updatePhysics(
            x, y, vx, vy, origX, origY, mouseX, mouseY, activeRadius
          );
          x = newX;
          y = newY;
          vx = newVx;
          vy = newVy;

          if (Math.abs(vx) + Math.abs(vy) > 0.02 || Math.abs(x - origX) + Math.abs(y - origY) > 0.05) {
            isMoving = true;
          } else {
            x = origX;
            y = origY;
            vx = 0;
            vy = 0;
          }

          particles[offset] = x;
          particles[offset + 1] = y;
          particles[offset + 2] = vx;
          particles[offset + 3] = vy;
        }

        const colorWeight = calculateColorWeight(x, y, origX, origY, 28);
        if (colorWeight > 0.02) {
          const r = Math.round(inkRgb[0] + (warmRgb[0] - inkRgb[0]) * colorWeight);
          const g = Math.round(inkRgb[1] + (warmRgb[1] - inkRgb[1]) * colorWeight);
          const b = Math.round(inkRgb[2] + (warmRgb[2] - inkRgb[2]) * colorWeight);
          ctx.fillStyle = `rgb(${r},${g},${b})`;
        } else {
          ctx.fillStyle = cfg.colors.ink;
        }

        ctx.beginPath();
        ctx.arc(x, y, particles[offset + 6], 0, Math.PI * 2);
        ctx.fill();
      }

      if (noiseCanvas && cfg.grain > 0) {
        ctx.globalAlpha = Math.min(1, cfg.grain) * 0.09;
        ctx.globalCompositeOperation = "overlay";
        const pattern = ctx.createPattern(noiseCanvas, "repeat");
        if (pattern) {
          ctx.fillStyle = pattern;
          ctx.fillRect(0, 0, width, heightPx);
        }
        ctx.globalAlpha = 1;
        ctx.globalCompositeOperation = "source-over";
      }

      needsRedraw = isMoving || rippleElapsed < 900 || mouseX > -1e4;
    };

    const loop = (time) => {
      animId = 0;
      if (isVisible) {
        drawFrame(time);
        if (needsRedraw) {
          animId = requestAnimationFrame(loop);
        }
      }
    };

    const requestFrame = () => {
      needsRedraw = true;
      if (!animId && isVisible) {
        animId = requestAnimationFrame(loop);
      }
    };

    const getCanvasPos = (e) => {
      const rect = canvas.getBoundingClientRect();
      return [e.clientX - rect.left, e.clientY - rect.top];
    };

    const onPointerMove = (e) => {
      if (!stateRef.current.interactive) return;
      const [px, py] = getCanvasPos(e);
      mouseX = px;
      mouseY = py;
      requestFrame();
    };

    const onPointerLeave = () => {
      mouseX = -1e5;
      mouseY = -1e5;
      requestFrame();
    };

    const onPointerDown = (e) => {
      if (!stateRef.current.interactive || prefersReducedMotion || e.target.closest("a,button")) return;
      const [px, py] = getCanvasPos(e);
      ripple = { x: px, y: py, t: performance.now() };
      requestFrame();
    };

    setup();
    drawFrame(performance.now());
    requestFrame();

    root.addEventListener("pointermove", onPointerMove);
    root.addEventListener("pointerleave", onPointerLeave);
    root.addEventListener("pointerdown", onPointerDown);

    const resizeObserver = new ResizeObserver(() => {
      setup();
      requestFrame();
    });
    resizeObserver.observe(root);

    const intersectionObserver = new IntersectionObserver((entries) => {
      isVisible = entries[0] ? entries[0].isIntersecting : true;
      if (isVisible) requestFrame();
    });
    intersectionObserver.observe(root);

    let isMounted = true;
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => {
        if (isMounted) {
          setup();
          requestFrame();
        }
      });
    }

    return () => {
      isMounted = false;
      cancelAnimationFrame(animId);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      root.removeEventListener("pointermove", onPointerMove);
      root.removeEventListener("pointerleave", onPointerLeave);
      root.removeEventListener("pointerdown", onPointerDown);
    };
  }, [effectKey]);

  return (
    <footer
      ref={rootRef}
      className={`relative w-full overflow-hidden isolate select-none ${className}`}
      style={{
        height,
        backgroundColor: colors.background === "transparent" ? "transparent" : colors.background,
        color: colors.ink
      }}
    >
      <canvas ref={canvasRef} aria-hidden="true" className="absolute inset-0 w-full h-full block" />
      <span className="sr-only">{wordmark}</span>
    </footer>
  );
}
