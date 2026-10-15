import React, { useState } from 'react';

export default function EvidenceGravityMap({ gravityMap = { nodes: [], connections: [] } }) {
  const [selectedNodeId, setSelectedNodeId] = useState(gravityMap.nodes[0]?.id);
  const [showRings, setShowRings] = useState(true);

  const selectedNode = gravityMap.nodes.find(n => n.id === selectedNodeId) || gravityMap.nodes[0];
  const relatedConnections = gravityMap.connections.filter(
    c => c.from === selectedNodeId || c.to === selectedNodeId
  );

  return (
    <div className="space-y-10 font-sans">
      {/* Editorial Header (Scaled Up) */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 pb-8 border-b border-zinc-100">
        <div>
          <span className="text-sm font-medium text-zinc-400 tracking-wide block">
            Network topology
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-zinc-900 mt-1.5">
            Evidence Gravity Map
          </h2>
          <p className="text-base sm:text-lg text-zinc-500 mt-2 max-w-2xl">
            Probabilistic attraction network linking forensic anomalies and verified facts.
          </p>
        </div>

        {/* Orbit Rings Toggle (Scaled Up) */}
        <div className="flex items-center gap-4 text-sm">
          <span className="text-zinc-400 hidden sm:inline">
            {gravityMap.nodes.length} nodes · {gravityMap.connections.length} connections
          </span>
          <button
            onClick={() => setShowRings(!showRings)}
            className="px-4 py-2 rounded-xl bg-zinc-100/80 hover:bg-zinc-200/70 text-zinc-700 font-medium transition-colors cursor-pointer border border-zinc-200/50"
          >
            {showRings ? 'Guides: Visible' : 'Guides: Hidden'}
          </button>
        </div>
      </div>

      {/* Main Content Layout: Scaled Up & Expansive */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
        {/* LEFT COLUMN: Clean Minimal Graph Canvas (Expansive) */}
        <div className="lg:col-span-7 min-h-[500px] sm:min-h-[560px] lg:min-h-[620px] rounded-3xl bg-zinc-50/60 border border-zinc-100 relative flex items-center justify-center overflow-hidden p-8">
          {/* Concentric Guide Rings */}
          {showRings && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-64 h-64 sm:w-72 sm:h-72 rounded-full border border-zinc-200/80" />
              <div className="w-96 h-96 sm:w-[480px] sm:h-[480px] rounded-full border border-dashed border-zinc-200/60" />
              <div className="w-[560px] h-[560px] sm:w-[640px] sm:h-[640px] rounded-full border border-zinc-200/40" />
            </div>
          )}

          {/* Force Lines (SVG Canvas) */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
            {gravityMap.connections.map((conn, idx) => {
              const isDirectContradiction = conn.relation.includes('contradicts') || conn.relation.includes('disproves');
              const isSelected = conn.from === selectedNodeId || conn.to === selectedNodeId;
              return (
                <line
                  key={idx}
                  x1="50%"
                  y1="50%"
                  x2={idx % 2 === 0 ? "24%" : "76%"}
                  y2={idx < 2 ? "26%" : "74%"}
                  stroke={isDirectContradiction ? "#f43f5e" : isSelected ? "#18181b" : "#d4d4d8"}
                  strokeWidth={isSelected ? 2.5 : 1.5}
                  strokeDasharray={isDirectContradiction ? "5 5" : "none"}
                  className="transition-all duration-300"
                  opacity={isSelected ? 1 : 0.6}
                />
              );
            })}
          </svg>

          {/* Floating Pill Nodes (Scaled Up) */}
          <div className="flex flex-wrap items-center justify-center gap-4 relative z-20 p-6 max-w-lg">
            {gravityMap.nodes.map((node) => {
              const isSelected = node.id === selectedNodeId;
              const isClaim = node.type === 'claim';
              const isFact = node.type === 'fact';

              return (
                <button
                  key={node.id}
                  onClick={() => setSelectedNodeId(node.id)}
                  className={`px-4 sm:px-5 py-2.5 sm:py-3 rounded-full transition-all duration-200 text-left cursor-pointer flex items-center gap-3 select-none ${
                    isSelected
                      ? 'bg-zinc-900 text-white shadow-lg scale-105'
                      : 'bg-white text-zinc-800 border border-zinc-200/80 hover:border-zinc-400 shadow-2xs'
                  }`}
                >
                  <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                    isSelected 
                      ? 'bg-white' 
                      : isFact 
                      ? 'bg-emerald-500' 
                      : isClaim 
                      ? 'bg-indigo-500' 
                      : 'bg-rose-500'
                  }`} />
                  <span className="text-sm sm:text-base font-medium tracking-tight">
                    {node.label}
                  </span>
                  <span className={`text-xs sm:text-sm font-normal pl-1 ${isSelected ? 'text-zinc-300' : 'text-zinc-400'}`}>
                    {node.gravity}%
                  </span>
                </button>
              );
            })}
          </div>

          <span className="absolute bottom-4 left-6 text-xs sm:text-sm text-zinc-400">
            Select a node to inspect relational attraction
          </span>
        </div>

        {/* RIGHT COLUMN: Node Inspector (Scaled Up) */}
        <div className="lg:col-span-5 space-y-8">
          {/* Active Node Header */}
          <div className="space-y-3 pb-8 border-b border-zinc-100">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-zinc-400">
                Selected evidence
              </span>
              <span className="text-xs sm:text-sm font-medium px-3.5 py-1 rounded-full bg-zinc-100 text-zinc-700 capitalize">
                {selectedNode?.type} · {selectedNode?.gravity}% weight
              </span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-semibold text-zinc-900 tracking-tight">
              {selectedNode?.label}
            </h3>
            <p className="text-base sm:text-lg text-zinc-500">
              Assigned epistemic gravity based on cross-modal verification.
            </p>
          </div>

          {/* Related Links: Scaled List */}
          <div className="space-y-4 pb-8 border-b border-zinc-100">
            <span className="text-sm sm:text-base font-medium text-zinc-400 block">
              Connected evidence links ({relatedConnections.length})
            </span>

            <div className="divide-y divide-zinc-100">
              {relatedConnections.map((conn, idx) => (
                <div key={idx} className="py-3.5 flex items-center justify-between text-sm sm:text-base">
                  <div className="flex items-center gap-2.5">
                    <span className="text-zinc-400">↳</span>
                    <span className="font-medium text-zinc-800 capitalize">
                      {conn.relation.replace('_', ' ')}
                    </span>
                  </div>
                  <span className="text-zinc-500 tabular-nums">
                    {(conn.strength * 100).toFixed(0)}% correlation
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Topology Finding Note */}
          <div className="pt-2 text-sm sm:text-base text-zinc-600 leading-relaxed">
            <span className="font-semibold text-zinc-900 block mb-1.5">Convergence summary</span>
            Evidence clustering indicates strong structural alignment toward generative edge tampering over social media transmission artifacts.
          </div>
        </div>
      </div>
    </div>
  );
}
