'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { 
  Shield, ArrowLeft, Download, RefreshCw, FileText, 
  Calendar, FileCode, CheckCircle2, AlertCircle, Share2, 
  Layers, HelpCircle, Search, ExternalLink, Sparkles 
} from 'lucide-react';
import { api } from '@/lib/api';
import { AnalysisResponse } from '@/lib/types';
import { TrustScoreGauge } from '@/components/ui/TrustScoreGauge';
import { SignalCard } from '@/components/ui/SignalCard';
import { ModelBreakdownCard } from '@/components/ui/ModelBreakdown';
import { SignalRadarChart } from '@/components/ui/SignalRadarChart';
import { SuspiciousFramesTimeline } from '@/components/ui/SuspiciousFramesTimeline';
import { FindingsList } from '@/components/ui/FindingsList';
import { FeatureMatrix } from '@/components/ui/FeatureMatrix';
import { ProcessingTimeline } from '@/components/ui/ProcessingTimeline';
import { DisclaimerBanner } from '@/components/layout/DisclaimerBanner';

export default function ResultsPage() {
  const params = useParams();
  const id = params.id as string;

  const [analysis, setAnalysis] = useState<AnalysisResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    const fetchAnalysis = async () => {
      setIsLoading(true);
      try {
        const data = await api.getAnalysisById(id);
        setAnalysis(data);
      } catch (err: any) {
        setErrorMsg(err.message || 'Failed to retrieve analysis report.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchAnalysis();
  }, [id]);

  const handleDownloadJSON = () => {
    if (!analysis) return;
    const jsonStr = JSON.stringify(analysis, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `TrustNetAI_Report_${analysis.id}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-20 text-center space-y-4">
        <RefreshCw className="w-10 h-10 text-cyan-400 animate-spin mx-auto" />
        <h3 className="text-xl font-bold text-white">Loading Forensics Report...</h3>
        <p className="text-xs text-slate-400 font-mono">Retrieving analysis record #{id}</p>
      </div>
    );
  }

  if (errorMsg || !analysis) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="p-4 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 w-16 h-16 mx-auto flex items-center justify-center">
          <AlertCircle className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-white">Report Not Found</h2>
          <p className="text-sm text-slate-400">{errorMsg || 'The requested analysis ID does not exist or has expired.'}</p>
        </div>
        <Link
          href="/analyze"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-cyan-500 text-slate-950 font-semibold text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Analyzer</span>
        </Link>
      </div>
    );
  }

  // Derive granular grounded reasoning bullets for "Why did TrustNet give this score?"
  const getExplainableReasons = () => {
    const reasons: { text: string; positive: boolean }[] = [];
    const signals = analysis.signals;
    const features = analysis.features;

    if (signals.manipulation_risk < 20) {
      reasons.push({ text: 'No significant manipulation or splicing artifacts were detected across high-frequency components.', positive: true });
    } else if (signals.manipulation_risk > 60) {
      reasons.push({ text: 'High manipulation risk indicates elevated probability of localized editing or boundary discontinuity.', positive: false });
    }

    if (signals.authenticity_score >= 75) {
      reasons.push({ text: 'Visual features, noise consistency, and sharpness gradients are consistent with authentic physical camera capture.', positive: true });
    } else if (signals.authenticity_score < 40) {
      reasons.push({ text: 'Visual patterns and high-frequency textures match synthetic generative diffusion signatures.', positive: false });
    }

    if (features && features.has_exif) {
      reasons.push({ text: 'Original camera hardware provenance metadata was preserved and verified.', positive: true });
    } else {
      reasons.push({ text: 'Hardware source verification is limited due to stripped or absent EXIF capture tags.', positive: false });
    }

    if (signals.claim_support >= 75) {
      reasons.push({ text: 'Associated context and propositions demonstrate corroboration with indexed sources.', positive: true });
    } else {
      reasons.push({ text: 'The associated claim has insufficient supporting evidence from independent verifiable sources.', positive: false });
    }

    return reasons;
  };

  const explainableReasons = getExplainableReasons();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Top Breadcrumb & Actions Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
        <div className="flex items-center gap-3">
          <Link
            href="/analyze"
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Back to Analyzer"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black text-white tracking-tight">
                Authenticity Forensics Report
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                #{analysis.id}
              </span>
            </div>
            <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                {new Date(analysis.created_at).toLocaleString()}
              </span>
              <span>&bull;</span>
              <span className="uppercase font-mono font-medium text-slate-300">
                {analysis.content_type}
              </span>
              {analysis.filename && (
                <>
                  <span>&bull;</span>
                  <span className="font-mono truncate max-w-[200px] text-slate-300">
                    {analysis.filename}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleDownloadJSON}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 text-xs font-semibold hover:bg-slate-800 hover:text-white transition-all shadow-sm"
          >
            <Download className="w-4 h-4 text-cyan-400" />
            <span>Export JSON</span>
          </button>

          <Link
            href="/analyze"
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-500 text-slate-950 text-xs font-bold hover:bg-cyan-400 transition-all shadow-glow-cyan"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Analyze New File</span>
          </Link>
        </div>
      </div>

      {/* Main Results Grid: Gauge + Preview + Signal Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Big Circular Gauge + Artifact Preview */}
        <div className="lg:col-span-1 space-y-6">
          <TrustScoreGauge
            score={analysis.trust_score}
            band={analysis.trust_band}
            riskLevel={analysis.risk_level}
            confidence={analysis.confidence}
          />

          {/* Context / Preview Box if available */}
          {analysis.preview_url && (
            <div className="p-4 rounded-2xl glass-panel border border-slate-800 space-y-3">
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Submitted Media Artifact
              </div>
              <div className="rounded-xl overflow-hidden bg-slate-950 border border-slate-800 aspect-video flex items-center justify-center">
                <img
                  src={analysis.preview_url}
                  alt="Analyzed media"
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
          )}

          {analysis.associated_claim && (
            <div className="p-4 rounded-2xl glass-panel border border-slate-800 space-y-2">
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-cyan-400" />
                Associated Claim Context
              </div>
              <p className="text-xs text-slate-300 italic bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                &ldquo;{analysis.associated_claim}&rdquo;
              </p>
            </div>
          )}
        </div>

        {/* Right Column: Executive Summary & 4 Core Signal Cards & Radar Chart */}
        <div className="lg:col-span-2 space-y-6">
          {/* Executive Summary Card */}
          <div className="p-6 rounded-2xl glass-panel border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="text-xs font-semibold uppercase tracking-wider text-cyan-400">
                Executive Synthesis
              </div>
              <span className="text-xs font-mono text-slate-400">
                Calibrated Fusion Engine v2.1
              </span>
            </div>
            <p className="text-sm sm:text-base text-slate-200 leading-relaxed">
              {analysis.summary_explanation}
            </p>
          </div>

          {/* 4 Independent Signals Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <SignalCard
              type="authenticity"
              score={analysis.signals.authenticity_score}
              label="Media Authenticity"
              description="Estimated probability of organic physical capture vs. synthetic generation."
            />
            <SignalCard
              type="manipulation"
              score={analysis.signals.manipulation_risk}
              label="Manipulation Risk"
              description="Probability of localized editing, splicing, or targeted pixel tampering."
            />
            <SignalCard
              type="source"
              score={analysis.signals.source_reliability}
              label="Source Reliability"
              description="Hardware camera metadata, provenance markers, and header signature integrity."
            />
            <SignalCard
              type="claim"
              score={analysis.signals.claim_support}
              label="Claim Support"
              description="Contextual evidence corroboration and cross-source stance consensus."
            />
          </div>

          {/* Technical Radar Chart & Deep Model Breakdown */}
          <div className="grid grid-cols-1 gap-6">
            <SignalRadarChart signals={analysis.signals} />
            <ModelBreakdownCard modelBreakdown={analysis.model_breakdown} />
          </div>
        </div>
      </div>

      {/* WHY DID TRUSTNET GIVE THIS SCORE? (Dedicated Explainability Section) */}
      <div className="p-8 rounded-3xl glass-panel border border-cyan-500/30 space-y-6 shadow-xl relative overflow-hidden">
        <div className="flex items-center gap-3 border-b border-slate-800/80 pb-4">
          <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            <HelpCircle className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">
              Why did TrustNet give this score?
            </h2>
            <p className="text-xs text-slate-400">
              Deconstructed multi-signal reasoning grounded directly in computed physical &amp; probabilistic measurements.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {explainableReasons.map((reason, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 flex items-start gap-3 text-xs leading-relaxed"
            >
              {reason.positive ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              )}
              <span className="text-slate-300">{reason.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* EVIDENCE SECTION (Transparent Evidence Retrieval Status) */}
      <div className="p-6 rounded-2xl glass-panel border border-slate-800 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <Search className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-white">External Evidence &amp; Citations</h3>
              <div className="text-xs text-slate-400">Cross-source corpus indexing</div>
            </div>
          </div>
          <span className="text-[11px] font-mono px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-slate-400">
            Stage 5 Architecture
          </span>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800/60 text-xs text-slate-400 space-y-2">
          <div className="font-semibold text-slate-300 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            Evidence retrieval is currently unavailable.
          </div>
          <p className="text-[11px] leading-relaxed">
            In accordance with scientific integrity rules, TrustNet AI does not fabricate external citations or web sources. Real-time news corpus search and fact-checking knowledge base connections are scheduled for Stage 5.
          </p>
        </div>
      </div>

      {/* Video Suspicious Frames Section (if Video or Roadmap demonstration) */}
      {analysis.content_type === 'video' && (
        <SuspiciousFramesTimeline />
      )}

      {/* Feature Matrix & Grounded Findings Section */}
      <div className="space-y-8">
        <FeatureMatrix features={analysis.features} />
        <FindingsList findings={analysis.findings} />
        <ProcessingTimeline timeline={analysis.processing_timeline} />
      </div>

      {/* Scientific Limitation statement banner */}
      <DisclaimerBanner />
    </div>
  );
}
