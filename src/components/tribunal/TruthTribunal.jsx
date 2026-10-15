import React, { useState, useEffect } from 'react';
import { 
  Scale, 
  Sparkles, 
  Search, 
  RotateCcw, 
  Send, 
  CheckCircle2, 
  HelpCircle, 
  Layers, 
  Info,
  Sliders,
  ChevronRight,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';

import { TRIBUNAL_SAMPLES } from '../../data/tribunalSamples';
import { aiService } from '../../services/aiService';
import PersonalityCard from './PersonalityCard';
import ChallengeRoundSection from './ChallengeRoundSection';
import DisagreementMatrix from './DisagreementMatrix';
import AdjudicatorAssessment from './AdjudicatorAssessment';

export default function TruthTribunal({ currentCase }) {
  const [selectedSampleIndex, setSelectedSampleIndex] = useState(0);
  const [claimText, setClaimText] = useState(TRIBUNAL_SAMPLES[0].claim);
  const [evidenceText, setEvidenceText] = useState(TRIBUNAL_SAMPLES[0].evidenceProvided);
  const [contextText, setContextText] = useState(TRIBUNAL_SAMPLES[0].knownContext);
  
  const [isInvestigating, setIsInvestigating] = useState(false);
  const [currentStage, setCurrentStage] = useState('idle'); // 'idle' | 'skeptic' | 'forensic' | 'challenge' | 'synthesis' | 'adjudication' | 'complete'
  const [stageDescription, setStageDescription] = useState('');
  const [tribunalResult, setTribunalResult] = useState(TRIBUNAL_SAMPLES[0]);

  // Handle switching sample case
  const handleSelectSample = (idx) => {
    const s = TRIBUNAL_SAMPLES[idx];
    setSelectedSampleIndex(idx);
    setClaimText(s.claim);
    setEvidenceText(s.evidenceProvided);
    setContextText(s.knownContext);
    setTribunalResult(s);
    setCurrentStage('complete');
  };

  // Run the full 4-stage investigation
  const handleStartInvestigation = async () => {
    if (!claimText.trim()) return;

    setIsInvestigating(true);
    setCurrentStage('skeptic');

    try {
      const result = await aiService.runTribunalInvestigation(
        claimText,
        evidenceText,
        contextText,
        (stageId, desc) => {
          setCurrentStage(stageId);
          setStageDescription(desc);
        }
      );
      setTribunalResult(result);
      setCurrentStage('complete');
    } catch (e) {
      console.error('Tribunal investigation error:', e);
      setCurrentStage('complete');
    } finally {
      setIsInvestigating(false);
    }
  };

  const isLive = aiService.isLiveMode();

  return (
    <div className="space-y-10 font-sans max-w-[1800px] mx-auto">
      {/* Editorial Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-zinc-200/80">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-mono font-bold tracking-widest text-zinc-500 uppercase">
              TRIBUNAL DELIBERATION // MULTI-PERSONALITY REASONING
            </span>
            <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border font-semibold ${
              isLive ? 'bg-emerald-50 text-emerald-800 border-emerald-300' : 'bg-zinc-100 text-zinc-700 border-zinc-200'
            }`}>
              {isLive ? 'LIVE AI ENCLAVE ACTIVE' : 'DETERMINISTIC DEMO MODE'}
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-zinc-950">
            The Truth Tribunal
          </h2>
          <p className="text-base sm:text-lg text-zinc-500 mt-2 max-w-3xl leading-relaxed">
            Three independent analytical agents—<strong className="text-zinc-800 font-semibold">The Skeptic</strong>, <strong className="text-zinc-800 font-semibold">The Forensic Analyst</strong>, and <strong className="text-zinc-800 font-semibold">The Adjudicator</strong>—cross-examine evidence, conduct a challenge round, and deliver a grounded determination without fabricated certainty percentages.
          </p>
        </div>

        {/* Preset Sample Selector Pills */}
        <div className="flex flex-col items-start md:items-end gap-2">
          <span className="text-xs font-mono text-zinc-400 uppercase">PRE-LOADED INVESTIGATIONS</span>
          <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-2xl bg-zinc-100/90 border border-zinc-200/60">
            {TRIBUNAL_SAMPLES.map((s, idx) => (
              <button
                key={s.id}
                onClick={() => handleSelectSample(idx)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  selectedSampleIndex === idx
                    ? 'bg-white text-zinc-950 shadow-xs'
                    : 'text-zinc-600 hover:text-zinc-950'
                }`}
              >
                {s.title.split(' ')[0]} {s.title.split(' ')[1] || ''}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Input Section: Claim & Evidence Ingestion Box */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-zinc-200/80 shadow-xs space-y-6">
        <div className="space-y-4">
          <div>
            <label className="text-xs font-mono font-bold text-zinc-900 uppercase tracking-wider block mb-2">
              1. Suspicious Claim or Leaked Assertion
            </label>
            <textarea
              rows={2}
              value={claimText}
              onChange={(e) => setClaimText(e.target.value)}
              placeholder="Paste suspicious quote, breaking viral claim, or unverified headline..."
              className="w-full p-4 rounded-2xl bg-zinc-50/70 border border-zinc-200 text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-900 font-sans resize-none transition-all"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-mono font-bold text-zinc-700 uppercase tracking-wider block mb-1.5">
                2. Supplied Evidence Description / Bitstream
              </label>
              <input
                type="text"
                value={evidenceText}
                onChange={(e) => setEvidenceText(e.target.value)}
                placeholder="File name, telegram link, duration, camera format, or raw metadata..."
                className="w-full px-4 py-3 rounded-xl bg-zinc-50/70 border border-zinc-200 text-xs sm:text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-900 font-sans"
              />
            </div>
            <div>
              <label className="text-xs font-mono font-bold text-zinc-700 uppercase tracking-wider block mb-1.5">
                3. Known Contextual Telemetry (Optional)
              </label>
              <input
                type="text"
                value={contextText}
                onChange={(e) => setContextText(e.target.value)}
                placeholder="Flight radar, historical archive dates, official calendar schedules..."
                className="w-full px-4 py-3 rounded-xl bg-zinc-50/70 border border-zinc-200 text-xs sm:text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-900 font-sans"
              />
            </div>
          </div>
        </div>

        {/* Action Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-zinc-100">
          <div className="flex items-center gap-2 text-xs text-zinc-500">
            <Info className="w-4 h-4 text-zinc-400 shrink-0" />
            <span>The Tribunal evaluates evidence without fabricating metadata or pretending to scan live internet sources.</span>
          </div>

          <button
            onClick={handleStartInvestigation}
            disabled={isInvestigating || !claimText.trim()}
            className={`px-6 py-3 rounded-2xl font-bold text-xs sm:text-sm tracking-wide transition-all cursor-pointer flex items-center justify-center gap-2 shadow-xs shrink-0 ${
              isInvestigating
                ? 'bg-zinc-200 text-zinc-400 cursor-not-allowed'
                : 'bg-zinc-950 hover:bg-zinc-800 text-white active:scale-[0.99]'
            }`}
          >
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>{isInvestigating ? 'Convening Tribunal...' : 'Convene Truth Tribunal'}</span>
          </button>
        </div>

        {/* Animated Deliberation Progress Stepper */}
        {isInvestigating && (
          <div className="p-4 rounded-2xl bg-zinc-950 text-white space-y-3 animate-fadeIn">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-emerald-400 font-bold uppercase">{stageDescription || "Synthesizing Independent Analyses..."}</span>
              <span className="text-zinc-400">{currentStage.toUpperCase()}</span>
            </div>
            <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-emerald-400 transition-all duration-300 ease-out rounded-full shadow-[0_0_10px_rgba(52,211,153,0.8)]"
                style={{
                  width: currentStage === 'skeptic' ? '25%' 
                       : currentStage === 'forensic' ? '50%'
                       : currentStage === 'challenge' ? '70%'
                       : currentStage === 'synthesis' ? '85%'
                       : currentStage === 'adjudication' ? '95%' : '100%'
                }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Main Deliberation Content */}
      {tribunalResult && (
        <div className="space-y-10">
          {/* 1. Independent Findings Cards Grid (3 Personalities) */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            <PersonalityCard
              type="skeptic"
              data={tribunalResult.skepticAnalysis}
              isEvaluating={isInvestigating && currentStage === 'skeptic'}
            />
            <PersonalityCard
              type="forensic"
              data={tribunalResult.forensicAnalysis}
              isEvaluating={isInvestigating && (currentStage === 'skeptic' || currentStage === 'forensic')}
            />
            <PersonalityCard
              type="adjudicator"
              data={tribunalResult.finalAssessment}
              isEvaluating={isInvestigating}
            />
          </div>

          {/* 2. Challenge Round: Cross-Examination Section */}
          <ChallengeRoundSection challengeRound={tribunalResult.challengeRound} />

          {/* 3. Consensus vs. Disagreement Matrix */}
          <DisagreementMatrix matrix={tribunalResult.agreementDisagreement} />

          {/* 4. Final Adjudication Assessment */}
          <AdjudicatorAssessment assessment={tribunalResult.finalAssessment} />
        </div>
      )}
    </div>
  );
}
