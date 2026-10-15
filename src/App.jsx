import React, { useState, useEffect, useCallback, useRef } from 'react';
import WebGLHero from './components/hero/WebGLHero';
import Dashboard from './dashboard';

export default function App() {
  const [heroPhase, setHeroPhase] = useState('idle'); // 'idle' | 'animating' | 'done'
  const [view, setView] = useState('landing'); // 'landing' | 'transitioning' | 'dashboard'
  const isTransitioningRef = useRef(false);

  // 1. Lock scrolling on the main landing screen until touched & animation finishes
  useEffect(() => {
    if (view === 'landing' || heroPhase !== 'done') {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
      document.documentElement.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
      document.documentElement.style.overflow = 'auto';
    };
  }, [view, heroPhase]);

  // 2. Smoothly scroll into the dashboard and lock view so it never scrolls back to black glitch screen
  const handleScrollToDashboard = useCallback(() => {
    if (isTransitioningRef.current) return;
    isTransitioningRef.current = true;
    setView('transitioning');

    document.body.style.overflow = 'auto';
    document.documentElement.style.overflow = 'auto';

    // Allow DOM to mount dashboard section then scroll smoothly
    setTimeout(() => {
      const el = document.getElementById('dashboard');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }

      // Once smooth scroll finishes, commit permanently to 'dashboard' view
      // Hero unmounts so scrolling up stays at top of dashboard without returning to black screen
      setTimeout(() => {
        setView('dashboard');
        window.scrollTo(0, 0);
        isTransitioningRef.current = false;
      }, 700);
    }, 50);
  }, []);

  // 3. Listen for scroll/wheel attempts once the animation is done on the landing screen
  useEffect(() => {
    if (view !== 'landing' || heroPhase !== 'done') return;

    let triggered = false;
    const onWheel = (e) => {
      if (e.deltaY > 15 && !triggered) {
        triggered = true;
        handleScrollToDashboard();
      }
    };

    let touchStartY = 0;
    const onTouchStart = (e) => {
      touchStartY = e.touches[0].clientY;
    };
    const onTouchMove = (e) => {
      const touchY = e.touches[0].clientY;
      if (touchStartY - touchY > 25 && !triggered) {
        triggered = true;
        handleScrollToDashboard();
      }
    };

    window.addEventListener('wheel', onWheel, { passive: true });
    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });

    return () => {
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
    };
  }, [view, heroPhase, handleScrollToDashboard]);

  const handleHeroPhaseChange = useCallback((newPhase) => {
    setHeroPhase(newPhase);
  }, []);

  const handleReturnToHero = () => {
    setHeroPhase('idle');
    setView('landing');
    window.scrollTo(0, 0);
  };

  return (
    <div className="min-h-screen bg-[#0e0d0b] text-[#f5f4ef] selection:bg-[#20D9FF] selection:text-[#050B14]">
      {/* 1. Hero Section (Shown on landing and during smooth glide into dashboard) */}
      {view !== 'dashboard' && (
        <WebGLHero
          onExplore={handleScrollToDashboard}
          onPhaseChange={handleHeroPhaseChange}
        />
      )}

      {/* 2. Dashboard Section (Shown during transition and permanently when reached) */}
      {(view === 'transitioning' || view === 'dashboard') && (
        <section id="dashboard" className="relative w-full">
          <Dashboard onBackToLanding={handleReturnToHero} />
        </section>
      )}
    </div>
  );
}
