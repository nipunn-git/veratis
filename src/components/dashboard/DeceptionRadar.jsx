import React, { useState } from 'react';
import { Radar, AlertCircle, Info, ShieldCheck } from 'lucide-react';

export default function DeceptionRadar({ scores, analysis }) {
  const [selectedAxis, setSelectedAxis] = useState('visual');

  const axes = [
    { key: 'visual', label: 'VISUAL SPECTRUM', score: scores.visual, detail: analysis.visual },
    { key: 'contextual', label: 'CONTEXTUAL ANCHORS', score: scores.contextual, detail: analysis.contextual },
    { key: 'temporal', label: 'TEMPORAL SYNCHRONICITY', score: scores.temporal, detail: analysis.temporal },
    { key: 'source', label: 'DIGITAL SOURCE PROVENANCE', score: scores.source, detail: analysis.source },
    { key: 'claim', label: 'CLAIM VERIFIABILITY', score: scores.claim, detail: analysis.claim },
  ];

  const compositeScore = Math.round(
    (scores.visual + scores.contextual + scores.temporal + scores.source + scores.claim) / 5
  );

  return (
    <div className="p-6 md:p-8 rounded-3xl bg-[#0c130f] border border-[#1f2d26] shadow-xl">
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#1f2d26] mb-6">
        <div className="flex items-center gap-2 text-xs font-mono text-[#c8f344] uppercase tracking-wider">
          <Radar className="w-4 h-4" />
          <span>DECEPTION RADAR // 5-AXIS ORTHOGONAL ANALYSIS</span>
        </div>
        <div className="text-xs font-mono">
          <span className="text-[#788279]">COMPOSITE DEVIATION: </span>
          <span className="text-[#c8f344] font-bold text-sm">{compositeScore} / 100</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Radar Graphic (Left) */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center p-4 rounded-2xl bg-[#080d0a] border border-[#1f2d26] relative">
          <svg viewBox="0 0 200 200" className="w-56 h-56 sm:w-64 sm:h-64">
            {/* Concentric Polygons */}
            {[20, 40, 60, 80].map((r, i) => (
              <polygon
                key={i}
                points="100,20 176,75 147,165 53,165 24,75"
                fill="none"
                stroke="#1b2a21"
                strokeWidth="1"
                transform={`scale(${r / 80})`}
                transform-origin="100 100"
              />
            ))}

            {/* Radar Lines */}
            <line x1="100" y1="100" x2="100" y2="20" stroke="#22362a" strokeWidth="1" />
            <line x1="100" y1="100" x2="176" y2="75" stroke="#22362a" strokeWidth="1" />
            <line x1="100" y1="100" x2="147" y2="165" stroke="#22362a" strokeWidth="1" />
            <line x1="100" y1="100" x2="53" y2="165" stroke="#22362a" strokeWidth="1" />
            <line x1="100" y1="100" x2="24" y2="75" stroke="#22362a" strokeWidth="1" />

            {/* Dynamic Polygon based on actual scores */}
            {(() => {
              // Convert 0-100 scores into 5 vertex positions
              const vY = 100 - (scores.visual / 100) * 80;
              const cX = 100 + (scores.contextual / 100) * 76;
              const cY = 100 - (scores.contextual / 100) * 25;
              const tX = 100 + (scores.temporal / 100) * 47;
              const tY = 100 + (scores.temporal / 100) * 65;
              const sX = 100 - (scores.source / 100) * 47;
              const sY = 100 + (scores.source / 100) * 65;
              const clX = 100 - (scores.claim / 100) * 76;
              const clY = 100 - (scores.claim / 100) * 25;

              return (
                <>
                  <polygon
                    points={`100,${vY} ${cX},${cY} ${tX},${tY} ${sX},${sY} ${clX},${clY}`}
                    fill="rgba(200, 243, 68, 0.2)"
                    stroke="#c8f344"
                    strokeWidth="2"
                    className="filter drop-shadow-[0_0_8px_#c8f344]"
                  />
                  <circle cx="100" cy={vY} r="3.5" fill="#c8f344" />
                  <circle cx={cX} cy={cY} r="3.5" fill="#c8f344" />
                  <circle cx={tX} cy={tY} r="3.5" fill="#c8f344" />
                  <circle cx={sX} cy={sY} r="3.5" fill="#c8f344" />
                  <circle cx={clX} cy={clY} r="3.5" fill="#c8f344" />
                </>
              );
            })()}
          </svg>

          <span className="text-[10px] font-mono text-[#788279] mt-2">
            Click bars on the right to inspect specific channel telemetry
          </span>
        </div>

        {/* Channel Bars & Selected Axis Detail (Right) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="space-y-2.5">
            {axes.map((ax) => {
              const isSelected = selectedAxis === ax.key;
              return (
                <div
                  key={ax.key}
                  onClick={() => setSelectedAxis(ax.key)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer ${
                    isSelected 
                      ? 'bg-[#18241e] border-[#c8f344]' 
                      : 'bg-[#080d0a] border-[#1b261f] hover:border-[#2b3d32]'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs font-mono mb-1.5">
                    <span className={isSelected ? 'text-[#c8f344] font-bold' : 'text-[#f5f4ef]'}>
                      {ax.label}
                    </span>
                    <span className="font-bold text-[#c8f344]">{ax.score} / 100</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-[#16221a] overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-500 via-[#c8f344] to-rose-500 rounded-full"
                      style={{ width: `${ax.score}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Active Axis Forensic Findings */}
          <div className="p-4 rounded-xl bg-[#080d0a] border border-[#23352a]">
            <div className="flex items-center gap-2 text-xs font-mono text-[#c8f344] font-bold mb-1">
              <Info className="w-3.5 h-3.5" />
              <span>{axes.find(a => a.key === selectedAxis)?.label} TELEMETRY:</span>
            </div>
            <p className="text-xs font-mono text-[#a4b3a6] leading-relaxed">
              {axes.find(a => a.key === selectedAxis)?.detail}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
