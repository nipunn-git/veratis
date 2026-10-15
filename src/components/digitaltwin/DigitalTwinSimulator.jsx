import React, { useState } from 'react';
import ScenarioSelector from './ScenarioSelector';
import ActiveSimulation from './ActiveSimulation';
import SimulationDebrief from './SimulationDebrief';
import { aiService } from '../../services/aiService';

export default function DigitalTwinSimulator() {
  const [viewState, setViewState] = useState('select'); // 'select' | 'simulate' | 'debrief'
  const [activeScenario, setActiveScenario] = useState(null);
  const [sessionEvaluation, setSessionEvaluation] = useState(null);

  const handleLaunchScenario = (scenario) => {
    setActiveScenario(scenario);
    setViewState('simulate');
  };

  const handleEndSimulation = (messagesHistory) => {
    if (!activeScenario) return;
    const evalResult = aiService.evaluateDigitalTwinSession(activeScenario, messagesHistory);
    setSessionEvaluation(evalResult);
    setViewState('debrief');
  };

  const handleRetry = () => {
    setViewState('simulate');
  };

  const handleBackToScenarios = () => {
    setViewState('select');
    setActiveScenario(null);
    setSessionEvaluation(null);
  };

  return (
    <div className="w-full">
      {viewState === 'select' && (
        <ScenarioSelector onSelectScenario={handleLaunchScenario} />
      )}

      {viewState === 'simulate' && activeScenario && (
        <ActiveSimulation
          scenario={activeScenario}
          onEndSimulation={handleEndSimulation}
          onExit={handleBackToScenarios}
        />
      )}

      {viewState === 'debrief' && activeScenario && sessionEvaluation && (
        <SimulationDebrief
          scenario={activeScenario}
          evaluation={sessionEvaluation}
          onRetry={handleRetry}
          onBackToScenarios={handleBackToScenarios}
        />
      )}
    </div>
  );
}
