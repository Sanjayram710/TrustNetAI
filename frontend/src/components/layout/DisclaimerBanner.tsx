'use client';

import React from 'react';
import { AlertCircle, Sparkles } from 'lucide-react';

interface DisclaimerBannerProps {
  compact?: boolean;
}

export const DisclaimerBanner: React.FC<DisclaimerBannerProps> = ({ compact = false }) => {
  if (compact) {
    return (
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900/80 border border-slate-700/50 text-xs text-slate-400">
        <AlertCircle className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
        <span>
          <strong>Probabilistic Assessment:</strong> Not absolute proof of authenticity or deception.
        </span>
      </div>
    );
  }

  return (
    <div className="w-full bg-slate-900/60 border border-slate-800/80 rounded-xl p-4 flex items-start gap-3 text-sm text-slate-300">
      <div className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 shrink-0 mt-0.5">
        <Sparkles className="w-4 h-4" />
      </div>
      <div className="space-y-1">
        <div className="font-medium text-slate-200 flex items-center gap-2">
          Scientific & Model Limitations Statement
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            DEMO / MOCK INFERENCE ACTIVE
          </span>
        </div>
        <p className="text-xs text-slate-400 leading-relaxed">
          This result represents a calibrated model-based assessment and should not be treated as absolute proof of authenticity or deception. Multi-signal verification fuses optical sensor noise, compression patterns, metadata integrity, and deep learning feature likelihoods.
        </p>
      </div>
    </div>
  );
};
