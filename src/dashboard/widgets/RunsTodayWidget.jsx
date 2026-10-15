import React, { useState, useMemo } from 'react';
import { Zap } from 'lucide-react';

export default function RunsTodayWidget() {
  const [runsCount, setRunsCount] = useState(1317);
  const [hoveredCell, setHoveredCell] = useState(null);

  const days = ['Sat', 'Sun', 'Mon', 'Tue', 'Today'];
  const hours = Array.from({ length: 24 }, (_, i) => i);

  // Realistic activity heatmap matrix
  const matrix = useMemo(() => {
    return days.map((day, dayIdx) => {
      return hours.map((hour) => {
        let count = 0;
        if (dayIdx >= 2 && hour >= 8 && hour <= 21) {
          const peak = Math.sin(((hour - 8) / 13) * Math.PI);
          count = Math.max(0, Math.round(peak * 45 + (Math.sin(hour * 1.5 + dayIdx) * 15)));
          if (dayIdx === 4 && hour >= 16 && hour <= 20) {
            count += 20; // Today peak
          }
        } else if (hour >= 11 && hour <= 19) {
          count = Math.max(0, Math.round(Math.random() * 25));
        } else {
          count = hour % 5 === 0 ? Math.round(Math.random() * 8) : 0;
        }

        return {
          day,
          hour,
          count,
        };
      });
    });
  }, []);

  // Clean high-contrast palette for heatmap cells in white theme
  const getCellStyle = (count) => {
    if (count === 0) {
      return 'bg-zinc-100 border border-zinc-200/70 hover:border-zinc-400';
    }
    if (count < 12) {
      return 'bg-zinc-200 border border-zinc-300 hover:bg-zinc-300';
    }
    if (count < 28) {
      return 'bg-zinc-400 border border-zinc-500 hover:bg-zinc-500';
    }
    if (count < 42) {
      return 'bg-zinc-700 border border-zinc-700 hover:bg-zinc-800';
    }
    // Peak - Deep Obsidian Solid
    return 'bg-zinc-950 border border-black hover:bg-black shadow-[0_0_6px_rgba(0,0,0,0.35)]';
  };

  const handleSimulate = (e) => {
    e.stopPropagation();
    setRunsCount((prev) => prev + 1);
  };

  return (
    <div className="h-full flex flex-col justify-between">
      {/* Top Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="text-[11px] font-mono tracking-wider text-zinc-500 uppercase font-semibold">
            RUNS TODAY
          </div>
          <div className="text-3xl sm:text-4xl font-mono font-bold text-zinc-900 mt-1 tracking-tight">
            {runsCount.toLocaleString()}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 font-mono text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded shadow-xs">
            <span>↑ 12%</span>
            <span className="text-[10px] text-emerald-600/80 font-normal">vs yesterday</span>
          </div>

          <button
            onClick={handleSimulate}
            title="Simulate incoming run"
            className="p-1 rounded bg-zinc-100 hover:bg-zinc-200 border border-zinc-200 text-zinc-600 hover:text-zinc-900 transition-colors cursor-pointer shadow-xs"
          >
            <Zap className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Heatmap Matrix Grid */}
      <div className="mt-5 relative">
        <div className="space-y-1.5">
          {matrix.map((row, rIdx) => (
            <div key={rIdx} className="flex items-center gap-2">
              {/* Day Label */}
              <span className="w-8 text-[11px] font-mono text-zinc-500 text-right shrink-0 select-none font-medium">
                {days[rIdx]}
              </span>

              {/* 24 Hourly Cells */}
              <div
                className="flex-1"
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(24, minmax(0, 1fr))',
                  gap: '3px',
                }}
              >
                {row.map((cell, cIdx) => (
                  <div
                    key={cIdx}
                    onMouseEnter={() => setHoveredCell(cell)}
                    onMouseLeave={() => setHoveredCell(null)}
                    className={`h-3 sm:h-3.5 rounded-[2px] sm:rounded-[3px] transition-all duration-150 cursor-pointer ${getCellStyle(
                      cell.count
                    )}`}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Hour Axis Labels */}
        <div className="flex items-center justify-between text-[10px] font-mono text-zinc-500 pt-2 pl-10 pr-1 select-none font-medium">
          <span>12AM</span>
          <span>6AM</span>
          <span>12PM</span>
          <span>6PM</span>
        </div>

        {/* Hover Tooltip */}
        {hoveredCell && (
          <div className="absolute -top-9 left-1/2 -translate-x-1/2 bg-zinc-900 border border-zinc-700 px-2.5 py-1 rounded-md text-[10px] font-mono text-white shadow-xl pointer-events-none z-30 flex items-center gap-2 whitespace-nowrap">
            <span className="text-white font-bold">
              {hoveredCell.day} {hoveredCell.hour}:00
            </span>
            <span className="text-zinc-600">|</span>
            <span className="text-zinc-300">{hoveredCell.count} scans executed</span>
          </div>
        )}
      </div>
    </div>
  );
}
