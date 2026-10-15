import React, { useState } from 'react';
import { 
  ArrowLeft, 
  RotateCcw, 
  Download, 
  Upload, 
  Sparkles, 
  Layers, 
  Maximize2,
  ChevronLeft
} from 'lucide-react';

import HalftoneNebula from '@/components/ui/halftone-nebula';
import TopCommandBar from './TopCommandBar';
import BottomNavbar from './BottomNavbar';
import DraggableGrid from './DraggableGrid';
import CaseSwitcherModal from './modals/CaseSwitcherModal';
import IngestModal from './modals/IngestModal';
import { DEFAULT_WIDGETS, LAYOUT_PRESETS } from './widgetRegistry';
import { INVESTIGATION_CASES } from '../data/mockInvestigations';
import { generateReportFile } from '../utils/exportReport';

// Feature deep-dive components
import DeceptionRadar from '../components/dashboard/DeceptionRadar';
import EvidenceAutopsy from '../components/dashboard/EvidenceAutopsy';
import RealityTimeline from '../components/dashboard/RealityTimeline';
import EvidenceGravityMap from '../components/dashboard/EvidenceGravityMap';
import CompetingHypotheses from '../components/dashboard/CompetingHypotheses';
import UncertaintyEngine from '../components/dashboard/UncertaintyEngine';

const STORAGE_KEY = 'veratis_dashboard_white_v2';

export default function Dashboard({ onBackToLanding, initialCaseIndex = 0 }) {
  const [currentCase, setCurrentCase] = useState(
    INVESTIGATION_CASES[initialCaseIndex] || INVESTIGATION_CASES[0]
  );
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'radar' | 'autopsy' | 'timeline' | 'gravity' | 'hypotheses' | 'uncertainty'
  const [widgets, setWidgets] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        const validIds = new Set(DEFAULT_WIDGETS.map((w) => w.id));
        const filtered = parsed.filter((w) => validIds.has(w.id));
        if (filtered.length === DEFAULT_WIDGETS.length) {
          return filtered;
        }
      }
    } catch (e) {
      // ignore
    }
    return DEFAULT_WIDGETS;
  });

  const [caseModalOpen, setCaseModalOpen] = useState(false);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);

  // Save widget order & visibility to localStorage
  const handleReorderWidgets = (newWidgets) => {
    setWidgets(newWidgets);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newWidgets));
    } catch (e) {
      // ignore
    }
  };

  // Reset to default layout
  const handleResetLayout = () => {
    setWidgets(DEFAULT_WIDGETS);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      // ignore
    }
  };

  // Toggle visibility of a widget
  const handleToggleWidgetVisibility = (widgetId) => {
    const updated = widgets.map((w) =>
      w.id === widgetId ? { ...w, visible: !w.visible } : w
    );
    handleReorderWidgets(updated);
  };

  // Apply layout preset
  const handleSelectPreset = (presetId) => {
    let updated;
    if (presetId === 'minimal') {
      updated = widgets.map((w) => ({
        ...w,
        visible: ['runs-today', 'system-status'].includes(w.id),
      }));
    } else {
      updated = widgets.map((w) => ({ ...w, visible: true }));
    }
    handleReorderWidgets(updated);
  };

  // Export report
  const handleExportDossier = () => {
    generateReportFile(currentCase);
  };

  // Handle custom upload file
  const handleCustomUpload = (fileInfo) => {
    const customCase = {
      id: 'CUSTOM-UPLOAD',
      code: 'CASE-USER-INGEST',
      title: fileInfo.name || 'User-Submitted Specimen',
      subject:
        'Client-side uploaded forensic specimen undergoing multi-spectral synthetic detection pipeline.',
      threatLevel: 'EVALUATING',
      category: 'USER-SUBMITTED MEDIA',
      verdict: 'SUSPICIOUS COMPOSITE DETECTED',
      verdictConfidence: 89.4,
      dateLogged: new Date().toUTCString(),
      leadInvestigator: 'VERATIS ENCLAVE // CLIENT LOCAL',
      image:
        fileInfo.dataUrl ||
        'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1200&q=80',
      radarScores: {
        visual: 84,
        contextual: 72,
        temporal: 80,
        source: 65,
        claim: 78,
      },
      radarAnalysis: {
        visual: 'Fourier spectrum shows high-frequency attenuation along edge boundaries.',
        contextual: 'Metadata headers lack authentic camera cryptographic signature.',
        temporal: 'Timestamps indicate re-compression consistent with messaging platforms.',
        source: 'Direct client upload without verified upstream provenance chain.',
        claim: 'Cross-referencing global truth index for semantic claims.',
      },
      annotations: [
        {
          id: 'usr-ann-1',
          label: 'Edge Boundary Variance',
          x: 40,
          y: 45,
          width: 20,
          height: 20,
          severity: 'warning',
          title: 'Compression Matrix Boundary Shift',
          detail:
            'Local discrete cosine transform analysis indicates non-uniform quantization coefficients.',
        },
      ],
      timeline: [
        {
          time: 'CURRENT',
          date: 'TODAY',
          event: 'Client Bitstream Ingestion',
          platform: 'VERATIS Workspace',
          status: 'verified',
          description:
            'Raw file uploaded to client-side WebAssembly verification memory.',
        },
      ],
      gravityMap: {
        nodes: [
          { id: 'CLAIM_USR', label: 'User Specimen Claim', type: 'claim', gravity: 80 },
          { id: 'FOURIER_USR', label: 'Fourier Noise Inconsistency', type: 'anomaly', gravity: 85 },
          { id: 'EXIF_USR', label: 'EXIF Quantization Check', type: 'fact', gravity: 90 },
        ],
        connections: [
          { from: 'FOURIER_USR', to: 'CLAIM_USR', relation: 'suggests_manipulation', strength: 0.85 },
          { from: 'EXIF_USR', to: 'CLAIM_USR', relation: 'inconclusive', strength: 0.6 },
        ],
      },
      competingHypotheses: [
        {
          id: 'usr-hyp-1',
          title: 'Selective Inpainting / Re-compression',
          probability: 76,
          status: 'PLAUSIBLE',
          description:
            'Media shows localized frequency attenuation consistent with digital editing.',
          supporting: ['Non-uniform DCT quantization matrix'],
          contradicting: ['Lacks obvious facial deformation'],
        },
        {
          id: 'usr-hyp-2',
          title: 'Authentic Media Degraded by Social Sharing',
          probability: 24,
          status: 'POSSIBLE',
          description:
            'Image may be authentic but repeatedly transcoded by messaging platforms.',
          supporting: ['Color distribution is natural'],
          contradicting: ['Localized edge artifacts do not match uniform recompression'],
        },
      ],
      uncertaintyEngine: {
        known: [
          'File size and bitstream are verified in local memory.',
          'Image exhibits non-uniform compression characteristics.',
        ],
        unknown: ['Original camera hardware and physical scene coordinates.'],
        untestable: ['Author intent and contextual provenance prior to local upload.'],
      },
    };

    setCurrentCase(customCase);
    setActiveTab('overview');
  };

  return (
    <div className="relative min-h-screen text-zinc-900 font-sans pb-24 selection:bg-zinc-900 selection:text-white overflow-x-hidden bg-[#f8fafd]">
      {/* 0. Live Ambient Halftone Nebula Canvas Background (Fast-moving & Shiny White) */}
      <div className="fixed inset-0 z-0 pointer-events-auto">
        <HalftoneNebula
          height="100vh"
          preset="shinyWhite"
          params={{
            planet: false,
            density: 0.42,
            pixel: 6,
            speed: 3.8,
            drift: 0.13,
            starDrift: 3.6,
            twinkle: 5.2,
            sparkles: 24,
            spikeWidth: 2.2,
            rippleSpeed: 750,
            grain: 0.015,
          }}
          interactive={true}
          className="w-full h-full"
        />
        {/* Subtle luminous light tint that preserves all sparkles and movement */}
        <div className="absolute inset-0 bg-white/10 pointer-events-none" />
      </div>

      <div className="relative z-10">
        {/* 1. Sleek Top Command Bar */}
        <TopCommandBar
          currentCase={currentCase}
          onBackToLanding={onBackToLanding}
          onOpenCaseSelector={() => setCaseModalOpen(true)}
          onOpenUpload={() => setUploadModalOpen(true)}
          onExportDossier={handleExportDossier}
          onSelectPreset={handleSelectPreset}
        />

        {/* 2. Main Dashboard Content Canvas (Extended Horizontally) */}
        <main className="max-w-[1780px] w-full mx-auto px-4 sm:px-8 lg:px-12 pt-4 pb-28">
          {/* VIEW A: OVERVIEW - The 21st.dev Draggable Widget Grid (6 cards only) */}
          {activeTab === 'overview' && (
            <DraggableGrid
              widgets={widgets}
              onReorderWidgets={handleReorderWidgets}
              onResetLayout={handleResetLayout}
              onToggleWidgetVisibility={handleToggleWidgetVisibility}
              currentCase={currentCase}
              onSwitchCase={() => setCaseModalOpen(true)}
              onExportDossier={handleExportDossier}
              onNewUpload={() => setUploadModalOpen(true)}
            />
          )}

          {/* VIEW B: DECEPTION RADAR (Focused Feature View) */}
          {activeTab === 'radar' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2">
                <button
                  onClick={() => setActiveTab('overview')}
                  className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/90 backdrop-blur-md border border-zinc-200/80 text-xs sm:text-sm font-medium text-zinc-700 hover:text-zinc-950 hover:bg-white transition-all shadow-2xs cursor-pointer group"
                >
                  <ChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5 text-zinc-400 group-hover:text-zinc-700" />
                  <span>Back to overview</span>
                </button>
                <span className="text-xs sm:text-sm font-medium px-4 py-1.5 rounded-full bg-white/90 backdrop-blur-md border border-zinc-200/80 text-zinc-600 shadow-2xs">
                  Deception Radar
                </span>
              </div>
              <div className="bg-white/80 backdrop-blur-xl border border-zinc-200/60 rounded-3xl p-6 sm:p-10 lg:p-12 shadow-xs">
                <DeceptionRadar
                  scores={currentCase.radarScores}
                  analysis={currentCase.radarAnalysis}
                />
              </div>
            </div>
          )}

          {/* VIEW C: EVIDENCE AUTOPSY (Focused Feature View) */}
          {activeTab === 'autopsy' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2">
                <button
                  onClick={() => setActiveTab('overview')}
                  className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/90 backdrop-blur-md border border-zinc-200/80 text-xs sm:text-sm font-medium text-zinc-700 hover:text-zinc-950 hover:bg-white transition-all shadow-2xs cursor-pointer group"
                >
                  <ChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5 text-zinc-400 group-hover:text-zinc-700" />
                  <span>Back to overview</span>
                </button>
                <span className="text-xs sm:text-sm font-medium px-4 py-1.5 rounded-full bg-white/90 backdrop-blur-md border border-zinc-200/80 text-zinc-600 shadow-2xs">
                  Evidence Autopsy
                </span>
              </div>
              <div className="bg-white/80 backdrop-blur-xl border border-zinc-200/60 rounded-3xl p-6 sm:p-10 lg:p-12 shadow-xs">
                <EvidenceAutopsy
                  image={currentCase.image}
                  annotations={currentCase.annotations}
                />
              </div>
            </div>
          )}

          {/* VIEW D: REALITY TIMELINE (Focused Feature View) */}
          {activeTab === 'timeline' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2">
                <button
                  onClick={() => setActiveTab('overview')}
                  className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/90 backdrop-blur-md border border-zinc-200/80 text-xs sm:text-sm font-medium text-zinc-700 hover:text-zinc-950 hover:bg-white transition-all shadow-2xs cursor-pointer group"
                >
                  <ChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5 text-zinc-400 group-hover:text-zinc-700" />
                  <span>Back to overview</span>
                </button>
                <span className="text-xs sm:text-sm font-medium px-4 py-1.5 rounded-full bg-white/90 backdrop-blur-md border border-zinc-200/80 text-zinc-600 shadow-2xs">
                  Reality Timeline
                </span>
              </div>
              <div className="bg-white/80 backdrop-blur-xl border border-zinc-200/60 rounded-3xl p-6 sm:p-10 lg:p-12 shadow-xs">
                <RealityTimeline timeline={currentCase.timeline} />
              </div>
            </div>
          )}

          {/* VIEW E: GRAVITY MAP (Focused Feature View) */}
          {activeTab === 'gravity' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2">
                <button
                  onClick={() => setActiveTab('overview')}
                  className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/90 backdrop-blur-md border border-zinc-200/80 text-xs sm:text-sm font-medium text-zinc-700 hover:text-zinc-950 hover:bg-white transition-all shadow-2xs cursor-pointer group"
                >
                  <ChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5 text-zinc-400 group-hover:text-zinc-700" />
                  <span>Back to overview</span>
                </button>
                <span className="text-xs sm:text-sm font-medium px-4 py-1.5 rounded-full bg-white/90 backdrop-blur-md border border-zinc-200/80 text-zinc-600 shadow-2xs">
                  Evidence Gravity Map
                </span>
              </div>
              <div className="bg-white/80 backdrop-blur-xl border border-zinc-200/60 rounded-3xl p-6 sm:p-10 lg:p-12 shadow-xs">
                <EvidenceGravityMap gravityMap={currentCase.gravityMap} />
              </div>
            </div>
          )}

          {/* VIEW F: COMPETING HYPOTHESES (Focused Feature View) */}
          {activeTab === 'hypotheses' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2">
                <button
                  onClick={() => setActiveTab('overview')}
                  className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/90 backdrop-blur-md border border-zinc-200/80 text-xs sm:text-sm font-medium text-zinc-700 hover:text-zinc-950 hover:bg-white transition-all shadow-2xs cursor-pointer group"
                >
                  <ChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5 text-zinc-400 group-hover:text-zinc-700" />
                  <span>Back to overview</span>
                </button>
                <span className="text-xs sm:text-sm font-medium px-4 py-1.5 rounded-full bg-white/90 backdrop-blur-md border border-zinc-200/80 text-zinc-600 shadow-2xs">
                  Competing Hypotheses
                </span>
              </div>
              <div className="bg-white/80 backdrop-blur-xl border border-zinc-200/60 rounded-3xl p-6 sm:p-10 lg:p-12 shadow-xs">
                <CompetingHypotheses
                  hypotheses={currentCase.competingHypotheses}
                />
              </div>
            </div>
          )}

          {/* VIEW G: UNCERTAINTY ENGINE (Focused Feature View) */}
          {activeTab === 'uncertainty' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2">
                <button
                  onClick={() => setActiveTab('overview')}
                  className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/90 backdrop-blur-md border border-zinc-200/80 text-xs sm:text-sm font-medium text-zinc-700 hover:text-zinc-950 hover:bg-white transition-all shadow-2xs cursor-pointer group"
                >
                  <ChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5 text-zinc-400 group-hover:text-zinc-700" />
                  <span>Back to overview</span>
                </button>
                <span className="text-xs sm:text-sm font-medium px-4 py-1.5 rounded-full bg-white/90 backdrop-blur-md border border-zinc-200/80 text-zinc-600 shadow-2xs">
                  Uncertainty Engine
                </span>
              </div>
              <div className="bg-white/80 backdrop-blur-xl border border-zinc-200/60 rounded-3xl p-6 sm:p-10 lg:p-12 shadow-xs">
                <UncertaintyEngine uncertainty={currentCase.uncertaintyEngine} />
              </div>
            </div>
          )}
        </main>

        {/* 3. Floating Bottom Navigation Dock (Differs completely from the white dashboard!) */}
        <BottomNavbar
          activeTab={activeTab}
          onTabChange={(tabId) => {
            setActiveTab(tabId);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onOpenCaseSelector={() => setCaseModalOpen(true)}
          onOpenUpload={() => setUploadModalOpen(true)}
          onExportDossier={handleExportDossier}
          onBackToLanding={onBackToLanding}
        />

        {/* 4. Investigation Case Switcher Modal */}
        <CaseSwitcherModal
          isOpen={caseModalOpen}
          onClose={() => setCaseModalOpen(false)}
          currentCaseId={currentCase.id}
          onSelectCase={(selectedCase) => {
            setCurrentCase(selectedCase);
          }}
        />

        {/* 5. Ingestion / Upload Modal */}
        <IngestModal
          isOpen={uploadModalOpen}
          onClose={() => setUploadModalOpen(false)}
          onFileUploaded={handleCustomUpload}
          onSelectSampleCase={(sampleCase) => {
            setCurrentCase(sampleCase);
          }}
        />
      </div>
    </div>
  );
}
