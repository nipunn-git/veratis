import React, { useState } from 'react';
import { ArrowUpRight, UploadCloud, Search, GitBranch, ShieldCheck, HelpCircle } from 'lucide-react';

export default function InvestigationProcess({ onStartInvestigation }) {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    {
      num: "01",
      title: "Submit & Ingest",
      tagline: "Lossless Bitstream Ingestion",
      detail: "Ingest high-resolution image bitstreams, audio stems, or social URLs. We preserve untouched EXIF metadata, discrete cosine transform tables, and cryptographic SHA-256 signatures.",
      badge: "Stage 01"
    },
    {
      num: "02",
      title: "Micro-Forensic Autopsy",
      tagline: "Sub-Pixel Physical Anomaly Detection",
      detail: "Deconstruct the visual field with 2D Fourier transforms to surface sensor Bayer noise patterns, corneal specular reflections, and neural face-swap blend boundaries.",
      badge: "Stage 02"
    },
    {
      num: "03",
      title: "Context Triangulation",
      tagline: "Chronological & Geospatial Anchors",
      detail: "Cross-reference external physical realities: historical solar azimuth, ADS-B satellite aircraft transponders, weather radar, and synchronized bot propagation spikes.",
      badge: "Stage 03"
    },
    {
      num: "04",
      title: "Gravity & Arbitration",
      tagline: "Bayesian Competing Hypotheses",
      detail: "Weigh competing explanations side-by-side. Is it a synthetic diffusion render, archival footage republished, or genuine reality? Contradictory evidence carries decisive weight.",
      badge: "Stage 04"
    },
    {
      num: "05",
      title: "The Epistemic Dossier",
      tagline: "Certainty Without Overconfidence",
      detail: "Receive a human-readable investigation dossier clearly demarcating what is verified as fact, what remains unknown, and what is scientifically untestable.",
      badge: "Stage 05"
    }
  ];

  return (
    <section id="methodology" className="relative py-28 md:py-36 bg-[#1a261d] text-[#f5f4ef] overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-10 border-b border-[#2c3d31] mb-16">
          <div>
            <div className="text-xs font-mono text-[#d5ed9a] tracking-widest uppercase mb-3">
              / METHODOLOGY [002]
            </div>
            <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-[#f5f4ef] leading-tight">
              The five stages of <br />
              <span className="font-serif italic font-normal text-[#d5ed9a]">forensic truth.</span>
            </h2>
          </div>

          <div className="max-w-md text-sm text-[#9db2a1] leading-relaxed font-light">
            A zero-trust investigative pipeline moving from raw signal ingestion to transparent epistemic clarity.
          </div>
        </div>

        {/* 5-Step Horizontal Grid (Souma Programs / Classes layout) */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-16">
          {steps.map((s, idx) => {
            const isSelected = activeStep === idx;
            return (
              <div
                key={s.num}
                onClick={() => setActiveStep(idx)}
                className={`p-6 rounded-[24px] border transition-all duration-300 cursor-pointer flex flex-col justify-between ${
                  isSelected 
                    ? 'bg-[#243427] border-[#d5ed9a] shadow-md' 
                    : 'bg-[#152018] border-[#253628] hover:border-[#3a503f] opacity-80 hover:opacity-100'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between text-xs font-mono text-[#9db2a1] mb-4">
                    <span>{s.num}</span>
                    <span className="text-[10px] uppercase">{s.badge}</span>
                  </div>
                  <h3 className="text-lg font-bold text-[#f5f4ef] mb-2 leading-snug">
                    {s.title}
                  </h3>
                </div>

                <div className="mt-8 pt-4 border-t border-[#2e4032] flex items-center justify-between text-[11px] font-mono">
                  <span className={isSelected ? 'text-[#d5ed9a] font-semibold' : 'text-[#697a6d]'}>
                    {isSelected ? 'ACTIVE VIEW' : 'EXPLORE'}
                  </span>
                  <span className={isSelected ? 'text-[#d5ed9a]' : 'text-[#697a6d]'}>→</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Detailed Active Stage Spotlight Card (Souma Editorial Big Card) */}
        <div className="p-8 md:p-14 rounded-[32px] bg-[#243427] border border-[#344938] flex flex-col lg:flex-row items-center justify-between gap-10 shadow-xl">
          <div className="max-w-2xl">
            <span className="text-xs font-mono text-[#d5ed9a] tracking-widest uppercase mb-3 block">
              {steps[activeStep].badge} // DETAILED PROTOCOL
            </span>
            <h3 className="text-2xl sm:text-4xl font-bold text-[#f5f4ef] mb-3">
              {steps[activeStep].title}
            </h3>
            <h4 className="text-lg font-serif italic text-[#d5ed9a] mb-6">
              "{steps[activeStep].tagline}"
            </h4>
            <p className="text-base text-[#9db2a1] font-light leading-relaxed">
              {steps[activeStep].detail}
            </p>
          </div>

          <div className="shrink-0">
            <button
              onClick={onStartInvestigation}
              className="flex items-center gap-3 pl-6 pr-2.5 py-3 rounded-full bg-[#f5f4ef] hover:bg-white text-[#111b14] font-semibold text-sm transition-all transform hover:scale-105 active:scale-95 shadow-md cursor-pointer group"
            >
              <span>Execute in workspace</span>
              <div className="w-7 h-7 rounded-full bg-[#111b14] flex items-center justify-center text-[#f5f4ef] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                <ArrowUpRight className="w-4 h-4" />
              </div>
            </button>
          </div>
        </div>

      </div>
    </section>
  );
}
