import React from 'react';
import { 
  ArrowLeft, 
  Upload, 
  Download, 
  Layers 
} from 'lucide-react';

export default function TopCommandBar({
  currentCase,
  onBackToLanding,
  onOpenCaseSelector,
  onOpenUpload,
  onExportDossier,
}) {
  return (
    <header className="w-full px-6 sm:px-10 lg:px-14 pt-3.5 pb-1 relative z-30 flex items-center justify-between font-sans pointer-events-none select-none shrink-0">
      {/* Left: Clean Brand + Active Case Pill */}
      <div className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white/85 backdrop-blur-xl border border-zinc-200/70 shadow-xs text-xs pointer-events-auto">
        <button
          onClick={onBackToLanding}
          className="flex items-center gap-2 text-zinc-900 hover:text-zinc-600 transition-colors cursor-pointer group shrink-0"
          title="Return to home"
        >
          <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5 text-zinc-400 group-hover:text-zinc-800" />
          <span className="font-semibold text-xs tracking-wider uppercase text-zinc-950">VERATIS</span>
        </button>

        <span className="text-zinc-300 select-none">/</span>

        <div className="flex items-center gap-2 min-w-0">
          <span className="relative flex h-2 w-2 shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-zinc-900 font-medium tracking-tight truncate max-w-[160px] sm:max-w-xs md:max-w-md">
            {currentCase.title}
          </span>
        </div>
      </div>

      {/* Center: Floating Obsidian Capsule Dock for Ingest/Export/Cases (Matches bottom dock!) */}
      <div className="absolute left-1/2 -translate-x-1/2 pointer-events-auto flex items-center gap-1 p-1 rounded-full bg-zinc-950/90 backdrop-blur-2xl border border-zinc-800/80 shadow-[0_15px_35px_rgba(0,0,0,0.35)] text-xs">
        <button
          onClick={onOpenCaseSelector}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-zinc-300 hover:text-white hover:bg-zinc-800/70 transition-all cursor-pointer font-medium"
          title="Switch investigation case"
        >
          <Layers className="w-3.5 h-3.5 text-zinc-400" />
          <span className="text-xs">Cases</span>
        </button>

        <button
          onClick={onOpenUpload}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-zinc-300 hover:text-white hover:bg-zinc-800/70 transition-all cursor-pointer font-medium"
          title="Ingest / upload specimen"
        >
          <Upload className="w-3.5 h-3.5 text-zinc-400" />
          <span className="text-xs">Ingest</span>
        </button>

        <button
          onClick={onExportDossier}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white text-zinc-950 font-medium hover:bg-zinc-100 transition-all cursor-pointer shadow-xs"
          title="Download forensic dossier"
        >
          <Download className="w-3.5 h-3.5 stroke-[2.2]" />
          <span className="text-xs">Export</span>
        </button>
      </div>

      {/* Right: Case Identifier & Threat Level */}
      <div className="hidden lg:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/85 backdrop-blur-xl border border-zinc-200/70 shadow-xs text-[11px] font-medium text-zinc-600 pointer-events-auto">
        <span className="font-mono text-zinc-400">{currentCase.code}</span>
        <span className="w-1 h-1 rounded-full bg-zinc-300" />
        <span className="text-zinc-700">
          {currentCase.threatLevel === 'CRITICAL' ? 'High priority' : currentCase.threatLevel === 'EVALUATING' ? 'Evaluating' : 'Standard'}
        </span>
      </div>
    </header>
  );
}
