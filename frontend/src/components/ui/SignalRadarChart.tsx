'use client';

import React from 'react';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import { CoreSignals } from '@/lib/types';
import { Radar as RadarIcon } from 'lucide-react';

interface SignalRadarChartProps {
  signals: CoreSignals;
}

export const SignalRadarChart: React.FC<SignalRadarChartProps> = ({ signals }) => {
  const data = [
    {
      subject: 'Authenticity',
      score: signals.authenticity_score,
      fullMark: 100,
    },
    {
      subject: 'Integrity (100 - Tamper)',
      score: Math.max(0, 100 - signals.manipulation_risk),
      fullMark: 100,
    },
    {
      subject: 'Source Provenance',
      score: signals.source_reliability,
      fullMark: 100,
    },
    {
      subject: 'Claim Support',
      score: signals.claim_support,
      fullMark: 100,
    },
  ];

  return (
    <div className="p-6 rounded-2xl glass-panel border border-slate-800 space-y-4">
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            <RadarIcon className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-white">Multidimensional Signal Space</h3>
            <div className="text-xs text-slate-400">4-Vector forensic equilibrium mapping</div>
          </div>
        </div>
        <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300">
          Normalized [0–100]
        </span>
      </div>

      <div className="w-full h-64 sm:h-72">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="75%" data={data}>
            <PolarGrid stroke="#334155" strokeDasharray="3 3" />
            <PolarAngleAxis
              dataKey="subject"
              tick={{ fill: '#94a3b8', fontSize: 11, fontFamily: 'monospace' }}
            />
            <PolarRadiusAxis
              angle={30}
              domain={[0, 100]}
              tick={{ fill: '#64748b', fontSize: 10 }}
            />
            <Radar
              name="Signal Score"
              dataKey="score"
              stroke="#06b6d4"
              fill="#06b6d4"
              fillOpacity={0.35}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#0f172a',
                borderColor: '#1e293b',
                borderRadius: '8px',
                color: '#f8fafc',
                fontSize: '12px',
                fontFamily: 'monospace',
              }}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
