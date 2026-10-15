import React from 'react';
import { 
  Check, 
  HelpCircle, 
  Minus
} from 'lucide-react';

export default function UncertaintyEngine({ uncertainty = { known: [], unknown: [], untestable: [] } }) {
  return (
    <div className="space-y-10 font-sans">
      {/* Editorial Header (Scaled Up) */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 pb-8 border-b border-zinc-100">
        <div>
          <span className="text-sm font-medium text-zinc-400 tracking-wide block">
            Epistemic boundaries
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-zinc-900 mt-1.5">
            Uncertainty Engine
          </h2>
          <p className="text-base sm:text-lg text-zinc-500 mt-2 max-w-2xl">
            Explicit demarcation between verified facts, open variables, and untestable factors.
          </p>
        </div>

        {/* Humility Badge (Scaled Up) */}
        <div className="flex items-center gap-2.5 text-sm text-zinc-500">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          <span className="font-medium">Epistemic humility active</span>
        </div>
      </div>

      {/* 3 Open Columns (Scaled Up & Breathable) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-14 items-start divide-y md:divide-y-0 md:divide-x divide-zinc-100">
        {/* Pillar 1: Verified Facts */}
        <div className="space-y-5 pt-4 md:pt-0">
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-lg sm:text-2xl font-semibold text-zinc-900 tracking-tight">
                Verified facts
              </span>
              <span className="text-xs sm:text-sm font-medium px-2.5 py-0.5 rounded-full bg-zinc-100 text-zinc-600">
                Empirical
              </span>
            </div>
            <p className="text-sm text-zinc-400">
              Corroborated across multiple independent sensors.
            </p>
          </div>

          <ul className="space-y-3.5 pt-2 text-sm sm:text-base text-zinc-600">
            {uncertainty.known.map((k, i) => (
              <li key={i} className="flex items-start gap-3">
                <Check className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600 mt-0.5 shrink-0" />
                <span className="leading-relaxed">{k}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Pillar 2: Unresolved Variables */}
        <div className="space-y-5 pt-8 md:pt-0 md:pl-10 lg:pl-14">
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-lg sm:text-2xl font-semibold text-zinc-900 tracking-tight">
                Unresolved variables
              </span>
              <span className="text-xs sm:text-sm font-medium px-2.5 py-0.5 rounded-full bg-zinc-100 text-zinc-600">
                Pending
              </span>
            </div>
            <p className="text-sm text-zinc-400">
              Requires upstream telemetry or registry confirmation.
            </p>
          </div>

          <ul className="space-y-3.5 pt-2 text-sm sm:text-base text-zinc-600">
            {uncertainty.unknown.map((u, i) => (
              <li key={i} className="flex items-start gap-3">
                <HelpCircle className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500 mt-0.5 shrink-0" />
                <span className="leading-relaxed">{u}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Pillar 3: Untestable Factors */}
        <div className="space-y-5 pt-8 md:pt-0 md:pl-10 lg:pl-14">
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-lg sm:text-2xl font-semibold text-zinc-900 tracking-tight">
                Untestable factors
              </span>
              <span className="text-xs sm:text-sm font-medium px-2.5 py-0.5 rounded-full bg-zinc-100 text-zinc-600">
                Assumption
              </span>
            </div>
            <p className="text-sm text-zinc-400">
              Qualitative context outside cryptographic bounds.
            </p>
          </div>

          <ul className="space-y-3.5 pt-2 text-sm sm:text-base text-zinc-600">
            {uncertainty.untestable.map((ut, i) => (
              <li key={i} className="flex items-start gap-3">
                <Minus className="w-4 h-4 sm:w-5 sm:h-5 text-zinc-400 mt-0.5 shrink-0" />
                <span className="leading-relaxed">{ut}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
