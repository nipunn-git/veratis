import React from 'react';
import EvidenceGravityMap from '../../components/dashboard/EvidenceGravityMap';

export default function GravityMapWidget({ gravityMap }) {
  if (!gravityMap) return null;

  return (
    <div className="w-full">
      <EvidenceGravityMap gravityMap={gravityMap} />
    </div>
  );
}
