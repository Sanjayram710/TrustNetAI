'use client';

import React, { useState } from 'react';
import { Film, AlertTriangle, Play, CheckCircle2 } from 'lucide-react';

interface FrameAnomaly {
  frame_number: number;
  timestamp: string;
  anomaly_type: string;
  confidence: number;
  severity: 'low' | 'medium' | 'high';
}

interface SuspiciousFramesTimelineProps {
  anomalies?: FrameAnomaly[];
}

export const SuspiciousFramesTimeline: React.FC<SuspiciousFramesTimelineProps> = ({
  anomalies = [
    { frame_number: 48, timestamp: '00:01.60', anomaly_type: 'Facial Boundary Warping', confidence: 0.84, severity: 'high' },
    { frame_number: 112, timestamp: '00:03.73', anomaly_type: 'Optical Flow Discontinuity', confidence: 0.62, severity: 'medium' },
    { frame_number: 216, timestamp: '00:07.20', anomaly_type: 'Eye Blink Asymmetry', confidence: 0.58, severity: 'low' },
  ],
}) => {
  const [selectedFrame, setSelectedFrame] = useState<FrameAnomaly>(anomalies[0]);

  return (
    <div className="p-6 rounded-2xl glass-panel border border-slate-800 space-y-6">
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <Film className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-white">Video Temporal &amp; Frame Forensics</h3>
            <div className="text-xs text-slate-400 font-mono">Stage 3 Architecture Demo &bull; 30 FPS Sampling</div>
          </div>
        </div>

        <span className="px-2.5 py-1 rounded-full text-xs font-mono bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
          {anomalies.length} Suspicious Keyframes
        </span>
      </div>

      {/* Frame Timeline Bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-xs text-slate-400 font-mono">
          <span>00:00.00</span>
          <span>Timeline (10.0s)</span>
          <span>00:10.00</span>
        </div>

        <div className="relative w-full h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center px-2">
          {/* Keyframe tick marks */}
          {anomalies.map((item) => {
            const leftPercent = Math.min(95, Math.max(5, (item.frame_number / 300) * 100));
            const isSelected = selectedFrame.frame_number === item.frame_number;
            return (
              <button
                key={item.frame_number}
                onClick={() => setSelectedFrame(item)}
                style={{ left: `${leftPercent}%` }}
                className={`absolute -translate-x-1/2 p-1 rounded transition-transform ${
                  isSelected
                    ? 'scale-125 z-10'
                    : 'hover:scale-110'
                }`}
                title={`Frame #${item.frame_number} at ${item.timestamp}`}
              >
                <div
                  className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                    item.severity === 'high'
                      ? 'bg-rose-500 border-rose-300 shadow-glow-rose'
                      : item.severity === 'medium'
                      ? 'bg-amber-500 border-amber-300'
                      : 'bg-cyan-500 border-cyan-300'
                  }`}
                />
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Frame Detail Inspection */}
      {selectedFrame && (
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-mono font-bold text-xs text-white">
                Frame #{selectedFrame.frame_number}
              </span>
              <span className="text-xs text-slate-400 font-mono">
                ({selectedFrame.timestamp})
              </span>
            </div>
            <span
              className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono uppercase ${
                selectedFrame.severity === 'high'
                  ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                  : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
              }`}
            >
              {selectedFrame.severity} Severity
            </span>
          </div>

          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-300 font-medium">
              {selectedFrame.anomaly_type}
            </span>
            <span className="text-cyan-400 font-mono font-bold">
              Confidence: {(selectedFrame.confidence * 100).toFixed(0)}%
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
