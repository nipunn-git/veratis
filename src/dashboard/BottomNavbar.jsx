import React, { useEffect } from 'react';
import { 
  LayoutGrid, 
  Radar, 
  Search, 
  Clock, 
  GitFork, 
  Scale, 
  HelpCircle, 
  Upload, 
  Download, 
  Home, 
  Layers,
  Sparkles,
  Gavel,
  Bot
} from 'lucide-react';

export default function BottomNavbar({
  activeTab,
  onTabChange,
  onOpenCaseSelector,
  onOpenUpload,
  onExportDossier,
  onBackToLanding,
}) {
  const tabs = [
    { id: 'overview', label: 'Grid', icon: LayoutGrid, hotkey: '1' },
    { id: 'tribunal', label: 'Tribunal', icon: Gavel, hotkey: '2' },
    { id: 'twin', label: 'Digital Twin', icon: Bot, hotkey: '3' },
    { id: 'reconstruct', label: 'Reconstruct', icon: Sparkles, hotkey: '4' },
    { id: 'radar', label: 'Radar', icon: Radar, hotkey: '5' },
    { id: 'autopsy', label: 'Autopsy', icon: Search, hotkey: '6' },
    { id: 'timeline', label: 'Timeline', icon: Clock, hotkey: '7' },
    { id: 'gravity', label: 'Gravity', icon: GitFork, hotkey: '8' },
    { id: 'hypotheses', label: 'Hypotheses', icon: Scale, hotkey: '9' },
    { id: 'uncertainty', label: 'Uncertainty', icon: HelpCircle, hotkey: '0' },
  ];

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName)) return;
      const match = tabs.find((t) => t.hotkey === e.key);
      if (match) {
        onTabChange(match.id);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [tabs, onTabChange]);

  return (
    <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-auto max-w-[96vw] pointer-events-auto">
      {/* Floating Minimalist Obsidian Capsule Dock */}
      <div className="flex items-center gap-1 sm:gap-1.5 p-1.5 rounded-full bg-zinc-950/90 backdrop-blur-2xl border border-zinc-800/80 shadow-[0_20px_50px_rgba(0,0,0,0.45)] font-sans">
        {/* Feature Switching Tabs */}
        <div className="flex items-center gap-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-full transition-all duration-150 cursor-pointer text-xs select-none ${
                  isActive
                    ? 'bg-white text-zinc-950 font-medium shadow-sm'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-800/60 font-normal'
                }`}
                title={`Switch to ${tab.label} (Press ${tab.hotkey})`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-zinc-950 stroke-[2.2]' : 'text-zinc-400'}`} />
                <span className="text-xs tracking-tight">
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* Subtle Separator */}
        <div className="w-px h-4 bg-zinc-800 mx-1" />

        {/* Exit / Return to Landing Page */}
        <button
          onClick={onBackToLanding}
          className="flex items-center gap-1 px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-800/60 transition-colors cursor-pointer text-xs font-normal"
          title="Return to home landing page"
        >
          <Home className="w-3.5 h-3.5" />
          <span className="hidden sm:inline text-xs">Home</span>
        </button>
      </div>
    </nav>
  );
}
