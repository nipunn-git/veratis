import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Download, 
  FileText, 
  RotateCcw, 
  Share2, 
  ShieldAlert, 
  Sliders, 
  CheckCircle2, 
  Printer, 
  Upload,
  Layers,
  Activity,
  AlertTriangle
} from 'lucide-react';
import UploadArea from './UploadArea';
import AnalysisProgress from './AnalysisProgress';
import DeceptionRadar from './DeceptionRadar';
import EvidenceAutopsy from './EvidenceAutopsy';
import RealityTimeline from './RealityTimeline';
import EvidenceGravityMap from './EvidenceGravityMap';
import CompetingHypotheses from './CompetingHypotheses';
import UncertaintyEngine from './UncertaintyEngine';
import { INVESTIGATION_CASES } from '../../data/mockInvestigations';
import { generateReportFile } from '../../utils/exportReport';

export default function DashboardLayout({ onBackToLanding, initialCaseIndex = 0 }) {
  const [currentCase, setCurrentCase] = useState(INVESTIGATION_CASES[initialCaseIndex]);
  const [workflowState, setWorkflowState] = useState('analyzed'); // 'upload' | 'analyzing' | 'analyzed'
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'radar' | 'autopsy' | 'timeline' | 'gravity' | 'hypotheses' | 'uncertainty'
  const [showReportModal, setShowReportModal] = useState(false);

  // Handle case selection
  const handleSelectSample = (sampleCase) => {
    setCurrentCase(sampleCase);
    setWorkflowState('analyzing');
  };

  // Handle custom upload file
  const handleCustomUpload = (fileInfo) => {
    const customCase = {
      id: "CUSTOM-UPLOAD",
      code: "CASE-USER-INGEST",
      title: fileInfo.name || "Custom User Uploaded Specimen",
      subject: "User-submitted media undergoing multi-spectral forensic verification pipeline",
      threatLevel: "EVALUATING",
      category: "USER-SUBMITTED MEDIA",
      verdict: "SUSPICIOUS COMPOSITE DETECTED",
      verdictConfidence: 89.4,
      dateLogged: new Date().toUTCString(),
      leadInvestigator: "VERATIS UNIT 01 // LOCAL ENCLAVE",
      image: fileInfo.dataUrl || "/assets/morphed_diplomat.jpg",
      radarScores: {
        visual: 84,
        contextual: 72,
        temporal: 80,
        source: 65,
        claim: 78
      },
      radarAnalysis: {
        visual: "Fourier spectrum shows high-frequency attenuation along edge boundaries.",
        contextual: "Metadata headers lack authentic camera cryptographic signature.",
        temporal: "Timestamps suggest social media compression re-encoding.",
        source: "Direct client upload without verified upstream provenance chain.",
        claim: "Cross-referencing global truth index for semantic claims."
      },
      annotations: [
        {
          id: "usr-ann-1",
          label: "Edge Boundary Variance",
          x: 40,
          y: 45,
          width: 20,
          height: 20,
          severity: "warning",
          title: "Compression Matrix Boundary Shift",
          detail: "Local discrete cosine transform analysis indicates non-uniform quantization coefficients."
        }
      ],
      timeline: [
        {
          time: "CURRENT",
          date: "TODAY",
          event: "Client Bitstream Ingestion",
          platform: "VERATIS Workspace",
          status: "verified",
          description: "Raw file uploaded to client-side WebAssembly verification memory."
        }
      ],
      gravityMap: {
        nodes: [
          { id: "CLAIM_USR", label: "User Specimen Claim", type: "claim", gravity: 80 },
          { id: "FOURIER_USR", label: "Fourier Noise Inconsistency", type: "anomaly", gravity: 85 },
          { id: "EXIF_USR", label: "EXIF Quantization Check", type: "fact", gravity: 90 }
        ],
        connections: [
          { from: "FOURIER_USR", to: "CLAIM_USR", relation: "suggests_manipulation", strength: 0.85 },
          { from: "EXIF_USR", to: "CLAIM_USR", relation: "inconclusive", strength: 0.6 }
        ]
      },
      competingHypotheses: [
        {
          id: "usr-hyp-1",
          title: "Selective Inpainting / Re-compression",
          probability: 76,
          status: "PLAUSIBLE",
          description: "Media shows localized frequency attenuation consistent with digital editing.",
          supporting: ["Non-uniform DCT quantization matrix"],
          contradicting: ["Lacks obvious facial deformation"]
        },
        {
          id: "usr-hyp-2",
          title: "Authentic Media Degraded by Social Sharing",
          probability: 24,
          status: "POSSIBLE",
          description: "Image may be authentic but repeatedly transcoded by messaging platforms.",
          supporting: ["Color distribution is natural"],
          contradicting: ["Localized edge artifacts do not match uniform recompression"]
        }
      ],
      uncertaintyEngine: {
        known: [
          "File size and bitstream are verified in local memory.",
          "Image exhibits non-uniform compression characteristics."
        ],
        unknown: [
          "Original camera hardware and physical scene coordinates."
        ],
        untestable: [
          "Author intent and contextual provenance prior to local upload."
        ]
      }
    };

    setCurrentCase(customCase);
    setWorkflowState('analyzing');
  };

  const handleExport = () => {
    generateReportFile(currentCase);
  };

  return (
    <div className="min-h-screen bg-[#070a08] text-[#f5f4ef] font-sans pb-24 selection:bg-[#c8f344] selection:text-[#070a08]">
      {/* Top Workspace Bar */}
      <header className="sticky top-0 z-30 bg-[#0c130f]/90 backdrop-blur-md border-b border-[#1f2d26] px-6 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={onBackToLanding}
              className="flex items-center gap-2 text-xs font-mono text-[#a4b3a6] hover:text-[#c8f344] transition-colors cursor-pointer group"
            >
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
              <span>RETURN TO LANDING</span>
            </button>
            <span className="text-[#293d32] hidden sm:inline-block">|</span>
            <div className="hidden sm:flex items-center gap-2 font-mono text-xs text-[#c8f344]">
              <span className="w-2 h-2 rounded-full bg-[#c8f344] animate-pulse" />
              <span>WORKSPACE // {currentCase.code}</span>
            </div>
          </div>

          <div className="flex items-center gap-3 font-mono text-xs">
            <button
              onClick={() => setWorkflowState('upload')}
              className="px-3.5 py-1.5 rounded-lg bg-[#142019] border border-[#263c2f] hover:border-[#c8f344] text-[#a4b3a6] hover:text-[#f5f4ef] flex items-center gap-2 cursor-pointer transition-colors"
            >
              <Upload className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">NEW INVESTIGATION</span>
            </button>

            <button
              onClick={handleExport}
              className="px-4 py-1.5 rounded-lg bg-[#c8f344] hover:bg-[#d6fa5c] text-[#070a08] font-bold flex items-center gap-2 cursor-pointer transition-all shadow-[0_0_12px_rgba(200,243,68,0.25)]"
            >
              <Download className="w-3.5 h-3.5" />
              <span>EXPORT DOSSIER</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Workspace Body */}
      <main className="max-w-7xl mx-auto px-6 pt-8">
        {/* Workflow State: UPLOAD NEW SPECIMEN */}
        {workflowState === 'upload' && (
          <div className="py-6">
            <div className="mb-8">
              <span className="text-xs font-mono text-[#c8f344] tracking-widest uppercase">
                [INGESTION PHASE] // LOAD MEDIA SPECIMEN
              </span>
              <h2 className="text-3xl sm:text-5xl font-display font-black text-[#f5f4ef] uppercase mt-2">
                STAGE NEW INVESTIGATION
              </h2>
            </div>
            <UploadArea 
              onFileSelected={handleCustomUpload} 
              onSelectSampleCase={handleSelectSample} 
            />
          </div>
        )}

        {/* Workflow State: ANALYSING ANIMATION */}
        {workflowState === 'analyzing' && (
          <div className="py-12">
            <AnalysisProgress 
              caseName={currentCase.title}
              onComplete={() => setWorkflowState('analyzed')} 
            />
          </div>
        )}

        {/* Workflow State: ANALYZED RESULTS WORKSPACE */}
        {workflowState === 'analyzed' && (
          <div className="space-y-10">
            {/* Case Dossier Executive Header Banner */}
            <div className="p-8 rounded-3xl bg-[#0c130f] border border-[#1f2d26] shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-80 h-80 bg-[#c8f344]/5 rounded-full blur-3xl pointer-events-none" />

              <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#1f2d26] mb-6 font-mono text-xs">
                <div className="flex items-center gap-3">
                  <span className="px-2.5 py-1 rounded bg-[#18241e] text-[#c8f344] font-bold border border-[#273d2f]">
                    {currentCase.code}
                  </span>
                  <span className="text-[#a4b3a6]">{currentCase.category}</span>
                </div>
                <div className="text-[#788279]">
                  LOGGED: {currentCase.dateLogged} // {currentCase.leadInvestigator}
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-8">
                  <h1 className="text-3xl sm:text-5xl font-display font-extrabold text-[#f5f4ef] uppercase tracking-tight mb-3">
                    {currentCase.title}
                  </h1>
                  <p className="text-sm sm:text-base text-[#a4b3a6] font-light leading-relaxed mb-6">
                    {currentCase.subject}
                  </p>

                  <div className="flex flex-wrap items-center gap-3">
                    <button
                      onClick={() => setWorkflowState('upload')}
                      className="text-xs font-mono px-3 py-1.5 rounded-lg bg-[#142019] border border-[#24382d] text-[#a4b3a6] hover:text-[#f5f4ef] hover:border-[#c8f344] transition-colors cursor-pointer"
                    >
                      SWITCH SPECIMEN CASE
                    </button>
                    <button
                      onClick={handleExport}
                      className="text-xs font-mono px-3 py-1.5 rounded-lg bg-[#18251e] border border-[#2f4938] text-[#c8f344] hover:bg-[#c8f344] hover:text-[#070a08] font-bold transition-all cursor-pointer flex items-center gap-1.5"
                    >
                      <Download className="w-3.5 h-3.5" />
                      DOWNLOAD FORENSIC DOSSIER (.MD)
                    </button>
                  </div>
                </div>

                {/* Verdict Confidence Gauge */}
                <div className="lg:col-span-4 p-6 rounded-2xl bg-[#080d0a] border border-[#1f2d26] text-center font-mono">
                  <span className="text-[10px] text-[#788279] tracking-widest block uppercase mb-1">
                    PRIMARY FORENSIC DETERMINATION
                  </span>
                  <div className="text-xl sm:text-2xl font-display font-black text-rose-400 mb-2 uppercase">
                    {currentCase.verdict}
                  </div>
                  <div className="text-4xl font-bold text-[#c8f344] mb-1">
                    {currentCase.verdictConfidence}%
                  </div>
                  <span className="text-[10px] text-[#a4b3a6]">
                    BAYESIAN CERTAINTY INDEX
                  </span>
                </div>
              </div>
            </div>

            {/* View Filter Tabs */}
            <div className="flex flex-wrap items-center gap-2 border-b border-[#1f2d26] pb-3 text-xs font-mono">
              <span className="text-[#788279] mr-2">ENGINES:</span>
              {[
                { id: 'all', label: 'FULL DOSSIER' },
                { id: 'radar', label: 'DECEPTION RADAR' },
                { id: 'autopsy', label: 'EVIDENCE AUTOPSY' },
                { id: 'timeline', label: 'REALITY TIMELINE' },
                { id: 'gravity', label: 'GRAVITY MAP' },
                { id: 'hypotheses', label: 'HYPOTHESES' },
                { id: 'uncertainty', label: 'UNCERTAINTY' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-3.5 py-1.5 rounded-lg transition-colors cursor-pointer ${
                    activeTab === tab.id
                      ? 'bg-[#c8f344] text-[#070a08] font-bold'
                      : 'text-[#a4b3a6] hover:text-[#f5f4ef] hover:bg-[#121c16]'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Dashboard Sections based on activeTab */}
            <div className="space-y-10">
              {/* Deception Radar */}
              {(activeTab === 'all' || activeTab === 'radar') && (
                <DeceptionRadar 
                  scores={currentCase.radarScores} 
                  analysis={currentCase.radarAnalysis} 
                />
              )}

              {/* Evidence Autopsy */}
              {(activeTab === 'all' || activeTab === 'autopsy') && (
                <EvidenceAutopsy 
                  image={currentCase.image} 
                  annotations={currentCase.annotations} 
                />
              )}

              {/* Reality Timeline */}
              {(activeTab === 'all' || activeTab === 'timeline') && (
                <RealityTimeline 
                  timeline={currentCase.timeline} 
                />
              )}

              {/* Evidence Gravity Map */}
              {(activeTab === 'all' || activeTab === 'gravity') && (
                <EvidenceGravityMap 
                  gravityMap={currentCase.gravityMap} 
                />
              )}

              {/* Competing Hypotheses */}
              {(activeTab === 'all' || activeTab === 'hypotheses') && (
                <CompetingHypotheses 
                  hypotheses={currentCase.competingHypotheses} 
                />
              )}

              {/* Uncertainty Engine */}
              {(activeTab === 'all' || activeTab === 'uncertainty') && (
                <UncertaintyEngine 
                  uncertainty={currentCase.uncertaintyEngine} 
                />
              )}
            </div>

            {/* Bottom Disclaimer */}
            <div className="p-4 rounded-xl bg-[#0a0f0d] border border-[#1f2d26] text-xs font-mono text-[#526356] flex items-center justify-between">
              <span>VERATIS SYSTEM NOTICE: ALL RESULTS ARE SIMULATED USING LOCAL FORENSIC TELEMETRY. NO DATA IS SENT EXTERNALLY.</span>
              <button 
                onClick={handleExport}
                className="text-[#c8f344] hover:underline cursor-pointer"
              >
                [DOWNLOAD DOSSIER]
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
