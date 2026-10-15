import React, { useState } from 'react';
import { 
  ShieldAlert, 
  Cpu, 
  Scale, 
  ChevronDown, 
  ChevronUp, 
  AlertTriangle, 
  CheckCircle2, 
  HelpCircle,
  ExternalLink
} from 'lucide-react';

export default function PersonalityCard({ type, data, isEvaluating }) {
  const [isExpanded, setIsExpanded] = useState(true);

  // Configure personality visual identity & tone
  const configs = {
    skeptic: {
      title: "The Skeptic",
      role: "Adversarial Challenge & Assumption Audit",
      subtitle: "Relentlessly challenges claims, identifies unproven premises, and demands falsifiable proof.",
      accentBorder: "border-rose-200",
      accentBg: "bg-rose-50/70",
      badgeClass: "bg-rose-100 text-rose-800 border-rose-200",
      icon: ShieldAlert,
      iconColor: "text-rose-600",
      headerBg: "bg-gradient-to-r from-rose-50 to-white",
    },
    forensic: {
      title: "The Forensic Analyst",
      role: "Empirical Bitstream & Contextual Inspection",
      subtitle: "Examines syntax, frequency signatures, metadata, and strictly observed physical artifacts.",
      accentBorder: "border-sky-200",
      accentBg: "bg-sky-50/70",
      badgeClass: "bg-sky-100 text-sky-800 border-sky-200",
      icon: Cpu,
      iconColor: "text-sky-600",
      headerBg: "bg-gradient-to-r from-sky-50 to-white",
    },
    adjudicator: {
      title: "The Adjudicator",
      role: "Epistemic Arbitration & Verdict Synthesis",
      subtitle: "Weighs opposing arguments, separates facts from hypotheses, and issues grounded conclusions.",
      accentBorder: "border-zinc-300",
      accentBg: "bg-zinc-50/90",
      badgeClass: "bg-zinc-900 text-white border-zinc-900",
      icon: Scale,
      iconColor: "text-zinc-900",
      headerBg: "bg-gradient-to-r from-zinc-100 to-white",
    },
  };

  const cfg = configs[type] || configs.skeptic;
  const Icon = cfg.icon;

  if (isEvaluating) {
    return (
      <div className={`p-6 rounded-3xl bg-white border ${cfg.accentBorder} shadow-xs flex flex-col justify-between min-h-[380px] animate-pulse`}>
        <div className="flex items-center gap-3">
          <div className={`p-2.5 rounded-2xl ${cfg.accentBg} ${cfg.iconColor}`}>
            <Icon className="w-5 h-5 animate-spin" />
          </div>
          <div>
            <span className="text-xs font-mono tracking-widest text-zinc-400 uppercase">ANALYZING EVIDENCE</span>
            <h4 className="text-lg font-bold text-zinc-900">{cfg.title}</h4>
          </div>
        </div>
        <div className="space-y-3 py-8">
          <div className="h-3 bg-zinc-100 rounded-full w-5/6" />
          <div className="h-3 bg-zinc-100 rounded-full w-4/6" />
          <div className="h-3 bg-zinc-100 rounded-full w-full" />
          <div className="h-3 bg-zinc-100 rounded-full w-3/4" />
        </div>
        <span className="text-xs font-mono text-zinc-400">Independent examination in progress...</span>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className={`rounded-3xl bg-white border ${cfg.accentBorder} shadow-xs overflow-hidden flex flex-col justify-between transition-all duration-200 hover:shadow-md`}>
      {/* Personality Card Header */}
      <div className={`p-5 sm:p-6 ${cfg.headerBg} border-b border-zinc-100 flex items-start justify-between gap-4`}>
        <div className="flex items-start gap-3.5">
          <div className={`p-2.5 rounded-2xl ${cfg.accentBg} ${cfg.iconColor} shrink-0 mt-0.5 shadow-xs`}>
            <Icon className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-lg sm:text-xl font-bold text-zinc-900 tracking-tight">{cfg.title}</h3>
              <span className={`text-[11px] font-mono px-2 py-0.5 rounded-full border font-semibold ${cfg.badgeClass}`}>
                {type.toUpperCase()}
              </span>
            </div>
            <p className="text-xs font-medium text-zinc-600 mt-0.5">{cfg.role}</p>
          </div>
        </div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-1.5 rounded-xl hover:bg-zinc-200/50 text-zinc-400 hover:text-zinc-700 transition-colors cursor-pointer shrink-0"
          title={isExpanded ? "Collapse panel" : "Expand panel"}
        >
          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {/* Expandable Findings Body */}
      {isExpanded && (
        <div className="p-5 sm:p-6 space-y-6 text-sm text-zinc-700 font-sans">
          {/* SKEPTIC FINDINGS */}
          {type === 'skeptic' && (
            <>
              {/* Unsupported Assumptions */}
              <div className="space-y-2">
                <span className="text-xs font-mono font-semibold tracking-wider text-rose-700 uppercase flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  Unsupported Assumptions ({data.unsupportedAssumptions?.length || 0})
                </span>
                <ul className="space-y-2 text-xs sm:text-sm text-zinc-600 pl-1">
                  {data.unsupportedAssumptions?.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2 leading-relaxed">
                      <span className="text-rose-500 font-bold shrink-0">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Missing Evidence */}
              <div className="space-y-2 pt-2 border-t border-zinc-100">
                <span className="text-xs font-mono font-semibold tracking-wider text-amber-700 uppercase flex items-center gap-1.5">
                  <HelpCircle className="w-3.5 h-3.5" />
                  Missing Critical Evidence
                </span>
                <ul className="space-y-1.5 text-xs text-zinc-600 pl-1">
                  {data.missingEvidence?.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2 leading-relaxed">
                      <span className="text-amber-500 font-bold shrink-0">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Contradictions */}
              {data.contradictions?.length > 0 && (
                <div className="p-3.5 rounded-2xl bg-rose-50/80 border border-rose-100 text-xs text-rose-950 space-y-1">
                  <span className="font-bold block text-rose-900 font-mono tracking-tight uppercase">Direct Contradictions:</span>
                  {data.contradictions.map((c, i) => (
                    <p key={i} className="leading-relaxed">{c}</p>
                  ))}
                </div>
              )}
            </>
          )}

          {/* FORENSIC ANALYST FINDINGS */}
          {type === 'forensic' && (
            <>
              {/* Grounded Technical Observations */}
              <div className="space-y-2">
                <span className="text-xs font-mono font-semibold tracking-wider text-sky-700 uppercase flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Empirically Verified Observations
                </span>
                <div className="space-y-2">
                  {data.groundedObservations?.map((obs, idx) => (
                    <div key={idx} className="p-2.5 rounded-xl bg-sky-50/60 border border-sky-100/80 text-xs text-sky-950 leading-relaxed font-sans">
                      {obs}
                    </div>
                  ))}
                </div>
              </div>

              {/* Bitstream / Linguistic Details */}
              <div className="space-y-2.5 pt-2 border-t border-zinc-100 text-xs">
                {data.visualClues && (
                  <div>
                    <span className="font-semibold text-zinc-900 block">Visual / Spectral Signature:</span>
                    <p className="text-zinc-600 mt-0.5 leading-relaxed">{data.visualClues}</p>
                  </div>
                )}
                {data.audioClues && data.audioClues !== "Not applicable." && (
                  <div>
                    <span className="font-semibold text-zinc-900 block">Acoustic / Formant Analysis:</span>
                    <p className="text-zinc-600 mt-0.5 leading-relaxed">{data.audioClues}</p>
                  </div>
                )}
                {data.sourceObservations && (
                  <div>
                    <span className="font-semibold text-zinc-900 block">Source Provenance Telemetry:</span>
                    <p className="text-zinc-600 mt-0.5 leading-relaxed">{data.sourceObservations}</p>
                  </div>
                )}
              </div>
            </>
          )}

          {/* ADJUDICATOR SYNTHESIS PREVIEW */}
          {type === 'adjudicator' && (
            <div className="space-y-3">
              <span className="text-xs font-mono font-semibold tracking-wider text-zinc-900 uppercase block">
                Evidence Synthesis & Arbitration
              </span>
              <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed">
                {data.verdictSummary || "Comparing opposing hypotheses against verified observational constraints."}
              </p>
              <div className="p-3 rounded-xl bg-zinc-100 text-xs text-zinc-800 font-mono">
                Status: Complete deliberation available below.
              </div>
            </div>
          )}
        </div>
      )}

      {/* Footer Meta */}
      <div className="px-5 sm:px-6 py-3 bg-zinc-50 border-t border-zinc-100 flex items-center justify-between text-[11px] font-mono text-zinc-400">
        <span>INDEPENDENT AGENT 0{type === 'skeptic' ? '1' : type === 'forensic' ? '2' : '3'}</span>
        <span className="text-zinc-600 font-medium">Deterministic Context</span>
      </div>
    </div>
  );
}
