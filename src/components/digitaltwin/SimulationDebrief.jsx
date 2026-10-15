import React from 'react';
import { 
  ShieldCheck, 
  ShieldAlert, 
  RotateCcw, 
  ArrowLeft, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Target, 
  Info,
  Sparkles
} from 'lucide-react';

export default function SimulationDebrief({
  scenario,
  evaluation,
  onRetry,
  onBackToScenarios,
}) {
  if (!evaluation) return null;

  return (
    <div className="max-w-4xl mx-auto space-y-8 font-sans animate-fadeIn">
      {/* Header Banner */}
      <div className="p-6 sm:p-8 bg-zinc-950 text-white rounded-3xl border border-zinc-800 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold tracking-widest text-emerald-400 uppercase">
              DEBRIEF // CYBERSECURITY TRAINING REVEAL
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/10 text-zinc-300">
              SIMULATION CONCLUDED
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Simulation Debrief & Performance Score
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400">
            Scenario: <strong className="text-white">{scenario.title}</strong> · Role: {scenario.characterName} ({scenario.role})
          </p>
        </div>

        {/* Score Card */}
        <div className="flex flex-col items-start sm:items-end gap-1.5 p-4 rounded-2xl bg-white/10 border border-white/10 shrink-0">
          <span className="text-xs font-mono text-zinc-400 uppercase">SECURITY RATING</span>
          <div className="text-3xl sm:text-4xl font-extrabold text-white tabular-nums">
            {evaluation.score}<span className="text-lg font-normal text-zinc-400"> / 100</span>
          </div>
          <span className={`text-[11px] font-mono px-2.5 py-0.5 rounded-full border font-bold ${evaluation.ratingColor}`}>
            {evaluation.rating}
          </span>
        </div>
      </div>

      {/* Observable Actions Rubric */}
      <div className="p-6 sm:p-8 bg-white rounded-3xl border border-zinc-200/90 shadow-xs space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
          <h3 className="text-base sm:text-lg font-bold text-zinc-950 tracking-tight flex items-center gap-2">
            <Target className="w-5 h-5 text-zinc-700" />
            <span>Observable Performance Rubric</span>
          </h3>
          <span className="text-xs font-mono text-zinc-400">BEHAVIORAL CRITERIA</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {evaluation.metrics.map((metric, idx) => (
            <div
              key={idx}
              className={`p-4 rounded-2xl border flex items-start gap-3 ${
                metric.achieved
                  ? 'bg-emerald-50/60 border-emerald-200/80 text-emerald-950'
                  : 'bg-rose-50/60 border-rose-200/80 text-rose-950'
              }`}
            >
              {metric.achieved ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              ) : (
                <XCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              )}
              <div className="space-y-0.5">
                <span className="font-bold text-xs sm:text-sm block">{metric.label}</span>
                <span className="text-[11px] font-mono text-zinc-500">
                  {metric.achieved ? `+${metric.weight} pts earned` : '0 pts · Vulnerability triggered'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Warning Signs Present in This Scenario */}
      <div className="p-6 sm:p-8 bg-white rounded-3xl border border-zinc-200/90 shadow-xs space-y-4">
        <h3 className="text-base sm:text-lg font-bold text-zinc-950 tracking-tight flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-amber-600" />
          <span>Active Red Flags Present in Scenario</span>
        </h3>
        <p className="text-xs sm:text-sm text-zinc-500">
          These subtle deception vectors were deployed by the persona during the conversation:
        </p>
        <div className="space-y-2.5 pt-2">
          {evaluation.redFlagsPresent.map((flag, idx) => (
            <div key={idx} className="p-3.5 rounded-2xl bg-amber-50/50 border border-amber-100 text-xs sm:text-sm text-amber-950 flex items-start gap-3">
              <span className="text-amber-600 font-bold font-mono">0{idx + 1}.</span>
              <span className="leading-relaxed">{flag}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Recommended Safe Responses */}
      <div className="p-6 sm:p-8 bg-white rounded-3xl border border-zinc-200/90 shadow-xs space-y-4">
        <h3 className="text-base sm:text-lg font-bold text-zinc-950 tracking-tight flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-600" />
          <span>Recommended Defensive Counter-Responses</span>
        </h3>
        <p className="text-xs sm:text-sm text-zinc-500">
          In real life, using these responses neutralizes social engineering without escalating conflict:
        </p>
        <div className="space-y-2.5 pt-2">
          {evaluation.safeRepliesRecommended.map((reply, idx) => (
            <div key={idx} className="p-3.5 rounded-2xl bg-zinc-50 border border-zinc-200/80 text-xs sm:text-sm text-zinc-800 leading-relaxed font-mono">
              "{reply}"
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
        <button
          onClick={onBackToScenarios}
          className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-zinc-100 hover:bg-zinc-200/80 text-zinc-800 font-bold text-xs sm:text-sm transition-all cursor-pointer flex items-center justify-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to All Scenarios</span>
        </button>

        <button
          onClick={onRetry}
          className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-zinc-950 hover:bg-zinc-800 text-white font-bold text-xs sm:text-sm transition-all cursor-pointer flex items-center justify-center gap-2 shadow-xs"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Retry This Scenario</span>
        </button>
      </div>
    </div>
  );
}
