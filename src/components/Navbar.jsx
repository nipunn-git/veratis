import React, { useState, useEffect } from 'react';
import { ArrowUpRight, Menu, X } from 'lucide-react';

export default function Navbar({ onOpenDashboard }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id) => {
    setMobileOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="fixed top-4 inset-x-0 z-50 flex justify-center px-4 pointer-events-none">
      <nav 
        className={`pointer-events-auto flex items-center justify-between gap-6 md:gap-8 px-4 md:px-6 py-2.5 rounded-full transition-all duration-300 ${
          scrolled 
            ? 'bg-[#223225]/95 backdrop-blur-md border border-white/10 shadow-lg' 
            : 'bg-[#243427]/85 backdrop-blur-sm border border-white/5'
        }`}
      >
        {/* Brand */}
        <a 
          href="#"
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="flex items-center gap-2.5 text-lg md:text-xl font-bold tracking-tight text-[#f5f4ef] hover:opacity-90 transition-opacity"
        >
          <img 
            src="/veratis-logo.png" 
            alt="VERATIS Logo" 
            className="w-6 h-6 rounded-full object-cover border border-white/20 shadow-xs" 
          />
          <span className="tracking-tight uppercase">VERATIS</span>
        </a>

        {/* Desktop Nav Items (Exact Souma Style) */}
        <div className="hidden lg:flex items-center gap-6 text-[13px] font-normal text-[#9db2a1]">
          <button 
            onClick={() => scrollToSection('about')} 
            className="hover:text-[#f5f4ef] transition-colors cursor-pointer"
          >
            About
          </button>
          <button 
            onClick={() => scrollToSection('methodology')} 
            className="hover:text-[#f5f4ef] transition-colors cursor-pointer"
          >
            Methodology
          </button>
          <button 
            onClick={() => scrollToSection('engines')} 
            className="hover:text-[#f5f4ef] transition-colors cursor-pointer"
          >
            Engines
          </button>
          <button 
            onClick={() => scrollToSection('specimen')} 
            className="hover:text-[#f5f4ef] transition-colors cursor-pointer"
          >
            Specimens
          </button>
          <button 
            onClick={() => scrollToSection('philosophy')} 
            className="hover:text-[#f5f4ef] transition-colors cursor-pointer"
          >
            Philosophy
          </button>
          <button 
            onClick={onOpenDashboard} 
            className="hover:text-[#f5f4ef] transition-colors cursor-pointer"
          >
            Workspace
          </button>
        </div>

        {/* CTA Button (Exact Souma Pill with Dark Arrow Circle) */}
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenDashboard}
            className="flex items-center gap-2 pl-4 pr-2 py-1.5 rounded-full bg-[#f5f4ef] hover:bg-white text-[#111b14] font-medium text-[13px] transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-sm cursor-pointer"
          >
            <span>Start investigation</span>
            <div className="w-6 h-6 rounded-full bg-[#111b14] flex items-center justify-center text-[#f5f4ef]">
              <ArrowUpRight className="w-3.5 h-3.5" />
            </div>
          </button>

          {/* Mobile hamburger */}
          <button 
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-1.5 text-[#9db2a1] hover:text-[#f5f4ef]"
            aria-label="Toggle Menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Dropdown */}
      {mobileOpen && (
        <div className="pointer-events-auto lg:hidden fixed top-20 inset-x-6 bg-[#223225]/95 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl flex flex-col gap-4 text-sm font-medium z-50">
          <button 
            onClick={() => scrollToSection('about')} 
            className="text-left text-[#9db2a1] hover:text-[#f5f4ef] py-2 border-b border-white/5"
          >
            About
          </button>
          <button 
            onClick={() => scrollToSection('methodology')} 
            className="text-left text-[#9db2a1] hover:text-[#f5f4ef] py-2 border-b border-white/5"
          >
            Methodology
          </button>
          <button 
            onClick={() => scrollToSection('engines')} 
            className="text-left text-[#9db2a1] hover:text-[#f5f4ef] py-2 border-b border-white/5"
          >
            Engines
          </button>
          <button 
            onClick={() => scrollToSection('specimen')} 
            className="text-left text-[#9db2a1] hover:text-[#f5f4ef] py-2 border-b border-white/5"
          >
            Specimens
          </button>
          <button 
            onClick={() => scrollToSection('philosophy')} 
            className="text-left text-[#9db2a1] hover:text-[#f5f4ef] py-2 border-b border-white/5"
          >
            Philosophy
          </button>
          <button 
            onClick={() => {
              setMobileOpen(false);
              onOpenDashboard();
            }}
            className="w-full mt-2 py-3 rounded-xl bg-[#f5f4ef] text-[#111b14] font-medium text-center"
          >
            Open Investigation Workspace →
          </button>
        </div>
      )}
    </header>
  );
}
