'use client';

import React from 'react';
import Link from 'next/link';
import { 
  ShieldCheck, Camera, Video, Mic, FileText, 
  ArrowRight, Activity, Sparkles, Layers, Cpu, 
  Search, CheckCircle2, AlertTriangle, ShieldAlert
} from 'lucide-react';
import { DisclaimerBanner } from '@/components/layout/DisclaimerBanner';

export default function HomePage() {
  const capabilities = [
    {
      icon: Camera,
      title: 'Image Forensics',
      status: 'Live MVP',
      statusColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
      description: 'Optical sensor noise variance, Error Level Analysis (ELA), camera EXIF provenance, and deep ensemble classification.',
      signals: ['Sensor Noise Residual', 'ELA Discrepancy', 'EXIF Integrity', 'Vision Transformer'],
    },
    {
      icon: Video,
      title: 'Video Intelligence',
      status: 'Roadmap (Stage 3)',
      statusColor: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
      description: 'Temporal continuity evaluation, facial keypoint optical flow, and frame-by-frame anomaly detection.',
      signals: ['Keyframe Sampling', 'Temporal Flow', 'Facial Boundary Sync', 'Frame Anomaly Timeline'],
    },
    {
      icon: Mic,
      title: 'Audio Forensics',
      status: 'Roadmap (Stage 4)',
      statusColor: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
      description: 'Mel Spectrogram analysis, synthetic vocal tract acoustics, and AI voice cloning detection.',
      signals: ['Spectral Flux Variance', 'Phase Discontinuity', 'Voice Clone Likelihood', 'Bio-Acoustics'],
    },
    {
      icon: FileText,
      title: 'Claim & Text Stance',
      status: 'Live NLP Demo',
      statusColor: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
      description: 'Entity extraction, sensationalism detection, and uncertainty-aware cross-source agreement scoring.',
      signals: ['Claim Extraction', 'Stance Agreement', 'Source Reliability', 'Evidence Weighting'],
    },
  ];

  const steps = [
    {
      num: '01',
      title: 'Ingestion & Security',
      desc: 'Multimodal input is validated via magic byte signatures and sanitized into safe memory buffers.',
    },
    {
      num: '02',
      title: 'Feature Extraction',
      desc: 'Computer vision and acoustic signal processing extract low-level physical capture features.',
    },
    {
      num: '03',
      title: 'Multi-Signal Fusion',
      desc: 'Independent signals are scored separately before fusion into a balanced 0–100 Trust Score.',
    },
    {
      num: '04',
      title: 'Explainable Report',
      desc: 'Evidence findings, probability breakdowns, and confidence intervals are synthesized transparently.',
    },
  ];

  return (
    <div className="space-y-24 pb-20">
      {/* Hero Section */}
      <section className="relative pt-16 sm:pt-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center space-y-8">
        {/* Glow backdrop */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 sm:w-[600px] h-96 sm:h-[600px] bg-gradient-to-tr from-cyan-500/20 via-blue-600/10 to-transparent rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-slate-800 text-xs text-slate-300 shadow-lg">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>Multimodal Content Authenticity &amp; Integrity Platform</span>
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
        </div>

        <div className="space-y-4 max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white leading-tight">
            Can You Trust <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400">
              What You See?
            </span>
          </h1>
          <p className="text-base sm:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
            In an era of generative diffusion models and deceptive deepfakes, TrustNet AI delivers transparent, multi-signal authenticity estimation and explainable 0–100 trust scores.
          </p>
        </div>

        {/* Hero CTAs */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
          <Link
            href="/analyze"
            className="flex items-center gap-2.5 px-7 py-4 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 text-white font-bold text-base hover:from-cyan-400 hover:to-indigo-500 transition-all shadow-glow-cyan"
          >
            <ShieldCheck className="w-5 h-5" />
            <span>Analyze Content</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </Link>

          <Link
            href="/technology"
            className="flex items-center gap-2 px-6 py-4 rounded-xl bg-slate-900/80 border border-slate-700 text-slate-200 font-semibold text-base hover:bg-slate-800 hover:text-white transition-all"
          >
            <Cpu className="w-5 h-5 text-cyan-400" />
            <span>Explore Technology</span>
          </Link>
        </div>

        {/* Scientific Limitation statement banner */}
        <div className="max-w-3xl mx-auto pt-6 text-left">
          <DisclaimerBanner />
        </div>
      </section>

      {/* Multimodal Capability Matrix */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-3">
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Comprehensive Multimodal Forensics
          </h2>
          <p className="text-sm sm:text-base text-slate-400 max-w-xl mx-auto">
            Distinct specialized pipelines evaluate specific artifact modalities before fusing into unified trust scoring.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {capabilities.map((cap) => {
            const Icon = cap.icon;
            return (
              <div
                key={cap.title}
                className="p-8 rounded-2xl glass-panel glass-panel-hover border border-slate-800/80 space-y-6 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="p-3 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-mono border ${cap.statusColor}`}>
                      {cap.status}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-white">{cap.title}</h3>
                    <p className="text-sm text-slate-300 mt-2 leading-relaxed">
                      {cap.description}
                    </p>
                  </div>
                </div>

                <div className="space-y-2 pt-4 border-t border-slate-800/60">
                  <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Extracted Signals:
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {cap.signals.map((sig) => (
                      <span
                        key={sig}
                        className="px-2.5 py-1 rounded-lg bg-slate-900/90 border border-slate-800 text-xs text-slate-300 font-mono"
                      >
                        {sig}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-3">
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            How TrustNet AI Analyzes Media
          </h2>
          <p className="text-sm sm:text-base text-slate-400 max-w-xl mx-auto">
            A transparent 4-stage pipeline distinguishing physical capture signatures from generative artifacts.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step) => (
            <div
              key={step.num}
              className="p-6 rounded-2xl glass-panel border border-slate-800/80 space-y-3 relative overflow-hidden"
            >
              <div className="text-3xl font-black font-mono text-cyan-400/30">
                {step.num}
              </div>
              <h4 className="text-base font-bold text-white">{step.title}</h4>
              <p className="text-xs text-slate-400 leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Trust Score Spectrum Breakdown */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 rounded-3xl glass-panel border border-slate-800 space-y-8">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <h3 className="text-2xl sm:text-3xl font-bold text-white">
              Calibrated Trust Score Bands
            </h3>
            <p className="text-sm text-slate-400">
              The continuous 0–100 Trust Score maps to calibrated risk levels, preventing misleading binary classifications.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 space-y-2 text-center">
              <div className="font-mono text-xl font-bold text-emerald-400">80 – 100</div>
              <div className="text-xs font-bold text-white uppercase">High Trust</div>
              <div className="text-[11px] text-slate-400">Minimal manipulation risk &amp; intact optical noise floor.</div>
            </div>

            <div className="p-4 rounded-xl bg-cyan-500/10 border border-cyan-500/30 space-y-2 text-center">
              <div className="font-mono text-xl font-bold text-cyan-400">60 – 79</div>
              <div className="text-xs font-bold text-white uppercase">Moderate Trust</div>
              <div className="text-[11px] text-slate-400">Likely authentic with minor compression or missing EXIF.</div>
            </div>

            <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 space-y-2 text-center">
              <div className="font-mono text-xl font-bold text-amber-400">40 – 59</div>
              <div className="text-xs font-bold text-white uppercase">Uncertain</div>
              <div className="text-[11px] text-slate-400">Inconclusive feature distribution or low model confidence.</div>
            </div>

            <div className="p-4 rounded-xl bg-orange-500/10 border border-orange-500/30 space-y-2 text-center">
              <div className="font-mono text-xl font-bold text-orange-400">20 – 39</div>
              <div className="text-xs font-bold text-white uppercase">Low Trust</div>
              <div className="text-[11px] text-slate-400">Elevated synthetic smoothing or localized splicing indicators.</div>
            </div>

            <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 space-y-2 text-center">
              <div className="font-mono text-xl font-bold text-rose-400">0 – 19</div>
              <div className="text-xs font-bold text-white uppercase">Very Low Trust</div>
              <div className="text-[11px] text-slate-400">Severe manipulation patterns or synthetic generator signatures.</div>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-10 rounded-3xl bg-gradient-to-r from-cyan-900/40 via-blue-900/30 to-slate-900/80 border border-cyan-500/30 text-center space-y-6 shadow-2xl relative overflow-hidden">
          <div className="space-y-2 max-w-xl mx-auto">
            <h3 className="text-2xl sm:text-3xl font-bold text-white">
              Ready to verify digital content?
            </h3>
            <p className="text-sm text-slate-300">
              Upload an image, video, audio clip, or text claim to run full multimodal forensics.
            </p>
          </div>

          <Link
            href="/analyze"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-cyan-500 text-slate-950 font-bold text-base hover:bg-cyan-400 transition-all shadow-glow-cyan"
          >
            <span>Launch Analyzer</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
