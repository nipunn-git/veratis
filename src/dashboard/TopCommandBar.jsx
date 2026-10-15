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
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-zinc-200/60 px-6 sm:px-10 lg:px-16 py-3 font-sans">
      <div className="w-full flex items-center justify-between gap-4">
        {/* Left: Clean Brand + Active Case */}
        <div className="flex items-center gap-3 sm:gap-4 min-w-0">
          <button
            onClick={onBackToLanding}
            className="flex items-center gap-2 text-zinc-900 hover:text-zinc-600 transition-colors cursor-pointer group shrink-0"
            title="Return to home"
          >
            <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5 text-zinc-400 group-hover:text-zinc-800" />
            <span className="font-semibold text-xs tracking-wider uppercase text-zinc-950">VERATIS</span>
          </button>

          <span className="text-zinc-300 hidden sm:inline select-none">/</span>

          {/* Active Case Title & Priority */}
          <div className="flex items-center gap-2.5 text-xs min-w-0">
            <span className="relative flex h-2 w-2 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-zinc-900 font-medium tracking-tight truncate">
              {currentCase.title}
            </span>
            <span className="text-zinc-400 font-mono text-[11px] hidden md:inline shrink-0">
              {currentCase.code}
            </span>
            <span className="hidden lg:inline px-2 py-0.5 rounded-full bg-zinc-100 text-[10px] font-medium text-zinc-500 shrink-0">
              {currentCase.threatLevel === 'CRITICAL' ? 'High priority' : currentCase.threatLevel === 'EVALUATING' ? 'Evaluating' : 'Standard'}
            </span>
          </div>
        </div>

        {/* Right: Minimal Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2 text-xs shrink-0">
          <button
            onClick={onOpenCaseSelector}
            className="px-3 py-1.5 rounded-lg text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100/80 flex items-center gap-1.5 transition-colors cursor-pointer font-medium"
          >
            <Layers className="w-3.5 h-3.5 text-zinc-500" />
            <span className="hidden sm:inline">Cases</span>
          </button>

          <button
            onClick={onOpenUpload}
            className="px-3 py-1.5 rounded-lg text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100/80 flex items-center gap-1.5 transition-colors cursor-pointer font-medium"
          >
            <Upload className="w-3.5 h-3.5 text-zinc-500" />
            <span className="hidden sm:inline">Ingest</span>
          </button>

          <button
            onClick={onExportDossier}
            className="px-3.5 py-1.5 rounded-lg bg-zinc-950 hover:bg-zinc-800 text-white font-medium flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export</span>
          </button>
        </div>
      </div>
    </header>
  );
}
