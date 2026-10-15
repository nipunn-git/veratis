import React from 'react';
import { ArrowRight, ShieldCheck, Search, Sparkles, CheckCircle2 } from 'lucide-react';

export default function HeroContent({ onStartVerification, onExplore }) {
  return (
    <div className="flex flex-col justify-between h-full pt-20 lg:pt-14 pb-4 lg:pb-8 max-w-xl z-20">
      
      {/* TOP SECTION: EYEBROW & MAIN HEADLINE */}
      <div className="space-y-4 sm:space-y-5">
        
        {/* Small Eyebrow Label */}
        <div className="inline-flex items-center gap-2.5 px-3 py-1 rounded-full bg-[#0A1322]/80 border border-[#20D9FF]/30 backdrop-blur-md shadow-[0_0_20px_rgba(32,217,255,0.08)]">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#20D9FF] opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#20D9FF]" />
          </span>
          <span className="text-[10px] sm:text-[10.5px] font-mono uppercase tracking-[0.22em] text-[#77BFFF] font-semibold">
            INTELLIGENCE FOR A SAFER INTERNET
          </span>
        </div>

        {/* Main Headline */}
        <h1 className="text-3xl sm:text-5xl md:text-5xl lg:text-[3.65rem] font-display font-extrabold tracking-tight text-[#E1F4FF] leading-[1.07]">
          Trust what you see. <br />
          <span className="relative inline-block">
            <span className="bg-gradient-to-r from-[#20D9FF] via-[#77BFFF] to-[#FFFFFF] bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(32,217,255,0.4)]">
              Verify
            </span>
            <span className="text-[#E1F4FF]"> what you can't.</span>
          </span>
        </h1>

        {/* Supporting Copy */}
        <p className="text-sm sm:text-base text-[#77BFFF]/85 font-light leading-relaxed max-w-lg">
          From suspicious links to AI-generated content, Veratis helps you navigate the digital world with greater clarity, confidence and control.
        </p>

        {/* Call to Action Buttons */}
        <div className="pt-1 flex flex-wrap items-center gap-3">
          {/* Primary CTA */}
          <button
            onClick={onStartVerification}
            className="group relative inline-flex items-center gap-2.5 px-5 sm:px-6 py-3 rounded-full bg-[#20D9FF] text-[#050B14] font-bold text-xs sm:text-sm tracking-wide transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-[0_0_25px_rgba(32,217,255,0.35)] hover:shadow-[0_0_35px_rgba(32,217,255,0.55)] cursor-pointer"
          >
            <span>Start verifying</span>
            <div className="w-5 h-5 rounded-full bg-[#050B14] text-[#20D9FF] flex items-center justify-center transition-transform duration-300 group-hover:translate-x-1">
              <ArrowRight className="w-3 h-3 stroke-[2.5]" />
            </div>
          </button>

          {/* Secondary CTA */}
          <button
            onClick={onExplore}
            className="inline-flex items-center gap-2 px-4 sm:px-5 py-3 rounded-full bg-[#0A1322]/80 border border-white/15 hover:border-[#77BFFF]/50 text-[#E1F4FF] hover:text-[#FFFFFF] text-xs sm:text-sm font-medium tracking-wide transition-all duration-300 backdrop-blur-sm hover:bg-[#0A1322] cursor-pointer"
          >
            <span>Discover Veratis</span>
          </button>
        </div>

        {/* Forensic Capabilities Tags / Quick Chips */}
        <div className="pt-2 flex flex-wrap items-center gap-1.5 sm:gap-2">
          {[
            'AI Media Forensic',
            'URL Phishing Radar',
            'Deepfake Artifacts',
            'C2PA Provenance',
          ].map((tag) => (
            <span 
              key={tag}
              className="px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md bg-[#0A1322]/60 border border-white/10 text-[10px] sm:text-[11px] font-mono text-[#77BFFF]/70 flex items-center gap-1.5"
            >
              <span className="w-1 h-1 rounded-full bg-[#20D9FF]/60" />
              {tag}
            </span>
          ))}
        </div>

      </div>

      {/* BOTTOM SECTION: TRUST-ORIENTED CAPTION & AUDIT BADGE */}
      <div className="mt-6 lg:mt-8 pt-4 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs">
        
        {/* Understated trust-oriented caption */}
        <div className="font-mono text-[#77BFFF]/70 tracking-wider text-[11px] sm:text-xs">
          Clarity over uncertainty. Confidence over doubt.
        </div>

        {/* Real-time status indication */}
        <div className="flex items-center gap-2 text-[11px] font-mono text-[#20D9FF]/90">
          <ShieldCheck className="w-3.5 h-3.5 text-[#20D9FF]" />
          <span>ZERO-RETENTION FORENSIC PROTOCOL</span>
        </div>

      </div>

    </div>
  );
}
