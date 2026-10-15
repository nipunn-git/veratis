import React from 'react';
import { Scale, Check, X } from 'lucide-react';

export default function BayesianArbitrationWidget({ currentCase }) {
  const hypotheses = currentCase?.competingHypotheses || [
    { title: 'Targeted Neural Inpainting', probability: 84 },
    { title: 'Social Media Re-compression', probability: 16 }
  ];

  const leading = hypotheses[0] || { title: 'Targeted Neural Inpainting', probability: 84 };
  const counter = hypotheses[1] || { title: 'Social Media Re-compression', probability: 16 };

  return (
    <div className="h-full flex flex-col justify-between font-sans">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between pb-3 border-b border-zinc-100 pr-16">
          <span className="text-sm font-medium text-zinc-500">
            Bayesian Arbitration
          </span>
          <span className="text-sm font-semibold text-zinc-900">
            Leading
          </span>
        </div>

        {/* Primary Probability */}
        <div className="mt-3.5">
          <div className="text-4xl font-bold text-zinc-950 tracking-tight">
            {leading.probability}%
          </div>
          <span className="text-sm text-zinc-700 font-medium block mt-1 truncate">
            {leading.title}
          </span>
        </div>

        {/* Two-Tone Progress Bar */}
        <div className="w-full h-2 rounded-full bg-zinc-100 flex overflow-hidden mt-3.5">
          <div 
            style={{ width: `${leading.probability}%` }}
            className="h-full bg-zinc-900"
          />
          <div 
            style={{ width: `${counter.probability}%` }}
            className="h-full bg-zinc-300"
          />
        </div>

        {/* Scenario Comparison Breakdown */}
        <div className="space-y-2 mt-3.5 text-sm">
          <div className="flex justify-between text-zinc-800">
            <span className="truncate pr-2 font-medium">{leading.title}</span>
            <span className="font-semibold text-zinc-950">{leading.probability}%</span>
          </div>
          <div className="flex justify-between text-zinc-500">
            <span className="truncate pr-2">{counter.title}</span>
            <span className="font-medium text-zinc-600">{counter.probability}%</span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="text-xs text-zinc-400 pt-3 border-t border-zinc-100 flex items-center justify-between">
        <span>Hypothesis divergence</span>
        <span className="text-zinc-700 font-medium">Empirical match</span>
      </div>
    </div>
  );
}
