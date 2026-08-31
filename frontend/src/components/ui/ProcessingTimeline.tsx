'use client';

import React from 'react';
import { ProcessingStep } from '@/lib/types';
import { CheckCircle2, Clock, ListOrdered } from 'lucide-react';

interface ProcessingTimelineProps {
  timeline: ProcessingStep[];
}

export const ProcessingTimeline: React.FC<ProcessingTimelineProps> = ({ timeline }) => {
  if (!timeline || timeline.length === 0) {
    return null;
  }

  return (
    <div className="p-6 rounded-2xl glass-panel border border-slate-800 space-y-4">
      <div className="flex items-center gap-2.5 border-b border-slate-800/80 pb-3">
        <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
          <ListOrdered className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-base font-semibold text-white">Pipeline Execution Summary</h3>
          <div className="text-xs text-slate-400">Sequential multi-stage verification log</div>
        </div>
      </div>

      <div className="space-y-2.5 pt-2">
        {timeline.map((step) => (
          <div
            key={step.step_number}
            className="flex items-center justify-between p-3 rounded-lg bg-slate-900/40 border border-slate-800/60 text-xs"
          >
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-6 h-6 rounded-full bg-emerald-500/10 text-emerald-400 font-mono text-[11px] font-bold">
                {step.step_number}
              </div>
              <div>
                <span className="font-medium text-slate-200">{step.name}</span>
                {step.message && (
                  <span className="text-slate-400 ml-2 text-[11px]">
                    &bull; {step.message}
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3 font-mono text-slate-400">
              {step.duration_ms && (
                <span className="flex items-center gap-1 text-[11px]">
                  <Clock className="w-3 h-3 text-slate-500" />
                  {step.duration_ms}ms
                </span>
              )}
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
