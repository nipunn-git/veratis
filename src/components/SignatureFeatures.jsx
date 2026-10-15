import React, { useState } from 'react';
import { 
  Radar, 
  Search, 
  Clock, 
  Share2, 
  GitCompare, 
  HelpCircle, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle,
  ArrowUpRight
} from 'lucide-react';

export default function SignatureFeatures({ onStartInvestigation }) {
  const [activeAutopsyIdx, setActiveAutopsyIdx] = useState(0);
  const [activeHypothesis, setActiveHypothesis] = useState(0);
  const [selectedGravityNode, setSelectedGravityNode] = useState("CLAIM");

  const autopsyFindings = [
    {
      title: "Corneal Reflection Angle",
      label: "Optical ray mismatch",
      detail: "Left eye cornea reflects a dispersed overhead spotlight, while right eye reflects a single linear tube strip. Euclidean 3D ray-cast calculation proves light sources are mutually irreconcilable (Δθ = 41.2°).",
      severity: "CRITICAL ANOMALY"
    },
    {
      title: "Mandibular Fourier Dropout",
      label: "Neural mask blend",
      detail: "Fourier 2D spectrum shows high-frequency noise dropout along the lower jaw boundary. Typical signature of generative inpainting mask smoothing.",
      severity: "CRITICAL ANOMALY"
    },
    {
      title: "Fabric Micro-Texture",
      label: "Latent upscaler glitch",
      detail: "Twill weave on suit lapel exhibits chaotic non-periodic patterns characteristic of neural diffusion model upscaling.",
      severity: "TEXTURE HALLUCINATION"
    }
  ];

  return (
    <section id="engines" className="relative py-28 md:py-36 bg-[#f5f4ef] text-[#111b14] overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-10 border-b border-[#e2e5d8] mb-20">
          <div>
            <div className="text-xs font-mono text-[#697a6d] tracking-widest uppercase mb-3">
              / SIGNATURE ENGINES [003]
            </div>
            <h2 className="text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-[#111b14] leading-tight">
              Six instruments of <br />
              <span className="font-serif italic font-normal text-[#243427]">evidentiary precision.</span>
            </h2>
          </div>

          <div className="max-w-md text-sm text-[#505d52] font-light leading-relaxed">
            Engineered to dismantle manipulation from opposing optical, temporal, and semantic dimensions.
          </div>
        </div>

        <div className="space-y-16">
          {/* ==============================================================
              FEATURE 1 & 2 ASYMMETRIC GRID (Souma Style)
              ============================================================== */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            
            {/* 1. DECEPTION RADAR (Left 6 Cols) */}
            <div className="lg:col-span-6 p-8 md:p-12 rounded-[32px] bg-[#ecefe5] border border-[#dce0d0] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-xs font-mono text-[#697a6d] mb-4">
                  <span>ENGINE 01</span>
                  <span>5-AXIS TRIANGULATION</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold text-[#111b14] mb-3">
                  Deception Radar
                </h3>
                <p className="text-sm text-[#505d52] leading-relaxed mb-6 font-light">
                  Single-model AI detectors get bypassed by new weights. The Deception Radar isolates verification into 5 orthogonal dimensions so no single vector can conceal the truth.
                </p>

                {/* Radar SVG */}
                <div className="p-4 rounded-2xl bg-white border border-[#dce0d0] flex items-center justify-center my-4">
                  <div className="relative w-56 h-56 flex items-center justify-center">
                    <svg viewBox="0 0 200 200" className="w-full h-full">
                      {[20, 40, 60, 80].map((r, i) => (
                        <polygon
                          key={i}
                          points="100,20 176,75 147,165 53,165 24,75"
                          fill="none"
                          stroke="#e0e4d7"
                          strokeWidth="1.5"
                          transform={`scale(${r / 80})`}
                          transform-origin="100 100"
                        />
                      ))}
                      <polygon
                        points="100,26 168,79 142,159 58,160 38,82"
                        fill="rgba(36, 52, 39, 0.15)"
                        stroke="#243427"
                        strokeWidth="2.5"
                      />
                      <circle cx="100" cy="26" r="4" fill="#243427" />
                      <circle cx="168" cy="79" r="4" fill="#243427" />
                      <circle cx="142" cy="159" r="4" fill="#243427" />
                      <circle cx="58" cy="160" r="4" fill="#243427" />
                      <circle cx="38" cy="82" r="4" fill="#243427" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-[#dce0d0] flex items-center justify-between text-xs font-mono text-[#505d52]">
                <span>VISUAL • CONTEXT • TIME • SOURCE • CLAIM</span>
                <span className="font-bold text-[#111b14]">87.8% DEVIATION</span>
              </div>
            </div>

            {/* 2. EVIDENCE AUTOPSY (Right 6 Cols) */}
            <div className="lg:col-span-6 p-8 md:p-12 rounded-[32px] bg-[#243427] text-[#f5f4ef] border border-[#344938] flex flex-col justify-between shadow-lg">
              <div>
                <div className="flex items-center justify-between text-xs font-mono text-[#9db2a1] mb-4">
                  <span>ENGINE 02</span>
                  <span>SUB-PIXEL ANATOMY</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold text-[#f5f4ef] mb-3">
                  Evidence Autopsy
                </h3>
                <p className="text-sm text-[#9db2a1] leading-relaxed mb-6 font-light">
                  Clickable inspection of suspicious coordinates. Surfaces specular highlights, Fourier frequency dropouts, and upscaler hallucination textures.
                </p>

                {/* Autopsy finding tabs */}
                <div className="space-y-3 mb-6">
                  {autopsyFindings.map((finding, idx) => (
                    <div
                      key={idx}
                      onClick={() => setActiveAutopsyIdx(idx)}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                        activeAutopsyIdx === idx 
                          ? 'bg-[#18241b] border-[#d5ed9a]' 
                          : 'bg-[#1e2c21] border-[#2d4032] opacity-75 hover:opacity-100'
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs font-mono mb-1">
                        <span className="text-[#d5ed9a] font-bold">{finding.title}</span>
                        <span className="text-[10px] text-[#9db2a1]">{finding.severity}</span>
                      </div>
                      <p className="text-xs text-[#9db2a1] leading-relaxed font-light">
                        {finding.detail}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-[#2e4233] text-xs font-mono text-[#9db2a1] flex items-center justify-between">
                <span>FOURIER 2D DECOMPOSITION</span>
                <span className="text-[#d5ed9a]">3 REGIONS IDENTIFIED</span>
              </div>
            </div>

          </div>

          {/* ==============================================================
              FEATURE 3 & 4: REALITY TIMELINE & GRAVITY MAP
              ============================================================== */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            
            {/* 3. REALITY TIMELINE (7 Cols) */}
            <div className="lg:col-span-7 p-8 md:p-12 rounded-[32px] bg-[#ecefe5] border border-[#dce0d0] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-xs font-mono text-[#697a6d] mb-4">
                  <span>ENGINE 03</span>
                  <span>CHRONOLOGICAL PROVENANCE</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold text-[#111b14] mb-3">
                  Reality Timeline
                </h3>
                <p className="text-sm text-[#505d52] leading-relaxed mb-6 font-light">
                  Maps known content history against satellite transponders, solar shadow azimuths, and verified eyewitness logs.
                </p>

                <div className="space-y-3 font-mono text-xs">
                  <div className="p-4 rounded-xl bg-white border border-[#dce0d0] flex items-start justify-between gap-4">
                    <div>
                      <span className="text-[11px] font-bold text-[#243427]">14:00 CET // FLIGHT TELEMETRY</span>
                      <p className="text-[#505d52] text-xs mt-1">ADS-B transponder confirms flight LX-GVA cruising at 36,000 ft.</p>
                    </div>
                    <span className="text-emerald-700 font-bold shrink-0">✓ VERIFIED</span>
                  </div>

                  <div className="p-4 rounded-xl bg-white border border-[#dce0d0] flex items-start justify-between gap-4">
                    <div>
                      <span className="text-[11px] font-bold text-rose-700">14:02 CET // VIRAL DISINFORMATION</span>
                      <p className="text-[#505d52] text-xs mt-1">Video seeded claiming subject is standing live in Geneva podium.</p>
                    </div>
                    <span className="text-rose-700 font-bold shrink-0">✗ IMPOSSIBLE</span>
                  </div>

                  <div className="p-4 rounded-xl bg-white border border-[#dce0d0] flex items-start justify-between gap-4">
                    <div>
                      <span className="text-[11px] font-bold text-[#243427]">15:22 CET // ACOUSTIC MATCH</span>
                      <p className="text-[#505d52] text-xs mt-1">Audio spectrogram matches ElevenLabs neural voice clone profile.</p>
                    </div>
                    <span className="text-emerald-700 font-bold shrink-0">✓ DEBUNKED</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-[#dce0d0] text-xs font-mono text-[#697a6d]">
                CHRONOLOGICAL DISSONANCE INDEX: 98.2%
              </div>
            </div>

            {/* 4. EVIDENCE GRAVITY MAP (5 Cols) */}
            <div className="lg:col-span-5 p-8 md:p-12 rounded-[32px] bg-[#243427] text-[#f5f4ef] border border-[#344938] flex flex-col justify-between shadow-lg">
              <div>
                <div className="flex items-center justify-between text-xs font-mono text-[#9db2a1] mb-4">
                  <span>ENGINE 04</span>
                  <span>BAYESIAN ATTRACTION</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold text-[#f5f4ef] mb-3">
                  Evidence Gravity Map
                </h3>
                <p className="text-sm text-[#9db2a1] leading-relaxed mb-6 font-light">
                  Claims and contradictions modeled with physical mass. A central claim collapses if heavy contradictory facts tear it down.
                </p>

                <div className="p-5 rounded-2xl bg-[#1a261c] border border-[#2f4233] space-y-3 font-mono text-xs">
                  <div className="flex items-center justify-between pb-2 border-b border-[#2a3c2e]">
                    <span className="text-[#f5f4ef]">CLAIM: Live Geneva Treaty Exit</span>
                    <span className="text-rose-400 font-bold">MASS: 85kg</span>
                  </div>
                  <div className="flex items-center justify-between pb-2 border-b border-[#2a3c2e]">
                    <span className="text-[#d5ed9a]">ADS-B Transponder Log</span>
                    <span className="text-emerald-400 font-bold">MASS: 98kg (CONTRADICTS)</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#d5ed9a]">Cornea Ray Disparity</span>
                    <span className="text-emerald-400 font-bold">MASS: 92kg (INVALIDATES)</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-[#2e4233] text-xs font-mono text-[#9db2a1]">
                BAYESIAN EQUILIBRIUM: <span className="text-[#d5ed9a] font-bold">CLAIM COLLAPSED</span>
              </div>
            </div>

          </div>

          {/* ==============================================================
              FEATURE 5 & 6: REALITY RECONSTRUCTION & UNCERTAINTY ENGINE
              ============================================================== */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            
            {/* 5. REALITY RECONSTRUCTION (6 Cols) */}
            <div className="lg:col-span-6 p-8 md:p-12 rounded-[32px] bg-[#ecefe5] border border-[#dce0d0] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-xs font-mono text-[#697a6d] mb-4">
                  <span>ENGINE 05</span>
                  <span>COMPETING HYPOTHESES</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold text-[#111b14] mb-3">
                  Reality Reconstruction
                </h3>
                <p className="text-sm text-[#505d52] leading-relaxed mb-6 font-light">
                  Instead of a blunt yes/no verdict, we weigh competing hypotheses with transparent supporting and contradicting points.
                </p>

                <div className="space-y-3">
                  <div className="p-4 rounded-xl bg-white border border-[#243427] shadow-sm">
                    <div className="flex items-center justify-between text-xs font-mono mb-1">
                      <span className="font-bold text-[#111b14]">Hypothesis A: Synthetic Face-Swap + Voice Clone</span>
                      <span className="font-bold text-[#243427] bg-[#d5ed9a] px-2 py-0.5 rounded">91% PROB</span>
                    </div>
                    <p className="text-xs text-[#505d52] mt-1">4 supporting points, 0 contradictions.</p>
                  </div>

                  <div className="p-4 rounded-xl bg-white border border-[#dce0d0]">
                    <div className="flex items-center justify-between text-xs font-mono mb-1">
                      <span className="text-[#505d52]">Hypothesis B: Recycled Archival Footage</span>
                      <span className="text-[#697a6d]">7% PROB</span>
                    </div>
                    <p className="text-xs text-[#697a6d] mt-1">1 supporting point, 3 contradictions.</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-[#dce0d0] text-xs font-mono text-[#697a6d]">
                ZERO CONFIRMATION BIAS EVALUATION
              </div>
            </div>

            {/* 6. UNCERTAINTY ENGINE (6 Cols) */}
            <div className="lg:col-span-6 p-8 md:p-12 rounded-[32px] bg-[#243427] text-[#f5f4ef] border border-[#344938] flex flex-col justify-between shadow-lg">
              <div>
                <div className="flex items-center justify-between text-xs font-mono text-[#9db2a1] mb-4">
                  <span>ENGINE 06</span>
                  <span>EPISTEMIC BOUNDARIES</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold text-[#f5f4ef] mb-3">
                  Uncertainty Engine
                </h3>
                <p className="text-sm text-[#9db2a1] leading-relaxed mb-6 font-light">
                  Commercial AI tools pretend omniscience. VERATIS draws clear epistemic boundaries around what is known, unknown, and untestable.
                </p>

                <div className="grid grid-cols-3 gap-3 font-mono text-xs">
                  <div className="p-3 rounded-xl bg-[#1a261c] border border-[#2f4233]">
                    <span className="text-[#d5ed9a] font-bold block mb-1">KNOWN</span>
                    <p className="text-[10px] text-[#9db2a1]">Flight position, light angle disparity, vocoder phase.</p>
                  </div>
                  <div className="p-3 rounded-xl bg-[#1a261c] border border-[#2f4233]">
                    <span className="text-amber-300 font-bold block mb-1">UNKNOWN</span>
                    <p className="text-[10px] text-[#9db2a1]">Identity of body actor, GPU render cluster ip.</p>
                  </div>
                  <div className="p-3 rounded-xl bg-[#1a261c] border border-[#2f4233]">
                    <span className="text-purple-300 font-bold block mb-1">UNTESTABLE</span>
                    <p className="text-[10px] text-[#9db2a1]">Subjective political motive of author.</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-[#2e4233] text-xs font-mono text-[#9db2a1]">
                PROBABILISTIC HUMILITY ASSURANCE
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
