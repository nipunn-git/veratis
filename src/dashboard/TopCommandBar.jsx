import React from 'react';
import { 
  ArrowLeft, 
  Upload, 
  Download, 
  Layers, 
  Sliders 
} from 'lucide-react';

export default function TopCommandBar({
  currentCase,
  onBackToLanding,
  onOpenCaseSelector,
  onOpenUpload,
  onExportDossier,
  onSelectPreset,
}) {
  return (
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-zinc-100 px-4 sm:px-8 lg:px-12 py-3.5 font-sans">
      <div className="max-w-[1780px] w-full mx-auto flex items-center justify-between gap-4">
        {/* Left: Brand / Return to Landing / Case Identifier */}
        <div className="flex items-center gap-3 sm:gap-4">
          <button
            onClick={onBackToLanding}
            className="flex items-center gap-2 text-xs font-medium text-zinc-500 hover:text-zinc-900 transition-colors cursor-pointer group"
          >
            <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5 text-zinc-400 group-hover:text-zinc-700" />
            <span className="hidden sm:inline">Overview</span>
          </button>

          <span className="text-zinc-200 hidden sm:inline">/</span>

          {/* Active Case Tag */}
          <div className="flex items-center gap-2.5 text-xs">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-zinc-900 font-semibold tracking-tight">
              {currentCase.title}
            </span>
            <span className="text-zinc-400 text-xs hidden sm:inline">
              ({currentCase.code})
            </span>
            <span className="hidden md:inline px-2 py-0.5 rounded-full bg-zinc-100 text-[11px] font-medium text-zinc-600">
              {currentCase.threatLevel === 'CRITICAL' ? 'High priority' : currentCase.threatLevel === 'EVALUATING' ? 'Evaluating' : 'Standard'}
            </span>
          </div>
        </div>

        {/* Right: Quick Ingest, Switch Cases, Export */}
        <div className="flex items-center gap-2 text-xs">
          {/* Preset Layout Dropdown */}
          <select
            onChange={(e) => onSelectPreset(e.target.value)}
            defaultValue="balanced"
            className="hidden lg:block bg-zinc-50 hover:bg-zinc-100/80 border border-zinc-200/60 text-zinc-700 px-3 py-1.5 rounded-lg text-xs cursor-pointer outline-none transition-colors"
          >
            <option value="balanced">Preset: Balanced</option>
            <option value="telemetry">Preset: Telemetry</option>
            <option value="forensic">Preset: Forensics</option>
          </select>

          {/* Switch Case */}
          <button
            onClick={onOpenCaseSelector}
            className="px-3 py-1.5 rounded-lg text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Layers className="w-3.5 h-3.5 text-zinc-400" />
            <span className="hidden sm:inline font-medium">Cases</span>
          </button>

          {/* New Investigation */}
          <button
            onClick={onOpenUpload}
            className="px-3 py-1.5 rounded-lg text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Upload className="w-3.5 h-3.5 text-zinc-400" />
            <span className="hidden sm:inline font-medium">Ingest</span>
          </button>

          {/* Export Report */}
          <button
            onClick={onExportDossier}
            className="px-3.5 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-white font-medium flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Export</span>
          </button>
        </div>
      </div>
    </header>
  );
}
