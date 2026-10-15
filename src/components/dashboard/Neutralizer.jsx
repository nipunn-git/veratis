import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, 
  RotateCcw, 
  Copy, 
  Check, 
  Edit3, 
  Eye, 
  GitCompare, 
  Info, 
  AlertTriangle, 
  CheckCircle2, 
  HelpCircle, 
  Layers, 
  ChevronDown, 
  ChevronUp, 
  Share2, 
  SlidersHorizontal, 
  FileText, 
  Search, 
  X, 
  ArrowRight,
  ShieldCheck,
  ShieldAlert,
  Zap
} from 'lucide-react';

import { 
  ANALYSIS_MODES, 
  FRAMING_CATEGORIES, 
  SAMPLE_CASES, 
  analyzeContentHeuristic, 
  computeSimpleDiff 
} from '../../utils/neutralizerEngine';

export default function Neutralizer({ onBackToOverview }) {
  // Input states
  const [inputText, setInputText] = useState(SAMPLE_CASES[0].original);
  const [selectedMode, setSelectedMode] = useState('all');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(() => analyzeContentHeuristic(SAMPLE_CASES[0].original, 'all'));

  // Interactive selection states
  const [selectedSignal, setSelectedSignal] = useState(() => analysisResult?.framingSignals?.[0] || null);
  const [comparisonView, setComparisonView] = useState('split'); // 'split' | 'diff'
  const [isEditingNeutralized, setIsEditingNeutralized] = useState(false);
  const [editedNeutralizedText, setEditedNeutralizedText] = useState(() => analysisResult?.neutralized || '');

  // Three-layer accordion states
  const [expandedLayer, setExpandedLayer] = useState('claim'); // 'claim' | 'evidence' | 'framing' | 'all'

  // Clipboard copy feedback states
  const [copiedOriginal, setCopiedOriginal] = useState(false);
  const [copiedNeutralized, setCopiedNeutralized] = useState(false);
  const [copiedEdited, setCopiedEdited] = useState(false);

  const inputRef = useRef(null);
  const MAX_CHARS = 2000;

  // Sync edited text whenever a new analysis completes
  useEffect(() => {
    if (analysisResult?.neutralized) {
      setEditedNeutralizedText(analysisResult.neutralized);
      setSelectedSignal(analysisResult.framingSignals?.[0] || null);
    }
  }, [analysisResult]);

  // Execute Analysis
  const handleAnalyze = (textToAnalyze = inputText, modeToUse = selectedMode) => {
    if (!textToAnalyze || !textToAnalyze.trim()) return;

    setIsAnalyzing(true);
    // Short realistic forensic evaluation delay (400ms) for smooth UX feedback
    setTimeout(() => {
      const result = analyzeContentHeuristic(textToAnalyze, modeToUse);
      setAnalysisResult(result);
      setIsEditingNeutralized(false);
      setIsAnalyzing(false);
    }, 420);
  };

  // Select Sample Preset Case
  const handleSelectSample = (sampleCase) => {
    setInputText(sampleCase.original);
    setSelectedMode(sampleCase.mode);
    handleAnalyze(sampleCase.original, sampleCase.mode);
  };

  // Clear Input
  const handleClear = () => {
    setInputText('');
    setAnalysisResult(null);
    setSelectedSignal(null);
    setIsEditingNeutralized(false);
    setEditedNeutralizedText('');
    inputRef.current?.focus();
  };

  // Reset to default sample
  const handleReset = () => {
    handleSelectSample(SAMPLE_CASES[0]);
  };

  // Clipboard Copy Handlers with timer
  const handleCopyOriginal = () => {
    if (!analysisResult?.original) return;
    navigator.clipboard.writeText(analysisResult.original);
    setCopiedOriginal(true);
    setTimeout(() => setCopiedOriginal(false), 2000);
  };

  const handleCopyNeutralized = () => {
    if (!analysisResult?.neutralized) return;
    navigator.clipboard.writeText(analysisResult.neutralized);
    setCopiedNeutralized(true);
    setTimeout(() => setCopiedNeutralized(false), 2000);
  };

  const handleCopyEdited = () => {
    if (!editedNeutralizedText) return;
    navigator.clipboard.writeText(editedNeutralizedText);
    setCopiedEdited(true);
    setTimeout(() => setCopiedEdited(false), 2000);
  };

  // Handle Ctrl+Enter shortcut in textarea
  const handleKeyDown = (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      handleAnalyze();
    }
  };

  // Render highlighted original text with interactive click listeners
  const renderInteractiveOriginalText = () => {
    if (!analysisResult) return null;
    const text = analysisResult.original;
    const signals = analysisResult.framingSignals || [];

    if (signals.length === 0) {
      return <p className="text-sm sm:text-base text-zinc-700 leading-relaxed font-sans">{text}</p>;
    }

    // Identify signal intervals in the text
    const markers = [];
    signals.forEach((signal, idx) => {
      const regex = new RegExp(escapeRegExp(signal.phrase), 'gi');
      let match;
      while ((match = regex.exec(text)) !== null) {
        markers.push({
          start: match.index,
          end: match.index + match[0].length,
          phrase: match[0],
          signal,
          idx,
        });
      }
    });

    // Sort markers by position
    markers.sort((a, b) => a.start - b.start);

    // Merge/filter overlaps
    const nonOverlapping = [];
    let lastEnd = 0;
    markers.forEach((m) => {
      if (m.start >= lastEnd) {
        nonOverlapping.push(m);
        lastEnd = m.end;
      }
    });

    // Build segments
    const parts = [];
    let cur = 0;
    nonOverlapping.forEach((m, i) => {
      if (m.start > cur) {
        parts.push({
          type: 'plain',
          text: text.slice(cur, m.start),
          key: `plain-${cur}`,
        });
      }

      parts.push({
        type: 'highlight',
        text: text.slice(m.start, m.end),
        signal: m.signal,
        key: `hl-${m.start}-${i}`,
      });
      cur = m.end;
    });

    if (cur < text.length) {
      parts.push({
        type: 'plain',
        text: text.slice(cur),
        key: `plain-${cur}`,
      });
    }

    return (
      <div className="text-sm sm:text-base text-zinc-800 leading-relaxed font-sans selection:bg-amber-100">
        {parts.map((part) => {
          if (part.type === 'plain') {
            return <span key={part.key}>{part.text}</span>;
          }

          const isSelected = selectedSignal?.phrase?.toLowerCase() === part.signal.phrase.toLowerCase();
          const cat = Object.values(FRAMING_CATEGORIES).find(c => c.name === part.signal.category) || FRAMING_CATEGORIES.EMOTIONAL;

          return (
            <button
              key={part.key}
              onClick={() => setSelectedSignal(part.signal)}
              className={`inline cursor-pointer text-left transition-all px-1 py-0.5 mx-0.5 rounded font-medium ${
                isSelected
                  ? 'bg-zinc-900 text-white shadow-xs ring-2 ring-zinc-900/20'
                  : `${cat.highlightClass} hover:opacity-80`
              }`}
              title={`Click to inspect: ${part.signal.category}`}
            >
              {part.text}
            </button>
          );
        })}
      </div>
    );
  };

  return (
    <div className="space-y-8 font-sans max-w-7xl mx-auto">
      {/* 1. Header Bar: Ultra-Minimal Editorial Design */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-zinc-200/80">
        <div>
          <div className="mb-1.5">
            <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
              Linguistic Forensic Reconstruction
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-950">
            Neutralizer
          </h1>

          <p className="text-sm text-zinc-500 mt-1 max-w-xl">
            Transforms sensationalized messaging into epistemically honest wording.
          </p>
        </div>

        {/* Top Actions */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={handleReset}
            className="px-3.5 py-1.5 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-700 text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Reset to default case"
          >
            <RotateCcw className="w-3.5 h-3.5 text-zinc-500" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* 2. Input Panel: Large Area, Mode Selector, Sample Pills, Clear & Analyze */}
      <div className="p-5 sm:p-7 rounded-3xl bg-white/90 backdrop-blur-xl border border-zinc-200/70 shadow-xs space-y-5">
        {/* Top Controls: Analysis Mode Tabs & Sample Cases */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Analysis Modes */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-xs font-semibold text-zinc-400 mr-1 uppercase tracking-wider">Mode:</span>
            {ANALYSIS_MODES.map((mode) => (
              <button
                key={mode.id}
                onClick={() => {
                  setSelectedMode(mode.id);
                  if (inputText.trim()) handleAnalyze(inputText, mode.id);
                }}
                className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-medium transition-all cursor-pointer ${
                  selectedMode === mode.id
                    ? 'bg-zinc-900 text-white shadow-xs'
                    : 'bg-zinc-100/90 text-zinc-600 hover:text-zinc-950 hover:bg-zinc-200/80'
                }`}
                title={mode.description}
              >
                {mode.label}
              </button>
            ))}
          </div>

          {/* Clickable Preset Examples */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            <span className="font-medium text-zinc-400 mr-0.5">Sample specimen:</span>
            {SAMPLE_CASES.map((sample) => (
              <button
                key={sample.id}
                onClick={() => handleSelectSample(sample)}
                className={`px-2.5 py-1 rounded-lg border text-xs font-medium transition-colors cursor-pointer ${
                  inputText === sample.original
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                    : 'bg-white border-zinc-200/80 text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900'
                }`}
              >
                {sample.pillLabel || sample.title}
              </button>
            ))}
          </div>
        </div>

        {/* Large Text Area */}
        <div className="relative">
          <textarea
            ref={inputRef}
            value={inputText}
            onChange={(e) => {
              if (e.target.value.length <= MAX_CHARS) {
                setInputText(e.target.value);
              }
            }}
            onKeyDown={handleKeyDown}
            placeholder="Paste sensationalized headline, suspicious forwarded claim, viral post, or rumor excerpt here..."
            rows={4}
            className="w-full p-4 rounded-2xl bg-zinc-50/70 border border-zinc-200 text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:bg-white text-sm sm:text-base leading-relaxed transition-all resize-y min-h-[110px]"
          />

          {/* Action Row inside Input Card */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <div className="flex items-center gap-3 text-xs text-zinc-500">
              <span className={`tabular-nums ${inputText.length > MAX_CHARS * 0.9 ? 'text-rose-600 font-semibold' : ''}`}>
                {inputText.length} / {MAX_CHARS} characters
              </span>
              <span className="text-zinc-300">·</span>
              <span className="hidden sm:inline text-zinc-400">
                Press <kbd className="px-1.5 py-0.5 rounded bg-zinc-100 border border-zinc-200 text-zinc-600 font-mono text-[11px]">Ctrl</kbd> + <kbd className="px-1.5 py-0.5 rounded bg-zinc-100 border border-zinc-200 text-zinc-600 font-mono text-[11px]">Enter</kbd> to analyze
              </span>
            </div>

            <div className="flex items-center gap-2">
              {inputText && (
                <button
                  onClick={handleClear}
                  className="px-3 py-1.5 rounded-xl border border-zinc-200 hover:bg-zinc-100 text-zinc-600 text-xs font-medium transition-colors cursor-pointer"
                >
                  Clear
                </button>
              )}

              <button
                onClick={() => handleAnalyze()}
                disabled={!inputText.trim() || isAnalyzing}
                className="px-4 py-2 rounded-xl bg-zinc-950 hover:bg-black text-white text-xs sm:text-sm font-medium flex items-center gap-2 transition-all cursor-pointer shadow-xs disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isAnalyzing ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Analyzing Framing...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-emerald-400" />
                    <span>Analyze Content</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Empty & Guidance State */}
      {!analysisResult && (
        <div className="p-12 text-center rounded-3xl bg-white/70 border border-zinc-200/60 space-y-3">
          <FileText className="w-8 h-8 text-zinc-400 mx-auto" />
          <h3 className="text-lg font-semibold text-zinc-900">Awaiting Specimen Content</h3>
          <p className="text-xs sm:text-sm text-zinc-500 max-w-md mx-auto">
            Paste any headline, forwarded messaging chain, or social claim above, or pick one of the sample cases to test framing de-escalation.
          </p>
        </div>
      )}

      {/* 4. Active Analysis Results Canvas */}
      {analysisResult && (
        <div className="space-y-8 animate-fadeIn">
          
          {/* Minimal Principle Line */}
          <div className="py-2.5 px-4 rounded-2xl bg-zinc-50/80 border border-zinc-200/70 flex items-center gap-2.5 text-xs text-zinc-500">
            <Info className="w-4 h-4 text-zinc-400 shrink-0" />
            <span>Neutral wording removes manipulative framing while strictly preserving factual uncertainty.</span>
          </div>

          {/* Side-by-Side Comparison Grid (Desktop: 2 columns, Mobile: 1 column) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
            
            {/* LEFT COLUMN: Original Content + Interactive Framing Markers */}
            <div className="rounded-3xl bg-white border border-zinc-200/80 shadow-xs p-6 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-zinc-900 tracking-wider uppercase">
                    Original Input
                  </span>
                  <span className="text-zinc-300">·</span>
                  <span className="text-xs text-zinc-400 font-medium">
                    {analysisResult.framingSignals?.length || 0} signals flagged
                  </span>
                </div>

                <button
                  onClick={handleCopyOriginal}
                  className="px-2.5 py-1 rounded-lg hover:bg-zinc-100 text-zinc-600 text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
                  title="Copy original text"
                >
                  {copiedOriginal ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-700">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-zinc-400" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>

              {/* Text display with interactive clickable highlights */}
              <div className="p-4 rounded-2xl bg-zinc-50/80 border border-zinc-200/60 min-h-[140px]">
                {renderInteractiveOriginalText()}
              </div>

              {/* Framing Category Badges Strip */}
              {analysisResult.framingSignals?.length > 0 && (
                <div className="space-y-2 pt-2">
                  <div className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
                    Detected framing categories (click to inspect):
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {analysisResult.framingSignals.map((signal, sIdx) => {
                      const isSelected = selectedSignal?.phrase === signal.phrase;
                      const cat = Object.values(FRAMING_CATEGORIES).find(c => c.name === signal.category) || FRAMING_CATEGORIES.EMOTIONAL;

                      return (
                        <button
                          key={sIdx}
                          onClick={() => setSelectedSignal(signal)}
                          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer border ${
                            isSelected
                              ? 'bg-zinc-900 text-white border-zinc-900 shadow-2xs'
                              : `${cat.bgClass} hover:opacity-90`
                          }`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-emerald-400' : cat.dotClass}`} />
                          <span className="font-semibold">{signal.phrase}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Interactive Signal Inspector Drawer */}
              {selectedSignal && (
                <div className="mt-4 p-4 rounded-2xl bg-zinc-50 border border-zinc-200 text-xs space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-zinc-900 uppercase tracking-wide text-[11px]">
                      Signal Inspector
                    </span>
                    <span className="text-xs font-semibold text-zinc-600">
                      {selectedSignal.category}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <div className="text-zinc-500 text-[11px]">Flagged Phrase:</div>
                    <div className="font-medium text-zinc-950 font-mono bg-white px-2.5 py-1 rounded-lg border border-zinc-200/80">
                      "{selectedSignal.phrase}"
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="text-zinc-500 text-[11px]">Forensic Explanation:</div>
                    <p className="text-zinc-700 leading-relaxed">
                      {selectedSignal.explanation}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-zinc-200/60 flex items-center justify-between">
                    <span className="text-zinc-500 text-[11px]">Proposed Neutral Alternative:</span>
                    <span className="font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                      {selectedSignal.alternative}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* RIGHT COLUMN: Neutralized Result & Comparison */}
            <div className="rounded-3xl bg-white border border-zinc-200/80 shadow-xs p-6 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-zinc-100">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-zinc-900 tracking-wider uppercase">
                    Neutralized Reconstruction
                  </span>
                </div>

                {/* Switcher & Actions */}
                <div className="flex items-center gap-1.5">
                  <div className="flex items-center p-0.5 rounded-xl bg-zinc-100 border border-zinc-200/80 text-xs">
                    <button
                      onClick={() => { setComparisonView('split'); setIsEditingNeutralized(false); }}
                      className={`px-2.5 py-1 rounded-lg font-medium transition-all cursor-pointer flex items-center gap-1 ${
                        comparisonView === 'split' && !isEditingNeutralized
                          ? 'bg-white text-zinc-950 shadow-2xs'
                          : 'text-zinc-500 hover:text-zinc-900'
                      }`}
                    >
                      <Eye className="w-3 h-3" />
                      <span>Text</span>
                    </button>
                    <button
                      onClick={() => { setComparisonView('diff'); setIsEditingNeutralized(false); }}
                      className={`px-2.5 py-1 rounded-lg font-medium transition-all cursor-pointer flex items-center gap-1 ${
                        comparisonView === 'diff' && !isEditingNeutralized
                          ? 'bg-white text-zinc-950 shadow-2xs'
                          : 'text-zinc-500 hover:text-zinc-900'
                      }`}
                    >
                      <GitCompare className="w-3 h-3" />
                      <span>Diff</span>
                    </button>
                    <button
                      onClick={() => setIsEditingNeutralized(!isEditingNeutralized)}
                      className={`px-2.5 py-1 rounded-lg font-medium transition-all cursor-pointer flex items-center gap-1 ${
                        isEditingNeutralized
                          ? 'bg-zinc-900 text-white shadow-2xs'
                          : 'text-zinc-500 hover:text-zinc-900'
                      }`}
                    >
                      <Edit3 className="w-3 h-3" />
                      <span>Edit</span>
                    </button>
                  </div>

                  <button
                    onClick={isEditingNeutralized ? handleCopyEdited : handleCopyNeutralized}
                    className="px-2.5 py-1 rounded-lg bg-zinc-900 hover:bg-black text-white text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
                    title="Copy neutralized text"
                  >
                    {(isEditingNeutralized ? copiedEdited : copiedNeutralized) ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-zinc-400" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Main Content Area: Diff, Normal Text, or Edit Mode */}
              <div className="p-4 rounded-2xl bg-zinc-50/80 border border-zinc-200/60 min-h-[140px] flex flex-col justify-between">
                {isEditingNeutralized ? (
                  /* Editable Textarea Mode */
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs text-zinc-500">
                      <span className="font-semibold text-zinc-800">Directly edit neutralized version:</span>
                      <span>{editedNeutralizedText.length} chars</span>
                    </div>
                    <textarea
                      value={editedNeutralizedText}
                      onChange={(e) => setEditedNeutralizedText(e.target.value)}
                      rows={5}
                      className="w-full p-3 rounded-xl bg-white border border-zinc-300 text-zinc-900 text-sm sm:text-base leading-relaxed focus:outline-none focus:ring-2 focus:ring-zinc-900"
                    />
                    <div className="flex justify-end gap-2 pt-1">
                      <button
                        onClick={() => setEditedNeutralizedText(analysisResult.neutralized)}
                        className="px-2.5 py-1 rounded-lg text-zinc-500 hover:text-zinc-900 text-xs font-medium cursor-pointer"
                      >
                        Reset edits
                      </button>
                      <button
                        onClick={handleCopyEdited}
                        className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium flex items-center gap-1 cursor-pointer shadow-2xs"
                      >
                        <Check className="w-3 h-3" />
                        <span>Copy Edited Version</span>
                      </button>
                    </div>
                  </div>
                ) : comparisonView === 'diff' ? (
                  /* Inline Diff Highlight Mode */
                  <div className="space-y-3">
                    <div className="text-[11px] text-zinc-400 font-semibold uppercase tracking-wider flex items-center gap-4">
                      <span className="flex items-center gap-1">
                        <span className="w-2.5 h-2.5 rounded bg-rose-200 inline-block" />
                        <span>Removed phrasing</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="w-2.5 h-2.5 rounded bg-emerald-200 inline-block" />
                        <span>Neutralized additions</span>
                      </span>
                    </div>
                    <div className="text-sm sm:text-base leading-relaxed font-sans text-zinc-800 pt-1">
                      {(analysisResult.diffChunks || computeSimpleDiff(analysisResult.original, analysisResult.neutralized)).map((chunk, cIdx) => {
                        if (chunk.type === 'same') {
                          return <span key={cIdx}>{chunk.text}</span>;
                        }
                        if (chunk.type === 'removed') {
                          return (
                            <span
                              key={cIdx}
                              className="bg-rose-100/90 text-rose-900 line-through mx-0.5 px-1 py-0.5 rounded text-xs sm:text-sm font-medium"
                            >
                              {chunk.text}
                            </span>
                          );
                        }
                        return (
                          <span
                            key={cIdx}
                            className="bg-emerald-100 text-emerald-900 mx-0.5 px-1 py-0.5 rounded font-medium"
                          >
                            {chunk.text}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  /* Normal Clean Neutralized Text */
                  <div className="space-y-3">
                    <p className="text-sm sm:text-base text-zinc-900 leading-relaxed font-sans font-normal">
                      {editedNeutralizedText || analysisResult.neutralized}
                    </p>
                  </div>
                )}

                {/* Sub-card Epistemic Qualifier */}
                <div className="mt-4 pt-3 border-t border-zinc-200/60 flex items-center justify-between text-xs text-zinc-500">
                  <span className="flex items-center gap-1 text-emerald-700 font-medium">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Uncertainty & Meaning Preserved</span>
                  </span>
                  <button
                    onClick={() => handleAnalyze()}
                    className="text-xs text-zinc-600 hover:text-zinc-900 font-medium flex items-center gap-1 cursor-pointer"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Reanalyze</span>
                  </button>
                </div>
              </div>

              {/* Summary of What Changed & Why */}
              <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200/70 space-y-2">
                <div className="text-xs font-semibold text-zinc-900 uppercase tracking-wide">
                  Forensic Transformation Log:
                </div>
                <ul className="space-y-1.5 text-xs text-zinc-600">
                  {analysisResult.changesExplanation?.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* 5. Three-Layer Analysis: CLAIM, EVIDENCE, FRAMING */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                  Tri-Partite Epistemic Breakdown
                </span>
                <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-950 mt-0.5">
                  Three-Layer Analysis
                </h3>
              </div>

              <div className="flex items-center gap-1 text-xs">
                <button
                  onClick={() => setExpandedLayer('all')}
                  className="px-2.5 py-1 rounded-lg text-zinc-600 hover:bg-zinc-100 font-medium cursor-pointer"
                >
                  Expand all
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              
              {/* LAYER 1: CLAIM */}
              <div className="rounded-2xl bg-white border border-zinc-200/80 p-5 shadow-xs space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-zinc-100">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-zinc-900" />
                    <span className="text-xs font-bold text-zinc-950 tracking-wider">
                      LAYER 1: CLAIM
                    </span>
                  </div>
                  <span className="text-[11px] font-medium text-zinc-400">Assertion</span>
                </div>

                <div className="text-xs font-semibold text-zinc-900">
                  What is the content actually asserting?
                </div>

                <p className="text-xs sm:text-sm text-zinc-700 leading-relaxed bg-zinc-50 p-3 rounded-xl border border-zinc-200/50">
                  {analysisResult.threeLayerAnalysis?.claim?.summary}
                </p>

                <ul className="space-y-1.5 text-xs text-zinc-500 pt-1">
                  {analysisResult.threeLayerAnalysis?.claim?.details?.map((d, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="w-1 h-1 rounded-full bg-zinc-400 mt-1.5 shrink-0" />
                      <span>{d}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* LAYER 2: EVIDENCE */}
              <div className="rounded-2xl bg-white border border-zinc-200/80 p-5 shadow-xs space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-zinc-100">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                    <span className="text-xs font-bold text-zinc-950 tracking-wider">
                      LAYER 2: EVIDENCE
                    </span>
                  </div>
                  <span className="text-sm font-semibold text-amber-700">
                    Audited
                  </span>
                </div>

                <div className="text-xs font-semibold text-zinc-900">
                  What evidence is supplied vs missing?
                </div>

                <div className="space-y-2 text-xs">
                  <div>
                    <span className="font-semibold text-emerald-800 block mb-1">
                      Supplied in text:
                    </span>
                    <ul className="space-y-1 text-zinc-600 bg-emerald-50/50 p-2.5 rounded-xl border border-emerald-100">
                      {analysisResult.threeLayerAnalysis?.evidence?.supplied?.map((sup, sIdx) => (
                        <li key={sIdx} className="flex items-start gap-1.5">
                          <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{sup}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <span className="font-semibold text-rose-800 block mb-1">
                      Missing verification:
                    </span>
                    <ul className="space-y-1 text-zinc-600 bg-rose-50/40 p-2.5 rounded-xl border border-rose-100">
                      {analysisResult.threeLayerAnalysis?.evidence?.missing?.map((mis, mIdx) => (
                        <li key={mIdx} className="flex items-start gap-1.5">
                          <AlertTriangle className="w-3.5 h-3.5 text-rose-500 shrink-0 mt-0.5" />
                          <span>{mis}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* LAYER 3: FRAMING */}
              <div className="rounded-2xl bg-white border border-zinc-200/80 p-5 shadow-xs space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-zinc-100">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
                    <span className="text-xs font-bold text-zinc-950 tracking-wider">
                      LAYER 3: FRAMING
                    </span>
                  </div>
                  <span className="text-sm font-semibold text-indigo-700">
                    Rhetoric
                  </span>
                </div>

                <div className="text-xs font-semibold text-zinc-900">
                  Which language choices influence the reader?
                </div>

                <ul className="space-y-2 text-xs text-zinc-600 pt-1">
                  {analysisResult.threeLayerAnalysis?.framing?.tactics?.map((tactic, tIdx) => (
                    <li key={tIdx} className="p-2.5 rounded-xl bg-zinc-50 border border-zinc-200/60 leading-relaxed">
                      {tactic}
                    </li>
                  ))}
                </ul>
              </div>

            </div>
          </div>

        </div>
      )}
    </div>
  );
}

function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
