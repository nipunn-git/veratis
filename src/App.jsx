import React, { useState } from 'react';
import LoadingScreen from './components/LoadingScreen';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import TheProblem from './components/TheProblem';
import InvestigationProcess from './components/InvestigationProcess';
import SignatureFeatures from './components/SignatureFeatures';
import InteractiveShowcase from './components/InteractiveShowcase';
import FinalCTA from './components/FinalCTA';
import HalftoneFooter from './components/HalftoneFooter';
import DashboardLayout from './components/dashboard/DashboardLayout';

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [currentView, setCurrentView] = useState('landing'); // 'landing' | 'dashboard'
  const [initialCaseIndex, setInitialCaseIndex] = useState(0);

  const handleStartInvestigation = (caseIdx = 0) => {
    setInitialCaseIndex(caseIdx);
    setCurrentView('dashboard');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleReturnToLanding = () => {
    setCurrentView('landing');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleExplore = () => {
    const el = document.getElementById('problem');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#070a08] text-[#f5f4ef] selection:bg-[#c8f344] selection:text-[#070a08]">
      {/* 1. Initial Skiper39-inspired Loading Preloader */}
      {isLoading && (
        <LoadingScreen onComplete={() => setIsLoading(false)} />
      )}

      {/* 2. Main Investigation Workspace (Dashboard View) */}
      {currentView === 'dashboard' ? (
        <DashboardLayout 
          onBackToLanding={handleReturnToLanding} 
          initialCaseIndex={initialCaseIndex} 
        />
      ) : (
        /* 3. Primary Landing Page (Souma Inspired Editorial Experience) */
        <div className="relative">
          {/* Floating Pill Header Nav */}
          <Navbar 
            onOpenDashboard={() => handleStartInvestigation(0)} 
            activeView="landing" 
          />

          {/* Section A: Hero */}
          <Hero 
            onStartInvestigation={() => handleStartInvestigation(0)}
            onExplore={handleExplore}
          />

          {/* Section B: The Problem (Crisis of Perception) */}
          <TheProblem />

          {/* Section C: Investigation Workflow */}
          <InvestigationProcess 
            onStartInvestigation={() => handleStartInvestigation(0)} 
          />

          {/* Section D: Six Signature Engines */}
          <SignatureFeatures 
            onStartInvestigation={() => handleStartInvestigation(0)} 
          />

          {/* Section E: Interactive Specimen Lab Preview */}
          <InteractiveShowcase 
            onStartInvestigation={() => handleStartInvestigation(0)} 
          />

          {/* Section F: Final Impact CTA */}
          <FinalCTA 
            onStartInvestigation={() => handleStartInvestigation(0)} 
          />

          {/* Section G: Halftone Wordmark Footer (Kedhareswer Naidu 21st.dev inspired) */}
          <HalftoneFooter 
            onStartInvestigation={() => handleStartInvestigation(0)} 
          />
        </div>
      )}
    </div>
  );
}
