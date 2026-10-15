import React, { useState } from 'react';
import { 
  Bot, 
  ShieldAlert, 
  ArrowRight, 
  Sliders, 
  CheckCircle2, 
  HelpCircle, 
  Lock, 
  Zap,
  Target
} from 'lucide-react';
import { DIGITAL_TWIN_SCENARIOS } from '../../data/digitalTwinScenarios';

export default function ScenarioSelector({ onSelectScenario }) {
  const [difficultyFilter, setDifficultyFilter] = useState('all');

  const filtered = DIGITAL_TWIN_SCENARIOS.filter((s) => {
    if (difficultyFilter === 'all') return true;
    return s.difficulty === difficultyFilter;
  });

  return (
    <div className="space-y-10 font-sans max-w-[1800px] mx-auto">
      {/* Editorial Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-zinc-200/80">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-mono font-bold tracking-widest text-zinc-500 uppercase">
              PRACTICE SIMULATOR // SPOT SCAMS & FAKES
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-zinc-100 text-zinc-700 border border-zinc-200 font-semibold">
              SAFE TRAINING EXERCISES
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-zinc-950">
            Digital Twin Test
          </h2>
          <p className="text-base sm:text-lg text-zinc-600 mt-2 max-w-3xl leading-relaxed">
            Chat with simulated bots pretending to be friends, coworkers, or family asking for money, passwords, or urgent favors. Practice spotting the red flags before it happens in real life.
          </p>
        </div>

        {/* Difficulty Filter Tabs */}
        <div className="flex flex-col items-start md:items-end gap-2">
          <span className="text-xs font-mono text-zinc-400 uppercase">DIFFICULTY</span>
          <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-zinc-100/90 border border-zinc-200/60 text-xs font-semibold">
            {['all', 'Easy', 'Hard'].map((diff) => (
              <button
                key={diff}
                onClick={() => setDifficultyFilter(diff)}
                className={`px-3.5 py-1.5 rounded-xl transition-all cursor-pointer ${
                  difficultyFilter === diff
                    ? 'bg-white text-zinc-950 shadow-xs'
                    : 'text-zinc-600 hover:text-zinc-950'
                }`}
              >
                {diff === 'all' ? 'All Scenarios' : diff}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Scenario Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
        {filtered.map((scenario) => {
          const isHard = scenario.difficulty === 'Hard';

          return (
            <div
              key={scenario.id}
              className="p-6 sm:p-7 rounded-3xl bg-white border border-zinc-200/80 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between space-y-6 relative group"
            >
              {/* Card Top: Role & Difficulty */}
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-3">
                  <span className={`text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-full border ${
                    isHard
                      ? 'bg-rose-50 text-rose-800 border-rose-200'
                      : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                  }`}>
                    {scenario.difficulty.toUpperCase()}
                  </span>

                  <span className="text-xs font-mono text-zinc-400">
                    {scenario.category}
                  </span>
                </div>

                {/* Character Persona Avatar & Title */}
                <div>
                  <h3 className="text-xl font-bold text-zinc-950 tracking-tight group-hover:text-emerald-700 transition-colors">
                    {scenario.title}
                  </h3>
                  <div className="flex items-center gap-2 text-xs font-medium text-zinc-500 mt-1">
                    <span className="font-semibold text-zinc-900">{scenario.characterName}</span>
                    <span>·</span>
                    <span>{scenario.role}</span>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed">
                  {scenario.setupDescription}
                </p>

                {/* Learning Objective Box */}
                <div className="p-3.5 rounded-2xl bg-zinc-50 border border-zinc-100 text-xs text-zinc-700 space-y-1">
                  <span className="font-bold text-zinc-900 block flex items-center gap-1.5">
                    <Target className="w-3.5 h-3.5 text-zinc-500" />
                    <span>Learning Objective:</span>
                  </span>
                  <p className="text-zinc-600 leading-relaxed pl-5">
                    {scenario.learningObjective}
                  </p>
                </div>
              </div>

              {/* Start Simulation Action */}
              <button
                onClick={() => onSelectScenario(scenario)}
                className="w-full py-3 px-4 rounded-2xl bg-zinc-950 hover:bg-zinc-800 text-white font-bold text-xs tracking-wide transition-all cursor-pointer flex items-center justify-center gap-2 group-hover:bg-emerald-600 shadow-xs"
              >
                <span>Start Practice Chat</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
