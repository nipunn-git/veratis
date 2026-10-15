import React, { useState } from 'react';
import { 
  ChevronDown, 
  ChevronUp 
} from 'lucide-react';

export default function RealityTimeline({ timeline = [] }) {
  const [filter, setFilter] = useState('all'); // 'all' | 'verified' | 'suspicious' | 'critical'
  const [expandedIndex, setExpandedIndex] = useState(null);

  const filteredTimeline = timeline.filter(item => {
    if (filter === 'all') return true;
    return item.status === filter;
  });

  const toggleExpand = (idx) => {
    setExpandedIndex(prev => (prev === idx ? null : idx));
  };

  const filterTabs = [
    { id: 'all', label: 'All events' },
    { id: 'verified', label: 'Verified' },
    { id: 'suspicious', label: 'Suspicious' },
    { id: 'critical', label: 'Critical' },
  ];

  return (
    <div className="space-y-10 font-sans">
      {/* Editorial Header (Scaled Up) */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 pb-8 border-b border-zinc-100">
        <div>
          <span className="text-sm font-medium text-zinc-400 tracking-wide block">
            Temporal provenance
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-zinc-900 mt-1.5">
            Reality Timeline
          </h2>
          <p className="text-base sm:text-lg text-zinc-500 mt-2 max-w-2xl">
            Verified chronological sequence of publication, distribution, and media alteration.
          </p>
        </div>

        {/* Minimal Filter Tabs (Scaled Up) */}
        <div className="flex items-center gap-1.5 p-1.5 rounded-2xl bg-zinc-100/80 border border-zinc-200/50 text-sm">
          {filterTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id)}
              className={`px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl font-medium transition-all cursor-pointer ${
                filter === tab.id
                  ? 'bg-white text-zinc-900 shadow-xs'
                  : 'text-zinc-600 hover:text-zinc-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Continuous Timeline Rail (Scaled Up & Expansive) */}
      <div className="relative pl-8 sm:pl-10 before:absolute before:left-3.5 sm:before:left-4 before:top-2 before:bottom-2 before:w-[1.5px] before:bg-zinc-200 space-y-4">
        {filteredTimeline.map((item, idx) => {
          const isVerified = item.status === 'verified';
          const isCritical = item.status === 'critical';
          const isExpanded = expandedIndex === idx;

          return (
            <div
              key={idx}
              className="relative p-6 sm:p-7 rounded-2xl hover:bg-zinc-50/70 transition-colors duration-150 group"
            >
              {/* Timeline Pin Node on Rail */}
              <div 
                className={`absolute -left-[23px] sm:-left-[27px] top-8 w-4 h-4 rounded-full border-2 bg-white transition-transform group-hover:scale-125 ${
                  isVerified 
                    ? 'border-emerald-500' 
                    : isCritical 
                    ? 'border-rose-500' 
                    : 'border-amber-500'
                }`}
              />

              {/* Event Metadata Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2">
                <div className="flex flex-wrap items-center gap-2.5 text-sm">
                  <span className="font-semibold text-zinc-900">
                    {item.time} · {item.date}
                  </span>
                  <span className="text-zinc-300">·</span>
                  <span className="text-zinc-500 font-medium">
                    {item.platform}
                  </span>
                  <span className={`text-sm font-semibold ${
                    isVerified 
                      ? 'text-emerald-600' 
                      : isCritical 
                      ? 'text-rose-600' 
                      : 'text-amber-600'
                  }`}>
                    · {isVerified ? 'Verified' : isCritical ? 'Critical anomaly' : 'Suspicious'}
                  </span>
                </div>

                <button
                  onClick={() => toggleExpand(idx)}
                  className="inline-flex items-center gap-1.5 text-sm text-zinc-400 hover:text-zinc-700 cursor-pointer self-start sm:self-auto transition-colors font-medium"
                >
                  <span>{isExpanded ? 'Hide details' : 'View details'}</span>
                  {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
              </div>

              {/* Event Body */}
              <div className="mt-1.5">
                <h4 className="text-xl sm:text-2xl font-semibold text-zinc-900 tracking-tight">
                  {item.event}
                </h4>
                <p className="text-base sm:text-lg text-zinc-600 mt-2 leading-relaxed font-normal">
                  {item.description}
                </p>
              </div>

              {/* Expanded Technical Details */}
              {isExpanded && (
                <div className="mt-4 pt-4 border-t border-zinc-100 grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm text-zinc-500">
                  <div>
                    <span className="text-zinc-400 block text-xs">Hash signature</span>
                    <span className="text-zinc-800 font-medium truncate block mt-0.5">sha256:4f991ac89...34a</span>
                  </div>
                  <div>
                    <span className="text-zinc-400 block text-xs">Propagation latency</span>
                    <span className="text-zinc-800 font-medium block mt-0.5">+0.038 seconds</span>
                  </div>
                  <div>
                    <span className="text-zinc-400 block text-xs">Validation node</span>
                    <span className="text-zinc-800 font-medium block mt-0.5">Consensus node verified</span>
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
