'use client';

import React from 'react';
import { Camera, AlertTriangle, Database, FileText } from 'lucide-react';

interface SignalCardProps {
  type: 'authenticity' | 'manipulation' | 'source' | 'claim';
  score: number;
  label: string;
  description: string;
}

export const SignalCard: React.FC<SignalCardProps> = ({
  type,
  score,
  label,
  description,
}) => {
  const getSignalConfig = () => {
    switch (type) {
      case 'authenticity':
        return {
          icon: Camera,
          color: 'text-emerald-400',
          bg: 'bg-emerald-500/10',
          border: 'border-emerald-500/20',
          barColor: 'bg-emerald-400',
          weight: '45% Weight',
          status: score >= 75 ? 'Organic' : score >= 45 ? 'Mixed' : 'Synthetic',
        };
      case 'manipulation':
        return {
          icon: AlertTriangle,
          color: score > 50 ? 'text-rose-400' : 'text-slate-300',
          bg: score > 50 ? 'bg-rose-500/10' : 'bg-slate-800/40',
          border: score > 50 ? 'border-rose-500/20' : 'border-slate-800',
          barColor: score > 50 ? 'bg-rose-500' : 'bg-slate-500',
          weight: '35% Penalty Weight',
          status: score >= 60 ? 'High Tamper Risk' : score >= 30 ? 'Moderate' : 'Low Risk',
        };
      case 'source':
        return {
          icon: Database,
          color: 'text-cyan-400',
          bg: 'bg-cyan-500/10',
          border: 'border-cyan-500/20',
          barColor: 'bg-cyan-400',
          weight: '10% Weight',
          status: score >= 70 ? 'Verified Hardware' : 'Stripped / Unverified',
        };
      case 'claim':
        return {
          icon: FileText,
          color: 'text-purple-400',
          bg: 'bg-purple-500/10',
          border: 'border-purple-500/20',
          barColor: 'bg-purple-400',
          weight: '10% Weight',
          status: score >= 70 ? 'Corroborated' : 'Unverified Stance',
        };
    }
  };

  const config = getSignalConfig();
  const Icon = config.icon;

  return (
    <div className={`p-4 rounded-xl glass-panel border ${config.border} flex flex-col justify-between space-y-3`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className={`p-2 rounded-lg ${config.bg} ${config.color}`}>
            <Icon className="w-4 h-4" />
          </div>
          <div>
            <div className="text-sm font-semibold text-white">{label}</div>
            <div className="text-[11px] text-slate-400 font-mono">{config.weight}</div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-xl font-bold font-mono text-white">
            {score.toFixed(1)}
            <span className="text-xs text-slate-500 font-normal">/100</span>
          </div>
          <div className={`text-[10px] font-medium ${config.color}`}>
            {config.status}
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="space-y-1">
        <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-700 ${config.barColor}`}
            style={{ width: `${Math.min(100, Math.max(0, score))}%` }}
          />
        </div>
        <p className="text-xs text-slate-400 leading-snug pt-1">{description}</p>
      </div>
    </div>
  );
};
