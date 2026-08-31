'use client';

import React, { useEffect, useState } from 'react';
import { Loader2, CheckCircle2, ShieldCheck, Sparkles, Cpu } from 'lucide-react';

interface StagedProgressProps {
  onComplete?: () => void;
}

const STAGES = [
  { id: 1, name: 'File Received & Validated', desc: 'MIME signature, magic bytes & safe sanitization' },
  { id: 2, name: 'Image Preprocessing & Normalization', desc: 'Color space conversion & resolution scaling' },
  { id: 3, name: 'Computer Vision Feature Extraction', desc: 'High-frequency noise floor & Laplacian variance' },
  { id: 4, name: 'Error Level Analysis (ELA)', desc: 'Localized compression artifact delta mapping' },
  { id: 5, name: 'Deep Learning Model Ensemble', desc: 'Vision Transformer & CNN authenticity classification' },
  { id: 6, name: 'Multi-Signal Fusion & Trust Scoring', desc: 'Weighted signal fusion with tampering penalty logic' },
  { id: 7, name: 'Explainable Findings Generation', desc: 'Synthesizing evidence-grounded report & confidence metrics' },
];

export const StagedProgress: React.FC<StagedProgressProps> = ({ onComplete }) => {
  const [currentStage, setCurrentStage] = useState(1);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStage((prev) => {
        if (prev < STAGES.length) {
          return prev + 1;
        } else {
          clearInterval(interval);
          if (onComplete) onComplete();
          return prev;
        }
      });
    }, 450);

    return () => clearInterval(interval);
  }, [onComplete]);

  const progressPercent = Math.min(100, Math.round((currentStage / STAGES.length) * 100));

  return (
    <div className="w-full max-w-2xl mx-auto p-8 rounded-2xl glass-panel border border-cyan-500/30 space-y-8 shadow-2xl relative overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute -top-24 -left-24 w-72 h-72 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="text-center space-y-2 relative">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-xs font-mono text-cyan-400">
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
          <span>Multimodal Inference Engine Active</span>
        </div>
        <h2 className="text-2xl font-bold text-white tracking-tight">
          Analyzing Content Authenticity
        </h2>
        <p className="text-sm text-slate-400">
          Running deep forensic heuristics, compression analysis, and model classification.
        </p>
      </div>

      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-xs font-mono text-slate-400">
          <span>Stage {currentStage} of {STAGES.length}</span>
          <span className="text-cyan-400 font-bold">{progressPercent}%</span>
        </div>
        <div className="w-full h-2 rounded-full bg-slate-800/80 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full transition-all duration-500 shadow-glow-cyan"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Step List */}
      <div className="space-y-2.5">
        {STAGES.map((stage) => {
          const isDone = currentStage > stage.id;
          const isCurrent = currentStage === stage.id;
          return (
            <div
              key={stage.id}
              className={`flex items-center justify-between p-3 rounded-xl transition-all duration-300 ${
                isCurrent
                  ? 'bg-slate-800/90 border border-cyan-500/40 text-white shadow-lg'
                  : isDone
                  ? 'bg-slate-900/40 border border-slate-800/40 text-slate-300'
                  : 'bg-slate-950/20 border border-transparent text-slate-600'
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`flex items-center justify-center w-6 h-6 rounded-full text-xs font-mono font-bold ${
                    isDone
                      ? 'bg-emerald-500/20 text-emerald-400'
                      : isCurrent
                      ? 'bg-cyan-500/20 text-cyan-400 animate-pulse'
                      : 'bg-slate-800 text-slate-600'
                  }`}
                >
                  {stage.id}
                </div>
                <div>
                  <div className={`text-xs font-medium ${isCurrent ? 'text-cyan-300' : ''}`}>
                    {stage.name}
                  </div>
                  <div className="text-[10px] text-slate-400">{stage.desc}</div>
                </div>
              </div>

              <div>
                {isDone ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                ) : isCurrent ? (
                  <Loader2 className="w-4 h-4 text-cyan-400 animate-spin" />
                ) : (
                  <span className="w-2 h-2 rounded-full bg-slate-800 block" />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
