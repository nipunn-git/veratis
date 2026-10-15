import React, { useState } from 'react';
import HeroNav from './HeroNav';
import HeroContent from './HeroContent';
import HeroCanvas from './HeroCanvas';
import VerificationModal from './VerificationModal';

export default function HeroSection({ onStartInvestigation, onExplore }) {
  const [activeStage, setActiveStage] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenVerification = () => {
    setIsModalOpen(true);
  };

  const handleCloseVerification = () => {
    setIsModalOpen(false);
  };

  const handleLaunchFullWorkspace = (caseIdx = 0) => {
    setIsModalOpen(false);
    onStartInvestigation?.(caseIdx);
  };

  return (
    <section 
      id="hero"
      aria-label="Veratis Hero Section"
      className="relative min-h-[100svh] w-full bg-[#050B14] text-[#E1F4FF] overflow-hidden flex flex-col justify-between"
    >
      {/* =====================================================================
          CINEMATIC BACKGROUND LAYERS: Midnight Navy & Deep Radial Blooms
          ===================================================================== */}
      {/* Atmospheric deep radial cyan-ice gradients */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_70%_45%,rgba(32,217,255,0.07),transparent_55%)]" />
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_30%_60%,rgba(119,191,255,0.04),transparent_60%)]" />
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_100%_100%_at_50%_-20%,rgba(10,22,38,0.8),#050B14_75%)]" />

      {/* Subtle Technical Grid Overlay */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.035]"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(32, 217, 255, 0.4) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(32, 217, 255, 0.4) 1px, transparent 1px)
          `,
          backgroundSize: '80px 80px',
        }}
      />

      {/* Ambient Noise / Grain Texture */}
      <div className="absolute inset-0 bg-grain pointer-events-none opacity-40" />

      {/* Minimal Top Navigation */}
      <HeroNav 
        onStartVerification={handleOpenVerification}
        onOpenDashboard={() => handleLaunchFullWorkspace(0)}
        onExplore={onExplore}
      />

      {/* =====================================================================
          MAIN SPLIT CANVAS CONTAINER (100svh Desktop Experience)
          Left: 40-45% Brand Message & Interactive Verification CTAs
          Right: 55-60% Centerpiece Cinematic 5-Stage Native Animation
          ===================================================================== */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 my-auto flex-1 flex items-center">
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center min-h-[calc(100svh-90px)] py-6 lg:py-0">
          
          {/* LEFT SIDE: BRAND MESSAGE & EDITORIAL HIERARCHY (lg:col-span-5) */}
          <div className="lg:col-span-5 flex flex-col justify-center order-2 lg:order-1">
            <HeroContent 
              onStartVerification={handleOpenVerification}
              onExplore={onExplore}
            />
          </div>

          {/* RIGHT SIDE: THE CINEMATIC VISUAL CENTERPIECE (lg:col-span-7) */}
          <div className="lg:col-span-7 relative w-full h-[460px] sm:h-[560px] lg:h-[calc(100svh-110px)] lg:max-h-[660px] flex items-center justify-center order-1 lg:order-2">
            
            {/* Luminous atmospheric halo extending behind canvas */}
            <div className="absolute -inset-10 bg-[radial-gradient(circle_at_50%_50%,rgba(32,217,255,0.06),transparent_70%)] pointer-events-none" />

            {/* Native 5-Stage Canvas Simulation */}
            <HeroCanvas 
              onStageChange={(stage) => setActiveStage(stage)}
              isInteractive={true}
            />

          </div>

        </div>
      </div>

      {/* Interactive Verification Modal Preview */}
      <VerificationModal 
        isOpen={isModalOpen}
        onClose={handleCloseVerification}
        onLaunchFullWorkspace={handleLaunchFullWorkspace}
      />
    </section>
  );
}
