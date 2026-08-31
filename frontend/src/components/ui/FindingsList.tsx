'use client';

import React, { useState } from 'react';
import { Finding, FindingSeverity } from '@/lib/types';
import { CheckCircle2, AlertCircle, AlertTriangle, ChevronDown, ChevronUp, FileSearch } from 'lucide-react';

interface FindingsListProps {
  findings: Finding[];
}

export const FindingsList: React.FC<FindingsListProps> = ({ findings }) => {
  const [filter, setFilter] = useState<'all' | 'alert' | 'caution' | 'positive'>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filteredFindings = findings.filter((f) => {
    if (filter === 'all') return true;
    return f.severity === filter;
  });

  const getSeverityIcon = (severity: FindingSeverity) => {
    switch (severity) {
      case 'positive':
        return <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />;
      case 'caution':
        return <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />;
      case 'alert':
        return <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />;
    }
  };

  const getSeverityBadge = (severity: FindingSeverity) => {
    switch (severity) {
      case 'positive':
        return <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Positive Indicator</span>;
      case 'caution':
        return <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20">Caution</span>;
      case 'alert':
        return <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-rose-500/10 text-rose-400 border border-rose-500/20">Anomaly Alert</span>;
    }
  };

  return (
    <div className="p-6 rounded-2xl glass-panel border border-slate-800 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            <FileSearch className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-white">Explainable Findings & Evidence</h3>
            <div className="text-xs text-slate-400">
              {findings.length} signal-grounded observations generated
            </div>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 bg-slate-900/80 p-1 rounded-lg border border-slate-800 text-xs">
          {(['all', 'positive', 'caution', 'alert'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-3 py-1 rounded-md capitalize font-medium transition-all ${
                filter === tab
                  ? 'bg-slate-800 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Findings Items */}
      <div className="space-y-3">
        {filteredFindings.length === 0 ? (
          <div className="text-center py-8 text-sm text-slate-400">
            No findings match the selected filter.
          </div>
        ) : (
          filteredFindings.map((finding) => {
            const isExpanded = expandedId === finding.id;
            return (
              <div
                key={finding.id}
                className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700/80 transition-all space-y-2"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    {getSeverityIcon(finding.severity)}
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-sm font-semibold text-slate-100">
                          {finding.title}
                        </span>
                        {getSeverityBadge(finding.severity)}
                        <span className="text-[10px] text-slate-400 font-mono">
                          {finding.category}
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        {finding.description}
                      </p>
                    </div>
                  </div>

                  {finding.technical_detail && (
                    <button
                      onClick={() => setExpandedId(isExpanded ? null : finding.id)}
                      className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                      title="Toggle technical details"
                    >
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  )}
                </div>

                {/* Expandable Technical Detail */}
                {isExpanded && finding.technical_detail && (
                  <div className="mt-2 pt-2 border-t border-slate-800/60 text-[11px] font-mono text-cyan-300/80 bg-slate-950/60 p-2.5 rounded-lg">
                    <span className="text-slate-500 font-sans font-medium mr-2">Signal Detail:</span>
                    {finding.technical_detail}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
