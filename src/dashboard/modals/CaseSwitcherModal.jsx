import React from 'react';
import { X, Check, ShieldAlert, ArrowRight } from 'lucide-react';
import { INVESTIGATION_CASES } from '../../data/mockInvestigations';

export default function CaseSwitcherModal({
  isOpen,
  onClose,
  currentCaseId,
  onSelectCase,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-2xl bg-white border border-zinc-200 rounded-3xl p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-zinc-200 mb-6">
          <div>
            <span className="text-xs font-mono text-zinc-500 uppercase tracking-wider font-semibold">
              [TELEMETRY ARCHIVE]
            </span>
            <h3 className="text-2xl font-bold text-zinc-900 uppercase mt-1">
              Select Investigation Case
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-zinc-100 border border-zinc-200 text-zinc-600 hover:text-zinc-900 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Case List */}
        <div className="space-y-3">
          {INVESTIGATION_CASES.map((item) => {
            const isSelected = item.id === currentCaseId;

            return (
              <div
                key={item.id}
                onClick={() => {
                  onSelectCase(item);
                  onClose();
                }}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                  isSelected
                    ? 'bg-zinc-50 border-zinc-900 ring-1 ring-zinc-900 shadow-md'
                    : 'bg-white border-zinc-200 hover:border-zinc-400 hover:bg-zinc-50/80 shadow-xs'
                }`}
              >
                <div className="flex items-start sm:items-center gap-4">
                  {/* Thumbnail */}
                  <div className="w-14 h-14 rounded-xl bg-zinc-100 border border-zinc-200 shrink-0 overflow-hidden flex items-center justify-center relative">
                    <img
                      src={item.image}
                      alt={item.title}
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                      className="w-full h-full object-cover contrast-125"
                    />
                    <ShieldAlert className="w-6 h-6 text-zinc-400 absolute" />
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-zinc-100 text-zinc-800 border border-zinc-200 font-bold">
                        {item.code}
                      </span>
                      <span className="text-[11px] font-mono text-rose-700 font-bold">
                        {item.threatLevel}
                      </span>
                    </div>
                    <div className="text-sm font-bold text-zinc-900">
                      {item.title}
                    </div>
                    <div className="text-xs font-mono text-zinc-500">
                      Certainty: <span className="text-zinc-900 font-bold">{item.verdictConfidence}%</span> // {item.category}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                  {isSelected ? (
                    <span className="px-3 py-1 rounded-full bg-zinc-900 text-white font-mono text-xs font-bold flex items-center gap-1 shadow-sm">
                      <Check className="w-3.5 h-3.5" /> ACTIVE
                    </span>
                  ) : (
                    <span className="px-3 py-1 rounded-full bg-zinc-100 text-zinc-700 font-mono text-xs hover:text-zinc-900 flex items-center gap-1 border border-zinc-200 font-medium">
                      SELECT <ArrowRight className="w-3 h-3" />
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
