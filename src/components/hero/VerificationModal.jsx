import React, { useState } from 'react';
import { X, Search, ShieldCheck, ArrowRight, AlertTriangle, FileText, Globe, CheckCircle2, Sparkles, ExternalLink } from 'lucide-react';

const PRESET_CASES = [
  {
    id: 0,
    title: 'Geneva Diplomatic Briefing Deepfake',
    type: 'Synthetic Video / Audio',
    riskScore: 94.8,
    status: 'SYNTHETIC_GENERATED',
    summary: 'Phoneme desynchronization and latent GAN facial frequency artifacts detected across keyframes 140-320.',
  },
  {
    id: 1,
    title: 'SWIFT Banking Phishing Gateway',
    type: 'Suspicious Domain / Link',
    riskScore: 98.2,
    status: 'MALICIOUS_REDIRECT',
    summary: 'Homograph glyph obfuscation with suspicious DNS fast-flux nameservers matching active credential-harvesting cluster.',
  },
  {
    id: 2,
    title: 'Electoral Tally Sheet Specimen',
    type: 'Manipulated Image / OCR',
    riskScore: 89.4,
    status: 'LOCAL_TAMPERING',
    summary: 'Error Level Analysis (ELA) reveals non-uniform compression variance and cloned pixel matrices in numerical blocks.',
  },
];

export default function VerificationModal({ isOpen, onClose, onLaunchFullWorkspace }) {
  const [selectedCase, setSelectedCase] = useState(PRESET_CASES[0]);
  const [customInput, setCustomInput] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);

  if (!isOpen) return null;

  const handleRunInstantVerification = () => {
    setIsAnalyzing(true);
    setAnalysisResult(null);

    setTimeout(() => {
      setIsAnalyzing(false);
      setAnalysisResult({
        score: customInput ? 87.6 : selectedCase.riskScore,
        confidence: '99.2%',
        classification: 'HIGH PROBABILITY SYNTHETIC DECEPTION',
        verdict: 'Synthetically Altered Media Detected',
        timestamp: new Date().toLocaleTimeString(),
      });
    }, 1100);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10 select-none">
      {/* Dark Navy Glass Backdrop */}
      <div 
        className="absolute inset-0 bg-[#050B14]/85 backdrop-blur-xl transition-opacity animate-in fade-in duration-300" 
        onClick={onClose}
      />

      {/* Modal Dialog Container */}
      <div className="relative w-full max-w-2xl bg-[#08101E] border border-[#20D9FF]/30 rounded-3xl p-6 md:p-8 shadow-[0_20px_70px_rgba(0,0,0,0.8)] overflow-hidden z-10 flex flex-col gap-6 animate-in zoom-in-95 duration-300">
        
        {/* Glow Accent */}
        <div className="absolute top-0 right-1/4 w-72 h-72 bg-[#20D9FF]/10 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="flex items-start justify-between border-b border-white/10 pb-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2 font-mono text-[11px] text-[#20D9FF] tracking-wider uppercase">
              <ShieldCheck className="w-4 h-4 text-[#20D9FF]" />
              <span>Veratis Forensic Verification Protocol</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-display font-bold text-[#E1F4FF]">
              Verify Digital Media or Links
            </h2>
            <p className="text-xs text-[#77BFFF]/80">
              Inspect suspicious assets, test synthetic media detection, or launch the comprehensive evidence workspace.
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-[#77BFFF] hover:text-[#FFFFFF] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Input Field: URL / Specimen Text */}
        <div className="space-y-2">
          <label className="text-xs font-mono uppercase tracking-wider text-[#77BFFF]/70">
            Enter Suspicious URL, Media Link or Content Hash:
          </label>
          <div className="relative flex items-center">
            <input
              type="text"
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              placeholder="e.g. https://auth-verify.security-notice.net or paste deepfake video url"
              className="w-full px-4 py-3 rounded-xl bg-[#050B14] border border-[#20D9FF]/30 text-sm text-[#E1F4FF] placeholder:text-[#77BFFF]/40 focus:outline-none focus:border-[#20D9FF] focus:ring-1 focus:ring-[#20D9FF] transition-all font-mono"
            />
            <button
              onClick={handleRunInstantVerification}
              disabled={isAnalyzing}
              className="absolute right-2 px-4 py-1.5 rounded-lg bg-[#20D9FF] hover:bg-[#77BFFF] text-[#050B14] font-bold text-xs uppercase tracking-wider transition-colors disabled:opacity-50 cursor-pointer"
            >
              {isAnalyzing ? 'Scanning...' : 'Verify'}
            </button>
          </div>
        </div>

        {/* Preset Sample Specimens */}
        <div className="space-y-2">
          <div className="text-xs font-mono uppercase tracking-wider text-[#77BFFF]/70">
            Or select a benchmark forensic specimen:
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {PRESET_CASES.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setSelectedCase(item);
                  setCustomInput('');
                  setAnalysisResult(null);
                }}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  selectedCase.id === item.id
                    ? 'bg-[#20D9FF]/10 border-[#20D9FF] shadow-[0_0_15px_rgba(32,217,255,0.15)]'
                    : 'bg-[#050B14]/60 border-white/10 hover:border-white/20'
                }`}
              >
                <div className="text-xs font-semibold text-[#E1F4FF] truncate">
                  {item.title}
                </div>
                <div className="text-[10px] font-mono text-[#20D9FF] mt-1">
                  {item.type}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Live Analysis Output / Verification Result */}
        <div className="p-4 rounded-2xl bg-[#050B14] border border-white/10 space-y-3">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-[#77BFFF]/70">ACTIVE SPECIMEN AUDIT</span>
            <span className="text-[#20D9FF]">STATUS: ONLINE</span>
          </div>

          {isAnalyzing ? (
            <div className="py-6 flex flex-col items-center justify-center gap-3">
              <div className="w-8 h-8 rounded-full border-2 border-[#20D9FF] border-t-transparent animate-spin" />
              <div className="text-xs font-mono text-[#77BFFF] animate-pulse">
                PARSING MULTI-SPECTRAL LATENT ARTIFACTS...
              </div>
            </div>
          ) : analysisResult ? (
            <div className="space-y-2 animate-in fade-in">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-[#E1F4FF]">
                  {analysisResult.verdict}
                </span>
                <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-red-500/20 text-red-400 border border-red-500/30">
                  DECEPTION INDEX: {analysisResult.score}%
                </span>
              </div>
              <p className="text-xs text-[#77BFFF]/80">
                Latent noise variance and phonetic mouth-boundary desynchronization verify synthetic AI generation with {analysisResult.confidence} statistical confidence.
              </p>
            </div>
          ) : (
            <div className="space-y-1.5">
              <div className="text-sm font-semibold text-[#E1F4FF]">
                {selectedCase.title}
              </div>
              <p className="text-xs text-[#77BFFF]/80 leading-relaxed">
                {selectedCase.summary}
              </p>
              <div className="pt-1 flex items-center gap-3 text-[11px] font-mono text-[#20D9FF]">
                <span>CONFIDENCE: 98.6%</span>
                <span>•</span>
                <span>RISK SCORE: {selectedCase.riskScore}/100</span>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Actions: Launch Full Workspace */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
          <div className="text-[11px] font-mono text-[#77BFFF]/70">
            Need deep cryptographic chain-of-custody dossier?
          </div>
          <button
            onClick={() => {
              onClose();
              onLaunchFullWorkspace?.(selectedCase.id);
            }}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#20D9FF] hover:bg-[#77BFFF] text-[#050B14] font-bold text-xs uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(32,217,255,0.3)] cursor-pointer"
          >
            <span>Open Investigation Workspace</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
}
