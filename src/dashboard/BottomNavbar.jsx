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
  Layers
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
    { id: 'radar', label: 'Radar', icon: Radar, hotkey: '2' },
    { id: 'autopsy', label: 'Autopsy', icon: Search, hotkey: '3' },
    { id: 'timeline', label: 'Timeline', icon: Clock, hotkey: '4' },
    { id: 'gravity', label: 'Gravity', icon: GitFork, hotkey: '5' },
    { id: 'hypotheses', label: 'Hypotheses', icon: Scale, hotkey: '6' },
    { id: 'uncertainty', label: 'Uncertainty', icon: HelpCircle, hotkey: '7' },
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
    <nav className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50 w-auto max-w-[96vw] pointer-events-auto">
      {/* Floating Cybernetic Dock (High Contrast Obsidian against White Canvas) */}
      <div className="flex items-center gap-1 sm:gap-2 p-1.5 sm:p-2 rounded-2xl md:rounded-full bg-[#0a0b10]/95 backdrop-blur-2xl border border-zinc-700/80 ring-1 ring-white/20 shadow-[0_25px_60px_-10px_rgba(0,0,0,0.5),0_0_30px_rgba(255,255,255,0.08)] font-sans">
        
        {/* Enclave Status Pill */}
        <div className="hidden xl:flex items-center gap-2 pl-3 pr-2 text-[11px] text-zinc-400 border-r border-zinc-800">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400"></span>
          </span>
          <span className="font-medium tracking-wide text-zinc-300">Dock</span>
        </div>

        {/* Feature Switching Tabs */}
        <div className="flex items-center gap-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`group relative flex items-center gap-1.5 px-3 py-2 sm:px-3.5 sm:py-2 rounded-xl md:rounded-full transition-all duration-200 cursor-pointer text-xs select-none ${
                  isActive
                    ? 'bg-white text-zinc-950 font-semibold shadow-[0_0_25px_rgba(255,255,255,0.85)] scale-105'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-800/80 font-medium'
                }`}
                title={`Switch to ${tab.label} (Press ${tab.hotkey})`}
              >
                <Icon className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isActive ? 'text-zinc-950 stroke-[2.5]' : 'text-zinc-400 group-hover:text-white'}`} />
                <span className={`text-[11px] sm:text-xs tracking-tight ${isActive ? 'inline-block' : 'hidden md:inline-block'}`}>
                  {tab.label}
                </span>

                {/* Hotkey Badge */}
                <span
                  className={`hidden lg:inline-block text-[9px] px-1 py-0.2 rounded transition-colors ${
                    isActive
                      ? 'bg-zinc-200 text-zinc-900 font-semibold'
                      : 'bg-zinc-800/80 text-zinc-500 group-hover:text-zinc-300'
                  }`}
                >
                  {tab.hotkey}
                </span>

                {/* Glow Dot indicator */}
                {isActive && (
                  <span className="w-1 h-1 rounded-full bg-zinc-950 ml-0.5 hidden sm:inline-block" />
                )}
              </button>
            );
          })}
        </div>

        {/* Vertical Divider */}
        <div className="w-[1px] h-6 bg-zinc-800 mx-1 sm:mx-1.5" />

        {/* Quick Utility Actions */}
        <div className="flex items-center gap-1 text-xs">
          {/* Switch Case Modal */}
          <button
            onClick={onOpenCaseSelector}
            className="p-2 sm:px-3 sm:py-2 rounded-xl md:rounded-full text-zinc-400 hover:text-white hover:bg-zinc-800/80 transition-colors cursor-pointer flex items-center gap-1.5"
            title="Switch investigation case"
          >
            <Layers className="w-3.5 h-3.5 text-zinc-300" />
            <span className="hidden lg:inline text-[11px] font-medium">Cases</span>
          </button>

          {/* Quick Ingest / Upload */}
          <button
            onClick={onOpenUpload}
            className="p-2 sm:px-3 sm:py-2 rounded-xl md:rounded-full text-zinc-400 hover:text-white hover:bg-zinc-800/80 transition-colors cursor-pointer flex items-center gap-1.5"
            title="Upload specimen"
          >
            <Upload className="w-3.5 h-3.5 text-zinc-300" />
            <span className="hidden lg:inline text-[11px] font-medium">Ingest</span>
          </button>

          {/* Export Report */}
          <button
            onClick={onExportDossier}
            className="p-2 sm:px-3 sm:py-2 rounded-xl md:rounded-full text-zinc-400 hover:text-white hover:bg-zinc-800/80 transition-colors cursor-pointer flex items-center gap-1.5"
            title="Download forensic dossier"
          >
            <Download className="w-3.5 h-3.5 text-zinc-300" />
            <span className="hidden lg:inline text-[11px] font-medium">Dossier</span>
          </button>

          {/* Return to Landing Page */}
          <button
            onClick={onBackToLanding}
            className="p-2 sm:px-3 sm:py-2 rounded-xl md:rounded-full text-zinc-400 hover:text-white hover:bg-zinc-800/80 transition-colors cursor-pointer flex items-center gap-1.5"
            title="Return to landing page"
          >
            <Home className="w-3.5 h-3.5" />
            <span className="hidden xl:inline text-[11px] font-medium">Landing</span>
          </button>
        </div>
      </div>
    </nav>
  );
}
