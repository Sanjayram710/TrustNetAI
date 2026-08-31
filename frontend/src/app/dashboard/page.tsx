'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  Activity, ShieldCheck, AlertTriangle, ShieldAlert, 
  Search, Filter, ArrowRight, RefreshCw, Layers, Calendar, 
  Camera, Video, Mic, FileText, CheckCircle2 
} from 'lucide-react';
import { api } from '@/lib/api';
import { AnalysisResponse, AnalysisSummaryMetrics, ContentType } from '@/lib/types';
import { TRUST_BAND_COLORS } from '@/lib/constants';
import { DisclaimerBanner } from '@/components/layout/DisclaimerBanner';

export default function DashboardPage() {
  const [items, setItems] = useState<AnalysisResponse[]>([]);
  const [metrics, setMetrics] = useState<AnalysisSummaryMetrics>({
    total_analyses: 0,
    authentic_count: 0,
    suspicious_count: 0,
    high_risk_count: 0,
    average_trust_score: 0,
  });
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedRisk, setSelectedRisk] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fetchHistory = async () => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const data = await api.listAnalyses({
        contentType: selectedType !== 'all' ? (selectedType as ContentType) : undefined,
        riskFilter: selectedRisk !== 'all' ? selectedRisk : undefined,
        search: searchQuery.trim() || undefined,
        page: 1,
        pageSize: 50,
      });
      setItems(data.items);
      setMetrics(data.metrics);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to load analysis history.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [selectedType, selectedRisk]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchHistory();
  };

  const getModalityIcon = (type: ContentType) => {
    switch (type) {
      case 'image':
        return <Camera className="w-4 h-4 text-cyan-400" />;
      case 'video':
        return <Video className="w-4 h-4 text-blue-400" />;
      case 'audio':
        return <Mic className="w-4 h-4 text-purple-400" />;
      case 'text':
        return <FileText className="w-4 h-4 text-amber-400" />;
      default:
        return <Layers className="w-4 h-4 text-slate-400" />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-2.5">
            <Activity className="w-7 h-7 text-cyan-400" />
            <span>Forensics Analytics &amp; History</span>
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Persisted analysis records, aggregate trust indices, and historical forensic audits.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchHistory}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 text-xs font-semibold hover:bg-slate-800 transition-all"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Refresh Data</span>
          </button>

          <Link
            href="/analyze"
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-500 text-slate-950 text-xs font-bold hover:bg-cyan-400 transition-all shadow-glow-cyan"
          >
            <span>+ New Analysis</span>
          </Link>
        </div>
      </div>

      {/* Aggregate Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="p-5 rounded-2xl glass-panel border border-slate-800 space-y-2">
          <div className="text-xs font-medium text-slate-400 uppercase tracking-wider">
            Total Audits
          </div>
          <div className="text-3xl font-black font-mono text-white">
            {metrics.total_analyses}
          </div>
          <div className="text-[11px] text-slate-500">Processed multimodal items</div>
        </div>

        <div className="p-5 rounded-2xl glass-panel border border-emerald-500/20 bg-emerald-500/5 space-y-2">
          <div className="text-xs font-medium text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4" />
            Authentic (80–100)
          </div>
          <div className="text-3xl font-black font-mono text-emerald-400">
            {metrics.authentic_count}
          </div>
          <div className="text-[11px] text-emerald-500/80">Organic capture signatures</div>
        </div>

        <div className="p-5 rounded-2xl glass-panel border border-amber-500/20 bg-amber-500/5 space-y-2">
          <div className="text-xs font-medium text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
            <AlertTriangle className="w-4 h-4" />
            Suspicious (40–79)
          </div>
          <div className="text-3xl font-black font-mono text-amber-400">
            {metrics.suspicious_count}
          </div>
          <div className="text-[11px] text-amber-500/80">Inconclusive / Mixed signals</div>
        </div>

        <div className="p-5 rounded-2xl glass-panel border border-rose-500/20 bg-rose-500/5 space-y-2">
          <div className="text-xs font-medium text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
            <ShieldAlert className="w-4 h-4" />
            High Risk (0–39)
          </div>
          <div className="text-3xl font-black font-mono text-rose-400">
            {metrics.high_risk_count}
          </div>
          <div className="text-[11px] text-rose-500/80">Synthetic / Tampered media</div>
        </div>

        <div className="p-5 rounded-2xl glass-panel border border-cyan-500/20 bg-cyan-500/5 space-y-2">
          <div className="text-xs font-medium text-cyan-400 uppercase tracking-wider">
            Avg Trust Index
          </div>
          <div className="text-3xl font-black font-mono text-cyan-400">
            {metrics.average_trust_score}
            <span className="text-sm text-slate-500 font-normal">/100</span>
          </div>
          <div className="text-[11px] text-cyan-500/80">Global cross-modal average</div>
        </div>
      </div>

      {/* Filter & Search Controls */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 rounded-2xl glass-panel border border-slate-800">
        {/* Search Input */}
        <form onSubmit={handleSearchSubmit} className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by file or claim..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
          />
        </form>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* Modality Filter */}
          <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs">
            {['all', 'image', 'text', 'video', 'audio'].map((t) => (
              <button
                key={t}
                onClick={() => setSelectedType(t)}
                className={`px-3 py-1 rounded-lg capitalize font-medium transition-all ${
                  selectedType === t
                    ? 'bg-slate-800 text-cyan-400 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          {/* Risk Level Filter */}
          <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs">
            {[
              { id: 'all', label: 'All Risks' },
              { id: 'authentic', label: 'Authentic' },
              { id: 'suspicious', label: 'Suspicious' },
              { id: 'high risk', label: 'High Risk' },
            ].map((r) => (
              <button
                key={r.id}
                onClick={() => setSelectedRisk(r.id)}
                className={`px-3 py-1 rounded-lg font-medium transition-all ${
                  selectedRisk === r.id
                    ? 'bg-slate-800 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* History Table */}
      <div className="rounded-2xl glass-panel border border-slate-800 overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center space-y-3">
            <RefreshCw className="w-8 h-8 text-cyan-400 animate-spin mx-auto" />
            <p className="text-xs text-slate-400 font-mono">Loading history records...</p>
          </div>
        ) : errorMsg ? (
          <div className="p-8 text-center text-xs text-rose-400">
            {errorMsg}
          </div>
        ) : items.length === 0 ? (
          <div className="p-12 text-center space-y-4">
            <Layers className="w-10 h-10 text-slate-600 mx-auto" />
            <div className="space-y-1">
              <h3 className="text-base font-bold text-white">No Analyses Found</h3>
              <p className="text-xs text-slate-400">
                Try adjusting your filters or upload a new file to analyze.
              </p>
            </div>
            <Link
              href="/analyze"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-500 text-slate-950 text-xs font-bold"
            >
              Analyze First Image
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900/90 text-slate-400 uppercase tracking-wider font-mono border-b border-slate-800 text-[10px]">
                <tr>
                  <th className="py-3.5 px-4">Artifact / File</th>
                  <th className="py-3.5 px-4">Modality</th>
                  <th className="py-3.5 px-4">Trust Score</th>
                  <th className="py-3.5 px-4">Trust Band</th>
                  <th className="py-3.5 px-4">Risk Level</th>
                  <th className="py-3.5 px-4">Analyzed At</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-sans text-slate-300">
                {items.map((item) => {
                  const bandConfig = TRUST_BAND_COLORS[item.trust_band] || TRUST_BAND_COLORS['Uncertain'];
                  return (
                    <tr
                      key={item.id}
                      className="hover:bg-slate-900/60 transition-colors group"
                    >
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-white truncate max-w-[220px]">
                          {item.filename || item.associated_claim || 'Text Claim Analysis'}
                        </div>
                        <div className="text-[10px] text-slate-500 font-mono">
                          #{item.id}
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 capitalize font-mono text-[11px]">
                          {getModalityIcon(item.content_type)}
                          <span>{item.content_type}</span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-bold font-mono text-sm text-white">
                          {item.trust_score}
                          <span className="text-[10px] text-slate-500 font-normal">/100</span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className={`px-2.5 py-1 rounded-full font-medium text-[10px] border ${bandConfig.bg} ${bandConfig.text} ${bandConfig.border}`}>
                          {item.trust_band}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="text-slate-300 font-medium">
                          {item.risk_level}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-slate-400 font-mono text-[11px]">
                        {new Date(item.created_at).toLocaleDateString()} {new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <Link
                          href={`/results/${item.id}`}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-cyan-400 hover:text-cyan-300 hover:border-cyan-500/40 text-xs font-medium transition-all group-hover:border-slate-700"
                        >
                          <span>View Report</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <DisclaimerBanner />
    </div>
  );
}
