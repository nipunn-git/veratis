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
      {/* Left: Clean Brand + Active Case Indicator */}
      <div className="flex items-center gap-2.5 px-4 py-2 rounded-2xl bg-white/90 backdrop-blur-xl border border-zinc-200/80 shadow-xs text-sm pointer-events-auto">
        <button
          onClick={onBackToLanding}
          className="flex items-center gap-2 text-zinc-900 hover:text-zinc-600 transition-colors cursor-pointer group shrink-0"
          title="Return to home"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5 text-zinc-400 group-hover:text-zinc-800" />
          <span className="font-bold text-xs tracking-wider uppercase text-zinc-950">VERATIS</span>
        </button>

        <span className="text-zinc-300 select-none">/</span>

        <div className="flex items-center gap-2 min-w-0">
          <span className="text-zinc-900 font-semibold tracking-tight truncate max-w-[160px] sm:max-w-xs md:max-w-md">
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
    </header>
  );
}
