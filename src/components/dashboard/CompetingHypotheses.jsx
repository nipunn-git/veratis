import React, { useState } from 'react';
import { GitCompare, ChevronDown, ChevronUp, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';

export default function CompetingHypotheses({ hypotheses }) {
  const [expandedId, setExpandedId] = useState(hypotheses[0]?.id);

  const toggleHypothesis = (id) => {
    setExpandedId(prev => (prev === id ? null : id));
  };

  return (
    <div className="p-6 md:p-8 rounded-3xl bg-[#0c130f] border border-[#1f2d26] shadow-xl">
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#1f2d26] mb-6">
        <div className="flex items-center gap-2 text-xs font-mono text-[#c8f344] uppercase tracking-wider">
          <GitCompare className="w-4 h-4" />
          <span>COMPETING HYPOTHESES // PROBABILITY ARBITRATION</span>
        </div>
        <span className="text-xs font-mono text-[#788279]">
          ZERO CONFIRMATION BIAS FRAMEWORK
        </span>
      </div>

      <div className="space-y-4">
        {hypotheses.map((hyp) => {
          const isExpanded = expandedId === hyp.id;
          return (
            <div
              key={hyp.id}
              className={`rounded-2xl border transition-all overflow-hidden ${
                isExpanded 
                  ? 'bg-[#121c16] border-[#c8f344]/80 shadow-[0_0_20px_rgba(200,243,68,0.1)]' 
                  : 'bg-[#080d0a] border-[#18241e] hover:border-[#25392e]'
              }`}
            >
              {/* Header Bar */}
              <button
                onClick={() => toggleHypothesis(hyp.id)}
                className="w-full p-5 flex items-center justify-between text-left cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <div className="font-mono text-xs px-2.5 py-1 rounded bg-[#18241e] text-[#c8f344] font-bold">
                    {hyp.probability}%
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-[#788279] uppercase block">
                      {hyp.status}
                    </span>
                    <h4 className="text-base font-display font-bold text-[#f5f4ef]">
                      {hyp.title}
                    </h4>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono text-[#788279] hidden sm:inline-block">
                    {hyp.supporting.length} SUPP / {hyp.contradicting.length} CONTRA
                  </span>
                  {isExpanded ? <ChevronUp className="w-4 h-4 text-[#c8f344]" /> : <ChevronDown className="w-4 h-4 text-[#788279]" />}
                </div>
              </button>

              {/* Expanded Details */}
              {isExpanded && (
                <div className="px-6 pb-6 pt-2 border-t border-[#1a2820] space-y-5">
                  <p className="text-xs sm:text-sm text-[#a4b3a6] font-mono leading-relaxed">
                    {hyp.description}
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Supporting Evidence */}
                    <div className="p-4 rounded-xl bg-[#080d0a] border border-emerald-500/20">
                      <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 font-bold mb-3">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>SUPPORTING EMPIRICAL POINTS ({hyp.supporting.length}):</span>
                      </div>
                      {hyp.supporting.length > 0 ? (
                        <ul className="space-y-2 text-xs font-mono text-[#a4b3a6]">
                          {hyp.supporting.map((s, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <span className="text-emerald-400 font-bold">+</span>
                              <span>{s}</span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <span className="text-xs font-mono text-[#526356]">No supporting empirical evidence found.</span>
                      )}
                    </div>

                    {/* Contradicting Evidence */}
                    <div className="p-4 rounded-xl bg-[#080d0a] border border-rose-500/20">
                      <div className="flex items-center gap-2 text-xs font-mono text-rose-400 font-bold mb-3">
                        <XCircle className="w-4 h-4" />
                        <span>CONTRADICTING PHYSICAL LAWS / FACTS ({hyp.contradicting.length}):</span>
                      </div>
                      {hyp.contradicting.length > 0 ? (
                        <ul className="space-y-2 text-xs font-mono text-[#a4b3a6]">
                          {hyp.contradicting.map((c, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <span className="text-rose-400 font-bold">-</span>
                              <span>{c}</span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <span className="text-xs font-mono text-[#526356]">No contradictions identified under current dataset.</span>
                      )}
                    </div>
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
