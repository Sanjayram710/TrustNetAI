'use client';

import React, { useState, useRef } from 'react';
import { UploadCloud, Image as ImageIcon, X, AlertCircle, Sparkles, Check, FileText } from 'lucide-react';
import { SAMPLE_PRESETS } from '@/lib/constants';

interface DropzoneProps {
  onAnalyze: (file: File, claim?: string) => void;
  isLoading: boolean;
}

export const Dropzone: React.FC<DropzoneProps> = ({ onAnalyze, isLoading }) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [claim, setClaim] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const validateAndSetFile = (file: File) => {
    setErrorMsg(null);
    const validExtensions = ['image/jpeg', 'image/png', 'image/webp', 'image/tiff'];
    if (!validExtensions.includes(file.type)) {
      setErrorMsg('Invalid file type. Please upload a JPG, PNG, or WEBP image.');
      return;
    }

    const maxBytes = 15 * 1024 * 1024;
    if (file.size > maxBytes) {
      setErrorMsg('File exceeds 15 MB limit. Please upload a smaller file.');
      return;
    }

    setSelectedFile(file);
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const clearFile = () => {
    setSelectedFile(null);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    setErrorMsg(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSampleSelect = (preset: typeof SAMPLE_PRESETS[0]) => {
    // Generate a lightweight canvas image for the preset
    const canvas = document.createElement('canvas');
    canvas.width = 600;
    canvas.height = 400;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      // Create a themed test graphic
      const gradient = ctx.createLinearGradient(0, 0, 600, 400);
      if (preset.id === 'sample_camera') {
        gradient.addColorStop(0, '#065f46');
        gradient.addColorStop(1, '#047857');
      } else if (preset.id === 'sample_diffusion') {
        gradient.addColorStop(0, '#881337');
        gradient.addColorStop(1, '#9f1239');
      } else {
        gradient.addColorStop(0, '#78350f');
        gradient.addColorStop(1, '#92400e');
      }
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 600, 400);

      // Add label text
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 24px sans-serif';
      ctx.fillText(preset.title, 40, 180);
      ctx.font = '16px sans-serif';
      ctx.fillText(preset.description, 40, 220);
      ctx.font = '14px monospace';
      ctx.fillText(`TrustNet AI Test Preset: ${preset.id}`, 40, 260);

      canvas.toBlob((blob) => {
        if (blob) {
          const file = new File([blob], `${preset.id}.jpg`, { type: 'image/jpeg' });
          validateAndSetFile(file);
          setClaim(preset.claim);
        }
      }, 'image/jpeg');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      setErrorMsg('Please select or drop an image file to analyze.');
      return;
    }
    onAnalyze(selectedFile, claim);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Drag & Drop Card */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`relative p-8 rounded-2xl border-2 border-dashed transition-all duration-300 ${
          dragActive
            ? 'border-cyan-400 bg-cyan-500/10 scale-[1.01]'
            : selectedFile
            ? 'border-slate-700 bg-slate-900/80'
            : 'border-slate-800 bg-slate-900/40 hover:border-slate-700'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/tiff"
          onChange={handleFileChange}
          className="hidden"
          id="image-file-input"
          disabled={isLoading}
        />

        {!selectedFile ? (
          <div className="flex flex-col items-center justify-center text-center space-y-4 py-8">
            <div className="p-4 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
              <UploadCloud className="w-10 h-10 animate-bounce" />
            </div>
            <div className="space-y-1">
              <div className="text-lg font-semibold text-white">
                Drag &amp; drop an image here, or{' '}
                <label
                  htmlFor="image-file-input"
                  className="text-cyan-400 hover:text-cyan-300 cursor-pointer underline underline-offset-4"
                >
                  browse your device
                </label>
              </div>
              <p className="text-xs text-slate-400">
                Supports JPG, PNG, WEBP, TIFF (Max 15 MB). Strictly sandboxed &amp; encrypted in-memory.
              </p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row items-center gap-6">
            {/* Preview Box */}
            <div className="relative w-40 h-40 rounded-xl overflow-hidden bg-slate-950 border border-slate-800 shrink-0">
              {previewUrl && (
                <img
                  src={previewUrl}
                  alt="Upload preview"
                  className="w-full h-full object-cover"
                />
              )}
              <button
                type="button"
                onClick={clearFile}
                className="absolute top-2 right-2 p-1 rounded-full bg-slate-900/90 text-slate-400 hover:text-white border border-slate-700"
                title="Remove file"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* File Info */}
            <div className="space-y-2 text-left flex-1">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-mono">
                <Check className="w-3.5 h-3.5" />
                File Ready for Forensics
              </div>
              <h4 className="text-base font-bold text-white truncate max-w-sm">
                {selectedFile.name}
              </h4>
              <div className="text-xs text-slate-400 font-mono space-x-3">
                <span>{(selectedFile.size / 1024).toFixed(1)} KB</span>
                <span>&bull;</span>
                <span className="uppercase">{selectedFile.type.replace('image/', '')}</span>
              </div>
              <div className="pt-2">
                <label
                  htmlFor="image-file-input"
                  className="text-xs text-cyan-400 hover:underline cursor-pointer"
                >
                  Replace with different image
                </label>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Error display */}
      {errorMsg && (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-300">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Contextual Claim Input */}
      <div className="space-y-2">
        <label className="flex items-center gap-2 text-xs font-semibold text-slate-300">
          <FileText className="w-3.5 h-3.5 text-cyan-400" />
          Associated Claim or Context (Optional)
        </label>
        <input
          type="text"
          value={claim}
          onChange={(e) => setClaim(e.target.value)}
          placeholder="e.g. Unedited photo of mountain gorilla captured in Volcanoes National Park..."
          className="w-full px-4 py-3 rounded-xl bg-slate-900/80 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
          disabled={isLoading}
        />
        <p className="text-[11px] text-slate-500">
          Providing the original claim allows TrustNet AI to evaluate cross-source claim support and contextual alignment.
        </p>
      </div>

      {/* Preset Test Scenarios */}
      <div className="space-y-3 pt-2">
        <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
          Or try a pre-configured forensic scenario:
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {SAMPLE_PRESETS.map((preset) => (
            <button
              key={preset.id}
              type="button"
              onClick={() => handleSampleSelect(preset)}
              disabled={isLoading}
              className="p-3 rounded-xl text-left glass-panel glass-panel-hover border border-slate-800/80 space-y-1 group"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors">
                  {preset.title}
                </span>
              </div>
              <div className="text-[10px] text-slate-400 line-clamp-2">
                {preset.description}
              </div>
              <div className="text-[10px] font-mono text-cyan-400 pt-1">
                {preset.badge}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Main Analyze CTA */}
      <button
        type="submit"
        disabled={isLoading || !selectedFile}
        className="w-full py-4 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 text-white font-bold text-base hover:from-cyan-400 hover:to-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-glow-cyan flex items-center justify-center gap-2"
      >
        <Sparkles className="w-5 h-5" />
        <span>Analyze with TrustNet AI</span>
      </button>
    </form>
  );
};
