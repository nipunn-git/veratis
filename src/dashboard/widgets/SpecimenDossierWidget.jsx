import { Download, RefreshCw, Upload, ShieldAlert, Sparkles, CheckCircle2, Gavel, Bot, FileText, Activity } from 'lucide-react';

export default function SpecimenDossierWidget({ 
  currentCase, 
  onSwitchCase, 
  onExportDossier, 
  onNewUpload,
  onPredictOriginal,
  onNavigateTab,
  onOpenNeutralizer,
  onOpenReactor
}) {
  if (!currentCase) return null;

  const isCritical = currentCase.threatLevel === 'CRITICAL';

  return (
    <div className="h-full flex flex-col justify-between font-sans">
      {/* Top Meta Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-zinc-100">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-zinc-900 tracking-tight">
            Active investigation
          </span>
          <span className="text-zinc-300">/</span>
          <span className="text-xs font-medium tracking-wide text-zinc-400 uppercase">
            {currentCase.code}
          </span>
        </div>

        <div className="flex items-center gap-3 text-xs sm:text-sm">
          <span className={`font-semibold tracking-tight ${
            isCritical ? 'text-rose-600' : 'text-amber-600'
          }`}>
            {currentCase.threatLevel === 'CRITICAL' ? 'High priority' : 'Evaluating'}
          </span>
          <span className="text-zinc-300 hidden sm:inline">·</span>
          <span className="text-zinc-400 hidden sm:inline text-xs font-normal">
            {currentCase.dateLogged ? currentCase.dateLogged.replace('//', '·') : 'Oct 14, 2026 · 18:42 UTC'}
          </span>
        </div>
      </div>

      {/* Main Specimen Details */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 my-4 items-center">
        <div className="md:col-span-8 space-y-2.5">
          <h3 className="text-2xl sm:text-3xl font-semibold text-zinc-950 tracking-tight leading-snug">
            {currentCase.title}
          </h3>
          <p className="text-sm sm:text-base text-zinc-600 leading-relaxed line-clamp-2">
            {currentCase.subject}
          </p>

          <div className="flex flex-wrap items-center gap-2.5 pt-2">
            <button
              onClick={() => onNavigateTab?.('tribunal')}
              className="px-3.5 py-2.5 rounded-xl bg-white hover:bg-zinc-50 border border-zinc-200/90 text-zinc-800 text-sm font-medium transition-all cursor-pointer flex items-center gap-2 shadow-2xs"
              title="Open Truth Tribunal deliberation"
            >
              <Gavel className="w-3.5 h-3.5 text-zinc-500" />
              <span>Tribunal</span>
            </button>

            <button
              onClick={() => onNavigateTab?.('twin')}
              className="px-3.5 py-2.5 rounded-xl bg-white hover:bg-zinc-50 border border-zinc-200/90 text-zinc-800 text-sm font-medium transition-all cursor-pointer flex items-center gap-2 shadow-2xs"
              title="Launch Digital Twin social engineering simulator"
            >
              <Bot className="w-3.5 h-3.5 text-zinc-500" />
              <span>Digital Twin</span>
            </button>

            <button
              onClick={onPredictOriginal}
              className="px-4 py-2.5 rounded-xl bg-zinc-950 hover:bg-black text-white text-sm font-medium transition-all cursor-pointer flex items-center gap-2 shadow-xs"
            >
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>Predict Original</span>
            </button>

            <button
              onClick={onOpenReactor}
              className="px-3.5 py-2.5 rounded-xl bg-white hover:bg-zinc-50 border border-zinc-200/90 text-zinc-800 text-sm font-medium transition-all cursor-pointer flex items-center gap-2 shadow-2xs"
              title="Simulate rumor network propagation & mutation"
            >
              <Activity className="w-4 h-4 text-zinc-500" />
              <span>Rumor Reactor</span>
            </button>

            <button
              onClick={onOpenNeutralizer}
              className="px-3.5 py-2.5 rounded-xl bg-white hover:bg-zinc-50 border border-zinc-200/90 text-zinc-800 text-sm font-medium transition-all cursor-pointer flex items-center gap-2 shadow-2xs"
              title="Neutralize manipulative language & framing"
            >
              <FileText className="w-4 h-4 text-zinc-500" />
              <span>Neutralizer</span>
            </button>

            <button
              onClick={onSwitchCase}
              className="px-3 py-2.5 rounded-xl bg-white hover:bg-zinc-50 border border-zinc-200/90 text-zinc-600 hover:text-zinc-900 text-sm font-medium transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs"
            >
              <RefreshCw className="w-3.5 h-3.5 text-zinc-400" />
              <span>Cases</span>
            </button>

            <button
              onClick={onNewUpload}
              className="px-3 py-2.5 rounded-xl bg-white hover:bg-zinc-50 border border-zinc-200/90 text-zinc-600 hover:text-zinc-900 text-sm font-medium transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs"
            >
              <Upload className="w-3.5 h-3.5 text-zinc-400" />
              <span>Upload</span>
            </button>
          </div>
        </div>

        {/* Forensic Determination Badge (Clean, Minimal, No Capsule) */}
        <div className="md:col-span-4 p-5 rounded-2xl bg-zinc-50/70 border border-zinc-100 flex flex-col justify-center text-center">
          <span className="text-xs text-zinc-400 font-semibold uppercase tracking-wider block mb-1">
            Forensic determination
          </span>
          <div className="text-base font-semibold text-zinc-950 leading-tight">
            {currentCase.verdict}
          </div>
          <div className="text-4xl font-bold text-zinc-950 mt-1.5 tracking-tight tabular-nums">
            {currentCase.verdictConfidence}%
          </div>
          <span className="text-xs text-emerald-700 font-medium block mt-1">
            Verified match certainty
          </span>
        </div>
      </div>

      {/* Footer Meta */}
      <div className="flex items-center justify-between text-xs sm:text-sm text-zinc-500 pt-3 border-t border-zinc-100">
        <span>Authentic Ground Truth Recovery</span>
        <button
          onClick={onPredictOriginal}
          className="text-xs sm:text-sm font-semibold text-zinc-900 hover:text-emerald-700 flex items-center gap-1.5 cursor-pointer transition-colors"
        >
          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
          <span>Invert Latent Deepfake →</span>
        </button>
      </div>
    </div>
  );
}
