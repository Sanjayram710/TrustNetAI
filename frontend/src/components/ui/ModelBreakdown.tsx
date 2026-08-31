'use client';

import React from 'react';
import { ModelBreakdown as ModelBreakdownType } from '@/lib/types';
import { Cpu, HelpCircle } from 'lucide-react';

interface ModelBreakdownProps {
  modelBreakdown: ModelBreakdownType;
}

export const ModelBreakdownCard: React.FC<ModelBreakdownProps> = ({ modelBreakdown }) => {
  const {
    authentic_probability,
    ai_generated_probability,
    manipulated_probability,
    model_name,
    is_demo_inference,
    calibrated_uncertainty,
  } = modelBreakdown;

  const classes = [
    {
      label: 'Authentic Organic',
      prob: authentic_probability,
      color: 'bg-emerald-500',
      textColor: 'text-emerald-400',
      desc: 'Consistent with natural sensor capture',
    },
    {
      label: 'AI Synthetic Generated',
      prob: ai_generated_probability,
      color: 'bg-rose-500',
      textColor: 'text-rose-400',
      desc: 'Latent diffusion or GAN synthesis patterns',
    },
    {
      label: 'Manipulated / Tampered',
      prob: manipulated_probability,
      color: 'bg-amber-500',
      textColor: 'text-amber-400',
      desc: 'Targeted splicing, retouching, or boundary edits',
    },
  ];

  return (
    <div className="p-6 rounded-2xl glass-panel border border-slate-800 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/20">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-white">Deep Model Ensemble Breakdown</h3>
            <div className="text-xs text-slate-400 font-mono">{model_name}</div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {is_demo_inference && (
            <span className="px-2.5 py-1 rounded-full text-[11px] font-mono bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              Demo Inference Architecture
            </span>
          )}
          <span className="px-2.5 py-1 rounded-full text-[11px] font-mono bg-slate-800 text-slate-300 border border-slate-700">
            &plusmn;{(calibrated_uncertainty * 100).toFixed(0)}% Margin
          </span>
        </div>
      </div>

      {/* Probabilities Distribution */}
      <div className="space-y-4">
        {classes.map((cls) => (
          <div key={cls.label} className="space-y-1.5">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium text-slate-200">{cls.label}</span>
              <span className={`font-mono font-bold ${cls.textColor}`}>
                {(cls.prob * 100).toFixed(1)}%
              </span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-800/80 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-700 ${cls.color}`}
                style={{ width: `${cls.prob * 100}%` }}
              />
            </div>
            <p className="text-[11px] text-slate-400">{cls.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
