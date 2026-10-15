import React, { useState, useEffect } from 'react';
import { ArrowUpRight, ShieldCheck, Menu, X, Sparkles } from 'lucide-react';

export default function HeroNav({ onStartVerification, onOpenDashboard, onExplore }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 24);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    } else {
      onExplore?.();
    }
  };

  return (
    <header className="fixed top-0 inset-x-0 z-50 pointer-events-none px-4 sm:px-6 lg:px-8 pt-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* BRAND WORDMARK (Left) */}
        <div className="pointer-events-auto flex items-center">
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="group flex items-center gap-2.5 text-lg font-bold tracking-tight text-[#E1F4FF] hover:text-[#FFFFFF] transition-colors"
          >
            {/* Luminous Brand Emblem */}
            <div className="w-8 h-8 rounded-lg bg-[#0A1322] border border-[#20D9FF]/30 flex items-center justify-center shadow-[0_0_15px_rgba(32,217,255,0.15)] group-hover:border-[#20D9FF]/60 transition-all">
              <ShieldCheck className="w-4 h-4 text-[#20D9FF]" />
            </div>
            <span className="font-display tracking-[0.08em] uppercase text-sm sm:text-base font-extrabold">
              VERATIS
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#20D9FF] shadow-[0_0_8px_#20D9FF] -ml-1" />
          </a>
        </div>

        {/* DESKTOP NAVIGATION LINKS (Center Minimal Floating Bar) */}
        <nav 
          className={`pointer-events-auto hidden md:flex items-center gap-1 lg:gap-2 px-4 py-1.5 rounded-full transition-all duration-300 ${
            scrolled 
              ? 'bg-[#050B14]/90 backdrop-blur-md border border-[#20D9FF]/20 shadow-[0_8px_30px_rgba(0,0,0,0.5)]' 
              : 'bg-[#0A1322]/70 backdrop-blur-sm border border-white/10'
          }`}
        >
          {[
            { label: 'About', id: 'about' },
            { label: 'Methodology', id: 'methodology' },
            { label: 'Engines', id: 'engines' },
            { label: 'Specimens', id: 'specimen' },
            { label: 'Philosophy', id: 'philosophy' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => scrollToSection(item.id)}
              className="relative px-3.5 py-1.5 text-xs font-medium text-[#77BFFF]/80 hover:text-[#FFFFFF] transition-colors group cursor-pointer"
            >
              <span>{item.label}</span>
              {/* Luminous underline on hover */}
              <span className="absolute inset-x-3 -bottom-0.5 h-[1.5px] bg-[#20D9FF] scale-x-0 group-hover:scale-x-100 transition-transform duration-200 origin-center shadow-[0_0_8px_#20D9FF]" />
            </button>
          ))}
          
          <button
            onClick={onOpenDashboard}
            className="px-3 py-1 text-xs font-mono text-[#20D9FF]/90 hover:text-[#20D9FF] hover:bg-[#20D9FF]/10 rounded-full transition-all cursor-pointer ml-1"
          >
            [Workspace]
          </button>
        </nav>

        {/* RIGHT ACTION BUTTON & MOBILE TOGGLE */}
        <div className="pointer-events-auto flex items-center gap-2.5">
          {/* Compact CTA */}
          <button
            onClick={onStartVerification}
            className="group relative inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-[#0A1322] border border-[#20D9FF]/40 text-[#E1F4FF] text-xs font-semibold tracking-wide hover:border-[#20D9FF] hover:bg-[#20D9FF]/10 transition-all duration-300 shadow-[0_0_20px_rgba(32,217,255,0.12)] cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#20D9FF] group-hover:rotate-12 transition-transform" />
            <span className="hidden sm:inline">Verify Content</span>
            <span className="sm:hidden text-[11px]">Verify</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-[#77BFFF] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </button>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl bg-[#0A1322] border border-white/10 text-[#77BFFF] hover:text-[#FFFFFF] transition-colors"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

      </div>

      {/* MOBILE DROPDOWN */}
      {mobileMenuOpen && (
        <div className="pointer-events-auto md:hidden mt-3 max-w-sm mx-auto p-5 rounded-2xl bg-[#050B14]/95 border border-[#20D9FF]/30 backdrop-blur-xl shadow-2xl flex flex-col gap-3">
          <button 
            onClick={() => scrollToSection('about')}
            className="text-left text-sm font-medium text-[#77BFFF] hover:text-[#FFFFFF] py-2 border-b border-white/5"
          >
            About
          </button>
          <button 
            onClick={() => scrollToSection('methodology')}
            className="text-left text-sm font-medium text-[#77BFFF] hover:text-[#FFFFFF] py-2 border-b border-white/5"
          >
            Methodology
          </button>
          <button 
            onClick={() => scrollToSection('engines')}
            className="text-left text-sm font-medium text-[#77BFFF] hover:text-[#FFFFFF] py-2 border-b border-white/5"
          >
            Engines
          </button>
          <button 
            onClick={() => scrollToSection('specimen')}
            className="text-left text-sm font-medium text-[#77BFFF] hover:text-[#FFFFFF] py-2 border-b border-white/5"
          >
            Specimens
          </button>
          <button 
            onClick={() => scrollToSection('philosophy')}
            className="text-left text-sm font-medium text-[#77BFFF] hover:text-[#FFFFFF] py-2 border-b border-white/5"
          >
            Philosophy
          </button>
          <button 
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenDashboard?.();
            }}
            className="w-full mt-2 py-2.5 rounded-xl bg-[#20D9FF] text-[#050B14] font-bold text-xs uppercase tracking-wider text-center shadow-[0_0_15px_rgba(32,217,255,0.4)]"
          >
            Launch Investigation Workspace →
          </button>
        </div>
      )}
    </header>
  );
}
