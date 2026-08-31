'use client';

import React from 'react';
import { ShieldCheck, Scale, Lock, Eye, AlertCircle, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { DisclaimerBanner } from '@/components/layout/DisclaimerBanner';

export default function AboutPage() {
  const principles = [
    {
      icon: Scale,
      title: 'Probabilistic, Not Infallible',
      description: 'TrustNet AI is designed not as a binary "truth machine", but as a probabilistic multi-signal estimator. We distinguish strictly between media authenticity, tampering risk, source reliability, and claim corroboration.',
    },
    {
      icon: Eye,
      title: 'Transparent & Explainable AI',
      description: 'Every score is decomposed into explicit physical feature measurements (sensor noise, compression anomalies, EXIF tags) and calibrated model likelihoods. We avoid black-box scores and hallucinated citations.',
    },
    {
      icon: Lock,
      title: 'Security & Privacy First',
      description: 'Uploads are treated as untrusted, isolated in memory, sanitized with magic byte validation, and processed ephemerally with zero permanent storage of sensitive biometric assets.',
    },
  ];

  const roadmapStages = [
    { stage: 'Stage 1 (Active MVP)', name: 'Image Forensics & Trust Scoring Core', desc: 'FastAPI service, OpenCV feature extraction (ELA, noise, EXIF), Next.js dashboard, explainable findings.' },
    { stage: 'Stage 2', name: 'Real Deep Learning Model Integration', desc: 'Pre-trained EfficientNet-B4 / Vision Transformer weights, calibrated softmax temperatures.' },
    { stage: 'Stage 3', name: 'Video Intelligence & Temporal Tracking', desc: 'Keyframe extraction, temporal flow consistency, facial bounding box analysis.' },
    { stage: 'Stage 4', name: 'Audio Intelligence & Synthetic Speech', desc: 'Mel spectrogram CNNs, neural vocoder artifact detection, voice clone classification.' },
    { stage: 'Stage 5', name: 'NLP Claim Extraction & Evidence Retrieval', desc: 'Automated claim proposition extraction, vector search against verified knowledge bases.' },
    { stage: 'Stage 6', name: 'Multimodal Fusion & Full Enterprise Platform', desc: 'End-to-end cross-modal attention fusion, team workspaces, compliance auditing.' },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* Header */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-xs font-mono text-cyan-400">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Platform Mission &amp; Scientific Integrity</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          About TrustNet AI
        </h1>
        <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
          Building verifiable, explainable digital media forensics to protect public discourse and information authenticity in the AI era.
        </p>
      </div>

      {/* Core Principles */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {principles.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.title}
              className="p-6 rounded-2xl glass-panel border border-slate-800 space-y-4"
            >
              <div className="p-3 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 w-fit">
                <Icon className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">{item.title}</h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {item.description}
              </p>
            </div>
          );
        })}
      </div>

      {/* Scientific Limitation Deep Dive */}
      <div className="p-8 rounded-3xl glass-panel border border-cyan-500/30 space-y-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-cyan-500/20 text-cyan-400">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-white">
            Our Stance on AI Detection Limitations
          </h2>
        </div>

        <div className="space-y-4 text-xs sm:text-sm text-slate-300 leading-relaxed">
          <p>
            Digital media forensics is fundamentally an exercise in probability and statistical signal estimation. No algorithmic system can guarantee 100% certainty regarding human intent or absolute physical reality.
          </p>
          <p>
            To uphold scientific rigor, TrustNet AI enforces three core rules:
          </p>
          <ul className="space-y-2 list-disc pl-5 text-slate-400">
            <li>
              <strong className="text-slate-200">No False Certainty:</strong> We explicitly communicate confidence intervals and avoid binary true/false classifications.
            </li>
            <li>
              <strong className="text-slate-200">Signal Separation:</strong> Optical sensor traits, localized splicing rate deltas, and claims stance are analyzed independently before fusion.
            </li>
            <li>
              <strong className="text-slate-200">Explainable Findings:</strong> Every score is backed by inspectable physical anomalies rather than unverified black-box claims.
            </li>
          </ul>
        </div>
      </div>

      {/* Delivery Roadmap */}
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-white">Staged Delivery Roadmap</h2>
          <p className="text-xs sm:text-sm text-slate-400">
            From runnable Stage 1 MVP through comprehensive multimodal enterprise intelligence.
          </p>
        </div>

        <div className="space-y-3">
          {roadmapStages.map((stg, i) => (
            <div
              key={stg.stage}
              className={`p-5 rounded-2xl glass-panel border ${
                i === 0 ? 'border-cyan-500/40 bg-cyan-500/5' : 'border-slate-800'
              } flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4`}
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-mono font-bold ${i === 0 ? 'text-cyan-400' : 'text-slate-400'}`}>
                    {stg.stage}
                  </span>
                  <h4 className="text-sm font-bold text-white">{stg.name}</h4>
                </div>
                <p className="text-xs text-slate-400">{stg.desc}</p>
              </div>

              {i === 0 && (
                <span className="px-3 py-1 rounded-full text-xs font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shrink-0">
                  Ready &amp; Runnable
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Footer Disclaimer */}
      <DisclaimerBanner />
    </div>
  );
}
