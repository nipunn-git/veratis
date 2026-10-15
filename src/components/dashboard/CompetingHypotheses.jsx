import React, { useState } from 'react';
import { 
  ChevronDown, 
  ChevronUp, 
  Check, 
  X, 
  Sparkles 
} from 'lucide-react';

export default function CompetingHypotheses({ hypotheses = [] }) {
  const [expandedId, setExpandedId] = useState(hypotheses[0]?.id);
  const [hypothesisList, setHypothesisList] = useState(hypotheses);
  const [simulationActive, setSimulationActive] = useState(false);

  const toggleHypothesis = (id) => {
    setExpandedId(prev => (prev === id ? null : id));
  };

  const handleSimulateEvidence = () => {
    setSimulationActive(true);
    setHypothesisList(prev => prev.map((h, i) => {
      if (i === 0) return { ...h, probability: Math.min(96, h.probability + 8) };
      return { ...h, probability: Math.max(4, h.probability - 8) };
    }));
  };

  return (
    <div className="space-y-10 font-sans">
      {/* Editorial Header (Scaled Up) */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 pb-8 border-b border-zinc-100">
        <div>
          <span className="text-sm font-medium text-zinc-400 tracking-wide block">
            Bayesian arbitration
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-zinc-900 mt-1.5">
            Competing Hypotheses
          </h2>
          <p className="text-base sm:text-lg text-zinc-500 mt-2 max-w-2xl">
            Comparative evaluation of alternative scenarios against empirical findings.
          </p>
        </div>

        {/* Minimal Simulation Action (Scaled Up) */}
        <button
          onClick={handleSimulateEvidence}
          className="px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl bg-zinc-100/80 hover:bg-zinc-200/70 border border-zinc-200/50 text-zinc-800 text-sm font-medium transition-colors cursor-pointer flex items-center gap-2 self-start sm:self-auto"
        >
          <Sparkles className="w-4 h-4 text-zinc-500" />
          <span>{simulationActive ? 'Evidence simulated' : 'Simulate evidence'}</span>
        </button>
      </div>

      {/* Slim Probability Distribution Strip (Scaled Up) */}
      <div className="space-y-3 pb-8 border-b border-zinc-100">
        <div className="flex items-center justify-between text-sm text-zinc-500">
          <span>Probability distribution</span>
          <span className="font-semibold text-zinc-800">100% normalized</span>
        </div>

        {/* Progress bar scaled to h-2.5 */}
        <div className="w-full h-2.5 rounded-full bg-zinc-100 flex overflow-hidden">
          {hypothesisList.map((h, i) => (
            <div
              key={h.id}
              style={{ width: `${h.probability}%` }}
              className={`h-full transition-all duration-500 ${
                i === 0 ? 'bg-zinc-900' : 'bg-zinc-300'
              }`}
            />
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-6 text-sm sm:text-base text-zinc-600 pt-1.5">
          {hypothesisList.map((h, i) => (
            <span key={h.id} className="flex items-center gap-2">
              <span className={`w-2.5 h-2.5 rounded-full ${i === 0 ? 'bg-zinc-900' : 'bg-zinc-300'}`} />
              <span className="font-medium text-zinc-900">{h.title}</span>
              <span className="text-zinc-400">({h.probability}%)</span>
            </span>
          ))}
        </div>
      </div>

      {/* Hypotheses List (Scaled Up) */}
      <div className="space-y-5">
        {hypothesisList.map((hyp, i) => {
          const isExpanded = expandedId === hyp.id;
          const isLeading = i === 0;

          return (
            <div
              key={hyp.id}
              className={`rounded-2xl transition-all duration-150 p-6 sm:p-8 ${
                isLeading 
                  ? 'bg-zinc-50/80 border border-zinc-200/70' 
                  : 'bg-white border border-zinc-200/50 hover:border-zinc-300'
              }`}
            >
              {/* Card Header */}
              <div 
                onClick={() => toggleHypothesis(hyp.id)}
                className="flex items-center justify-between cursor-pointer select-none"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2.5">
                    <span className="text-sm text-zinc-400 font-medium">Scenario {i + 1}</span>
                    {isLeading && (
                      <>
                        <span className="text-zinc-300">·</span>
                        <span className="text-sm font-semibold text-zinc-950">
                          Leading hypothesis
                        </span>
                      </>
                    )}
                  </div>
                  <h3 className="text-xl sm:text-2xl font-semibold text-zinc-900 tracking-tight">
                    {hyp.title}
                  </h3>
                </div>

                <div className="flex items-center gap-4 sm:gap-6">
                  <div className="text-right">
                    <div className="text-3xl sm:text-4xl font-semibold text-zinc-900 tabular-nums">
                      {hyp.probability}%
                    </div>
                    <div className="text-xs sm:text-sm text-zinc-400 font-medium">Probability</div>
                  </div>
                  <button className="text-zinc-400 hover:text-zinc-700 p-1.5">
                    {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Scaled Indicator Bar */}
              <div className="w-full h-2 bg-zinc-100 rounded-full mt-4 overflow-hidden">
                <div 
                  style={{ width: `${hyp.probability}%` }}
                  className={`h-full rounded-full transition-all duration-500 ${
                    isLeading ? 'bg-zinc-900' : 'bg-zinc-400'
                  }`}
                />
              </div>

              {/* Expanded Body: Scaled Unboxed Arguments */}
              {isExpanded && (
                <div className="mt-6 pt-6 border-t border-zinc-200/60 grid grid-cols-1 md:grid-cols-2 gap-8 text-sm sm:text-base">
                  {/* Supporting Evidence */}
                  <div>
                    <span className="font-semibold text-zinc-900 block mb-3">
                      Supporting evidence
                    </span>
                    <ul className="space-y-2.5 text-zinc-600">
                      {hyp.supporting?.map((point, idx) => (
                        <li key={idx} className="flex items-start gap-2.5">
                          <Check className="w-4 h-4 text-emerald-600 mt-1 shrink-0" />
                          <span className="leading-relaxed">{point}</span>
                        </li>
                      )) || (
                        <li className="text-zinc-400">No supporting evidence logged.</li>
                      )}
                    </ul>
                  </div>

                  {/* Contradicting Evidence */}
                  <div>
                    <span className="font-semibold text-zinc-900 block mb-3">
                      Contradicting evidence
                    </span>
                    <ul className="space-y-2.5 text-zinc-600">
                      {hyp.contradicting?.map((point, idx) => (
                        <li key={idx} className="flex items-start gap-2.5">
                          <X className="w-4 h-4 text-rose-500 mt-1 shrink-0" />
                          <span className="leading-relaxed">{point}</span>
                        </li>
                      )) || (
                        <li className="text-zinc-400">No contradicting evidence logged.</li>
                      )}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
