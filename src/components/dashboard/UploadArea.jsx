import React, { useState, useRef } from 'react';
import { Upload, FileImage, Sparkles, AlertCircle, ArrowRight, CheckCircle2 } from 'lucide-react';
import { INVESTIGATION_CASES } from '../../data/mockInvestigations';

export default function UploadArea({ onFileSelected, onSelectSampleCase }) {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      processFile(files[0]);
    }
  };

  const handleFileInputChange = (e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      processFile(files[0]);
    }
  };

  const processFile = (file) => {
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file (PNG, JPG, WEBP, or TIFF).');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      setSelectedFile({
        name: file.name,
        size: (file.size / (1024 * 1024)).toFixed(2) + ' MB',
        type: file.type,
        dataUrl: e.target.result
      });
      // Pass custom upload file up
      onFileSelected({
        name: file.name,
        size: (file.size / (1024 * 1024)).toFixed(2) + ' MB',
        dataUrl: e.target.result
      });
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-8">
      {/* Upload Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`p-10 md:p-12 rounded-3xl border-2 border-dashed transition-all duration-200 flex flex-col items-center justify-center text-center cursor-pointer relative overflow-hidden group ${
          isDragging 
            ? 'border-zinc-900 bg-zinc-100 shadow-md' 
            : 'border-zinc-300/80 bg-zinc-50/70 hover:border-zinc-900 hover:bg-zinc-100/60'
        }`}
      >
        <input 
          ref={fileInputRef}
          type="file" 
          accept="image/*" 
          onChange={handleFileInputChange}
          className="hidden" 
        />

        <div className="w-14 h-14 rounded-2xl bg-white border border-zinc-200 shadow-xs flex items-center justify-center text-zinc-900 mb-4 group-hover:scale-105 transition-transform">
          <Upload className="w-6 h-6 text-zinc-700" />
        </div>

        <h3 className="text-lg sm:text-xl font-semibold text-zinc-950 mb-1">
          {selectedFile ? selectedFile.name : "Drop specimen media or click to browse"}
        </h3>

        <p className="text-xs sm:text-sm text-zinc-500 max-w-md mb-3">
          PNG, JPG, TIFF, WEBP. Neural latent de-morphing and authenticity verification will run automatically.
        </p>

        {selectedFile && (
          <div className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-700">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Specimen staged · {selectedFile.size}</span>
          </div>
        )}
      </div>

      {/* Or Select Instant Sample Case */}
      <div>
        <div className="flex items-center justify-between mb-3 text-xs">
          <span className="font-semibold text-zinc-700">
            Or select benchmark forensic case:
          </span>
          <span className="text-zinc-400">Pre-loaded specimens</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
          {INVESTIGATION_CASES.map((c) => (
            <div
              key={c.id}
              onClick={() => onSelectSampleCase(c)}
              className="p-4 rounded-2xl bg-white border border-zinc-200/70 hover:border-zinc-400 hover:shadow-xs transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono text-zinc-400 font-medium">
                    {c.code}
                  </span>
                  <span className="text-[11px] font-semibold text-rose-600">
                    {c.threatLevel}
                  </span>
                </div>
                <h4 className="text-xs sm:text-sm font-semibold text-zinc-950 group-hover:text-emerald-700 transition-colors mb-1 line-clamp-1">
                  {c.title}
                </h4>
                <p className="text-xs text-zinc-500 line-clamp-2 leading-relaxed mb-3">
                  {c.subject}
                </p>
              </div>

              <div className="pt-2.5 border-t border-zinc-100 flex items-center justify-between text-xs text-zinc-600">
                <span>Confidence: {c.verdictConfidence}%</span>
                <span className="font-medium text-zinc-900 group-hover:translate-x-0.5 transition-transform">Load →</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
