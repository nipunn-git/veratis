import React, { useState } from 'react';
import { X, Upload, CheckCircle2, ShieldAlert, Cpu } from 'lucide-react';
import UploadArea from '../../components/dashboard/UploadArea';
import AnalysisProgress from '../../components/dashboard/AnalysisProgress';

export default function IngestModal({
  isOpen,
  onClose,
  onFileUploaded,
  onSelectSampleCase,
}) {
  const [pipelineState, setPipelineState] = useState('idle'); // 'idle' | 'analyzing'
  const [stagedName, setStagedName] = useState('');

  if (!isOpen) return null;

  const handleCustomUpload = (fileInfo) => {
    setStagedName(fileInfo.name || 'Custom Specimen');
    setPipelineState('analyzing');
    setTimeout(() => {
      onFileUploaded(fileInfo);
      setPipelineState('idle');
      onClose();
    }, 3800);
  };

  const handleSample = (sampleCase) => {
    setStagedName(sampleCase.title);
    setPipelineState('analyzing');
    setTimeout(() => {
      onSelectSampleCase(sampleCase);
      setPipelineState('idle');
      onClose();
    }, 2800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-3xl bg-white border border-zinc-200 rounded-3xl p-6 sm:p-8 shadow-2xl relative max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-zinc-200 mb-6 font-sans">
          <div>
            <span className="text-xs text-zinc-500 font-medium">
              Forensic Specimen Ingestion
            </span>
            <h3 className="text-xl font-bold text-zinc-950 mt-0.5">
              Upload Specimen Media
            </h3>
          </div>
          <button
            onClick={() => {
              setPipelineState('idle');
              onClose();
            }}
            className="p-2 rounded-xl bg-zinc-100 border border-zinc-200 text-zinc-600 hover:text-zinc-900 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content based on pipelineState */}
        {pipelineState === 'analyzing' ? (
          <div className="py-8">
            <AnalysisProgress
              caseName={stagedName}
              onComplete={() => {
                setPipelineState('idle');
                onClose();
              }}
            />
          </div>
        ) : (
          <UploadArea
            onFileSelected={handleCustomUpload}
            onSelectSampleCase={handleSample}
          />
        )}
      </div>
    </div>
  );
}
