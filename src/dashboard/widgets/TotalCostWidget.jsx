import React, { useState } from 'react';

export default function TotalCostWidget() {
  const [hoveredBar, setHoveredBar] = useState(null);

  const bars = [
    { height: 28, cost: '$8.20' },
    { height: 35, cost: '$10.50' },
    { height: 30, cost: '$9.10' },
    { height: 42, cost: '$12.80' },
    { height: 38, cost: '$11.40' },
    { height: 45, cost: '$13.20' },
    { height: 50, cost: '$14.90' },
    { height: 40, cost: '$12.00' },
    { height: 58, cost: '$16.50' },
    { height: 52, cost: '$15.10' },
    { height: 65, cost: '$18.70' },
    { height: 60, cost: '$17.40' },
    { height: 75, cost: '$22.10' },
    { height: 95, cost: '$28.40', active: true },
  ];

  return (
    <div className="h-full flex flex-col justify-between">
      {/* Top Header */}
      <div>
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-mono tracking-wider text-zinc-500 uppercase font-semibold">
            TOTAL COST
          </span>
          <div className="flex items-center gap-1 font-mono text-xs font-semibold text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded shadow-xs">
            <span>↑ 8%</span>
            <span className="text-[10px] text-blue-600/80 font-normal">MoM</span>
          </div>
        </div>

        <div className="flex items-baseline gap-2 mt-1">
          <span className="text-3xl sm:text-4xl font-mono font-bold text-zinc-900 tracking-tight">
            $186
          </span>
          <span className="text-xs font-mono text-zinc-500">MTD</span>
        </div>
      </div>

      {/* Pill Bars Histogram */}
      <div className="mt-6 relative">
        <div className="flex items-end justify-between gap-1.5 h-14 px-1 pb-1">
          {bars.map((bar, idx) => (
            <div
              key={idx}
              onMouseEnter={() => setHoveredBar(bar)}
              onMouseLeave={() => setHoveredBar(null)}
              className="flex-1 flex flex-col justify-end items-center h-full cursor-pointer group"
            >
              <div
                style={{ height: `${bar.height}%` }}
                className={`w-full max-w-[14px] rounded-full transition-all duration-200 ${
                  bar.active
                    ? 'bg-zinc-900 shadow-[0_0_10px_rgba(0,0,0,0.25)] group-hover:bg-black'
                    : 'bg-zinc-200 group-hover:bg-zinc-400'
                }`}
              />
            </div>
          ))}
        </div>

        {/* Hover Tooltip */}
        {hoveredBar && (
          <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-zinc-900 border border-zinc-700 px-2 py-0.5 rounded text-[10px] font-mono text-white whitespace-nowrap shadow-md z-20">
            Daily Spend: <span className="text-white font-bold">{hoveredBar.cost}</span>
          </div>
        )}

        <div className="flex justify-between items-center text-[10px] font-mono text-zinc-500 mt-1.5 px-1 font-medium">
          <span>Neural Ingestion</span>
          <span className="text-zinc-700 font-semibold">Est. $214</span>
        </div>
      </div>
    </div>
  );
}
