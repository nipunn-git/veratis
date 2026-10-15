import React from 'react';
import EvidenceAutopsy from '../../components/dashboard/EvidenceAutopsy';

export default function EvidenceAutopsyWidget({ image, annotations }) {
  const specimen = image || '/assets/morphed_diplomat.jpg';

  return (
    <div className="w-full">
      <EvidenceAutopsy image={specimen} annotations={annotations || []} />
    </div>
  );
}
