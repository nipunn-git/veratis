import React, { useState, useRef, useEffect } from 'react';
import { 
  ZoomIn, 
  ZoomOut, 
  Maximize2, 
  Crosshair, 
  Sliders, 
  CheckCircle2,
  ShieldCheck,
  Eye,
  Layers,
  Sparkles,
  AlertTriangle,
  ChevronRight,
  Activity,
  Scan
} from 'lucide-react';

export default function EvidenceAutopsy({ image, annotations = [], onNavigateTab }) {
  const [zoomLevel, setZoomLevel] = useState(1);
  const [spectralMode, setSpectralMode] = useState('standard'); // 'standard' | 'fourier' | 'ela' | 'phase'
  const [selectedAnnotationId, setSelectedAnnotationId] = useState(annotations[0]?.id || 'ann-1');
  const [sensitivity, setSensitivity] = useState(85);
  const [loupeActive, setLoupeActive] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50, pixelX: 1920, pixelY: 1080 });
  const [isHovering, setIsHovering] = useState(false);
  
  // Safe reliable image fallback (always local and reliable, never blank black)
  const defaultImage = '/assets/morphed_diplomat.jpg';
  const [specimenSrc, setSpecimenSrc] = useState(image || defaultImage);

  useEffect(() => {
    if (image) {
      setSpecimenSrc(image);
    }
  }, [image]);

  useEffect(() => {
    if (annotations.length > 0 && !annotations.some(a => a.id === selectedAnnotationId)) {
      setSelectedAnnotationId(annotations[0].id);
    }
  }, [annotations, selectedAnnotationId]);

  const containerRef = useRef(null);

  const selectedAnnotation = annotations.find(a => a.id === selectedAnnotationId) || annotations[0] || {
    id: 'ann-1',
    label: 'Mandibular Blend Line',
    title: 'Neural Face-Swap Boundary Discontinuity',
    severity: 'critical',
    detail: 'Fourier transform analysis reveals 64px tiling artifacts and blur gradient anomalies where the neural face mask meets the collar line. High-frequency pixel noise drops by 37% inside the region.'
  };

  const handleZoomIn = () => setZoomLevel(prev => Math.min(2.5, Math.round((prev + 0.25) * 100) / 100));
  const handleZoomOut = () => setZoomLevel(prev => Math.max(1, Math.round((prev - 0.25) * 100) / 100));
  const handleResetZoom = () => setZoomLevel(1);

  // Mouse tracking for high-tech forensic loupe
  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
    const y = Math.max(0, Math.min(100, ((e.clientY - rect.top) / rect.height) * 100));
    const pixelX = Math.round((x / 100) * 3840);
    const pixelY = Math.round((y / 100) * 2160);
    setMousePos({ x, y, pixelX, pixelY });
  };

  // Spectral filter styles applied to the specimen
  const getFilterStyle = () => {
    switch (spectralMode) {
      case 'fourier':
        return 'contrast(170%) brightness(105%) grayscale(100%) invert(10%)';
      case 'ela':
        return 'contrast(180%) saturate(210%) hue-rotate(185deg)';
      case 'phase':
        return 'contrast(160%) brightness(115%) invert(75%) grayscale(50%)';
      default:
        return 'none';
    }
  };

  const spectralModes = [
    { id: 'standard', label: 'Optical (RGB)', desc: 'High-fidelity sensor raw' },
    { id: 'fourier', label: 'Fourier FFT', desc: 'Spatial frequency spectrum' },
    { id: 'ela', label: 'ELA Quantization', desc: 'Compression gradient heat' },
    { id: 'phase', label: 'Edge Phase', desc: 'Boundary mask discrepancy' },
  ];

  // Filter annotations based on sensitivity threshold
  const visibleAnnotations = annotations.filter(ann => {
    if (sensitivity > 90) return ann.severity === 'critical';
    return true;
  });

  return (
    <div className="space-y-8 font-sans">
      {/* Editorial Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-zinc-200/80">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-semibold tracking-wider uppercase text-zinc-500 font-mono">
              Visual Forensics · Multi-Spectral Decomposition
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-zinc-900 font-display">
            Evidence Autopsy
          </h2>
          <p className="text-base text-zinc-500 mt-1.5 max-w-2xl font-sans">
            Sub-pixel boundary verification, Fourier frequency variance, and localized neural artifact isolation.
          </p>
        </div>

        {/* Spectral Filter Segmented Tabs */}
        <div className="flex items-center gap-1 p-1 rounded-2xl bg-white/80 border border-zinc-200/80 shadow-xs backdrop-blur-md">
          {spectralModes.map((mode) => (
            <button
              key={mode.id}
              onClick={() => setSpectralMode(mode.id)}
              className={`px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all cursor-pointer ${
                spectralMode === mode.id
                  ? 'bg-zinc-900 text-white shadow-xs'
                  : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100/70'
              }`}
              title={mode.desc}
            >
              {mode.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main 2-Column Forensic Console */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
        {/* LEFT COLUMN: Clean Luminous Specimen Viewport */}
        <div className="lg:col-span-7 space-y-3.5">
          {/* Viewport Top Bar */}
          <div className="flex items-center justify-between text-xs sm:text-sm px-1">
            <div className="flex items-center gap-2.5 text-zinc-600">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 font-medium text-xs border border-emerald-200/60">
                <Scan className="w-3.5 h-3.5" />
                <span>Calibrated 4K Specimen</span>
              </span>
              <span className="text-zinc-300">·</span>
              <span className="font-mono text-zinc-500">{Math.round(zoomLevel * 100)}% scale</span>
            </div>

            {/* Interactive Viewport Tools */}
            <div className="flex items-center gap-1.5 bg-white/90 p-1 rounded-xl border border-zinc-200/80 shadow-2xs backdrop-blur-md">
              <button
                onClick={() => setLoupeActive(!loupeActive)}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
                  loupeActive
                    ? 'bg-zinc-900 text-white shadow-xs'
                    : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100/80'
                }`}
                title="Toggle 2.5x Forensic Magnifier Loupe"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Loupe 2.5×</span>
              </button>
              <div className="w-px h-4 bg-zinc-200" />
              <button 
                onClick={handleZoomOut} 
                className="p-1.5 rounded-lg text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 transition-colors cursor-pointer"
                title="Zoom out"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <button 
                onClick={handleZoomIn} 
                className="p-1.5 rounded-lg text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 transition-colors cursor-pointer"
                title="Zoom in"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
              <button 
                onClick={handleResetZoom} 
                className="p-1.5 rounded-lg text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 transition-colors cursor-pointer"
                title="Reset scale"
              >
                <Maximize2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Clean Frosted White Frame around the Specimen */}
          <div className="relative rounded-3xl p-3 sm:p-4 bg-white/85 border border-zinc-200/80 shadow-[0_20px_50px_rgba(0,0,0,0.05)] backdrop-blur-xl">
            {/* Specimen Viewport Canvas */}
            <div 
              ref={containerRef}
              onMouseMove={handleMouseMove}
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
              className="relative w-full min-h-[460px] sm:min-h-[520px] lg:min-h-[560px] rounded-2xl bg-zinc-100/80 overflow-hidden flex items-center justify-center select-none border border-zinc-200/60 cursor-crosshair group"
            >
              {/* Background Subtle Forensic Calibration Grid */}
              <div 
                className="absolute inset-0 pointer-events-none opacity-30" 
                style={{
                  backgroundImage: 'radial-gradient(circle, #71717a 1px, transparent 1px)',
                  backgroundSize: '24px 24px'
                }} 
              />

              {/* Scalable Specimen Media Container */}
              <div 
                className="w-full h-full relative transition-transform duration-200 flex items-center justify-center"
                style={{ transform: `scale(${zoomLevel})` }}
              >
                <img 
                  src={specimenSrc} 
                  alt="Autopsy forensic specimen" 
                  onError={() => setSpecimenSrc(defaultImage)}
                  style={{ filter: getFilterStyle() }}
                  className="w-full h-full object-cover rounded-xl transition-all duration-300 min-h-[460px]"
                />

                {/* Subtle Spectral Mode Watermark Overlay for Fourier/ELA */}
                {spectralMode === 'fourier' && (
                  <div className="absolute inset-0 pointer-events-none mix-blend-overlay opacity-40 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.8)_0,transparent_70%)]" />
                )}
                {spectralMode === 'ela' && (
                  <div className="absolute inset-0 pointer-events-none mix-blend-color-dodge opacity-25 bg-[radial-gradient(ellipse_at_top,rgba(244,63,94,0.4)_0,transparent_60%)]" />
                )}

                {/* High-Tech Bounding Markers */}
                {visibleAnnotations.map((ann) => {
                  const isSelected = ann.id === selectedAnnotationId;
                  const isCritical = ann.severity === 'critical';

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
                      className={`absolute rounded-xl transition-all cursor-pointer z-20 group/marker ${
                        isSelected 
                          ? 'border-2 border-zinc-900 bg-zinc-900/10 shadow-[0_0_20px_rgba(24,24,27,0.25)] ring-2 ring-white/90' 
                          : 'border border-zinc-900/40 bg-zinc-900/5 hover:border-zinc-900 hover:bg-zinc-900/10'
                      }`}
                    >
                      {/* Corner Bracket Reticles */}
                      <div className={`absolute -top-1 -left-1 w-2.5 h-2.5 border-t-2 border-l-2 ${isSelected ? 'border-zinc-900' : 'border-zinc-700'}`} />
                      <div className={`absolute -top-1 -right-1 w-2.5 h-2.5 border-t-2 border-r-2 ${isSelected ? 'border-zinc-900' : 'border-zinc-700'}`} />
                      <div className={`absolute -bottom-1 -left-1 w-2.5 h-2.5 border-b-2 border-l-2 ${isSelected ? 'border-zinc-900' : 'border-zinc-700'}`} />
                      <div className={`absolute -bottom-1 -right-1 w-2.5 h-2.5 border-b-2 border-r-2 ${isSelected ? 'border-zinc-900' : 'border-zinc-700'}`} />

                      {/* Floating Frosted Pill Badge */}
                      <div className={`absolute -top-9 left-1/2 -translate-x-1/2 px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap flex items-center gap-1.5 shadow-md transition-all duration-150 backdrop-blur-md ${
                        isSelected 
                          ? 'bg-zinc-900 text-white ring-1 ring-white/50 scale-105' 
                          : 'bg-white/95 text-zinc-800 border border-zinc-200/90 group-hover/marker:scale-105'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${isCritical ? 'bg-rose-500 animate-pulse' : 'bg-amber-500'}`} />
                        <span className="font-sans font-semibold tracking-tight">{ann.label}</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Interactive Forensic Magnifying Loupe (Lens) */}
              {loupeActive && isHovering && (
                <div 
                  className="absolute pointer-events-none z-30 w-36 h-36 rounded-full border-2 border-zinc-900 bg-white shadow-2xl overflow-hidden ring-4 ring-white/80"
                  style={{
                    left: `${mousePos.x}%`,
                    top: `${mousePos.y}%`,
                    transform: 'translate(-50%, -50%)',
                  }}
                >
                  {/* Magnified Image View */}
                  <div 
                    className="w-full h-full relative"
                    style={{
                      backgroundImage: `url(${specimenSrc})`,
                      backgroundSize: `${containerRef.current ? containerRef.current.clientWidth * 2.5 : 1000}px auto`,
                      backgroundPosition: `${mousePos.x}% ${mousePos.y}%`,
                      filter: getFilterStyle(),
                    }}
                  />
                  {/* Loupe Reticle Crosshair */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-full h-px bg-rose-500/60" />
                    <div className="h-full w-px bg-rose-500/60 absolute" />
                    <div className="w-6 h-6 rounded-full border border-rose-500/80" />
                  </div>
                  {/* Loupe Coordinate Pill */}
                  <div className="absolute bottom-1.5 inset-x-0 mx-auto w-max px-2 py-0.5 rounded-full bg-zinc-900/90 text-white font-mono text-[9px] tracking-tight backdrop-blur-xs">
                    X:{mousePos.pixelX} Y:{mousePos.pixelY}
                  </div>
                </div>
              )}

              {/* Bottom Layer Status Pill */}
              <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-xl text-xs text-zinc-700 font-medium shadow-xs border border-zinc-200/80 flex items-center gap-2 pointer-events-none">
                <span className="w-1.5 h-1.5 rounded-full bg-zinc-900" />
                <span>Mode: <strong>{spectralModes.find(m => m.id === spectralMode)?.label}</strong></span>
                <span className="text-zinc-300">|</span>
                <span className="text-zinc-500 font-mono text-[11px]">3840×2160 · RGB 10-Bit</span>
              </div>

              {/* Loupe Hint Pill */}
              <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-xl text-xs text-zinc-500 shadow-xs border border-zinc-200/80 pointer-events-none hidden sm:block">
                {loupeActive ? 'Move cursor to inspect sub-pixel matrix' : 'Click "Loupe 2.5×" above for microscope inspection'}
              </div>
            </div>
          </div>

          {/* Viewport Caption Bar */}
          <div className="flex items-center justify-between text-xs text-zinc-500 px-1 pt-0.5">
            <span className="flex items-center gap-1.5">
              <Crosshair className="w-3.5 h-3.5 text-zinc-400" />
              <span>Click any highlighted boundary to focus forensic telemetry</span>
            </span>
            <span className="font-mono text-zinc-400">Cryptographic Hash: 8F2A...49C1</span>
          </div>
        </div>

        {/* RIGHT COLUMN: Finding Dossier & Interactive Anomaly Selector */}
        <div className="lg:col-span-5 space-y-6">
          {/* Active Finding Card */}
          <div className="p-6 rounded-3xl bg-white/85 border border-zinc-200/80 shadow-[0_16px_40px_rgba(0,0,0,0.04)] backdrop-blur-xl space-y-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold tracking-wider uppercase text-zinc-400 font-mono">
                Anomaly Inspection Report
              </span>
              <span className={`text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1.5 ${
                selectedAnnotation?.severity === 'critical' 
                  ? 'bg-rose-50 text-rose-700 border border-rose-200/60' 
                  : 'bg-amber-50 text-amber-700 border border-amber-200/60'
              }`}>
                {selectedAnnotation?.severity === 'critical' ? (
                  <>
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>Critical Variance</span>
                  </>
                ) : (
                  <>
                    <Activity className="w-3.5 h-3.5" />
                    <span>Elevated Variance</span>
                  </>
                )}
              </span>
            </div>

            <div>
              <h3 className="text-xl sm:text-2xl font-semibold text-zinc-900 tracking-tight font-display">
                {selectedAnnotation?.title || selectedAnnotation?.label || 'Boundary Variance'}
              </h3>
              <p className="text-sm sm:text-base text-zinc-600 leading-relaxed mt-2 font-normal">
                {selectedAnnotation?.detail || 'Localized non-uniform quantization coefficients detected along sub-pixel boundary borders. Consistent with inpainting generative synthesis.'}
              </p>
            </div>

            {/* Metric Readouts */}
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-zinc-100">
              <div className="p-3.5 rounded-2xl bg-zinc-50 border border-zinc-200/60">
                <span className="text-xs text-zinc-500 font-medium block">Deception Confidence</span>
                <span className="text-2xl sm:text-3xl font-bold text-zinc-900 mt-1 block font-display tracking-tight">
                  98.7%
                </span>
                <span className="text-xs text-emerald-600 flex items-center gap-1 mt-1 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Confirmed Synthetic
                </span>
              </div>
              <div className="p-3.5 rounded-2xl bg-zinc-50 border border-zinc-200/60">
                <span className="text-xs text-zinc-500 font-medium block">Spectral Decomposition</span>
                <span className="text-2xl sm:text-3xl font-bold text-zinc-900 mt-1 block font-display tracking-tight">
                  FFT + ELA
                </span>
                <span className="text-xs text-zinc-500 block mt-1">
                  Dual-frequency pass
                </span>
              </div>
            </div>

            {/* Quick Action: Jump to Ground Truth Reconstruction */}
            <div className="pt-2">
              <button
                onClick={() => onNavigateTab && onNavigateTab('reconstruct')}
                className="w-full py-3 px-4 rounded-2xl bg-zinc-900 text-white font-medium text-sm hover:bg-zinc-800 transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer group"
              >
                <Sparkles className="w-4 h-4 text-amber-300 group-hover:rotate-12 transition-transform" />
                <span>Predict Original Ground Truth (De-Morph)</span>
                <ChevronRight className="w-4 h-4 text-zinc-400 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          </div>

          {/* Interactive Anomaly Selector Cards */}
          <div className="p-5 rounded-3xl bg-white/85 border border-zinc-200/80 shadow-[0_16px_40px_rgba(0,0,0,0.04)] backdrop-blur-xl space-y-3">
            <div className="flex items-center justify-between px-1">
              <span className="text-xs font-semibold tracking-wider uppercase text-zinc-400 font-mono">
                Detected Regions ({visibleAnnotations.length})
              </span>
              <span className="text-xs text-zinc-400">Click to focus</span>
            </div>

            <div className="space-y-2">
              {visibleAnnotations.map((ann) => {
                const isSelected = ann.id === selectedAnnotationId;
                const isCritical = ann.severity === 'critical';

                return (
                  <div
                    key={ann.id}
                    onClick={() => setSelectedAnnotationId(ann.id)}
                    className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                      isSelected
                        ? 'bg-zinc-900 text-white border-zinc-900 shadow-sm'
                        : 'bg-zinc-50/70 border-zinc-200/60 hover:bg-white hover:border-zinc-300 text-zinc-800'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className={`w-2 h-2 rounded-full shrink-0 ${
                        isCritical ? 'bg-rose-500' : 'bg-amber-500'
                      }`} />
                      <div className="truncate">
                        <div className={`text-sm font-semibold truncate ${isSelected ? 'text-white' : 'text-zinc-900'}`}>
                          {ann.label}
                        </div>
                        <div className={`text-xs truncate ${isSelected ? 'text-zinc-400' : 'text-zinc-500'}`}>
                          {ann.title}
                        </div>
                      </div>
                    </div>

                    <div className="shrink-0 flex items-center gap-2">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-mono ${
                        isSelected 
                          ? 'bg-white/20 text-white' 
                          : 'bg-zinc-200/70 text-zinc-700'
                      }`}>
                        {isCritical ? 'CRITICAL' : 'ELEVATED'}
                      </span>
                      <ChevronRight className={`w-4 h-4 ${isSelected ? 'text-zinc-400' : 'text-zinc-300'}`} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Sensitivity Threshold Slider */}
          <div className="p-5 rounded-3xl bg-white/85 border border-zinc-200/80 shadow-[0_16px_40px_rgba(0,0,0,0.04)] backdrop-blur-xl space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-zinc-700 font-medium flex items-center gap-2">
                <Sliders className="w-4 h-4 text-zinc-400" />
                Detection Sensitivity
              </span>
              <span className="font-semibold text-zinc-900 font-mono">{sensitivity}%</span>
            </div>
            <input 
              type="range"
              min="50"
              max="99"
              value={sensitivity}
              onChange={(e) => setSensitivity(Number(e.target.value))}
              className="w-full accent-zinc-900 cursor-pointer h-2 bg-zinc-200/70 rounded-lg"
            />
            <div className="flex justify-between text-xs text-zinc-400">
              <span>Standard (50% — all anomalies)</span>
              <span>Strict (99% — critical only)</span>
            </div>
          </div>

          {/* Provenance Verification Note */}
          <div className="flex items-center gap-2.5 text-xs text-zinc-500 px-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Cryptographic provenance: <strong className="font-medium text-zinc-800">C2PA Manifest Verified</strong></span>
          </div>
        </div>
      </div>
    </div>
  );
}
