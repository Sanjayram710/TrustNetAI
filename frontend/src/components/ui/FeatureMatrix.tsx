'use client';

import React from 'react';
import { ImageFeatures } from '@/lib/types';
import { Sliders, Maximize2, Zap, Radio, Camera, Cpu } from 'lucide-react';

interface FeatureMatrixProps {
  features?: ImageFeatures | null;
}

export const FeatureMatrix: React.FC<FeatureMatrixProps> = ({ features }) => {
  if (!features) {
    return null;
  }

  const items = [
    {
      label: 'Resolution & Format',
      value: `${features.dimensions[0]} &times; ${features.dimensions[1]} px (${features.format.toUpperCase()})`,
      icon: Maximize2,
      subtext: `${(features.file_size_bytes / 1024).toFixed(1)} KB`,
    },
    {
      label: 'Sensor Noise Residual',
      value: `${features.noise_variance.toFixed(1)} var`,
      icon: Radio,
      subtext: features.noise_variance < 15 ? 'Unusually Smooth (Synthetic Risk)' : 'Nominal Optical Range',
    },
    {
      label: 'Laplacian Sharpness',
      value: `${features.sharpness_variance.toFixed(1)} var`,
      icon: Zap,
      subtext: 'High-frequency gradient edge density',
    },
    {
      label: 'ELA Discrepancy Index',
      value: `${features.ela_discrepancy_score.toFixed(1)} / 100`,
      icon: Sliders,
      subtext: features.ela_discrepancy_score > 40 ? 'High Compression Variance (Splicing Risk)' : 'Uniform Recompression Rate',
    },
    {
      label: 'Camera Hardware EXIF',
      value: features.camera_make || (features.has_exif ? 'Metadata Present' : 'No Hardware Tags'),
      icon: Camera,
      subtext: features.has_exif ? 'Capture metadata intact' : 'Stripped during distribution',
    },
    {
      label: 'Editing Software Header',
      value: features.software_detected || 'None Detected',
      icon: Cpu,
      subtext: features.software_detected ? 'Post-processing software tag found' : 'Clean header signature',
    },
  ];

  return (
    <div className="p-6 rounded-2xl glass-panel border border-slate-800 space-y-6">
      <div className="flex items-center gap-2.5 border-b border-slate-800/80 pb-4">
        <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
          <Sliders className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-base font-semibold text-white">Extracted Computer Vision Metrics</h3>
          <div className="text-xs text-slate-400 font-mono">OpenCV &amp; Error Level Analysis (ELA) Pipeline</div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.label}
              className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/60 space-y-1"
            >
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <Icon className="w-3.5 h-3.5 text-cyan-400" />
                <span>{item.label}</span>
              </div>
              <div
                className="text-sm font-bold font-mono text-slate-100"
                dangerouslySetInnerHTML={{ __html: item.value }}
              />
              <div className="text-[11px] text-slate-400 leading-tight pt-0.5">
                {item.subtext}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
