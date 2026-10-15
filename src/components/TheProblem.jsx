import React from 'react';
import { ArrowUpRight, ShieldCheck, Sparkles } from 'lucide-react';

export default function TheProblem() {
  return (
    <section id="about" className="relative py-28 md:py-36 bg-[#f5f4ef] text-[#111b14] overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Top Metadata Header (Exact Souma Recreation from Image 2: "/ A LITTLE ABOUT SOUMA" and "[001]") */}
        <div className="flex items-center justify-between pb-10 border-b border-[#e2e5d8] text-xs font-mono text-[#697a6d] tracking-widest uppercase mb-16">
          <span>/ A LITTLE ABOUT VERATIS</span>
          <span>[001]</span>
        </div>

        {/* 2-Column Editorial Showcase (Exact Layout from Image 2) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center mb-24">
          
          {/* Left Column: Editorial Photo Card */}
          <div className="lg:col-span-5">
            <div className="relative rounded-[28px] overflow-hidden shadow-lg aspect-[4/3] sm:aspect-[5/4] bg-[#e4e7db]">
              <img 
                src="https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1000&q=80" 
                alt="Investigative Verification Workspace" 
                className="w-full h-full object-cover grayscale contrast-115 hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-[#243427]/10 mix-blend-multiply pointer-events-none" />
              
              {/* Subtle corner badge */}
              <div className="absolute bottom-4 left-4 bg-[#f5f4ef]/95 backdrop-blur-sm px-3.5 py-1.5 rounded-full text-xs font-mono text-[#111b14] shadow-sm">
                VERATIS ARCHIVE // REF 09
              </div>
            </div>
          </div>

          {/* Right Column: Prominent Editorial Quote & Philosophy */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            <blockquote className="text-3xl sm:text-4xl md:text-5xl font-serif italic text-[#111b14] leading-[1.2] mb-8">
              “We believe truth belongs in your everyday feed — a rigorous way to examine, verify, and feel certain of what is real.”
            </blockquote>

            <p className="text-base sm:text-lg text-[#505d52] font-light leading-relaxed mb-6">
              In an online world inundated with synthetic diffusion, cloned acoustics, and weaponized archival media, human intuition has met its limit. VERATIS replaces blind trust with empirical forensics.
            </p>

            <div className="flex items-center gap-6 pt-6 border-t border-[#e2e5d8] text-xs font-mono text-[#697a6d]">
              <div>
                <span className="text-[#111b14] font-bold block text-sm">ZERO TRUST</span>
                <span>Mathematical verification</span>
              </div>
              <div className="w-[1px] h-8 bg-[#d6dacb]" />
              <div>
                <span className="text-[#111b14] font-bold block text-sm">5-AXIS RADAR</span>
                <span>Orthogonal cross-checks</span>
              </div>
              <div className="w-[1px] h-8 bg-[#d6dacb]" />
              <div>
                <span className="text-[#111b14] font-bold block text-sm">OPEN DOSSIER</span>
                <span>Falsifiable hypotheses</span>
              </div>
            </div>
          </div>

        </div>

        {/* 3 Editorial Pillars (Souma-styled warm bone cards) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-10 border-t border-[#e2e5d8]">
          <div className="p-8 rounded-[24px] bg-[#ecefe5] border border-[#dce0d0] flex flex-col justify-between">
            <div>
              <span className="text-xs font-mono text-[#697a6d] block mb-3">01 // SYNTHETIC MANUFACTURE</span>
              <h3 className="text-xl font-bold text-[#111b14] mb-3">The Latent Hallucination</h3>
              <p className="text-sm text-[#505d52] font-light leading-relaxed">
                When not a single photon ever touched an optical sensor. We isolate high-frequency Fourier dropouts and corneal ray inconsistencies.
              </p>
            </div>
            <div className="mt-8 text-xs font-mono font-semibold text-[#243427]">
              SPECTRAL FOURIER 2D →
            </div>
          </div>

          <div className="p-8 rounded-[24px] bg-[#ecefe5] border border-[#dce0d0] flex flex-col justify-between">
            <div>
              <span className="text-xs font-mono text-[#697a6d] block mb-3">02 // TEMPORAL RECIRCULATION</span>
              <h3 className="text-xl font-bold text-[#111b14] mb-3">The Recycled Disaster</h3>
              <p className="text-sm text-[#505d52] font-light leading-relaxed">
                Real photos from 2018 retrofitted with current breaking news headlines. We match chronological flight radars, shadow angles, and archival logs.
              </p>
            </div>
            <div className="mt-8 text-xs font-mono font-semibold text-[#243427]">
              SOLAR & ADS-B TELEMETRY →
            </div>
          </div>

          <div className="p-8 rounded-[24px] bg-[#ecefe5] border border-[#dce0d0] flex flex-col justify-between">
            <div>
              <span className="text-xs font-mono text-[#697a6d] block mb-3">03 // CONTEXT COLLAPSE</span>
              <h3 className="text-xl font-bold text-[#111b14] mb-3">The Caption Inversion</h3>
              <p className="text-sm text-[#505d52] font-light leading-relaxed">
                Movie sets and emergency drills deceptively captioned as spontaneous atrocities. We triangulate digital provenance and emergency feeds.
              </p>
            </div>
            <div className="mt-8 text-xs font-mono font-semibold text-[#243427]">
              SOURCE PROVENANCE →
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
