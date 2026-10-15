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
import RealityInversion from '../components/dashboard/RealityInversion';

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
        '/assets/morphed_diplomat.jpg',
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
    <div className="h-screen max-h-screen w-screen overflow-hidden text-zinc-900 font-sans selection:bg-zinc-900 selection:text-white relative bg-[#f8fafd] flex flex-col justify-between">
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

      <div className="relative z-10 h-full w-full flex flex-col justify-between overflow-hidden">
        {/* 1. Sleek Top Command Bar with Centered Floating Action Capsule */}
        <TopCommandBar
          currentCase={currentCase}
          onBackToLanding={onBackToLanding}
          onOpenCaseSelector={() => setCaseModalOpen(true)}
          onOpenUpload={() => setUploadModalOpen(true)}
          onExportDossier={handleExportDossier}
        />

        {/* 2. Main Dashboard Content Canvas (Constant Ratio, Only Feature Area Scrollable) */}
        <main className="flex-1 w-full min-h-0 flex flex-col justify-center my-auto overflow-hidden">
          {/* VIEW A: OVERVIEW - The 21st.dev Draggable Widget Grid (6 cards only) */}
          {activeTab === 'overview' && (
            <div className="max-w-[1800px] w-full mx-auto px-4 sm:px-8 lg:px-12 my-auto max-h-[calc(100vh-170px)] overflow-y-auto pb-4">
              <DraggableGrid
                widgets={widgets}
                onReorderWidgets={handleReorderWidgets}
                onResetLayout={handleResetLayout}
                onToggleWidgetVisibility={handleToggleWidgetVisibility}
                currentCase={currentCase}
                onSwitchCase={() => setCaseModalOpen(true)}
                onExportDossier={handleExportDossier}
                onNewUpload={() => setUploadModalOpen(true)}
                onPredictOriginal={() => setActiveTab('reconstruct')}
              />
            </div>
          )}

          {/* FOCUSED FEATURE VIEWS: Attached edge-to-edge to sides, open top/bottom revealing live moving background */}
          {activeTab !== 'overview' && (
            <div className="w-full my-auto max-h-[calc(100vh-160px)] overflow-y-auto bg-white/70 backdrop-blur-md border-y border-zinc-200/60 border-x-0 py-6 sm:py-8 px-6 sm:px-12 lg:px-20 xl:px-28 2xl:px-36 shadow-xs">
              {/* VIEW: REALITY INVERSION (AI Original Prediction & Reconstruction) */}
              {activeTab === 'reconstruct' && (
                <RealityInversion
                  currentCase={currentCase}
                  onIngestNew={() => setUploadModalOpen(true)}
                />
              )}

              {/* VIEW B: DECEPTION RADAR */}
              {activeTab === 'radar' && (
                <DeceptionRadar
                  scores={currentCase.radarScores}
                  analysis={currentCase.radarAnalysis}
                />
              )}

              {/* VIEW C: EVIDENCE AUTOPSY */}
              {activeTab === 'autopsy' && (
                <EvidenceAutopsy
                  image={currentCase.image}
                  annotations={currentCase.annotations}
                  onNavigateTab={setActiveTab}
                />
              )}

              {/* VIEW D: REALITY TIMELINE */}
              {activeTab === 'timeline' && (
                <RealityTimeline timeline={currentCase.timeline} />
              )}

              {/* VIEW E: GRAVITY MAP */}
              {activeTab === 'gravity' && (
                <EvidenceGravityMap gravityMap={currentCase.gravityMap} />
              )}

              {/* VIEW F: COMPETING HYPOTHESES */}
              {activeTab === 'hypotheses' && (
                <CompetingHypotheses
                  hypotheses={currentCase.competingHypotheses}
                />
              )}

              {/* VIEW G: UNCERTAINTY ENGINE */}
              {activeTab === 'uncertainty' && (
                <UncertaintyEngine uncertainty={currentCase.uncertaintyEngine} />
              )}
            </div>
          )}
        </main>

        {/* Bottom Spacer to guarantee moving nebula is always visible behind bottom dock */}
        <div className="shrink-0 h-16 pointer-events-none" />

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
