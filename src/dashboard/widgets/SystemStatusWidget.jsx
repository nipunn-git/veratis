import React, { useState } from 'react';

export default function SystemStatusWidget() {
  const [hoveredDay, setHoveredDay] = useState(null);

  const days = Array.from({ length: 30 }, (_, i) => {
    const isDegraded = i === 18;
    return {
      day: i + 1,
      status: isDegraded ? 'degraded' : 'operational',
      uptime: isDegraded ? 99.4 : 100,
    };
  });

  return (
    <div className="h-full flex flex-col justify-between">
      {/* Top Header */}
      <div>
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-mono tracking-wider text-zinc-500 uppercase font-semibold">
            SYSTEM STATUS
          </span>
          <span className="text-[11px] font-mono text-zinc-500 font-medium">30d</span>
        </div>

        <div className="flex items-baseline gap-2 mt-1">
          <span className="text-3xl sm:text-4xl font-mono font-bold text-zinc-900 tracking-tight">
            99.98%
          </span>
          <span className="text-xs font-mono text-zinc-500">uptime</span>
        </div>

        {/* Status text with pulsing emerald dot */}
        <div className="flex items-center gap-2 mt-2 text-xs font-mono text-zinc-700 font-medium">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600"></span>
          </span>
          <span>All systems operational</span>
        </div>
      </div>

      {/* 30-Day Segmented Uptime Bar */}
      <div className="mt-6 relative">
        <div className="flex items-end gap-[3px] sm:gap-1 h-9 p-1 rounded-lg bg-zinc-100 border border-zinc-200/90">
          {days.map((item) => (
            <div
              key={item.day}
              onMouseEnter={() => setHoveredDay(item)}
              onMouseLeave={() => setHoveredDay(null)}
              className={`flex-1 rounded-[2px] transition-all cursor-pointer ${
                item.status === 'degraded'
                  ? 'h-6 bg-amber-400 hover:bg-amber-500'
                  : 'h-full bg-zinc-400 hover:bg-zinc-900'
              }`}
            />
          ))}
        </div>

        {/* Hover Tooltip */}
        {hoveredDay && (
          <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-zinc-900 border border-zinc-700 px-2 py-0.5 rounded text-[10px] font-mono text-white whitespace-nowrap shadow-md z-20">
            Day {hoveredDay.day}: <span className="text-white font-bold">{hoveredDay.uptime}%</span> ({hoveredDay.status})
          </div>
        )}

        <div className="flex justify-between items-center text-[10px] font-mono text-zinc-500 mt-1.5 px-0.5 font-medium">
          <span>30 days ago</span>
          <span className="text-zinc-600">Latency: 14ms</span>
          <span>Today</span>
        </div>
      </div>
    </div>
  );
}
