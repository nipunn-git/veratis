import React, { useEffect, useRef, useState, useCallback } from "react";
import HalftoneWordmarkFooter from "@/components/ui/halftone-wordmark-footer";

/* ───────────────────────────── GLSL SHADERS ────────────────────────────── */
const VERT_SHADER = `#version 300 es
  in vec2 aPos;
  out vec2 vUv;
  void main() {
    vUv = aPos * 0.5 + 0.5;
    gl_Position = vec4(aPos, 0.0, 1.0);
  }
`;

const FRAG_SHADER = `#version 300 es
precision highp float;

uniform sampler2D uSrc;   // 1. Fresco hands with "YOU"
uniform sampler2D uDark;  // 2. Dark topographic contour hands
uniform sampler2D uFrag;  // 3. Silvery fragmented landscape
uniform sampler2D uDest;  // 4. White & matte grey halftone face

uniform float uP;    // Progress [0.0 - 1.0]
uniform float uT;    // Time in seconds
uniform vec2 uRes;   // Canvas resolution in pixels

in vec2 vUv;
out vec4 fragColor;

/* ── 2D Simplex Noise ──────────────────────────── */
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec3 permute(vec3 x) { return mod289(((x * 34.0) + 1.0) * x); }

float snoise(vec2 v) {
  const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
  vec2 i  = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod289(i);
  vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
  vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
  m = m * m; m = m * m;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
  vec3 g;
  g.x  = a0.x * x0.x + h.x * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

float fbm(vec2 p, int octaves) {
  float v = 0.0;
  float a = 0.5;
  for (int i = 0; i < 6; i++) {
    if (i >= octaves) break;
    v += a * snoise(p);
    p *= 2.08;
    a *= 0.5;
  }
  return v;
}

/* ── Precise Cover UV ─────────────────────────────── */
vec2 getCoverUv(vec2 uv, float ia, float sa) {
  vec2 st = uv - 0.5;
  if (sa > ia) {
    st.y *= ia / sa;
  } else {
    st.x *= sa / ia;
  }
  return st + 0.5;
}

/* ── Slower, Measured Monochromatic Digital Screen Glitch Engine ── */
vec2 getGlitchDisplacement(vec2 uv, float t) {
  vec2 disp = vec2(0.0);

  // 1. Measured horizontal slice jumps (calm 7 fps cadence)
  float sliceBlock = floor(uv.y * 65.0 + t * 5.0);
  float sliceNoise = snoise(vec2(sliceBlock * 0.35, floor(t * 7.0) * 0.85));
  if (abs(sliceNoise) > 0.62) {
    disp.x += sign(sliceNoise) * (abs(sliceNoise) - 0.62) * 0.020;
  }

  // 2. Micro scanline jitter (deliberate 11 fps ticks)
  float microBlock = floor(uv.y * 160.0 - t * 8.0);
  float microNoise = snoise(vec2(microBlock * 0.22, floor(t * 11.0) * 0.9));
  if (abs(microNoise) > 0.68) {
    disp.x += sign(microNoise) * (abs(microNoise) - 0.68) * 0.012;
  }

  // 3. Periodic subtle micro vertical twitch
  float vJitter = step(0.96, fract(sin(floor(t * 8.0) * 45.1) * 43758.5453));
  disp.y += (vJitter * 0.004 - 0.002);

  return disp;
}

/* ── Monochromatic Matte Grey & White Sampling (Slower, Clean Analog Texture) ── */
vec3 sampleGlitchedDest(vec2 uv, vec2 disp, float t) {
  vec2 sampleUv = clamp(uv + disp, 0.001, 0.999);
  vec4 texCol = texture(uDest, sampleUv);

  // Strictly monochromatic matte luminance (white, grey, black - NO extra colors)
  float lum = dot(texCol.rgb, vec3(0.299, 0.587, 0.114));
  vec3 monoCol = vec3(lum);

  // Slower, smooth scanline drift & calm flicker
  float scanline = 0.96 + 0.04 * sin(uv.y * uRes.y * 0.90 + t * 2.2);
  float flicker = 1.0 - 0.025 * step(0.95, fract(sin(floor(t * 8.0) * 12.9898) * 43758.5453));
  return monoCol * scanline * flicker;
}

/* ── Cross Sparkle Star with Needle Diffraction Spikes ── */
vec4 drawCrossStar(vec2 pxCoord, vec2 pos, float reach, float core, float twinkle, float alphaMult) {
  vec2 d = pxCoord - pos;
  float th = 1.25; // 1px needle-thin spike width

  // Horizontal & vertical needle spikes
  float hx = step(abs(d.y), th) * pow(max(1.0 - abs(d.x) / max(reach, 1.0), 0.0), 1.25);
  float vy = step(abs(d.x), th) * pow(max(1.0 - abs(d.y) / max(reach, 1.0), 0.0), 1.25);

  // 45-degree diagonal needle spikes
  vec2 rd = vec2(d.x + d.y, d.x - d.y) * 0.7071;
  float diag = 0.42 * max(
    step(abs(rd.y), th) * pow(max(1.0 - abs(rd.x) / max(reach * 0.30, 1.0), 0.0), 2.0),
    step(abs(rd.x), th) * pow(max(1.0 - abs(rd.y) / max(reach * 0.30, 1.0), 0.0), 2.0)
  );

  float spikeIntensity = clamp(max(max(hx, vy), diag), 0.0, 1.0);

  // Chunky pixel-disc core
  float dist = length(d);
  float coreDisc = step(dist, core);
  float glow = exp(-dist / max(core * 2.0, 1.0)) * (1.0 - coreDisc) * 0.5;

  float totalLight = (spikeIntensity * 0.95 + coreDisc + glow) * twinkle * alphaMult;
  if (totalLight <= 0.001) return vec4(0.0);

  // Clean luminous white/silver color
  vec3 col = mix(vec3(0.92, 0.95, 1.0), vec3(1.0, 1.0, 1.0), coreDisc);
  return vec4(col * totalLight, totalLight);
}

/* ── Transparent Moving Sparkles, Stars & Particles ── */
vec4 computeSparklesAndStars(vec2 screenPx, vec2 resPx, float t) {
  vec4 acc = vec4(0.0);

  // 1. Moving cross-stars
  // Center Hero Cross Star
  vec2 p1 = vec2(
    resPx.x * (0.50 + 0.10 * sin(t * 0.28) + 0.03 * cos(t * 0.65)),
    resPx.y * (0.48 + 0.07 * cos(t * 0.24) - 0.03 * sin(t * 0.52))
  );
  float tw1 = 0.78 + 0.22 * sin(t * 3.4);
  acc += drawCrossStar(screenPx, p1, 75.0, 4.0, tw1, 0.95);

  // Upper Left Cross Star
  vec2 p2 = vec2(
    resPx.x * (0.22 + 0.07 * cos(t * 0.32 + 1.2)),
    resPx.y * (0.72 + 0.06 * sin(t * 0.27 + 0.9))
  );
  float tw2 = 0.72 + 0.28 * sin(t * 4.2 + 1.5);
  acc += drawCrossStar(screenPx, p2, 55.0, 3.2, tw2, 0.88);

  // Upper Right Cross Star
  vec2 p3 = vec2(
    resPx.x * (0.80 + 0.08 * sin(t * 0.36 + 2.5)),
    resPx.y * (0.76 + 0.05 * cos(t * 0.31 + 2.1))
  );
  float tw3 = 0.68 + 0.32 * sin(t * 3.9 + 2.8);
  acc += drawCrossStar(screenPx, p3, 50.0, 3.0, tw3, 0.82);

  // Mid-Lower Left Cross Star
  vec2 p4 = vec2(
    resPx.x * (0.15 + 0.06 * sin(t * 0.22 + 4.2)),
    resPx.y * (0.34 + 0.06 * cos(t * 0.29 + 3.4))
  );
  float tw4 = 0.70 + 0.30 * sin(t * 4.6 + 4.1);
  acc += drawCrossStar(screenPx, p4, 44.0, 2.8, tw4, 0.78);

  // Lower Right Cross Star
  vec2 p5 = vec2(
    resPx.x * (0.74 + 0.09 * cos(t * 0.26 + 5.1)),
    resPx.y * (0.24 + 0.06 * sin(t * 0.33 + 4.6))
  );
  float tw5 = 0.75 + 0.25 * sin(t * 3.6 + 5.3);
  acc += drawCrossStar(screenPx, p5, 52.0, 3.0, tw5, 0.85);

  // 2. Parallax Drifting Twinkling Pixel Stars
  for (int layer = 0; layer < 3; layer++) {
    float fl = float(layer);
    float speed = 16.0 + fl * 20.0;
    float scale = 36.0 - fl * 7.0;

    vec2 driftCoord = screenPx + vec2(t * 5.0 * (fl - 1.0), t * speed);
    vec2 cellId = floor(driftCoord / scale);
    vec2 cellFrac = fract(driftCoord / scale) - 0.5;

    vec2 seed = cellId + vec2(fl * 127.1, fl * 311.7);
    float h1 = fract(sin(dot(seed, vec2(12.9898, 78.233))) * 43758.5453);
    float h2 = fract(sin(dot(seed, vec2(39.346, 11.135))) * 23421.631);

    if (h1 > 0.86) {
      vec2 starPos = (vec2(h1, h2) - 0.5) * 0.7;
      float dist = length(cellFrac - starPos) * scale;
      float radius = 1.2 + h2 * 2.6;
      float dotMask = smoothstep(radius + 0.8, radius - 0.5, dist);
      float tw = 0.5 + 0.5 * sin(t * (2.8 + h1 * 4.5) + h2 * 6.28);
      float alpha = dotMask * tw * (0.35 + 0.55 * h2);

      vec3 starCol = mix(vec3(0.90, 0.95, 1.0), vec3(1.0, 1.0, 1.0), h1);
      acc.rgb += starCol * alpha;
      acc.a = max(acc.a, alpha);
    }
  }

  return clamp(acc, 0.0, 1.0);
}

void main() {
  vec2 uv = vUv;
  float p = clamp(uP, 0.0, 1.0);
  float t = uT;

  // Aspect ratios: reference texture is 1203 x 678 (1.7743)
  float ia = 1203.0 / 678.0;
  float sa = uRes.x / uRes.y;
  vec2 aUv = getCoverUv(uv, ia, sa);
  vec2 clampedUv = clamp(aUv, 0.001, 0.999);

  // ── When p >= 0.99: Halftone face with Preloaded Rapid Glitch + Moving Sparkles & Stars ──
  if (p >= 0.99) {
    vec2 glitchDisp = getGlitchDisplacement(clampedUv, t);
    vec3 baseCol = sampleGlitchedDest(clampedUv, glitchDisp, t);
    vec2 screenPx = vUv * uRes;
    vec4 sparkles = computeSparklesAndStars(screenPx, uRes, t);
    vec3 finalCol = baseCol + sparkles.rgb * 0.88;

    fragColor = vec4(finalCol, 1.0);
    return;
  }

  // ── Transition & Initial Hands State (Centered precisely on "YOU") ──
  vec2 tearCenter = vec2(0.500, 0.510);
  vec2 delta = clampedUv - tearCenter;
  delta.x *= ia;
  float dist = length(delta);

  // 1. Multi-scale procedural noise
  float n1 = fbm(clampedUv * 4.2 + vec2(t * 0.08, -t * 0.04), 4);
  float n2 = fbm(clampedUv * 11.5 - vec2(t * 0.05, t * 0.12), 3);

  // 2. Horizontal tear shreds
  float row = floor(clampedUv.y * 120.0) * 0.35;
  float rowGlitch = snoise(vec2(row + t * 1.5, clampedUv.x * 5.0)) * 0.06;

  // 3. Radius expansion
  float maxRadius = 2.1;
  float expansion = smoothstep(0.02, 0.96, p);
  float currentRadius = expansion * maxRadius;

  // 4. Irregular tear boundary
  float tearBoundary = dist - (n1 * 0.22 + n2 * 0.09 + rowGlitch);
  float inside = smoothstep(currentRadius + 0.035, currentRadius - 0.035, tearBoundary);

  float borderDist = abs(tearBoundary - currentRadius);
  float border = smoothstep(0.14, 0.0, borderDist) 
               * smoothstep(0.02, 0.15, p) 
               * (1.0 - smoothstep(0.82, 0.98, p));

  // 5. Localized tear displacement
  vec2 tearDisplace = vec2(n1 * 0.04 + rowGlitch * 0.25, n2 * 0.03) * border * smoothstep(0.0, 0.5, p);
  vec2 srcUv = clamp(clampedUv + tearDisplace, 0.001, 0.999);
  vec2 destUv = clamp(clampedUv - tearDisplace * 0.5, 0.001, 0.999);

  // 6. Outside tear: fresco hands -> dark contour hands
  float darkMix = smoothstep(0.01, 0.20, p);
  vec4 colOutside = mix(texture(uSrc, srcUv), texture(uDark, srcUv), darkMix);

  // 7. Inside tear: immediately glitched halftone face with sparkles (preloaded & rapid)
  vec2 innerGlitch = getGlitchDisplacement(destUv, t);
  vec3 glitchedFace = sampleGlitchedDest(destUv, innerGlitch, t);
  vec2 screenPx = vUv * uRes;
  vec4 innerSparkles = computeSparklesAndStars(screenPx, uRes, t);
  vec4 colHalftone = vec4(glitchedFace + innerSparkles.rgb * 0.88, 1.0);

  // 8. Composite inside & outside immediately
  vec4 col = mix(colOutside, colHalftone, inside);

  // 9. Digital debris & sparkles along border (clean silver/white)
  float spk1 = step(0.56, snoise(clampedUv * 150.0 + vec2(t * 3.2, t * 1.6)));
  float spk2 = step(0.54, snoise(clampedUv * 300.0 - vec2(t * 2.4, t * 2.9)));
  float crystalSparkle = spk1 * spk2;
  float horizStreak = step(0.92, snoise(vec2(floor(clampedUv.y * 130.0) * 0.8 + t * 4.0, clampedUv.x * 26.0)));
  float debris = (crystalSparkle * 1.6 + horizStreak * 0.7) * border;
  col = mix(col, vec4(1.0, 1.0, 1.0, 1.0), clamp(debris + border * 0.5, 0.0, 0.95));

  // 10. Idle sparkle on the "YOU" text when p == 0
  if (p < 0.04) {
    float idleDist = length((clampedUv - tearCenter) * vec2(ia, 1.0));
    float idleSparkle = step(0.68, snoise(clampedUv * 75.0 + t * 2.5)) 
                      * step(0.65, snoise(clampedUv * 150.0 - t * 1.8))
                      * smoothstep(0.09, 0.0, idleDist)
                      * (0.5 + 0.5 * sin(t * 3.5));
    col = mix(col, vec4(1.0, 1.0, 1.0, 1.0), idleSparkle * (1.0 - p / 0.04));
  }

  fragColor = col;
}
`;

/* ───────────────────────── WebGL HELPERS ────────────────────────────────── */
function compileShader(gl, type, src) {
  const s = gl.createShader(type);
  gl.shaderSource(s, src);
  gl.compileShader(s);
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
    console.error("Shader compile error:", gl.getShaderInfoLog(s));
    gl.deleteShader(s);
    return null;
  }
  return s;
}

function createProgram(gl, vertSrc, fragSrc) {
  const vs = compileShader(gl, gl.VERTEX_SHADER, vertSrc);
  const fs = compileShader(gl, gl.FRAGMENT_SHADER, fragSrc);
  if (!vs || !fs) return null;

  const p = gl.createProgram();
  gl.attachShader(p, vs);
  gl.attachShader(p, fs);
  gl.linkProgram(p);
  if (!gl.getProgramParameter(p, gl.LINK_STATUS)) {
    console.error("Program link error:", gl.getProgramInfoLog(p));
    return null;
  }
  return p;
}

function createTextureWithPlaceholder(gl) {
  const tex = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, tex);
  gl.texImage2D(
    gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0,
    gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([14, 13, 11, 255])
  );
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  return tex;
}

function loadTextureInto(gl, tex, url) {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      resolve(tex);
    };
    img.onerror = () => {
      console.warn("Failed to load texture at:", url);
      resolve(tex);
    };
    img.src = url;
  });
}

/* ─────────────────────── EASING & TWEENING ────────────────────────── */
const easeInQuad     = (t) => t * t;
const easeInOutCubic = (t) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
const easeOutCubic   = (t) => 1 - Math.pow(1 - t, 3);

function makeTween(stages, onUpdate, onComplete) {
  let cancelled = false;
  let stageIdx = 0;
  let fromVal = 0;
  let startTs = null;

  function step(ts) {
    if (cancelled) return;
    if (!startTs) startTs = ts;

    const s = stages[stageIdx];
    const elapsed = (ts - startTs) / (s.duration * 1000);
    const t = Math.min(Math.max(elapsed, 0), 1);

    onUpdate(fromVal + (s.toValue - fromVal) * s.ease(t));

    if (t < 1) {
      requestAnimationFrame(step);
      return;
    }

    stageIdx++;
    if (stageIdx < stages.length) {
      fromVal = s.toValue;
      startTs = null;
      requestAnimationFrame(step);
    } else {
      onComplete();
    }
  }

  requestAnimationFrame(step);
  return () => {
    cancelled = true;
  };
}

/* ───────────────────────────── COMPONENT ───────────────────────────────── */
export default function WebGLHero({ onExplore, onPhaseChange }) {
  const canvasRef         = useRef(null);
  const glRef             = useRef(null);
  const progRef           = useRef(null);
  const texRef            = useRef({ src: null, dark: null, frag: null, dest: null });
  const texturesLoadedRef = useRef(false);
  const pendingTriggerRef = useRef(false);
  const uniformRef        = useRef({});
  const frameRef          = useRef(null);
  const startTsRef        = useRef(null);
  const cancelTweenRef    = useRef(null);
  const progressRef       = useRef(0);
  const transitionedRef   = useRef(false);
  const isPlayingRef      = useRef(false);
  const lastTriggerTsRef  = useRef(0);

  const [phase, setPhase]     = useState("idle"); // 'idle' | 'animating' | 'done'
  const [glError, setGlError] = useState(false);
  const [showWordmark, setShowWordmark] = useState(false);
  const showWordmarkRef = useRef(false);

  const onPhaseChangeRef = useRef(onPhaseChange);
  useEffect(() => {
    onPhaseChangeRef.current = onPhaseChange;
  }, [onPhaseChange]);

  const updatePhase = useCallback((newPhase) => {
    setPhase(newPhase);
    onPhaseChangeRef.current?.(newPhase);
  }, []);

  /* Handle dynamic window resize */
  const handleResize = useCallback(() => {
    const canvas = canvasRef.current;
    const gl     = glRef.current;
    if (!canvas || !gl || !progRef.current) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width  = Math.floor(canvas.clientWidth * dpr);
    canvas.height = Math.floor(canvas.clientHeight * dpr);
    gl.viewport(0, 0, canvas.width, canvas.height);
    if (uniformRef.current.uRes) {
      gl.uniform2f(uniformRef.current.uRes, canvas.width, canvas.height);
    }
  }, []);

  /* Trigger slow, proper, furnished cinematic tear transition */
  const triggerTransition = useCallback(() => {
    const now = performance.now();
    if (now - lastTriggerTsRef.current < 250) return;
    lastTriggerTsRef.current = now;

    if (isPlayingRef.current || transitionedRef.current) return;
    if (!progRef.current) return;

    if (!texturesLoadedRef.current) {
      pendingTriggerRef.current = true;
      return;
    }

    isPlayingRef.current = true;
    updatePhase("animating");

    cancelTweenRef.current = makeTween(
      [
        // Stage 1: Slow, tactile initial rupture at "YOU" (0.85s)
        { toValue: 0.22, duration: 0.85, ease: easeInQuad },
        // Stage 2: Rich, furnished tearing expansion unfolding across the page (1.45s)
        { toValue: 0.75, duration: 1.45, ease: easeInOutCubic },
        // Stage 3: Gentle, majestic settling as tear finishes (0.90s)
        { toValue: 1.00, duration: 0.90, ease: easeOutCubic },
      ],
      (v) => {
        progressRef.current = v;
        if (v >= 0.35 && !showWordmarkRef.current) {
          showWordmarkRef.current = true;
          setShowWordmark(true);
        }
      },
      () => {
        showWordmarkRef.current = true;
        setShowWordmark(true);
        transitionedRef.current = true;
        isPlayingRef.current    = false;
        updatePhase("done");
      }
    );
  }, [updatePhase]);

  /* Universal pointer/click/touch interaction handler */
  const handleInteraction = useCallback((e) => {
    if (e) {
      e.stopPropagation();
      if (e.type === 'touchend' && e.cancelable) {
        e.preventDefault();
      }
    }
    triggerTransition();
  }, [triggerTransition]);

  /* Keyboard trigger support */
  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        triggerTransition();
      }
    },
    [triggerTransition]
  );

  /* Dev reset button */
  const resetTransition = useCallback(() => {
    if (cancelTweenRef.current) cancelTweenRef.current();
    progressRef.current     = 0;
    transitionedRef.current = false;
    isPlayingRef.current    = false;
    showWordmarkRef.current = false;
    setShowWordmark(false);
    updatePhase("idle");
  }, [updatePhase]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    setGlError(false);

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width  = Math.floor(canvas.clientWidth * dpr);
    canvas.height = Math.floor(canvas.clientHeight * dpr);

    const gl = canvas.getContext("webgl2", { antialias: true, alpha: false });
    if (!gl) {
      console.warn("WebGL2 not supported, falling back to basic view");
      setGlError(true);
      return;
    }
    glRef.current = gl;

    const prog = createProgram(gl, VERT_SHADER, FRAG_SHADER);
    if (!prog) {
      setGlError(true);
      return;
    }
    progRef.current = prog;
    gl.useProgram(prog);

    /* Fullscreen quad buffer */
    const vbo = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
      gl.STATIC_DRAW
    );
    const aPos = gl.getAttribLocation(prog, "aPos");
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    /* Uniforms */
    const u = {
      uSrc:  gl.getUniformLocation(prog, "uSrc"),
      uDark: gl.getUniformLocation(prog, "uDark"),
      uFrag: gl.getUniformLocation(prog, "uFrag"),
      uDest: gl.getUniformLocation(prog, "uDest"),
      uP:    gl.getUniformLocation(prog, "uP"),
      uT:    gl.getUniformLocation(prog, "uT"),
      uRes:  gl.getUniformLocation(prog, "uRes"),
    };
    uniformRef.current = u;

    gl.uniform1i(u.uSrc,  0);
    gl.uniform1i(u.uDark, 1);
    gl.uniform1i(u.uFrag, 2);
    gl.uniform1i(u.uDest, 3);
    gl.uniform2f(u.uRes, canvas.width, canvas.height);

    /* Initialize textures with 1x1 placeholders so render starts immediately */
    const tS = createTextureWithPlaceholder(gl);
    const tD = createTextureWithPlaceholder(gl);
    const tF = createTextureWithPlaceholder(gl);
    const tDest = createTextureWithPlaceholder(gl);
    texRef.current = { src: tS, dark: tD, frag: tF, dest: tDest };

    startTsRef.current = performance.now();

    /* Render loop begins immediately on frame 1 */
    const render = (ts) => {
      frameRef.current = requestAnimationFrame(render);
      const elapsed = (ts - startTsRef.current) / 1000;
      const { src, dark, frag, dest } = texRef.current;

      gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, src);
      gl.activeTexture(gl.TEXTURE1); gl.bindTexture(gl.TEXTURE_2D, dark);
      gl.activeTexture(gl.TEXTURE2); gl.bindTexture(gl.TEXTURE_2D, frag);
      gl.activeTexture(gl.TEXTURE3); gl.bindTexture(gl.TEXTURE_2D, dest);

      gl.uniform1f(u.uP, progressRef.current);
      gl.uniform1f(u.uT, elapsed);

      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    };
    frameRef.current = requestAnimationFrame(render);

    /* Load HD assets asynchronously and update textures in-place */
    Promise.all([
      loadTextureInto(gl, tS, "/art-start.png"),
      loadTextureInto(gl, tD, "/art-dark-contour.png"),
      loadTextureInto(gl, tF, "/art-landscape-frag.png"),
      loadTextureInto(gl, tDest, "/art-dest-landscape.png"),
    ]).then(() => {
      texturesLoadedRef.current = true;
      if (pendingTriggerRef.current) {
        pendingTriggerRef.current = false;
        triggerTransition();
      }
    });

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      progressRef.current = 1.0;
      updatePhase("done");
    }

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
      if (cancelTweenRef.current) cancelTweenRef.current();
      gl.deleteProgram(prog);
    };
  }, [handleResize, triggerTransition, updatePhase]);

  /* Fallback if WebGL2 is completely unavailable */
  if (glError) {
    return (
      <section
        id="hero"
        className="relative w-full h-[100svh] flex items-center justify-center bg-[#0e0d0b] text-white"
      >
        <p className="font-mono text-sm tracking-widest text-white/60">
          WebGL2 acceleration not available.
        </p>
      </section>
    );
  }

  return (
    <section
      id="hero"
      aria-label="Veratis Hero Section"
      className="relative w-full overflow-hidden select-none"
      style={{ height: "100svh", background: "#0e0d0b" }}
    >
      {/* ── WebGL Canvas (Immediate Interactive Experience) ── */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 z-0 w-full h-full"
        onClick={handleInteraction}
        onPointerDown={handleInteraction}
        onKeyDown={handleKeyDown}
        tabIndex={phase === "idle" ? 0 : -1}
        role="button"
        aria-label="Interactive visual canvas"
        style={{
          cursor: phase === "idle" ? "pointer" : "default",
          display: "block",
          pointerEvents: "auto",
        }}
      />

      {/* ── "REALITY HAS A BLIND SPOT" at the Bottom ── */}
      {phase === "idle" && (
        <div className="absolute inset-x-0 bottom-0 z-30 flex flex-col items-center justify-end pb-3 sm:pb-4 pointer-events-none select-none overflow-visible px-4">
          <button
            type="button"
            onClick={handleInteraction}
            onPointerDown={handleInteraction}
            className="text-white pointer-events-auto cursor-pointer select-none touch-manipulation transition-opacity duration-150 hover:opacity-80 active:opacity-60 whitespace-nowrap"
            style={{
              fontSize: "clamp(1.1rem, 3.4vw, 3.2rem)",
              fontFamily: "'Inter', 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif",
              letterSpacing: "0.04em",
              fontWeight: 300,
              lineHeight: 1,
              textShadow: "none",
              color: "#FFFFFF",
              background: "transparent",
              border: "none",
              outline: "none",
              margin: 0,
              padding: 0,
              display: "inline-block",
            }}
          >
            REALITY HAS A BLIND SPOT
          </button>
        </div>
      )}

      {/* ── Preloaded Interactive Halftone Dot 'VERATIS' Wordmark (Appears Quicker) ── */}
      <div
        className={`absolute inset-x-0 bottom-0 z-20 flex flex-col justify-end transition-opacity duration-300 ease-out ${
          showWordmark ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        <HalftoneWordmarkFooter
          wordmark="VERATIS"
          height="clamp(160px, 25vh, 240px)"
          crop={0.16}
          dotGap={5}
          radius={85}
          grain={0.2}
          interactive={true}
          palette={{
            background: "transparent",
            ink: "#ffffff",
            warm: "#d5ed9a",
          }}
          columns={[]}
          label=""
          meta=""
          backToTop={false}
        />
      </div>

      {/* ── Minimalist Scroll Prompt on Completed Halftone Page ── */}
      <div
        className={`absolute bottom-[clamp(170px,27vh,255px)] inset-x-0 z-30 flex justify-center transition-opacity duration-500 ease-out ${
          phase === "done" ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        <button
          onClick={onExplore}
          className="group flex flex-col items-center gap-1.5 text-white/60 hover:text-white transition-colors cursor-pointer pointer-events-auto backdrop-blur-xs py-1.5 px-3.5 rounded-full bg-black/25 border border-white/10 shadow-xs"
          aria-label="Scroll to explore dashboard"
        >
          <span className="text-[10px] font-mono tracking-[0.3em] uppercase">Scroll</span>
          <svg
            width="16"
            height="9"
            viewBox="0 0 18 10"
            fill="none"
            className="transition-transform group-hover:translate-y-1"
          >
            <path
              d="M1 1L9 8L17 1"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </div>

      {/* ── Dev Rewatch / Reset Button ── */}
      {phase === "done" && (
        <button
          onClick={resetTransition}
          className="absolute top-5 right-5 z-30 px-3 py-1.5 rounded-full bg-black/50 border border-white/15 text-white/70 hover:text-white text-[11px] font-mono hover:bg-black/80 transition-all cursor-pointer backdrop-blur-md shadow-lg"
          title="Replay cinematic transition"
        >
          ↺ Rewatch
        </button>
      )}
    </section>
  );
}
