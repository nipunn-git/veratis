import React, { useState } from 'react';
import { ArrowUpRight, Play, Home, Compass, Scan, FileText, CheckCircle2 } from 'lucide-react';

export default function Hero({ onStartInvestigation }) {
  const [activeTab, setActiveTab] = useState('scan');

  return (
    <section className="relative min-h-[95vh] pt-32 pb-20 md:pb-28 bg-[#141e17] overflow-hidden flex flex-col justify-between">
      {/* Cinematic subtle warm forest gradient background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-10%,rgba(65,92,72,0.45),rgba(20,30,23,0.95))]" />
      <div className="absolute inset-0 bg-grain pointer-events-none" />

      {/* Main 3-Column Editorial Hero Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 w-full my-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-4 items-center">
          
          {/* ==============================================================
              LEFT COLUMN: Editorial Typography & Bottom Sub-tagline
              ============================================================== */}
          <div className="lg:col-span-4 flex flex-col justify-between h-full pt-4 lg:pt-12 order-2 lg:order-1">
            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-[#f5f4ef] leading-[1.08]">
                Real or <br />
                rendered? <br />
                <span className="text-[#d5ed9a]">A forensic lens</span> <br />
                for your feed.
              </h1>
            </div>

            {/* Bottom Tagline matching Souma Image 1: "MOVE WITH INTENTION. LIVE WITH MORE EASE." */}
            <div className="mt-12 lg:mt-24 pt-4 text-[11px] font-mono tracking-widest text-[#697a6d] uppercase">
              REALITY HAS A BLIND SPOT. VERIFY WITH CERTAINTY.
            </div>
          </div>

          {/* ==============================================================
              CENTER COLUMN: The Iconic Smartphone Device Mockup (Exact Souma Recreation)
              ============================================================== */}
          <div className="lg:col-span-4 flex justify-center order-1 lg:order-2">
            <div className="relative w-[300px] sm:w-[325px] h-[610px] bg-[#0c120e] rounded-[48px] p-3 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.7)] border-[4px] border-[#2c3d31] overflow-hidden">
              {/* Dynamic Phone Speaker Notch */}
              <div className="absolute top-4 left-1/2 -translate-x-1/2 w-28 h-5 bg-[#141e17] rounded-full z-30 flex items-center justify-center">
                <div className="w-12 h-1 bg-[#233127] rounded-full" />
              </div>

              {/* Phone Inner Screen Screen */}
              <div className="w-full h-full bg-[#f5f4ef] text-[#111b14] rounded-[38px] p-5 pt-8 flex flex-col justify-between overflow-hidden relative">
                
                {/* App Screen Header */}
                <div className="flex items-center justify-between mt-2">
                  <span className="font-bold text-sm tracking-tight text-[#111b14]">
                    veratis
                  </span>
                  <div className="w-7 h-7 rounded-full bg-[#e3e5db] flex items-center justify-center text-xs font-semibold text-[#111b14]">
                    JD
                  </div>
                </div>

                {/* App Screen Title */}
                <div className="my-2">
                  <h2 className="text-2xl font-serif italic text-[#111b14] leading-tight">
                    Evidence autopsy <br />
                    <span className="font-sans not-italic font-bold text-xl text-[#243427]">
                      in real-time.
                    </span>
                  </h2>
                </div>

                {/* App Screen Main Media Card (Souma "Morning flow" Card) */}
                <div className="relative rounded-2xl overflow-hidden bg-[#141e17] text-[#f5f4ef] aspect-[4/3] group shadow-sm">
                  <img 
                    src="https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=600&q=80" 
                    alt="Forensic Specimen" 
                    className="w-full h-full object-cover opacity-85 group-hover:scale-105 transition-transform duration-500"
                  />
                  
                  {/* Card Overlay Text */}
                  <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-[#111b14]/90 via-[#111b14]/50 to-transparent flex items-end justify-between">
                    <div>
                      <h3 className="font-bold text-sm text-[#f5f4ef]">
                        Geneva Briefing
                      </h3>
                      <p className="text-[11px] text-[#d5ed9a] font-mono">
                        Synthetic video • 94.8%
                      </p>
                    </div>

                    <button 
                      onClick={onStartInvestigation}
                      className="w-8 h-8 rounded-full bg-[#d5ed9a] text-[#111b14] flex items-center justify-center shadow-md hover:scale-110 transition-transform"
                    >
                      <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                    </button>
                  </div>
                </div>

                {/* App Screen "This week" Verification Activity Tracker (Souma Image 1 exact widget) */}
                <div className="mt-2">
                  <div className="text-[11px] font-semibold text-[#788a7c] mb-1.5">
                    Recent investigations
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-[#788a7c]">
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, i) => (
                      <div key={day} className="flex flex-col items-center gap-1">
                        <span className="font-mono text-[9px]">{day}</span>
                        <span className={`w-3 h-3 rounded-full ${
                          i < 4 ? 'bg-[#243427]' : 'bg-[#e0e3d6]'
                        }`} />
                      </div>
                    ))}
                  </div>
                </div>

                {/* App Screen Bottom Navigation Bar */}
                <div className="pt-2 border-t border-[#e2e5d8] flex items-center justify-around text-[#788a7c]">
                  <button className="flex flex-col items-center gap-0.5 text-[#111b14]">
                    <Home className="w-4 h-4" />
                    <span className="text-[8px] font-medium">Home</span>
                  </button>
                  <button className="flex flex-col items-center gap-0.5 hover:text-[#111b14]">
                    <Compass className="w-4 h-4" />
                    <span className="text-[8px] font-medium">Radar</span>
                  </button>
                  <button className="flex flex-col items-center gap-0.5 hover:text-[#111b14]">
                    <Scan className="w-4 h-4" />
                    <span className="text-[8px] font-medium">Autopsy</span>
                  </button>
                  <button className="flex flex-col items-center gap-0.5 hover:text-[#111b14]">
                    <FileText className="w-4 h-4" />
                    <span className="text-[8px] font-medium">Dossier</span>
                  </button>
                </div>

              </div>
            </div>
          </div>

          {/* ==============================================================
              RIGHT COLUMN: Editorial Companion Text & Pill CTA Button
              ============================================================== */}
          <div className="lg:col-span-4 flex flex-col justify-center h-full pt-4 lg:pt-12 order-3">
            <div className="space-y-6 max-w-sm">
              {/* Bullet header matching Souma: "• YOUR EVERYDAY YOGA COMPANION" */}
              <div className="flex items-center gap-2 text-xs font-semibold text-[#d5ed9a] tracking-wider uppercase">
                <span className="w-1.5 h-1.5 rounded-full bg-[#d5ed9a]" />
                <span>YOUR DIGITAL VERIFICATION COMPANION</span>
              </div>

              {/* Supporting editorial paragraph */}
              <p className="text-base text-[#9db2a1] leading-relaxed font-light">
                Guided forensic analysis and evidentiary verification made for the synthetic age. Don't just detect the fake. Investigate the evidence. Come back to certainty.
              </p>

              {/* CTA Pill Button (Exact Souma Style from Image 1) */}
              <div>
                <button
                  onClick={onStartInvestigation}
                  className="flex items-center gap-3 pl-6 pr-2.5 py-2.5 rounded-full bg-[#f5f4ef] hover:bg-white text-[#111b14] font-semibold text-sm transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-md cursor-pointer group"
                >
                  <span>Start investigation</span>
                  <div className="w-7 h-7 rounded-full bg-[#111b14] flex items-center justify-center text-[#f5f4ef] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                    <ArrowUpRight className="w-4 h-4" />
                  </div>
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
