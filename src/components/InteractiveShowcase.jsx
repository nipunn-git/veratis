import React, { useState } from 'react';
import { Crosshair, ArrowUpRight, Scan, Play } from 'lucide-react';
import { INVESTIGATION_CASES } from '../data/mockInvestigations';

export default function InteractiveShowcase({ onStartInvestigation }) {
  const [selectedCaseIdx, setSelectedCaseIdx] = useState(0);
  const currentCase = INVESTIGATION_CASES[selectedCaseIdx];
  const [selectedAnnotationId, setSelectedAnnotationId] = useState(currentCase.annotations[0]?.id);
  const [activeFilter, setActiveFilter] = useState('normal');

  const activeAnnotation = currentCase.annotations.find(a => a.id === selectedAnnotationId) || currentCase.annotations[0];

  const handleSelectCase = (idx) => {
    setSelectedCaseIdx(idx);
    setSelectedAnnotationId(INVESTIGATION_CASES[idx].annotations[0]?.id);
  };

  return (
    <section id="specimen" className="relative py-28 md:py-36 bg-[#141e17] text-[#f5f4ef] overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-10 border-b border-[#2c3d31] mb-16">
          <div>
            <div className="text-xs font-mono text-[#d5ed9a] tracking-widest uppercase mb-3">
              / SPECIMEN LAB [004]
            </div>
            <h2 className="text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-[#f5f4ef] leading-tight">
              Interactive forensic <br />
              <span className="font-serif italic font-normal text-[#d5ed9a]">workbench.</span>
            </h2>
          </div>

          <div className="max-w-md text-sm text-[#9db2a1] leading-relaxed font-light">
            Examine verified forensic benchmark specimens. Toggle multi-spectral filters and inspect region-of-interest anomalies directly.
          </div>
        </div>

        {/* Case Switcher Tabs */}
        <div className="flex flex-wrap items-center gap-3 mb-10">
          {INVESTIGATION_CASES.map((c, idx) => (
            <button
              key={c.id}
              onClick={() => handleSelectCase(idx)}
              className={`px-5 py-2.5 rounded-full text-xs font-medium tracking-wide transition-all cursor-pointer ${
                selectedCaseIdx === idx
                  ? 'bg-[#f5f4ef] text-[#111b14] font-semibold shadow-sm'
                  : 'bg-[#243427] text-[#9db2a1] hover:text-[#f5f4ef] border border-white/5'
              }`}
            >
              <span>{c.title}</span>
            </button>
          ))}
        </div>

        {/* Workbench Card Stage */}
        <div className="rounded-[36px] bg-[#1a261d] border border-[#2d4032] p-6 md:p-12 shadow-2xl">
          
          {/* Top HUD Controls */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-[#2d4032] mb-8 text-xs font-mono">
            <div className="flex items-center gap-3 text-[#9db2a1]">
              <span className="text-[#f5f4ef] font-bold">{currentCase.code}</span>
              <span>•</span>
              <span className="text-[#d5ed9a]">{currentCase.category}</span>
            </div>

            {/* Filter Toggle Pills */}
            <div className="flex items-center gap-1.5 bg-[#141e17] p-1 rounded-full border border-[#2d4032]">
              <button
                onClick={() => setActiveFilter('normal')}
                className={`px-3 py-1 rounded-full text-[11px] transition-colors cursor-pointer ${
                  activeFilter === 'normal' ? 'bg-[#f5f4ef] text-[#111b14] font-semibold' : 'text-[#9db2a1] hover:text-white'
                }`}
              >
                Optical
              </button>
              <button
                onClick={() => setActiveFilter('fourier')}
                className={`px-3 py-1 rounded-full text-[11px] transition-colors cursor-pointer ${
                  activeFilter === 'fourier' ? 'bg-[#f5f4ef] text-[#111b14] font-semibold' : 'text-[#9db2a1] hover:text-white'
                }`}
              >
                Fourier 2D
              </button>
              <button
                onClick={() => setActiveFilter('cfa')}
                className={`px-3 py-1 rounded-full text-[11px] transition-colors cursor-pointer ${
                  activeFilter === 'cfa' ? 'bg-[#f5f4ef] text-[#111b14] font-semibold' : 'text-[#9db2a1] hover:text-white'
                }`}
              >
                Bayer CFA
              </button>
              <button
                onClick={() => setActiveFilter('heatmap')}
                className={`px-3 py-1 rounded-full text-[11px] transition-colors cursor-pointer ${
                  activeFilter === 'heatmap' ? 'bg-[#f5f4ef] text-[#111b14] font-semibold' : 'text-[#9db2a1] hover:text-white'
                }`}
              >
                Latent Heatmap
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
            
            {/* Specimen Viewport (7 Cols) */}
            <div className="lg:col-span-7 relative rounded-[28px] overflow-hidden bg-[#0c120e] min-h-[420px] shadow-inner">
              <img 
                src={currentCase.image} 
                alt={currentCase.title}
                className={`w-full h-full object-cover transition-all duration-500 ${
                  activeFilter === 'normal' ? 'grayscale contrast-115' :
                  activeFilter === 'fourier' ? 'invert contrast-200 hue-rotate-90' :
                  activeFilter === 'cfa' ? 'sepia contrast-150 saturate-150' :
                  'brightness-110 contrast-150 hue-rotate-180'
                }`}
              />

              {/* Clickable Annotations */}
              {currentCase.annotations.map((ann) => {
                const isSelected = ann.id === selectedAnnotationId;
                return (
                  <div
                    key={ann.id}
                    onClick={() => setSelectedAnnotationId(ann.id)}
                    style={{
                      left: `${ann.x}%`,
                      top: `${ann.y}%`,
                      width: `${ann.width}%`,
                      height: `${ann.height}%`
                    }}
                    className={`absolute border-2 rounded-xl transition-all cursor-pointer ${
                      isSelected 
                        ? 'border-[#d5ed9a] bg-[#d5ed9a]/25 shadow-lg scale-105' 
                        : 'border-white/40 hover:border-[#d5ed9a] bg-black/20'
                    }`}
                  >
                    <div className="absolute -top-6 left-0 bg-[#141e17] text-[#d5ed9a] text-[10px] font-mono px-2 py-0.5 rounded-full whitespace-nowrap shadow-sm">
                      {ann.label}
                    </div>
                  </div>
                );
              })}

              <div className="absolute bottom-4 left-4 bg-[#141e17]/90 backdrop-blur-sm px-3.5 py-1.5 rounded-full text-xs font-mono text-[#9db2a1]">
                FILTER: {activeFilter.toUpperCase()} // CLICK HIGHLIGHTS TO EXAMINE
              </div>
            </div>

            {/* Findings Inspector Card (5 Cols) */}
            <div className="lg:col-span-5 p-8 rounded-[28px] bg-[#243427] text-[#f5f4ef] border border-[#344938] flex flex-col justify-between shadow-lg">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-[#344938] mb-6 text-xs font-mono text-[#9db2a1]">
                  <span>REGION FINDING</span>
                  <span className="text-[#d5ed9a] uppercase font-bold">{activeAnnotation?.severity}</span>
                </div>

                <h3 className="text-2xl font-bold text-[#f5f4ef] mb-2">
                  {activeAnnotation?.title}
                </h3>

                <div className="text-xs font-mono text-[#d5ed9a] mb-4">
                  LOCATION: [{activeAnnotation?.x}%, {activeAnnotation?.y}%]
                </div>

                <p className="text-sm text-[#9db2a1] leading-relaxed font-light mb-8">
                  {activeAnnotation?.detail}
                </p>

                {/* Annotation Selector Pills */}
                <div className="space-y-2 mb-6">
                  {currentCase.annotations.map((ann) => (
                    <button
                      key={ann.id}
                      onClick={() => setSelectedAnnotationId(ann.id)}
                      className={`w-full text-left p-3 rounded-xl text-xs font-mono flex items-center justify-between border transition-all cursor-pointer ${
                        selectedAnnotationId === ann.id
                          ? 'bg-[#18241b] border-[#d5ed9a] text-[#f5f4ef]'
                          : 'bg-[#1e2c21] border-[#2d4032] text-[#9db2a1] hover:text-[#f5f4ef]'
                      }`}
                    >
                      <span>{ann.label}</span>
                      <span className="text-[10px] uppercase text-[#d5ed9a]">{ann.severity}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Action Button to Workspace */}
              <div className="pt-6 border-t border-[#344938]">
                <button
                  onClick={onStartInvestigation}
                  className="w-full flex items-center justify-between px-6 py-3.5 rounded-full bg-[#f5f4ef] hover:bg-white text-[#111b14] font-semibold text-xs tracking-wide transition-all transform hover:scale-[1.02] shadow-sm cursor-pointer"
                >
                  <span>Open full dossier in workspace</span>
                  <div className="w-6 h-6 rounded-full bg-[#111b14] flex items-center justify-center text-[#f5f4ef]">
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </div>
                </button>
              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
