'use client';

import React from 'react';
import { TrustBand, RiskLevel } from '@/lib/types';
import { TRUST_BAND_COLORS } from '@/lib/constants';
import { Shield, ShieldAlert, ShieldCheck, HelpCircle } from 'lucide-react';

interface TrustScoreGaugeProps {
  score: number;
  band: TrustBand;
  riskLevel: RiskLevel;
  confidence: number;
  size?: 'sm' | 'md' | 'lg';
}

export const TrustScoreGauge: React.FC<TrustScoreGaugeProps> = ({
  score,
  band,
  riskLevel,
  confidence,
  size = 'lg',
}) => {
  const config = TRUST_BAND_COLORS[band] || TRUST_BAND_COLORS['Uncertain'];
  
  // Calculate SVG circle dash offset
  // Radius = 45, circumference = 2 * PI * 45 = 282.74
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const getShieldIcon = () => {
    if (score >= 80) return <ShieldCheck className="w-8 h-8 text-emerald-400" />;
    if (score >= 40) return <Shield className="w-8 h-8 text-amber-400" />;
    return <ShieldAlert className="w-8 h-8 text-rose-400" />;
  };

  return (
    <div className="relative flex flex-col items-center justify-center p-6 rounded-2xl glass-panel border border-slate-800 shadow-2xl">
      {/* Background radial glow */}
      <div
        className="absolute inset-0 rounded-2xl opacity-15 pointer-events-none blur-2xl transition-all duration-700"
        style={{ backgroundColor: config.barColor }}
      />

      {/* Circular Gauge */}
      <div className="relative w-48 h-48 sm:w-56 sm:h-56 flex items-center justify-center">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          {/* Background circle */}
          <circle
            cx="50"
            cy="50"
            r={radius}
            className="circle-bg"
          />
          {/* Progress circle */}
          <circle
            cx="50"
            cy="50"
            r={radius}
            className="circle"
            stroke={config.barColor}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            style={{
              filter: `drop-shadow(0 0 6px ${config.barColor})`,
            }}
          />
        </svg>

        {/* Center Content */}
        <div className="absolute flex flex-col items-center justify-center text-center">
          <div className="mb-1">{getShieldIcon()}</div>
          <div className="text-4xl sm:text-5xl font-black tracking-tight text-white font-mono">
            {score}
            <span className="text-xl text-slate-500 font-normal">/100</span>
          </div>
          <div className={`text-xs sm:text-sm font-semibold tracking-wide uppercase mt-1 ${config.text}`}>
            {band}
          </div>
        </div>
      </div>

      {/* Meta tags below gauge */}
      <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${config.bg} ${config.text} ${config.border}`}>
          {riskLevel}
        </span>
        <span className="px-3 py-1 rounded-full text-xs font-medium bg-slate-800/80 text-slate-300 border border-slate-700">
          Confidence: <strong>{(confidence * 100).toFixed(0)}%</strong>
        </span>
      </div>
    </div>
  );
};
