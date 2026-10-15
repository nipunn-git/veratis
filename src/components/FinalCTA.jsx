import React from 'react';
import { ArrowUpRight, ShieldCheck, Terminal, Sparkles } from 'lucide-react';

export default function FinalCTA({ onStartInvestigation }) {
  return (
    <section id="philosophy" className="relative py-28 md:py-36 bg-[#f5f4ef] text-[#111b14] overflow-hidden">
      <div className="max-w-5xl mx-auto px-6 text-center relative z-10">
        
        <div className="inline-block text-xs font-mono text-[#697a6d] tracking-widest uppercase mb-6">
          / VERATIS INVESTIGATION LABS [005]
        </div>

        <h2 className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-[#111b14] leading-[1.08] mb-6">
          Ready to see what <br />
          <span className="font-serif italic font-normal text-[#243427]">is actually real?</span>
        </h2>

        <p className="text-base sm:text-lg text-[#505d52] font-light max-w-xl mx-auto leading-relaxed mb-10">
          Step beyond superficial confidence percentages. Investigate the physical light, the historical timeline, and the mathematical noise.
        </p>

        <div className="flex justify-center mb-16">
          <button
            onClick={onStartInvestigation}
            className="flex items-center gap-3 pl-8 pr-3 py-3.5 rounded-full bg-[#111b14] hover:bg-[#243427] text-[#f5f4ef] font-semibold text-sm transition-all transform hover:scale-105 active:scale-95 shadow-xl cursor-pointer group"
          >
            <span>Launch investigation workspace</span>
            <div className="w-8 h-8 rounded-full bg-[#f5f4ef] flex items-center justify-center text-[#111b14] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </button>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-8 text-xs font-mono text-[#697a6d] pt-10 border-t border-[#e2e5d8]">
          <span>CLIENT-SIDE MULTI-SPECTRAL ENGINE</span>
          <span>•</span>
          <span>NO CLOUD PROMPT RETENTION</span>
          <span>•</span>
          <span>OPEN VERIFIABLE EVIDENCE DOSSIERS</span>
        </div>

      </div>
    </section>
  );
}
