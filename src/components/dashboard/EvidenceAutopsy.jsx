import React, { useState } from 'react';
import { Search, ZoomIn, ZoomOut, Maximize2, Crosshair, AlertTriangle } from 'lucide-react';

export default function EvidenceAutopsy({ image, annotations }) {
  const [zoomLevel, setZoomLevel] = useState(1);
  const [selectedAnnotationId, setSelectedAnnotationId] = useState(annotations[0]?.id);

  const selectedAnnotation = annotations.find(a => a.id === selectedAnnotationId) || annotations[0];

  const handleZoomIn = () => setZoomLevel(prev => Math.min(3, prev + 0.5));
  const handleZoomOut = () => setZoomLevel(prev => Math.max(1, prev - 0.5));
  const handleResetZoom = () => setZoomLevel(1);

  return (
    <div className="p-6 md:p-8 rounded-3xl bg-[#0c130f] border border-[#1f2d26] shadow-xl">
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#1f2d26] mb-6">
        <div className="flex items-center gap-2 text-xs font-mono text-[#c8f344] uppercase tracking-wider">
          <Search className="w-4 h-4" />
          <span>EVIDENCE AUTOPSY // SUB-PIXEL SPECTRAL INSPECTION</span>
        </div>

        {/* Zoom Controls */}
        <div className="flex items-center gap-2 bg-[#080d0a] p-1 rounded-xl border border-[#1f2d26] text-xs font-mono">
          <button 
            onClick={handleZoomOut} 
            className="p-1.5 rounded-lg text-[#788279] hover:text-[#f5f4ef] hover:bg-[#18241e] cursor-pointer"
            title="Zoom Out"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <span className="px-2 text-[#c8f344] font-bold">{Math.round(zoomLevel * 100)}%</span>
          <button 
            onClick={handleZoomIn} 
            className="p-1.5 rounded-lg text-[#788279] hover:text-[#f5f4ef] hover:bg-[#18241e] cursor-pointer"
            title="Zoom In"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button 
            onClick={handleResetZoom} 
            className="p-1.5 rounded-lg text-[#788279] hover:text-[#f5f4ef] hover:bg-[#18241e] cursor-pointer"
            title="Reset Zoom"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        {/* Specimen Viewport (Left) */}
        <div className="lg:col-span-7 relative rounded-2xl overflow-hidden bg-[#070a08] border border-[#23352a] min-h-[440px] flex items-center justify-center">
          <div 
            className="w-full h-full relative transition-transform duration-300"
            style={{ transform: `scale(${zoomLevel})` }}
          >
            <img 
              src={image} 
              alt="Autopsy Specimen" 
              className="w-full h-full object-cover grayscale contrast-125"
            />

            {/* Clickable Bounding Regions */}
            {annotations.map((ann) => {
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
                  className={`absolute border-2 rounded transition-all cursor-pointer group ${
                    isSelected 
                      ? 'border-[#c8f344] bg-[#c8f344]/25 shadow-[0_0_24px_rgba(200,243,68,0.5)] z-20' 
                      : 'border-white/50 bg-black/20 hover:border-[#c8f344] z-10'
                  }`}
                >
                  <div className="absolute -top-6 left-0 bg-[#080d0a]/90 backdrop-blur-sm border border-[#c8f344] text-[#c8f344] text-[10px] font-mono px-2 py-0.5 rounded whitespace-nowrap flex items-center gap-1.5 shadow-md">
                    <Crosshair className="w-2.5 h-2.5" />
                    <span>{ann.label}</span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="absolute bottom-3 left-3 bg-[#080d0a]/80 backdrop-blur-sm px-3 py-1 rounded-lg border border-[#1f2d26] text-[10px] font-mono text-[#a4b3a6]">
            CLICK REGIONS ON SPECIMEN TO REVEAL FORENSIC FINDING
          </div>
        </div>

        {/* Selected Finding Detail (Right) */}
        <div className="lg:col-span-5 p-6 rounded-2xl bg-[#080d0a] border border-[#1f2d26] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[#1f2d26] mb-4">
              <span className="text-xs font-mono text-[#788279]">
                FINDING DOSSIER #{selectedAnnotation?.id}
              </span>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase ${
                selectedAnnotation?.severity === 'critical' 
                  ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30' 
                  : selectedAnnotation?.severity === 'warning'
                  ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                  : 'bg-[#c8f344]/10 text-[#c8f344] border border-[#c8f344]/30'
              }`}>
                {selectedAnnotation?.severity}
              </span>
            </div>

            <h4 className="text-xl font-display font-bold text-[#f5f4ef] mb-2">
              {selectedAnnotation?.title}
            </h4>

            <div className="text-xs font-mono text-[#c8f344] mb-4">
              TARGET COORDINATES: [X: {selectedAnnotation?.x}%, Y: {selectedAnnotation?.y}%]
            </div>

            <p className="text-xs sm:text-sm text-[#a4b3a6] font-mono leading-relaxed mb-6">
              {selectedAnnotation?.detail}
            </p>
          </div>

          {/* Annotation Navigator */}
          <div className="space-y-2 pt-4 border-t border-[#1f2d26]">
            <span className="text-[10px] font-mono text-[#788279] block mb-1">
              ALL ROI ANNOTATIONS ({annotations.length}):
            </span>
            {annotations.map((ann) => (
              <button
                key={ann.id}
                onClick={() => setSelectedAnnotationId(ann.id)}
                className={`w-full text-left p-2.5 rounded-lg text-xs font-mono flex items-center justify-between border transition-all cursor-pointer ${
                  selectedAnnotationId === ann.id
                    ? 'bg-[#18241e] border-[#c8f344] text-[#f5f4ef]'
                    : 'bg-[#0c120f] border-[#18241e] text-[#788279] hover:text-[#f5f4ef]'
                }`}
              >
                <span className="truncate">{ann.label}</span>
                <span className="text-[10px] uppercase text-[#a4b3a6]">{ann.severity}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
