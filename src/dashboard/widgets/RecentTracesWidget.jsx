import React, { useState, useEffect } from 'react';

export default function RecentTracesWidget() {
  const [progress, setProgress] = useState(65);
  const activeTrace = {
    id: 'tr_844d69',
    name: 'planner',
    duration: '3.46s',
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => (prev >= 100 ? 15 : prev + 3));
    }, 180);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="h-full flex flex-col justify-between">
      {/* Top Header */}
      <div>
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-mono tracking-wider text-zinc-500 uppercase font-semibold">
            RECENT TRACES
          </span>
          <div className="flex items-center gap-1.5 font-mono text-xs text-emerald-700 font-medium bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded shadow-xs">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600"></span>
            </span>
            <span>live</span>
          </div>
        </div>

        <div className="flex items-baseline gap-2 mt-1">
          <span className="text-3xl sm:text-4xl font-mono font-bold text-zinc-900 tracking-tight">
            2.55s
          </span>
          <span className="text-xs font-mono text-zinc-500">p50</span>
        </div>
      </div>

      {/* Active Trace Line */}
      <div className="mt-5 space-y-2">
        <div className="flex items-center justify-between text-xs font-mono">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span className="text-zinc-900 font-bold">{activeTrace.id}</span>
            <span className="text-zinc-500 font-medium">{activeTrace.name}</span>
          </div>
          <span className="text-zinc-600 font-semibold text-[11px]">{activeTrace.duration}</span>
        </div>

        {/* Animated Progress Bar */}
        <div className="w-full h-1.5 rounded-full bg-zinc-100 border border-zinc-200/80 overflow-hidden">
          <div
            style={{ width: `${progress}%` }}
            className="h-full bg-gradient-to-r from-zinc-500 via-zinc-700 to-zinc-950 rounded-full transition-all duration-150"
          />
        </div>

        <div className="flex justify-between items-center text-[10px] font-mono text-zinc-500 pt-1 font-medium">
          <span>p95: 4.12s</span>
          <span>p99: 5.80s</span>
        </div>
      </div>
    </div>
  );
}
