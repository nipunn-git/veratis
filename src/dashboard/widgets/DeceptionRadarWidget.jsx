import React from 'react';
import DeceptionRadar from '../../components/dashboard/DeceptionRadar';

export default function DeceptionRadarWidget({ scores, analysis }) {
  if (!scores || !analysis) return null;

  return (
    <div className="w-full">
      <DeceptionRadar scores={scores} analysis={analysis} />
    </div>
  );
}
