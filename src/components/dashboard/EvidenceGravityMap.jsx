import React, { useState } from 'react';
import { Share2, CircleDot, Info, AlertTriangle, CheckCircle2 } from 'lucide-react';

export default function EvidenceGravityMap({ gravityMap }) {
  const [selectedNodeId, setSelectedNodeId] = useState(gravityMap.nodes[0]?.id);

  const selectedNode = gravityMap.nodes.find(n => n.id === selectedNodeId) || gravityMap.nodes[0];
  const relatedConnections = gravityMap.connections.filter(
    c => c.from === selectedNodeId || c.to === selectedNodeId
  );

  return (
    <div className="p-6 md:p-8 rounded-3xl bg-[#0c130f] border border-[#1f2d26] shadow-xl">
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#1f2d26] mb-6">
        <div className="flex items-center gap-2 text-xs font-mono text-[#c8f344] uppercase tracking-wider">
          <Share2 className="w-4 h-4" />
          <span>EVIDENCE GRAVITY MAP // BAYESIAN ATTRACTION NETWORK</span>
        </div>
        <span className="text-xs font-mono text-[#788279]">
          TOTAL NODES: {gravityMap.nodes.length} // CONNECTIONS: {gravityMap.connections.length}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        {/* Interactive Node Graph (Left) */}
        <div className="lg:col-span-8 p-6 rounded-2xl bg-[#080d0a] border border-[#1f2d26] relative min-h-[420px] flex items-center justify-center overflow-hidden">
          {/* Force Lines (SVG) */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            {gravityMap.connections.map((conn, idx) => {
              const isDirectContradiction = conn.relation.includes('contradicts') || conn.relation.includes('disproves');
              return (
                <line
                  key={idx}
                  x1="50%"
                  y1="50%"
                  x2={idx % 2 === 0 ? "25%" : "75%"}
                  y2={idx < 2 ? "25%" : "75%"}
                  stroke={isDirectContradiction ? "#f43f5e" : "#c8f344"}
                  strokeWidth={conn.strength * 2.5}
                  strokeDasharray={isDirectContradiction ? "4 4" : "none"}
                  opacity="0.6"
                />
              );
            })}
          </svg>

          {/* Render Interactive Nodes */}
          <div className="flex flex-wrap items-center justify-center gap-6 relative z-10 p-4">
            {gravityMap.nodes.map((node) => {
              const isSelected = node.id === selectedNodeId;
              const isClaim = node.type === 'claim';
              const isFact = node.type === 'fact';
              const isAnomaly = node.type === 'anomaly';

              return (
                <button
                  key={node.id}
                  onClick={() => setSelectedNodeId(node.id)}
                  className={`p-4 rounded-2xl border transition-all text-left cursor-pointer ${
                    isSelected
                      ? 'bg-[#18241e] border-[#c8f344] scale-105 shadow-[0_0_24px_rgba(200,243,68,0.3)]'
                      : 'bg-[#0f1612] border-[#223528] hover:border-[#334d3c]'
                  }`}
                >
                  <div className="flex items-center justify-between gap-3 text-[10px] font-mono mb-1">
                    <span className={`uppercase font-bold ${
                      isClaim ? 'text-rose-400' : isFact ? 'text-emerald-400' : 'text-[#c8f344]'
                    }`}>
                      {node.type}
                    </span>
                    <span className="text-[#788279]">MASS: {node.gravity}kg</span>
                  </div>
                  <div className="text-xs font-display font-bold text-[#f5f4ef]">
                    {node.label}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Node Details (Right) */}
        <div className="lg:col-span-4 p-6 rounded-2xl bg-[#080d0a] border border-[#1f2d26] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[#1f2d26] mb-4">
              <span className="text-xs font-mono text-[#788279]">SELECTED NODE</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#18241e] text-[#c8f344] uppercase">
                {selectedNode?.type}
              </span>
            </div>

            <h4 className="text-xl font-display font-bold text-[#f5f4ef] mb-2">
              {selectedNode?.label}
            </h4>

            <div className="text-xs font-mono text-[#c8f344] mb-4">
              GRAVITATIONAL MASS: {selectedNode?.gravity} KG
            </div>

            <div className="space-y-3 pt-3 border-t border-[#1f2d26]">
              <span className="text-[11px] font-mono text-[#788279] block">
                ACTIVE VECTORS ({relatedConnections.length}):
              </span>
              {relatedConnections.map((conn, i) => (
                <div key={i} className="p-2.5 rounded-lg bg-[#0d1410] border border-[#1b2720] text-xs font-mono">
                  <div className="text-[#a4b3a6] text-[10px] uppercase mb-0.5">
                    RELATION: <span className="text-[#c8f344] font-bold">{conn.relation.replace(/_/g, ' ')}</span>
                  </div>
                  <div className="text-[#788279] text-[10px]">
                    STRENGTH: {(conn.strength * 100).toFixed(0)}%
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-3 rounded-lg bg-[#121c16] border border-[#23352a] text-[11px] font-mono text-[#a4b3a6] mt-6">
            Higher mass nodes exert greater Bayesian pull on the ultimate verdict.
          </div>
        </div>
      </div>
    </div>
  );
}
