import React from 'react';
import UncertaintyEngine from '../../components/dashboard/UncertaintyEngine';

export default function UncertaintyEngineWidget({ uncertainty }) {
  if (!uncertainty) return null;

  return (
    <div className="w-full">
      <UncertaintyEngine uncertainty={uncertainty} />
    </div>
  );
}
