import React, { useState } from 'react';

export default function DeceptionRadar({ scores, analysis }) {
  const [selectedAxis, setSelectedAxis] = useState('visual');

  const axes = [
    { 
      key: 'visual', 
      label: 'Visual spectrum', 
      score: scores.visual, 
      detail: analysis.visual,
      note: 'High-frequency Fourier boundary variance detected',
      risk: 'Critical anomaly',
    },
    { 
      key: 'contextual', 
      label: 'Contextual anchors', 
      score: scores.contextual, 
      detail: analysis.contextual,
      note: 'Cryptographic camera signatures absent from metadata',
      risk: 'Elevated anomaly',
    },
    { 
      key: 'temporal', 
      label: 'Temporal synchronicity', 
      score: scores.temporal, 
      detail: analysis.temporal,
      note: 'Frame cadence exhibits compression jitter',
      risk: 'High anomaly',
    },
    { 
      key: 'source', 
      label: 'Source provenance', 
      score: scores.source, 
      detail: analysis.source,
      note: 'Decentralized propagation without verified upstream origin',
      risk: 'Moderate anomaly',
    },
    { 
      key: 'claim', 
      label: 'Claim verifiability', 
      score: scores.claim, 
      detail: analysis.claim,
      note: 'Cross-reference with global truth records indicates discrepancies',
      risk: 'High anomaly',
    },
  ];

  const compositeScore = Math.round(
    (scores.visual + scores.contextual + scores.temporal + scores.source + scores.claim) / 5
  );

  const activeAxisData = axes.find((a) => a.key === selectedAxis) || axes[0];

  return (
    <div className="space-y-10 font-sans max-w-[1800px] mx-auto">
      {/* Editorial Header - Matches Image 2 */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 pb-8 border-b border-zinc-200/80">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-mono font-bold tracking-widest text-zinc-500 uppercase">
              INTEGRITY RADAR // ORTHOGONAL DECOMPOSITION
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-zinc-100 text-zinc-700 border border-zinc-200 font-semibold">
              5-AXIS FORENSICS
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-zinc-950">
            Deception Radar
          </h2>
          <p className="text-base sm:text-lg text-zinc-600 mt-2 max-w-3xl leading-relaxed">
            Five-dimensional orthogonal decomposition of media authenticity, isolating anomalies across spectrum, temporal cadence, and context.
          </p>
        </div>

        {/* Scaled Minimal Score Indicator */}
        <div className="flex flex-col items-start sm:items-end gap-1 shrink-0">
          <span className="text-xs font-mono text-zinc-400 uppercase">COMPOSITE DEVIATION</span>
          <div className="text-5xl sm:text-6xl font-extrabold tracking-tight text-zinc-950 tabular-nums">
            {compositeScore}<span className="text-2xl font-normal text-zinc-400"> / 100</span>
          </div>
        </div>
      </div>

      {/* Main Content Layout: Scaled Up & Expansive */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
        {/* LEFT: Elegant Polar Radar (Scaled to fit the wide layout) */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center relative py-6">
          <div className="relative w-72 h-72 sm:w-88 sm:h-88 lg:w-[440px] lg:h-[440px] flex items-center justify-center select-none">
            <svg viewBox="0 0 220 220" className="w-full h-full overflow-visible">
              {/* Concentric Guide Rings */}
              {[22, 44, 66, 88].map((r, i) => (
                <polygon
                  key={i}
                  points="110,22 194,83 162,182 58,182 26,83"
                  fill="none"
                  stroke="#e4e4e7"
                  strokeWidth="1.25"
                  strokeDasharray={i === 3 ? "none" : "3 3"}
                  transform={`scale(${r / 88})`}
                  transform-origin="110 110"
                />
              ))}

              {/* Axis Rays */}
              <line x1="110" y1="110" x2="110" y2="22" stroke="#e4e4e7" strokeWidth="1.25" />
              <line x1="110" y1="110" x2="194" y2="83" stroke="#e4e4e7" strokeWidth="1.25" />
              <line x1="110" y1="110" x2="162" y2="182" stroke="#e4e4e7" strokeWidth="1.25" />
              <line x1="110" y1="110" x2="58" y2="182" stroke="#e4e4e7" strokeWidth="1.25" />
              <line x1="110" y1="110" x2="26" y2="83" stroke="#e4e4e7" strokeWidth="1.25" />

              {/* Dynamic Radar Shape */}
              {(() => {
                const vY = 110 - (scores.visual / 100) * 88;
                const cX = 110 + (scores.contextual / 100) * 84;
                const cY = 110 - (scores.contextual / 100) * 27;
                const tX = 110 + (scores.temporal / 100) * 52;
                const tY = 110 + (scores.temporal / 100) * 72;
                const sX = 110 - (scores.source / 100) * 52;
                const sY = 110 + (scores.source / 100) * 72;
                const clX = 110 - (scores.claim / 100) * 84;
                const clY = 110 - (scores.claim / 100) * 27;

                return (
                  <>
                    <polygon
                      points={`110,${vY} ${cX},${cY} ${tX},${tY} ${sX},${sY} ${clX},${clY}`}
                      fill="rgba(24, 24, 27, 0.05)"
                      stroke="#18181b"
                      strokeWidth="2.2"
                      className="transition-all duration-300"
                    />

                    {/* Nodes */}
                    {[
                      { key: 'visual', cx: 110, cy: vY, label: 'Visual' },
                      { key: 'contextual', cx: cX, cy: cY, label: 'Context' },
                      { key: 'temporal', cx: tX, cy: tY, label: 'Temporal' },
                      { key: 'source', cx: sX, cy: sY, label: 'Source' },
                      { key: 'claim', cx: clX, cy: clY, label: 'Claim' },
                    ].map((pt) => {
                      const isSel = selectedAxis === pt.key;
                      return (
                        <g 
                          key={pt.key}
                          onClick={() => setSelectedAxis(pt.key)}
                          className="cursor-pointer group/pin"
                        >
                          <circle
                            cx={pt.cx}
                            cy={pt.cy}
                            r={isSel ? 5.5 : 4}
                            fill={isSel ? '#18181b' : '#ffffff'}
                            stroke="#18181b"
                            strokeWidth="2.5"
                            className="transition-all duration-150"
                          />
                        </g>
                      );
                    })}
                  </>
                );
              })()}
            </svg>
          </div>

          <span className="text-sm text-zinc-400 mt-4">
            Click any node or dimension to inspect details
          </span>
        </div>

        {/* RIGHT: Minimal Dimension List & Active Finding (Scaled Proportions) */}
        <div className="lg:col-span-7 space-y-8">
          <div className="divide-y divide-zinc-100">
            {axes.map((ax) => {
              const isSelected = selectedAxis === ax.key;
              return (
                <div
                  key={ax.key}
                  onClick={() => setSelectedAxis(ax.key)}
                  className={`py-4 sm:py-5 px-4 sm:px-6 rounded-2xl transition-all cursor-pointer ${
                    isSelected ? 'bg-zinc-50/90' : 'hover:bg-zinc-50/50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${isSelected ? 'bg-zinc-900' : 'bg-zinc-300'}`} />
                      <span className={`text-base sm:text-lg ${isSelected ? 'font-semibold text-zinc-900' : 'font-medium text-zinc-700'}`}>
                        {ax.label}
                      </span>
                    </div>
                    <span className="text-base sm:text-lg font-semibold text-zinc-900 tabular-nums">
                      {ax.score}%
                    </span>
                  </div>

                  {/* Progress bar scaled up to h-2 */}
                  <div className="w-full h-2 bg-zinc-100 rounded-full mt-3 overflow-hidden">
                    <div 
                      style={{ width: `${ax.score}%` }}
                      className={`h-full rounded-full transition-all duration-300 ${
                        isSelected ? 'bg-zinc-900' : 'bg-zinc-400'
                      }`}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Active Detail Editorial Note (Scaled Up) */}
          <div className="pt-6 border-t border-zinc-100">
            <div className="text-sm font-medium text-zinc-400">
              {activeAxisData.label} findings
            </div>
            <p className="text-base sm:text-lg text-zinc-700 mt-2 leading-relaxed">
              {activeAxisData.detail}
            </p>
            <div className="text-sm text-zinc-500 mt-3">
              Assessment: <span className="font-semibold text-zinc-900">{activeAxisData.risk}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
