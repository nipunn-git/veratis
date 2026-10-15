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
        className={`p-10 md:p-14 rounded-3xl border-2 border-dashed transition-all duration-300 flex flex-col items-center justify-center text-center cursor-pointer relative overflow-hidden group ${
          isDragging 
            ? 'border-[#c8f344] bg-[#c8f344]/10 shadow-[0_0_30px_rgba(200,243,68,0.2)]' 
            : 'border-[#223529] bg-[#0c130f] hover:border-[#c8f344]/60 hover:bg-[#101914]'
        }`}
      >
        <input 
          ref={fileInputRef}
          type="file" 
          accept="image/*" 
          onChange={handleFileInputChange}
          className="hidden" 
        />

        <div className="w-16 h-16 rounded-2xl bg-[#16221a] border border-[#263c2e] flex items-center justify-center text-[#c8f344] mb-5 group-hover:scale-110 group-hover:shadow-[0_0_20px_rgba(200,243,68,0.3)] transition-all">
          <Upload className="w-7 h-7" />
        </div>

        <h3 className="text-xl sm:text-2xl font-display font-bold text-[#f5f4ef] mb-2">
          {selectedFile ? selectedFile.name : "DROP SPECIMEN IMAGE OR CLICK TO BROWSE"}
        </h3>

        <p className="text-xs sm:text-sm text-[#788279] font-mono max-w-md mb-4">
          PNG, JPG, TIFF, WEBP // Original uncompressed bitstream will be preserved for Fourier quantization analysis.
        </p>

        {selectedFile && (
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#19271e] text-[#c8f344] font-mono text-xs border border-[#273d2f]">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>IMAGE STAGED // SIZE: {selectedFile.size}</span>
          </div>
        )}
      </div>

      {/* Or Select Instant Sample Case */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-mono text-[#788279] tracking-wider uppercase">
            OR LOAD REAL-WORLD FORENSIC BENCHMARK CASE:
          </span>
          <span className="text-[11px] font-mono text-[#c8f344]">INSTANT LOCAL DATASET</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {INVESTIGATION_CASES.map((c) => (
            <div
              key={c.id}
              onClick={() => onSelectSampleCase(c)}
              className="p-5 rounded-2xl bg-[#0c130f] border border-[#1f2d26] hover:border-[#c8f344] hover:bg-[#111a14] transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#18241e] text-[#c8f344] border border-[#263a2d]">
                    {c.code}
                  </span>
                  <span className="text-[10px] font-mono text-rose-400 font-bold">
                    {c.threatLevel}
                  </span>
                </div>
                <h4 className="text-sm font-display font-bold text-[#f5f4ef] group-hover:text-[#c8f344] transition-colors mb-1 line-clamp-1">
                  {c.title}
                </h4>
                <p className="text-xs text-[#788279] line-clamp-2 leading-relaxed mb-4">
                  {c.subject}
                </p>
              </div>

              <div className="pt-3 border-t border-[#18241e] flex items-center justify-between text-xs font-mono text-[#a4b3a6]">
                <span>CONFIDENCE: {c.verdictConfidence}%</span>
                <span className="text-[#c8f344] group-hover:translate-x-1 transition-transform">LOAD →</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
