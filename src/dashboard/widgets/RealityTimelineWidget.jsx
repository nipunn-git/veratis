import React from 'react';
import RealityTimeline from '../../components/dashboard/RealityTimeline';

export default function RealityTimelineWidget({ timeline }) {
  if (!timeline) return null;

  return (
    <div className="w-full">
      <RealityTimeline timeline={timeline} />
    </div>
  );
}
