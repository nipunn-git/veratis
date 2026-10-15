import React from 'react';
import { 
  Scale, 
  ShieldCheck, 
  AlertTriangle, 
  FileText, 
  ArrowRight, 
  CheckCircle2, 
  AlertOctagon,
  Download,
  Share2
} from 'lucide-react';

export default function AdjudicatorAssessment({ assessment, onExportReport }) {
  if (!assessment) return null;

  // Outcome badge styling
  const getOutcomeStyle = (outcome) => {
    switch (outcome) {
      case 'Supported by supplied evidence':
        return {
          bg: 'bg-emerald-50 text-emerald-800 border-emerald-300',
          icon: CheckCircle2,
          color: 'text-emerald-600',
        };
      case 'Misleading context suspected':
        return {
          bg: 'bg-amber-50 text-amber-900 border-amber-300',
          icon: AlertTriangle,
          color: 'text-amber-600',
        };
      case 'Potential manipulation indicators':
        return {
          bg: 'bg-rose-50 text-rose-900 border-rose-300',
          icon: AlertOctagon,
          color: 'text-rose-600',
        };
      case 'Insufficient evidence':
      case 'Unverified claim':
      default:
        return {
          bg: 'bg-zinc-100 text-zinc-900 border-zinc-300',
          icon: Scale,
          color: 'text-zinc-700',
        };
    }
  };

  const style = getOutcomeStyle(assessment.outcome);
  const StatusIcon = style.icon;

  return (
    <div className="rounded-3xl bg-white border border-zinc-200/90 shadow-md overflow-hidden font-sans">
      {/* Top Banner */}
      <div className="p-6 sm:p-8 bg-zinc-950 text-white flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-semibold tracking-wider text-emerald-400 uppercase">
              STAGE 04 // FINAL ADJUDICATION
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-zinc-300 font-mono">
              SYNTHESIZED DETERMINATION
            </span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            The Adjudicator's Final Assessment
          </h3>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-2xl">
            A balanced determination based strictly on verified bitstream anomalies, observational constraints, and dialectical challenge.
          </p>
        </div>

        {/* Outcome Badge */}
        <div className="flex flex-col items-start md:items-end gap-2 shrink-0">
          <span className="text-xs font-mono text-zinc-400 uppercase">DETERMINATION VERDICT</span>
          <div className={`px-4 py-2 rounded-2xl border font-bold text-sm sm:text-base flex items-center gap-2 shadow-sm ${style.bg}`}>
            <StatusIcon className={`w-5 h-5 ${style.color}`} />
            <span>{assessment.outcome}</span>
          </div>
        </div>
      </div>

      {/* Main Body */}
      <div className="p-6 sm:p-8 space-y-8 bg-white">
        {/* Rationale & Summary */}
        <div className="p-5 sm:p-6 rounded-2xl bg-zinc-50 border border-zinc-200/70 space-y-2">
          <span className="text-xs font-mono font-bold text-zinc-900 uppercase tracking-wider block">
            Executive Rationale & Assessment
          </span>
          <p className="text-sm sm:text-base text-zinc-800 leading-relaxed font-sans">
            {assessment.verdictSummary}
          </p>
        </div>

        {/* 3 Columns: Grounded Evidence | Known Limitations | Next Verification Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          {/* Col 1: Grounded Evidence */}
          <div className="space-y-3 p-5 rounded-2xl bg-zinc-50/60 border border-zinc-100">
            <span className="text-xs font-mono font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              Grounded Observations ({assessment.groundedEvidence?.length || 0})
            </span>
            <ul className="space-y-2 text-xs text-zinc-700">
              {assessment.groundedEvidence?.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2 leading-relaxed">
                  <span className="text-emerald-500 font-bold shrink-0">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 2: Epistemic Limitations */}
          <div className="space-y-3 p-5 rounded-2xl bg-zinc-50/60 border border-zinc-100">
            <span className="text-xs font-mono font-bold text-amber-800 uppercase tracking-wider flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
              Known Limitations & Gaps
            </span>
            <ul className="space-y-2 text-xs text-zinc-700">
              {assessment.limitations?.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2 leading-relaxed">
                  <span className="text-amber-500 font-bold shrink-0">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Practical Next Steps */}
          <div className="space-y-3 p-5 rounded-2xl bg-zinc-50/60 border border-zinc-100">
            <span className="text-xs font-mono font-bold text-sky-800 uppercase tracking-wider flex items-center gap-1.5">
              <ArrowRight className="w-3.5 h-3.5 text-sky-600" />
              Next Verification Steps
            </span>
            <ul className="space-y-2 text-xs text-zinc-700">
              {assessment.recommendedNextSteps?.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2 leading-relaxed">
                  <span className="text-sky-500 font-bold shrink-0">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
