import React from 'react';
import { Download, RefreshCw, Sparkles } from 'lucide-react';

export default function SpecimenSummaryWidget({ currentCase, onSwitchCase, onExportDossier, onNewUpload }) {
  if (!currentCase) return null;

  return (
    <div className="h-full flex flex-col justify-between">
      {/* Top Meta Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-white/10">
        <div className="flex items-center gap-2.5">
          <span className="px-2.5 py-1 rounded bg-zinc-900 text-white font-mono text-xs font-bold border border-zinc-700">
            {currentCase.code}
          </span>
          <span className="text-xs font-mono text-zinc-400">
            {currentCase.category}
          </span>
        </div>

        <div className="flex items-center gap-2 font-mono text-[11px] text-zinc-400">
          <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
          <span>THREAT LEVEL: <strong className="text-white">{currentCase.threatLevel}</strong></span>
          <span className="text-zinc-700">|</span>
          <span className="hidden sm:inline">{currentCase.dateLogged}</span>
        </div>
      </div>

      {/* Main Specimen Details in Matte Gray & Pure White */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 my-5 items-center">
        <div className="md:col-span-8 space-y-2.5">
          <h2 className="text-xl sm:text-2xl font-bold text-white uppercase tracking-tight">
            {currentCase.title}
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed font-light">
            {currentCase.subject}
          </p>

          <div className="flex flex-wrap items-center gap-2 pt-2">
            <button
              onClick={onSwitchCase}
              className="text-xs font-mono px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-700 hover:border-white text-zinc-300 hover:text-white transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <RefreshCw className="w-3 h-3" />
              <span>SWITCH CASE</span>
            </button>

            <button
              onClick={onNewUpload}
              className="text-xs font-mono px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-700 hover:border-white text-zinc-300 hover:text-white transition-colors cursor-pointer"
            >
              UPLOAD NEW SPECIMEN
            </button>

            <button
              onClick={onExportDossier}
              className="text-xs font-mono px-3 py-1.5 rounded-lg bg-white text-black font-bold hover:bg-zinc-200 transition-all cursor-pointer flex items-center gap-1.5 shadow-[0_0_12px_rgba(255,255,255,0.25)]"
            >
              <Download className="w-3 h-3" />
              <span>EXPORT DOSSIER (.MD)</span>
            </button>
          </div>
        </div>

        {/* Verdict Badge */}
        <div className="md:col-span-4 p-4 rounded-2xl bg-[#070709] border border-white/10 text-center font-mono">
          <span className="text-[10px] text-zinc-400 tracking-wider block uppercase mb-1">
            FORENSIC DETERMINATION
          </span>
          <div className="text-base sm:text-lg font-bold text-zinc-200 mb-1 leading-tight">
            {currentCase.verdict}
          </div>
          <div className="text-3xl font-extrabold text-white tracking-tight">
            {currentCase.verdictConfidence}%
          </div>
          <span className="text-[10px] text-zinc-500 block mt-0.5">
            BAYESIAN CERTAINTY INDEX
          </span>
        </div>
      </div>

      {/* Footer Meta */}
      <div className="flex items-center justify-between text-[11px] font-mono text-zinc-500 pt-3 border-t border-white/10">
        <span>LEAD INVESTIGATOR: {currentCase.leadInvestigator}</span>
        <span className="text-zinc-300 flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-white" /> Enclave Verified
        </span>
      </div>
    </div>
  );
}
