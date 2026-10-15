import React from 'react';
import { Download, RefreshCw, Upload, ShieldAlert, Sparkles, CheckCircle2 } from 'lucide-react';

export default function SpecimenDossierWidget({ 
  currentCase, 
  onSwitchCase, 
  onExportDossier, 
  onNewUpload 
}) {
  if (!currentCase) return null;

  const isCritical = currentCase.threatLevel === 'CRITICAL';

  return (
    <div className="h-full flex flex-col justify-between font-sans">
      {/* Top Meta Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-zinc-100">
        <div className="flex items-center gap-2.5">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-xs font-semibold text-zinc-900 tracking-tight">
            Active investigation
          </span>
          <span className="text-zinc-300">·</span>
          <span className="text-xs text-zinc-500 font-medium">
            {currentCase.code}
          </span>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className={`px-2.5 py-0.5 rounded-full font-medium ${
            isCritical ? 'bg-rose-50 text-rose-700' : 'bg-amber-50 text-amber-700'
          }`}>
            {currentCase.threatLevel === 'CRITICAL' ? 'High priority' : 'Evaluating'}
          </span>
          <span className="text-zinc-300 hidden sm:inline">·</span>
          <span className="text-zinc-400 hidden sm:inline text-[11px]">{currentCase.dateLogged}</span>
        </div>
      </div>

      {/* Main Specimen Details */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 my-4 items-center">
        <div className="md:col-span-8 space-y-2">
          <h3 className="text-xl sm:text-2xl font-semibold text-zinc-900 tracking-tight leading-snug">
            {currentCase.title}
          </h3>
          <p className="text-xs sm:text-sm text-zinc-500 leading-relaxed line-clamp-2">
            {currentCase.subject}
          </p>

          <div className="flex flex-wrap items-center gap-2 pt-2">
            <button
              onClick={onSwitchCase}
              className="text-xs font-medium px-3 py-1.5 rounded-lg bg-zinc-100/80 hover:bg-zinc-200/70 text-zinc-700 transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5 text-zinc-500" />
              <span>Switch case</span>
            </button>

            <button
              onClick={onNewUpload}
              className="text-xs font-medium px-3 py-1.5 rounded-lg bg-zinc-100/80 hover:bg-zinc-200/70 text-zinc-700 transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <Upload className="w-3.5 h-3.5 text-zinc-500" />
              <span>Ingest media</span>
            </button>

            <button
              onClick={onExportDossier}
              className="text-xs font-medium px-3.5 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-white transition-colors cursor-pointer flex items-center gap-1.5 shadow-xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export dossier</span>
            </button>
          </div>
        </div>

        {/* Forensic Determination Badge (Clean, Unboxed) */}
        <div className="md:col-span-4 p-4 rounded-2xl bg-zinc-50/80 border border-zinc-100 flex flex-col justify-center text-center">
          <span className="text-xs text-zinc-400 font-medium block mb-1">
            Forensic determination
          </span>
          <div className="text-sm font-semibold text-zinc-900 leading-tight">
            {currentCase.verdict}
          </div>
          <div className="text-3xl font-semibold text-zinc-900 mt-1 tracking-tight tabular-nums">
            {currentCase.verdictConfidence}%
          </div>
          <span className="text-[11px] text-emerald-600 font-medium block mt-0.5">
            Verified match certainty
          </span>
        </div>
      </div>

      {/* Footer Meta */}
      <div className="flex items-center justify-between text-xs text-zinc-400 pt-3 border-t border-zinc-100">
        <span>Lead: {currentCase.leadInvestigator}</span>
        <span className="text-zinc-600 font-medium flex items-center gap-1.5">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Enclave verified
        </span>
      </div>
    </div>
  );
}
