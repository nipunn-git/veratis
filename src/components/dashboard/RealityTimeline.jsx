import React, { useState } from 'react';
import { Clock, CheckCircle2, AlertTriangle, XCircle, Filter } from 'lucide-react';

export default function RealityTimeline({ timeline }) {
  const [filter, setFilter] = useState('all'); // 'all' | 'verified' | 'suspicious' | 'critical'

  const filteredTimeline = timeline.filter(item => {
    if (filter === 'all') return true;
    return item.status === filter;
  });

  return (
    <div className="p-6 md:p-8 rounded-3xl bg-[#0c130f] border border-[#1f2d26] shadow-xl">
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#1f2d26] mb-6">
        <div className="flex items-center gap-2 text-xs font-mono text-[#c8f344] uppercase tracking-wider">
          <Clock className="w-4 h-4" />
          <span>REALITY TIMELINE // CHRONOLOGICAL PROVENANCE RECONSTRUCTION</span>
        </div>

        {/* Filter Controls */}
        <div className="flex items-center gap-2 bg-[#080d0a] p-1 rounded-xl border border-[#1f2d26] text-xs font-mono">
          <span className="text-[#788279] text-[10px] px-2 hidden sm:inline-block">FILTER:</span>
          {['all', 'verified', 'suspicious', 'critical'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1 rounded-lg text-[10px] uppercase transition-colors cursor-pointer ${
                filter === f ? 'bg-[#1e2e24] text-[#c8f344] font-bold' : 'text-[#788279] hover:text-[#f5f4ef]'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Timeline Events List */}
      <div className="space-y-4">
        {filteredTimeline.map((item, idx) => {
          const isVerified = item.status === 'verified';
          const isCritical = item.status === 'critical';
          const isSuspicious = item.status === 'suspicious';

          return (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-[#080d0a] border border-[#1f2d26] flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-[#2b3e32] transition-colors"
            >
              <div className="flex items-start gap-4">
                <div className={`p-2.5 rounded-xl border mt-0.5 shrink-0 ${
                  isVerified 
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' 
                    : isCritical 
                    ? 'bg-rose-500/10 border-rose-500/30 text-rose-400' 
                    : 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                }`}>
                  {isVerified ? <CheckCircle2 className="w-4 h-4" /> : 
                   isCritical ? <XCircle className="w-4 h-4" /> : 
                   <AlertTriangle className="w-4 h-4" />}
                </div>

                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className="text-xs font-mono font-bold text-[#f5f4ef]">
                      {item.event}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#16221b] text-[#a4b3a6] border border-[#23352b]">
                      {item.platform}
                    </span>
                  </div>
                  <p className="text-xs text-[#788279] font-mono leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>

              <div className="text-left md:text-right shrink-0 border-t md:border-t-0 border-[#18241e] pt-2 md:pt-0">
                <div className="text-xs font-mono font-bold text-[#c8f344]">{item.time}</div>
                <div className="text-[10px] font-mono text-[#788279]">{item.date}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
