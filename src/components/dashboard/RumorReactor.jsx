import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  FastForward, 
  StepForward, 
  ShieldCheck, 
  AlertTriangle, 
  FileText, 
  HelpCircle, 
  Search, 
  Share2, 
  Activity, 
  Info, 
  CheckCircle2, 
  ChevronRight, 
  Sparkles, 
  Sliders, 
  ArrowRight, 
  X,
  ExternalLink,
  Layers,
  Eye,
  MessageSquare,
  AlertCircle
} from 'lucide-react';

import { 
  SCENARIOS, 
  NETWORK_NODES, 
  NETWORK_EDGES, 
  ACCOUNT_ROLES, 
  INTERVENTION_TYPES, 
  generateFictionalScenarioFromClaim 
} from '../../utils/rumorReactorEngine';

export default function RumorReactor({ onBackToOverview }) {
  // Scenario Selection State
  const [selectedScenarioIndex, setSelectedScenarioIndex] = useState(0);
  const [isCustomMode, setIsCustomMode] = useState(false);
  const [customInputClaim, setCustomInputClaim] = useState('');
  
  // Current active scenario object
  const activeScenario = useMemo(() => {
    if (isCustomMode && customInputClaim.trim()) {
      return generateFictionalScenarioFromClaim(customInputClaim);
    }
    return SCENARIOS[selectedScenarioIndex] || SCENARIOS[0];
  }, [selectedScenarioIndex, isCustomMode, customInputClaim]);

  // Simulation execution states
  const [currentStepIndex, setCurrentStepIndex] = useState(0); // 0 = not started
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1); // 0.5 | 1 | 2 | 4
  const [selectedNodeId, setSelectedNodeId] = useState('node-1');

  // Interventions applied map: { [nodeId]: { type, label, appliedAtStep } }
  const [interventions, setInterventions] = useState({});
  const [showSourceModal, setShowSourceModal] = useState(false);
  const [showDebriefModal, setShowDebriefModal] = useState(false);
  const [activeTabMobile, setActiveTabMobile] = useState('network'); // 'network' | 'timeline' for mobile

  const timerRef = useRef(null);
  const timelineEndRef = useRef(null);

  // Total steps in current scenario
  const totalSteps = activeScenario.steps.length;

  // Active steps up to currentStepIndex
  const activeTimelineSteps = useMemo(() => {
    if (currentStepIndex === 0) return [];
    return activeScenario.steps.slice(0, currentStepIndex);
  }, [activeScenario, currentStepIndex]);

  // Nodes currently active in the simulation
  const activeNodeIdsSet = useMemo(() => {
    const set = new Set();
    activeTimelineSteps.forEach(step => {
      set.add(step.activeNodeId);
      if (step.affectedNodeIds) {
        step.affectedNodeIds.forEach(id => set.add(id));
      }
    });
    return set;
  }, [activeTimelineSteps]);

  // Real-time computed internal metrics (derived directly from state)
  const metrics = useMemo(() => {
    const activeCount = activeNodeIdsSet.size;
    const resharesCount = Math.max(0, currentStepIndex - 1);
    
    // Count variants that differ from original
    const alteredCount = activeTimelineSteps.filter(
      s => s.variantType !== 'original' && s.variantType !== 'repost'
    ).length;

    // Count nodes that received correction or context intervention
    const correctedNodeIds = Object.keys(interventions).filter(
      id => interventions[id].type === 'correction' || interventions[id].type === 'context'
    );
    const correctedCount = correctedNodeIds.length;

    // Missing context count
    const missingContextCount = activeTimelineSteps.filter(
      s => s.variantType === 'context_stripped' || s.variantType === 'sensationalized'
    ).length;

    return {
      activeAccounts: activeCount,
      totalAccounts: NETWORK_NODES.length,
      simulatedReshares: resharesCount,
      mutatedVariants: alteredCount,
      reachedByCorrection: correctedCount,
      missingContext: missingContextCount,
    };
  }, [activeNodeIdsSet, currentStepIndex, activeTimelineSteps, interventions]);

  // Step advancement logic
  const handleAdvanceStep = () => {
    setCurrentStepIndex(prev => {
      if (prev < totalSteps) {
        const next = prev + 1;
        // Auto-select latest active node
        const nextStepObj = activeScenario.steps[next - 1];
        if (nextStepObj) {
          setSelectedNodeId(nextStepObj.activeNodeId);
        }
        return next;
      } else {
        setIsPlaying(false);
        setShowDebriefModal(true);
        return prev;
      }
    });
  };

  // Timer loop for auto playback
  useEffect(() => {
    if (isPlaying) {
      const intervalMs = Math.max(500, 2400 / playbackSpeed);
      timerRef.current = setInterval(() => {
        handleAdvanceStep();
      }, intervalMs);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, playbackSpeed, totalSteps]);

  // Start simulation
  const handleStartSimulation = () => {
    if (currentStepIndex === 0) {
      setCurrentStepIndex(1);
      setSelectedNodeId(activeScenario.steps[0].activeNodeId);
    }
    setIsPlaying(true);
  };

  // Pause simulation
  const handlePauseSimulation = () => {
    setIsPlaying(false);
  };

  // Reset simulation
  const handleResetSimulation = () => {
    setIsPlaying(false);
    setCurrentStepIndex(0);
    setInterventions({});
    setSelectedNodeId('node-1');
    setShowDebriefModal(false);
  };

  // Apply an intervention to the currently selected node
  const handleApplyIntervention = (type) => {
    if (type === 'inspect_source') {
      setShowSourceModal(true);
      return;
    }

    const typeObj = INTERVENTION_TYPES.find(t => t.id === type);
    if (!typeObj) return;

    setInterventions(prev => ({
      ...prev,
      [selectedNodeId]: {
        type,
        title: typeObj.title,
        color: typeObj.color,
        appliedAtStep: currentStepIndex || 1,
        timestamp: new Date().toLocaleTimeString(),
      },
    }));
  };

  // Node details for selected node
  const selectedNode = NETWORK_NODES.find(n => n.id === selectedNodeId) || NETWORK_NODES[0];
  const selectedNodePost = activeTimelineSteps.find(s => s.activeNodeId === selectedNodeId);
  const selectedNodeIntervention = interventions[selectedNodeId];

  return (
    <div className="space-y-10 font-sans max-w-[1800px] mx-auto">
      
      {/* 1. Header & Pedagogical Framing - Matches Image 2 */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-zinc-200/80">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-mono font-bold tracking-widest text-zinc-500 uppercase">
              INFORMATION DYNAMICS SIMULATOR // CASCADE NETWORK
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-zinc-100 text-zinc-700 border border-zinc-200 font-semibold">
              VIRAL PROPAGATION
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-zinc-950">
            Rumor Reactor
          </h2>

          <p className="text-base sm:text-lg text-zinc-600 mt-2 max-w-3xl leading-relaxed">
            Simulate network cascade dynamics and test live verification interventions to neutralize viral disinfo.
          </p>
        </div>

        {/* Pedagogical Framing Note */}
        <div className="flex flex-col items-start md:items-end gap-2 shrink-0">
          <span className="text-xs font-mono text-zinc-400 uppercase">PROPAGATION ENGINE</span>
          <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-zinc-100/90 border border-zinc-200/60 text-xs font-semibold">
            <span className="px-3.5 py-1.5 rounded-xl bg-white text-zinc-950 shadow-xs">
              Synthetic Simulation
            </span>
          </div>
        </div>
      </div>

      {/* 2. Scenario Picker & Console Banner */}
      <div className="p-5 sm:p-6 rounded-3xl bg-white/90 backdrop-blur-xl border border-zinc-200/70 shadow-xs space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Scenario Tabs */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-zinc-400 mr-1 uppercase tracking-wider">Scenario:</span>
            {SCENARIOS.map((sc, idx) => (
              <button
                key={sc.id}
                onClick={() => {
                  setSelectedScenarioIndex(idx);
                  setIsCustomMode(false);
                  handleResetSimulation();
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                  !isCustomMode && selectedScenarioIndex === idx
                    ? 'bg-zinc-900 text-white shadow-xs'
                    : 'bg-zinc-100/90 text-zinc-600 hover:text-zinc-950 hover:bg-zinc-200/80'
                }`}
              >
                {sc.title}
              </button>
            ))}

            <button
              onClick={() => {
                setIsCustomMode(true);
                handleResetSimulation();
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer border ${
                isCustomMode
                  ? 'bg-purple-900 text-white border-purple-900 shadow-xs'
                  : 'bg-purple-50 text-purple-800 border-purple-200/80 hover:bg-purple-100'
              }`}
            >
              + Custom Claim
            </button>
          </div>

          {/* Source Dossier Inspection Button */}
          <button
            onClick={() => setShowSourceModal(true)}
            className="px-3 py-1.5 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-700 text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer self-start lg:self-auto"
          >
            <Search className="w-3.5 h-3.5 text-zinc-500" />
            <span>Inspect Scenario Ground Truth</span>
          </button>
        </div>

        {/* Claim Input / Preview */}
        {isCustomMode ? (
          <div className="space-y-2 pt-1">
            <label className="text-xs font-semibold text-zinc-700">Enter custom starting post or claim:</label>
            <textarea
              value={customInputClaim}
              onChange={(e) => setCustomInputClaim(e.target.value)}
              placeholder="e.g. Flight 802 returned to gate for 20 minutes due to low tire pressure indicator check..."
              rows={2}
              className="w-full p-3 rounded-2xl bg-zinc-50 border border-zinc-200 text-zinc-900 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900"
            />
          </div>
        ) : (
          <div className="p-3.5 rounded-2xl bg-zinc-50 border border-zinc-200/70 flex items-start gap-3">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-zinc-900">Baseline Verified Claim:</span>
                <span className="text-[11px] text-zinc-400">· {activeScenario.sourceInfo.origin}</span>
              </div>
              <p className="text-xs sm:text-sm text-zinc-700 mt-0.5 leading-relaxed font-sans italic">
                "{activeScenario.initialClaim}"
              </p>
            </div>
          </div>
        )}
      </div>

      {/* 3. Primary Simulation Controls & Metric HUD */}
      <div className="p-4 sm:p-5 rounded-3xl bg-zinc-950 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        {/* Playback Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {!isPlaying ? (
            <button
              onClick={handleStartSimulation}
              className="px-4 py-2 rounded-xl bg-white hover:bg-zinc-100 text-zinc-950 text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-md"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>{currentStepIndex === 0 ? 'Start Simulation' : 'Resume'}</span>
            </button>
          ) : (
            <button
              onClick={handlePauseSimulation}
              className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-zinc-950 text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-md"
            >
              <Pause className="w-3.5 h-3.5 fill-current" />
              <span>Pause</span>
            </button>
          )}

          <button
            onClick={handleAdvanceStep}
            disabled={currentStepIndex >= totalSteps || isPlaying}
            className="p-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
            title="Advance 1 step"
          >
            <StepForward className="w-4 h-4" />
          </button>

          <button
            onClick={handleResetSimulation}
            className="p-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 transition-colors cursor-pointer"
            title="Reset simulation"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Speed Selector */}
          <div className="flex items-center gap-1 ml-2 pl-3 border-l border-zinc-800 text-xs">
            <span className="text-zinc-400 mr-1 hidden sm:inline">Speed:</span>
            {[0.5, 1, 2, 4].map((spd) => (
              <button
                key={spd}
                onClick={() => setPlaybackSpeed(spd)}
                className={`px-2 py-1 rounded-lg text-xs font-mono font-medium transition-colors cursor-pointer ${
                  playbackSpeed === spd
                    ? 'bg-zinc-700 text-white'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                {spd}x
              </button>
            ))}
          </div>
        </div>

        {/* Step Indicator & HUD */}
        <div className="flex items-center gap-5 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-zinc-400">Simulation Progress:</span>
            <span className="font-mono font-bold text-white bg-zinc-800 px-2.5 py-1 rounded-lg border border-zinc-700">
              Step {currentStepIndex} of {totalSteps}
            </span>
          </div>

          {currentStepIndex > 0 && (
            <button
              onClick={() => setShowDebriefModal(true)}
              className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>View Debrief</span>
            </button>
          )}
        </div>
      </div>

      {/* 4. Real-Time Scenario-Derived Metric Counters */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
        <div className="p-3.5 rounded-2xl bg-white border border-zinc-200/80 shadow-2xs">
          <span className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider block">
            Active Accounts
          </span>
          <div className="text-xl sm:text-2xl font-bold text-zinc-950 mt-0.5 tabular-nums">
            {metrics.activeAccounts} <span className="text-xs text-zinc-400 font-normal">/ {metrics.totalAccounts}</span>
          </div>
          <span className="text-[10px] text-zinc-500 block mt-0.5">Simulated network reach</span>
        </div>

        <div className="p-3.5 rounded-2xl bg-white border border-zinc-200/80 shadow-2xs">
          <span className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider block">
            Simulated Reshares
          </span>
          <div className="text-xl sm:text-2xl font-bold text-zinc-950 mt-0.5 tabular-nums">
            {metrics.simulatedReshares}
          </div>
          <span className="text-[10px] text-zinc-500 block mt-0.5">Propagation hops</span>
        </div>

        <div className="p-3.5 rounded-2xl bg-white border border-zinc-200/80 shadow-2xs">
          <span className="text-[10px] font-semibold text-rose-500 uppercase tracking-wider block">
            Mutated Variants
          </span>
          <div className="text-xl sm:text-2xl font-bold text-rose-700 mt-0.5 tabular-nums">
            {metrics.mutatedVariants}
          </div>
          <span className="text-[10px] text-rose-600 block mt-0.5">Context or scale altered</span>
        </div>

        <div className="p-3.5 rounded-2xl bg-white border border-zinc-200/80 shadow-2xs">
          <span className="text-[10px] font-semibold text-emerald-600 uppercase tracking-wider block">
            Interventions Active
          </span>
          <div className="text-xl sm:text-2xl font-bold text-emerald-700 mt-0.5 tabular-nums">
            {metrics.reachedByCorrection}
          </div>
          <span className="text-[10px] text-emerald-600 block mt-0.5">Corrections / context added</span>
        </div>

        <div className="p-3.5 rounded-2xl bg-white border border-zinc-200/80 shadow-2xs col-span-2 sm:col-span-1">
          <span className="text-[10px] font-semibold text-amber-500 uppercase tracking-wider block">
            Unresolved Claims
          </span>
          <div className="text-xl sm:text-2xl font-bold text-amber-700 mt-0.5 tabular-nums">
            {metrics.missingContext}
          </div>
          <span className="text-[10px] text-amber-600 block mt-0.5">Lacking primary citations</span>
        </div>
      </div>

      {/* Mobile View Toggle */}
      <div className="flex lg:hidden items-center p-1 rounded-xl bg-zinc-100 border border-zinc-200 text-xs">
        <button
          onClick={() => setActiveTabMobile('network')}
          className={`flex-1 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
            activeTabMobile === 'network' ? 'bg-white text-zinc-950 shadow-2xs' : 'text-zinc-600'
          }`}
        >
          Network Map
        </button>
        <button
          onClick={() => setActiveTabMobile('timeline')}
          className={`flex-1 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
            activeTabMobile === 'timeline' ? 'bg-white text-zinc-950 shadow-2xs' : 'text-zinc-600'
          }`}
        >
          Simulated Feed ({activeTimelineSteps.length})
        </button>
      </div>

      {/* 5. Main Canvas: Interactive SVG Network (Left) & Simulated Timeline (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT COLUMN: SVG Network Visualization (7 Cols) */}
        <div className={`lg:col-span-7 rounded-3xl bg-white border border-zinc-200/80 shadow-xs p-5 space-y-4 ${
          activeTabMobile === 'timeline' ? 'hidden lg:block' : 'block'
        }`}>
          <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-purple-600" />
              <span className="text-xs font-bold text-zinc-900 tracking-wider uppercase">
                Simulated Information Flow
              </span>
              <span className="text-zinc-300">·</span>
              <span className="text-xs text-zinc-500 font-medium">
                {activeNodeIdsSet.size} active nodes
              </span>
            </div>

            <div className="flex items-center gap-3 text-xs text-zinc-400">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
                <span>Source</span>
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-rose-500 inline-block" />
                <span>Mutated</span>
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-blue-500 inline-block" />
                <span>Fact-Check</span>
              </span>
            </div>
          </div>

          {/* Native SVG Graph Canvas */}
          <div className="relative w-full aspect-4/3 sm:h-[480px] rounded-2xl bg-zinc-50/70 border border-zinc-200/60 overflow-hidden select-none">
            
            {/* SVG Lines and Animated Propagation Pulses */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 760 520" preserveAspectRatio="xMidYMid meet">
              <defs>
                <linearGradient id="edgeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#10b981" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#f43f5e" stopOpacity="0.4" />
                </linearGradient>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                  <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>

              {/* Network Edges */}
              {NETWORK_EDGES.map((edge, eIdx) => {
                const fromNode = NETWORK_NODES.find(n => n.id === edge.from);
                const toNode = NETWORK_NODES.find(n => n.id === edge.to);
                if (!fromNode || !toNode) return null;

                const isEdgeActive = activeNodeIdsSet.has(edge.from) && activeNodeIdsSet.has(edge.to);
                const isSelectedEdge = selectedNodeId === edge.from || selectedNodeId === edge.to;

                return (
                  <g key={eIdx}>
                    <line
                      x1={fromNode.x}
                      y1={fromNode.y}
                      x2={toNode.x}
                      y2={toNode.y}
                      stroke={
                        isSelectedEdge 
                          ? '#18181b' 
                          : isEdgeActive 
                          ? '#8b5cf6' 
                          : '#e4e4e7'
                      }
                      strokeWidth={isSelectedEdge ? 2.5 : isEdgeActive ? 1.8 : 1}
                      strokeDasharray={isEdgeActive ? 'none' : '4 4'}
                      opacity={isEdgeActive ? 0.85 : 0.45}
                      className="transition-all duration-300"
                    />

                    {/* Animated moving pulse when edge is active */}
                    {isEdgeActive && isPlaying && (
                      <circle r="3" fill="#8b5cf6">
                        <animateMotion
                          path={`M ${fromNode.x} ${fromNode.y} L ${toNode.x} ${toNode.y}`}
                          dur={`${2.2 / playbackSpeed}s`}
                          repeatCount="indefinite"
                        />
                      </circle>
                    )}
                  </g>
                );
              })}
            </svg>

            {/* Interactive Fictional Account Nodes */}
            <div className="absolute inset-0 w-full h-full pointer-events-auto">
              {NETWORK_NODES.map((node) => {
                const isActive = activeNodeIdsSet.has(node.id);
                const isSelected = selectedNodeId === node.id;
                const intervention = interventions[node.id];
                
                // Find latest post for this node if active
                const nodeStep = activeTimelineSteps.find(s => s.activeNodeId === node.id);

                // Determine node color badge
                let nodeColorBg = 'bg-white text-zinc-700 border-zinc-200';
                let indicatorColor = 'bg-zinc-300';

                if (node.role === 'SOURCE') {
                  indicatorColor = 'bg-emerald-500';
                } else if (node.role === 'FACT_CHECKER' || node.role === 'CORRECTOR') {
                  indicatorColor = 'bg-blue-500';
                } else if (node.role === 'SENSATIONALIST') {
                  indicatorColor = 'bg-rose-500';
                } else if (node.role === 'CONTEXT_STRIPPER') {
                  indicatorColor = 'bg-amber-500';
                } else if (node.role === 'INFLUENCER') {
                  indicatorColor = 'bg-purple-500';
                }

                if (isActive) {
                  if (nodeStep?.variantType === 'sensationalized') {
                    nodeColorBg = 'bg-rose-50 border-rose-300 text-rose-950 font-medium';
                  } else if (nodeStep?.variantType === 'context_stripped') {
                    nodeColorBg = 'bg-amber-50 border-amber-300 text-amber-950 font-medium';
                  } else if (nodeStep?.variantType === 'fact_check') {
                    nodeColorBg = 'bg-blue-50 border-blue-300 text-blue-950 font-medium';
                  }
                }

                if (intervention) {
                  nodeColorBg = 'bg-emerald-50 border-emerald-400 text-emerald-950 ring-2 ring-emerald-300';
                }

                if (isSelected) {
                  nodeColorBg = 'bg-zinc-950 text-white border-zinc-900 shadow-xl ring-2 ring-zinc-400 scale-110';
                }

                // Map coordinates percentage-wise for responsive SVG bounding
                const leftPct = (node.x / 760) * 100;
                const topPct = (node.y / 520) * 100;

                return (
                  <button
                    key={node.id}
                    onClick={() => setSelectedNodeId(node.id)}
                    style={{ left: `${leftPct}%`, top: `${topPct}%` }}
                    className={`absolute -translate-x-1/2 -translate-y-1/2 px-2.5 py-1.5 rounded-full border shadow-xs transition-all duration-200 cursor-pointer flex items-center gap-1.5 select-none text-[11px] z-10 ${nodeColorBg} ${
                      !isActive ? 'opacity-40 hover:opacity-80' : 'opacity-100'
                    }`}
                    title={`${node.name} (${node.handle}) · Role: ${node.role}`}
                  >
                    <span className={`w-2 h-2 rounded-full shrink-0 ${isSelected ? 'bg-white' : indicatorColor}`} />
                    <span className="font-medium truncate max-w-[85px] sm:max-w-[105px]">
                      {node.name.split(' ')[0]}
                    </span>
                    {intervention && (
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* In-canvas Guidance Overlay when simulation not started */}
            {currentStepIndex === 0 && (
              <div className="absolute inset-0 bg-white/75 backdrop-blur-xs flex flex-col items-center justify-center p-6 text-center z-20">
                <div className="w-10 h-10 rounded-2xl bg-zinc-900 text-white flex items-center justify-center mb-3 shadow-lg">
                  <Play className="w-5 h-5 fill-current ml-0.5" />
                </div>
                <h3 className="text-base font-bold text-zinc-900">Simulation Ready to Launch</h3>
                <p className="text-xs text-zinc-500 max-w-sm mt-1 mb-4 leading-relaxed">
                  Click 'Start Simulation' above to initiate the information cascade and watch the claim evolve through 16 simulated accounts.
                </p>
                <button
                  onClick={handleStartSimulation}
                  className="px-4 py-2 rounded-xl bg-zinc-900 hover:bg-black text-white text-xs font-bold transition-all cursor-pointer shadow-md"
                >
                  Start Simulation
                </button>
              </div>
            )}
          </div>

          {/* Selected Account Inspector & Quick Intervention Console */}
          <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200/80 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-zinc-900 uppercase tracking-wide">
                  Account Inspector: {selectedNode.name}
                </span>
                <span className="text-[11px] font-mono text-zinc-500">{selectedNode.handle}</span>
              </div>

              <span className="text-xs font-semibold text-zinc-600">
                {ACCOUNT_ROLES[selectedNode.role]?.name}
              </span>
            </div>

            {/* Current post or dormant state */}
            {selectedNodePost ? (
              <div className="p-3 rounded-xl bg-white border border-zinc-200 text-xs space-y-1.5">
                <div className="flex items-center justify-between text-[11px] text-zinc-400">
                  <span className="font-semibold text-zinc-700">{selectedNodePost.mutationLabel}</span>
                  <span>{selectedNodePost.timestamp}</span>
                </div>
                <p className="text-zinc-900 font-medium leading-relaxed italic">
                  "{selectedNodePost.content}"
                </p>
                <div className="text-[11px] text-zinc-500 pt-1 border-t border-zinc-100">
                  <strong>Why it matters:</strong> {selectedNodePost.significance}
                </div>
              </div>
            ) : (
              <p className="text-xs text-zinc-400 italic">
                This account has not yet received or shared the claim in the current simulation timeline.
              </p>
            )}

            {/* Active Intervention for this node */}
            {selectedNodeIntervention && (
              <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Intervention Active: <strong>{selectedNodeIntervention.title}</strong></span>
                </div>
                <span className="text-[10px] text-emerald-700">Applied at Step {selectedNodeIntervention.appliedAtStep}</span>
              </div>
            )}

            {/* Action Bar: Intervene in this account */}
            <div className="pt-2 border-t border-zinc-200/60">
              <span className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider block mb-2">
                Deploy Forensic Intervention:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {INTERVENTION_TYPES.map((action) => (
                  <button
                    key={action.id}
                    onClick={() => handleApplyIntervention(action.id)}
                    className={`px-2.5 py-1 rounded-lg border text-xs font-medium transition-all cursor-pointer flex items-center gap-1 shadow-2xs ${action.buttonClass}`}
                  >
                    <span>{action.title}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Chronological Simulated Feed (5 Cols) */}
        <div className={`lg:col-span-5 rounded-3xl bg-white border border-zinc-200/80 shadow-xs p-5 space-y-4 ${
          activeTabMobile === 'network' ? 'hidden lg:block' : 'block'
        }`}>
          <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-purple-600" />
              <span className="text-xs font-bold text-zinc-900 tracking-wider uppercase">
                Simulated Feed
              </span>
              <span className="text-zinc-300">·</span>
              <span className="text-xs text-zinc-500 font-medium">
                {activeTimelineSteps.length} posts
              </span>
            </div>

            {currentStepIndex > 0 && (
              <button
                onClick={() => setShowDebriefModal(true)}
                className="text-xs text-purple-700 hover:text-purple-900 font-semibold cursor-pointer"
              >
                End & Debrief →
              </button>
            )}
          </div>

          {/* Timeline Feed Container */}
          <div className="space-y-3.5 max-h-[580px] overflow-y-auto pr-1">
            {activeTimelineSteps.length === 0 ? (
              <div className="p-8 text-center text-zinc-400 space-y-2">
                <FileText className="w-6 h-6 mx-auto text-zinc-300" />
                <p className="text-xs">No posts generated yet. Start the simulation to begin recording the propagation feed.</p>
              </div>
            ) : (
              activeTimelineSteps.map((item, idx) => {
                const isSelected = selectedNodeId === item.activeNodeId;
                const intervention = interventions[item.activeNodeId];

                // Card badge colors
                let badgeClass = 'bg-zinc-100 text-zinc-700';
                if (item.variantType === 'original') badgeClass = 'bg-emerald-100 text-emerald-800';
                if (item.variantType === 'context_stripped') badgeClass = 'bg-amber-100 text-amber-800';
                if (item.variantType === 'sensationalized') badgeClass = 'bg-rose-100 text-rose-800';
                if (item.variantType === 'fact_check') badgeClass = 'bg-blue-100 text-blue-800';

                return (
                  <div
                    key={idx}
                    onClick={() => setSelectedNodeId(item.activeNodeId)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-2.5 ${
                      isSelected
                        ? 'bg-zinc-50 border-zinc-900 shadow-sm ring-1 ring-zinc-900'
                        : 'bg-white border-zinc-200/80 hover:border-zinc-300 shadow-2xs'
                    }`}
                  >
                    {/* Post Author Bar */}
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="font-semibold text-zinc-900 truncate">{item.actor.name}</span>
                        <span className="text-[11px] text-zinc-400 truncate">{item.actor.handle}</span>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${badgeClass}`}>
                          {item.variantType}
                        </span>
                        <span className="text-[11px] font-mono text-zinc-400">{item.timestamp}</span>
                      </div>
                    </div>

                    {/* Post Content */}
                    <p className="text-xs sm:text-sm text-zinc-900 leading-relaxed font-sans">
                      "{item.content}"
                    </p>

                    {/* Mutation Wording Note */}
                    <div className="p-2.5 rounded-xl bg-zinc-50 border border-zinc-200/60 text-[11px] space-y-1">
                      <div className="font-semibold text-zinc-700">
                        {item.mutationLabel}
                      </div>
                      <p className="text-zinc-600 leading-snug">
                        {item.changeNotes}
                      </p>
                    </div>

                    {/* Intervention Tag if present */}
                    {intervention && (
                      <div className="flex items-center gap-1.5 text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-1 rounded-lg border border-emerald-200/60">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Intervened: {intervention.title}</span>
                      </div>
                    )}
                  </div>
                );
              })
            )}
            <div ref={timelineEndRef} />
          </div>
        </div>
      </div>

      {/* 6. Source Ground Truth Inspection Modal */}
      {showSourceModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-xl w-full bg-white rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl border border-zinc-200 animate-fadeIn">
            <div className="flex items-center justify-between pb-4 border-b border-zinc-100">
              <div className="flex items-center gap-2">
                <Search className="w-5 h-5 text-purple-600" />
                <h3 className="text-xl font-bold text-zinc-950">Scenario Ground Truth Dossier</h3>
              </div>
              <button
                onClick={() => setShowSourceModal(false)}
                className="p-1 rounded-lg hover:bg-zinc-100 text-zinc-400 hover:text-zinc-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs sm:text-sm">
              <div className="p-3.5 rounded-2xl bg-zinc-50 border border-zinc-200/70">
                <span className="font-semibold text-zinc-500 uppercase text-[10px] block mb-1">
                  Originating Source Authority:
                </span>
                <span className="font-bold text-zinc-900 text-sm">{activeScenario.sourceInfo.origin}</span>
                <p className="text-zinc-700 mt-1 italic leading-relaxed">
                  "{activeScenario.initialClaim}"
                </p>
              </div>

              <div className="space-y-2">
                <span className="font-semibold text-emerald-800 uppercase text-[10px] tracking-wider block">
                  Verified Empirical Facts:
                </span>
                <ul className="space-y-1.5 text-zinc-700 bg-emerald-50/60 p-3.5 rounded-2xl border border-emerald-200">
                  {activeScenario.sourceInfo.verifiedFacts.map((fact, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{fact}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-2">
                <span className="font-semibold text-amber-800 uppercase text-[10px] tracking-wider block">
                  Unverified / Open Variables:
                </span>
                <ul className="space-y-1.5 text-zinc-700 bg-amber-50/60 p-3.5 rounded-2xl border border-amber-200">
                  {activeScenario.sourceInfo.missingOrUncertain.map((fact, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <HelpCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                      <span>{fact}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setShowSourceModal(false)}
                className="px-4 py-2 rounded-xl bg-zinc-950 text-white text-xs font-semibold cursor-pointer"
              >
                Close Dossier
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 7. End-of-Simulation Debrief Report Modal */}
      {showDebriefModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-2xl w-full max-h-[90vh] overflow-y-auto bg-white rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl border border-zinc-200 animate-fadeIn">
            <div className="flex items-center justify-between pb-4 border-b border-zinc-100">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-purple-600" />
                <h3 className="text-xl sm:text-2xl font-bold text-zinc-950">Simulation Debrief Report</h3>
              </div>
              <button
                onClick={() => setShowDebriefModal(false)}
                className="p-1 rounded-lg hover:bg-zinc-100 text-zinc-400 hover:text-zinc-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-5 text-xs sm:text-sm">
              
              {/* Contrast: Original vs Final Claim */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-1.5">
                  <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block">
                    1. Original Ground Truth Claim
                  </span>
                  <p className="text-zinc-900 font-medium leading-relaxed italic">
                    "{activeScenario.initialClaim}"
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-rose-50/70 border border-rose-200 space-y-1.5">
                  <span className="text-[10px] font-bold text-rose-800 uppercase tracking-wider block">
                    2. Peak Mutated Narrative
                  </span>
                  <p className="text-zinc-900 font-medium leading-relaxed italic">
                    "{activeTimelineSteps[activeTimelineSteps.length - 1]?.content || activeScenario.steps[activeScenario.steps.length - 1].content}"
                  </p>
                </div>
              </div>

              {/* Point of Divergence Audit */}
              <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200/70 space-y-2">
                <span className="text-xs font-bold text-zinc-900 uppercase tracking-wider block">
                  Critical Divergence Analysis:
                </span>
                <p className="text-zinc-700 leading-relaxed">
                  Context was initially stripped at <strong>Step 3</strong> by <em>{activeScenario.steps[2]?.actor?.name || 'Neighborhood Forum'}</em>, which removed geographical boundaries and operational details. This omission created the factual vacuum subsequently filled by sensationalized amplification.
                </p>
              </div>

              {/* Interventions Applied & Network Response */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-zinc-900 uppercase tracking-wider block">
                  Intervention Effectiveness:
                </span>
                {Object.keys(interventions).length === 0 ? (
                  <p className="text-zinc-500 italic p-3 rounded-xl bg-zinc-50 border border-zinc-200/60">
                    No interventions were applied during this run. The simulation propagated unhindered across all accounts.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {Object.entries(interventions).map(([nodeId, item], idx) => {
                      const nodeObj = NETWORK_NODES.find(n => n.id === nodeId);
                      return (
                        <div key={idx} className="p-3 rounded-xl bg-emerald-50/60 border border-emerald-200 flex items-start gap-2.5">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          <div>
                            <span className="font-semibold text-zinc-900">
                              Applied "{item.title}" on {nodeObj?.name} (@{nodeObj?.handle}):
                            </span>
                            <span className="text-zinc-600 block mt-0.5">
                              Halted unverified mutation downstream and anchored subsequent reshares to verified context.
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Pedagogical Takeaways */}
              <div className="p-4 rounded-2xl bg-purple-50/60 border border-purple-200 space-y-1.5 text-purple-950">
                <span className="text-xs font-bold uppercase tracking-wider block">
                  Pedagogical Takeaway:
                </span>
                <p className="text-xs leading-relaxed text-purple-900">
                  Information distortion rarely requires deliberate malice at the outset. Reposting systems that drop specific conditions (dates, street names, operational teams) naturally cultivate fertile ground for sensational amplification hubs.
                </p>
              </div>
            </div>

            {/* Debrief Actions */}
            <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-zinc-100">
              <button
                onClick={() => {
                  setShowDebriefModal(false);
                  handleResetSimulation();
                  handleStartSimulation();
                }}
                className="px-4 py-2 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-800 text-xs font-semibold cursor-pointer"
              >
                Replay Simulation
              </button>

              <button
                onClick={() => setShowDebriefModal(false)}
                className="px-4 py-2 rounded-xl bg-zinc-950 text-white text-xs font-semibold cursor-pointer"
              >
                Close Debrief
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
