import React from 'react';

export default function ErrorsWidget() {
  const sparkline = [3, 2, 4, 1, 0, 2, 5, 8, 12, 6, 4, 3, 5, 9, 14, 7, 5, 2, 1, 3, 4, 6, 2, 1];

  return (
    <div className="h-full flex flex-col justify-between">
      {/* Top Header */}
      <div>
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-mono tracking-wider text-zinc-500 uppercase font-semibold">
            ERRORS
          </span>
          <span className="text-[11px] font-mono text-zinc-500 font-medium">24h</span>
        </div>

        <div className="flex items-baseline gap-3 mt-1">
          <span className="text-3xl sm:text-4xl font-mono font-bold text-zinc-900 tracking-tight">
            29
          </span>
          <span className="text-xs font-mono text-zinc-500">2.3% rate</span>
        </div>
      </div>

      {/* Sparkline & Threshold */}
      <div className="mt-6">
        <div className="flex items-end gap-1 h-9 px-1">
          {sparkline.map((val, idx) => (
            <div
              key={idx}
              style={{ height: `${Math.max(10, (val / 14) * 100)}%` }}
              className={`flex-1 rounded-[1.5px] transition-all ${
                val > 10 ? 'bg-zinc-900 shadow-xs' : 'bg-zinc-200 hover:bg-zinc-400'
              }`}
              title={`Hour ${idx}: ${val} anomaly flags`}
            />
          ))}
        </div>

        <div className="flex justify-between items-center text-[10px] font-mono text-zinc-500 mt-2 px-1 font-medium">
          <span className="flex items-center gap-1 text-zinc-700">
            <span className="w-1.5 h-1.5 rounded-full bg-zinc-900" />
            Within tolerance
          </span>
          <span>Max: 14/hr</span>
        </div>
      </div>
    </div>
  );
}
