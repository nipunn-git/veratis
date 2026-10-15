import React from 'react';
import EvidenceAutopsy from '../../components/dashboard/EvidenceAutopsy';

export default function EvidenceAutopsyWidget({ image, annotations }) {
  if (!image) return null;

  return (
    <div className="w-full">
      <EvidenceAutopsy image={image} annotations={annotations || []} />
    </div>
  );
}
