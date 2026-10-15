import React, { useState } from 'react';
import { 
  ZoomIn, 
  ZoomOut, 
  Maximize2, 
  Crosshair, 
  Sliders, 
  CheckCircle2,
  ShieldCheck
} from 'lucide-react';

export default function EvidenceAutopsy({ image, annotations = [] }) {
  const [zoomLevel, setZoomLevel] = useState(1);
  const [spectralMode, setSpectralMode] = useState('standard'); // 'standard' | 'fourier' | 'ela' | 'thermal'
  const [selectedAnnotationId, setSelectedAnnotationId] = useState(annotations[0]?.id);
  const [sensitivity, setSensitivity] = useState(85);
  const [imgError, setImgError] = useState(false);

  const selectedAnnotation = annotations.find(a => a.id === selectedAnnotationId) || annotations[0];

  const handleZoomIn = () => setZoomLevel(prev => Math.min(3, Math.round((prev + 0.5) * 10) / 10));
  const handleZoomOut = () => setZoomLevel(prev => Math.max(1, Math.round((prev - 0.5) * 10) / 10));
  const handleResetZoom = () => setZoomLevel(1);

  // Spectral filter styles applied to the image
  const getFilterStyle = () => {
    switch (spectralMode) {
      case 'fourier':
        return 'contrast(180%) brightness(110%) grayscale(100%) invert(15%)';
      case 'ela':
        return 'contrast(160%) saturate(190%) hue-rotate(180deg)';
      case 'thermal':
        return 'contrast(140%) hue-rotate(90deg) saturate(160%)';
      default:
        return 'none';
    }
  };

  const spectralModes = [
    { id: 'standard', label: 'Standard' },
    { id: 'fourier', label: 'Fourier' },
    { id: 'ela', label: 'Error level' },
    { id: 'thermal', label: 'Thermal' },
  ];

  return (
    <div className="space-y-10 font-sans">
      {/* Editorial Header (Scaled Up) */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 pb-8 border-b border-zinc-100">
        <div>
          <span className="text-sm font-medium text-zinc-400 tracking-wide block">
            Visual forensics
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-zinc-900 mt-1.5">
            Evidence Autopsy
          </h2>
          <p className="text-base sm:text-lg text-zinc-500 mt-2 max-w-2xl">
            Spectral layer decomposition and localized sub-pixel artifact analysis.
          </p>
        </div>

        {/* Minimal Segmented Filter Controls (Scaled Up) */}
        <div className="flex items-center gap-1.5 p-1.5 rounded-2xl bg-zinc-100/80 border border-zinc-200/50 text-sm">
          {spectralModes.map((mode) => (
            <button
              key={mode.id}
              onClick={() => setSpectralMode(mode.id)}
              className={`px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl font-medium transition-all cursor-pointer ${
                spectralMode === mode.id
                  ? 'bg-white text-zinc-900 shadow-xs'
                  : 'text-zinc-600 hover:text-zinc-900'
              }`}
            >
              {mode.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content: Breathable 2-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
        {/* LEFT COLUMN: Media Viewport (Larger Canvas) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Viewport Top Bar */}
          <div className="flex items-center justify-between text-sm text-zinc-500 px-1">
            <div className="flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="font-medium text-zinc-700">Specimen viewport</span>
              <span className="text-zinc-300">·</span>
              <span className="text-zinc-500">{Math.round(zoomLevel * 100)}% zoom</span>
            </div>

            {/* Clean Zoom Controls */}
            <div className="flex items-center gap-1 bg-zinc-100/80 p-1 rounded-xl border border-zinc-200/50 text-sm">
              <button 
                onClick={handleZoomOut} 
                className="p-1.5 rounded-lg text-zinc-600 hover:text-zinc-900 hover:bg-white transition-colors cursor-pointer"
                title="Zoom out"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <button 
                onClick={handleZoomIn} 
                className="p-1.5 rounded-lg text-zinc-600 hover:text-zinc-900 hover:bg-white transition-colors cursor-pointer"
                title="Zoom in"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
              <button 
                onClick={handleResetZoom} 
                className="p-1.5 rounded-lg text-zinc-600 hover:text-zinc-900 hover:bg-white transition-colors cursor-pointer"
                title="Reset zoom"
              >
                <Maximize2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Interactive Image Viewport */}
          <div className="relative w-full min-h-[440px] sm:min-h-[520px] lg:min-h-[580px] rounded-3xl bg-zinc-950 overflow-hidden flex items-center justify-center select-none shadow-xs border border-zinc-200/60">
            <div 
              className="w-full h-full relative transition-transform duration-200"
              style={{ transform: `scale(${zoomLevel})` }}
            >
              {!imgError ? (
                <img 
                  src={image} 
                  alt="Autopsy specimen" 
                  onError={() => setImgError(true)}
                  style={{ filter: getFilterStyle() }}
                  className="w-full h-full object-cover transition-all duration-300 min-h-[440px]"
                />
              ) : (
                <div 
                  style={{ filter: getFilterStyle() }}
                  className="w-full h-full min-h-[440px] bg-gradient-to-br from-zinc-800 via-zinc-900 to-zinc-950 flex flex-col items-center justify-center p-8 text-center"
                >
                  <div className="w-24 h-24 rounded-full border border-white/20 flex items-center justify-center mb-4">
                    <Crosshair className="w-10 h-10 text-zinc-400" />
                  </div>
                  <span className="text-base font-medium text-zinc-300">Forensic Specimen Vector</span>
                  <span className="text-sm text-zinc-500 mt-1">Multi-spectral layer loaded</span>
                </div>
              )}

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
                    className={`absolute rounded-xl transition-all cursor-pointer group z-20 ${
                      isSelected 
                        ? 'border-2 border-white shadow-[0_0_25px_rgba(255,255,255,0.7)] ring-2 ring-zinc-900' 
                        : 'border border-white/60 bg-white/10 hover:border-white'
                    }`}
                  >
                    <div className="absolute -top-7 left-0 bg-zinc-900/90 text-white text-xs font-medium px-2.5 py-1 rounded-md shadow-sm whitespace-nowrap flex items-center gap-1.5 backdrop-blur-xs">
                      <Crosshair className="w-3 h-3 text-zinc-300" />
                      <span>{ann.label}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Viewport Layer Pill */}
            <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-md px-3.5 py-1.5 rounded-lg text-xs sm:text-sm text-zinc-200 pointer-events-none">
              Filter: {spectralModes.find(m => m.id === spectralMode)?.label}
            </div>
          </div>

          {/* Viewport Caption */}
          <div className="flex items-center justify-between text-sm text-zinc-400 px-1 pt-1">
            <span>Click any highlighted region to inspect localized findings</span>
            <span>3840 × 2160 · 32-bit</span>
          </div>
        </div>

        {/* RIGHT COLUMN: Finding Dossier (Scaled Proportions) */}
        <div className="lg:col-span-5 space-y-8">
          {/* Finding Header */}
          <div className="space-y-4 pb-8 border-b border-zinc-100">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-zinc-400">
                Finding detail
              </span>
              <span className="text-xs sm:text-sm font-medium px-3 py-1 rounded-full bg-rose-50 text-rose-700">
                {selectedAnnotation?.severity === 'critical' ? 'Critical variance' : 'Elevated variance'}
              </span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-semibold text-zinc-900 tracking-tight">
              {selectedAnnotation?.title || 'Discrete Cosine Transform (DCT) Inconsistency'}
            </h3>

            <p className="text-base sm:text-lg text-zinc-600 leading-relaxed font-normal">
              {selectedAnnotation?.detail || 'Localized non-uniform quantization coefficients detected along sub-pixel boundary borders. Consistent with inpainting generative synthesis.'}
            </p>
          </div>

          {/* Key Metrics: Scaled Numbers */}
          <div className="grid grid-cols-2 gap-6 pb-8 border-b border-zinc-100">
            <div>
              <span className="text-sm text-zinc-400 block">Confidence level</span>
              <span className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-zinc-900 mt-1 block">98.7%</span>
              <span className="text-sm text-emerald-600 flex items-center gap-1.5 mt-1 font-medium">
                <CheckCircle2 className="w-4 h-4" /> Confirmed match
              </span>
            </div>
            <div>
              <span className="text-sm text-zinc-400 block">Inspection method</span>
              <span className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-zinc-900 mt-1 block">FFT + ELA</span>
              <span className="text-sm text-zinc-500 block mt-1">Dual-spectral pass</span>
            </div>
          </div>

          {/* Sensitivity Slider: Scaled Up */}
          <div className="space-y-3 pb-8 border-b border-zinc-100">
            <div className="flex items-center justify-between text-sm sm:text-base">
              <span className="text-zinc-700 font-medium flex items-center gap-2">
                <Sliders className="w-4 h-4 text-zinc-400" />
                Detection sensitivity
              </span>
              <span className="font-semibold text-zinc-900 tabular-nums">{sensitivity}%</span>
            </div>
            <input 
              type="range"
              min="40"
              max="99"
              value={sensitivity}
              onChange={(e) => setSensitivity(Number(e.target.value))}
              className="w-full accent-zinc-900 cursor-pointer h-2 bg-zinc-100 rounded-lg"
            />
            <div className="flex justify-between text-xs sm:text-sm text-zinc-400">
              <span>Standard (40%)</span>
              <span>Strict (99%)</span>
            </div>
          </div>

          {/* Cryptographic Proof: Clean inline note */}
          <div className="flex items-center gap-2.5 text-sm text-zinc-500 pt-1">
            <ShieldCheck className="w-5 h-5 text-zinc-400 shrink-0" />
            <span>Cryptographic provenance: <strong className="font-medium text-zinc-800">SHA-256 verified</strong></span>
          </div>
        </div>
      </div>
    </div>
  );
}
