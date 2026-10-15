import React from 'react';
import CompetingHypotheses from '../../components/dashboard/CompetingHypotheses';

export default function CompetingHypothesesWidget({ hypotheses }) {
  if (!hypotheses) return null;

  return (
    <div className="w-full">
      <CompetingHypotheses hypotheses={hypotheses} />
    </div>
  );
}
