'use client';

import React from 'react';
import { 
  Cpu, Camera, Video, Mic, FileText, Layers, 
  Sparkles, CheckCircle2, Sliders, ShieldCheck, ArrowRight 
} from 'lucide-react';
import Link from 'next/link';
import { DisclaimerBanner } from '@/components/layout/DisclaimerBanner';

export default function TechnologyPage() {
  const pillars = [
    {
      id: 'cv-image',
      icon: Camera,
      title: '1. Computer Vision & Image Forensics',
      status: 'Live MVP & Demo Ensemble',
      statusColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
      description: 'Multi-tiered image analysis combining optical sensor noise statistics, Error Level Analysis (ELA), Laplacian sharpness, and deep Vision Transformer / EfficientNet classifiers.',
      components: [
        'High-Pass Noise Residual Variance (OpenCV Gaussian subtraction)',
        'Error Level Analysis (ELA) re-compression discrepancy delta',
        'Laplacian gradient variance for focus and sharpness distribution',
        'Camera EXIF & Hardware Provenance verification',
        'Interface ready for PyTorch EfficientNet-B4 / ConvNeXt weights',
      ],
      futureModels: 'EfficientNet-B4, XceptionNet, ConvNeXt-Large, CLIP-ViT-L/14',
    },
    {
      id: 'video-temporal',
      icon: Video,
      title: '2. Video Intelligence & Temporal Continuity',
      status: 'Stage 3 Roadmap',
      statusColor: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
      description: 'Temporal deepfake detection evaluating optical flow continuity, facial boundary sync, and intra-frame flicker anomalies across sampled keyframes.',
      components: [
        'Adaptive FPS keyframe extraction with face/object bounding boxes',
        'Frame-level CNN feature embedding extraction',
        'Temporal Transformer / 3D-CNN intra-frame motion continuity',
        'Audio-visual speech synchronization alignment check',
      ],
      futureModels: 'TimeSformer, Video-Swin, 3D ResNet, FaceForensics++ fine-tuned models',
    },
    {
      id: 'audio-voice',
      icon: Mic,
      title: '3. Audio Intelligence & Synthetic Speech',
      status: 'Stage 4 Roadmap',
      statusColor: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
      description: 'Acoustic forensics detecting synthetic voice clones, neural vocoder artifacts, and biological vocal tract physical constraints.',
      components: [
        'Mel-Frequency Cepstral Coefficients (MFCC) and Spectrogram transformation',
        'Phase discontinuity & high-frequency spectral flux analysis',
        'Synthetic speech generator artifact detection (ElevenLabs / VALL-E markers)',
        'Acoustic environment reverberation consistency',
      ],
      futureModels: 'Wav2Vec2, Audio Spectrogram Transformer (AST), RawNet2',
    },
    {
      id: 'nlp-claim',
      icon: FileText,
      title: '4. NLP Claim Extraction & Stance Verification',
      status: 'Live NLP Demo',
      statusColor: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
      description: 'Natural language pipeline extracting core factual propositions, identifying sensationalism patterns, and scoring cross-source consensus.',
      components: [
        'Named Entity Recognition (NER) & core proposition parsing',
        'Sensationalism and rhetorical urgency density scoring',
        'Multi-domain cross-source consensus verification',
        'Uncertainty-aware stance labels: Supported, Refuted, Insufficient Evidence',
      ],
      futureModels: 'RoBERTa-large-MNLI, DeBERTa-v3, ClaimBuster, Dense Retrieval (BGE)',
    },
    {
      id: 'multimodal-fusion',
      icon: Layers,
      title: '5. Multi-Signal Fusion Engine',
      status: 'Live Engine v2.1',
      statusColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
      description: 'Transparent mathematical fusion service combining independent signals into a calibrated 0–100 Trust Score with non-linear tampering penalties.',
      components: [
        'Independent signal isolation (Authenticity, Manipulation, Source, Claim)',
        'Critical Tampering Penalty activation when manipulation > 75%',
        'Bayesian confidence regression towards prior neutrality (50.0) under high uncertainty',
        'Configurable weights inspectable via /api/config/trust-engine',
      ],
      futureModels: 'Calibrated Logistic Fusion, Attention-based Cross-Modal Fusion',
    },
    {
      id: 'explainable-ai',
      icon: Sparkles,
      title: '6. Explainable AI & Evidence Synthesis',
      status: 'Live Generator',
      statusColor: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
      description: 'Generates evidence-grounded findings directly from computed physical metrics, avoiding hallucinated explanations and generic platitudes.',
      components: [
        'Signal-to-text grounded heuristic mapping',
        'Severity categorization (Positive, Caution, Alert)',
        'Granular technical parameter inspection for forensic experts',
        'Probabilistic confidence intervals communicated on all outputs',
      ],
      futureModels: 'Attribution Heatmaps (Grad-CAM), Counterfactual XAI Generator',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Header */}
      <div className="text-center space-y-3 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-xs font-mono text-cyan-400">
          <Cpu className="w-3.5 h-3.5" />
          <span>System Architecture &amp; AI Roadmap</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          TrustNet AI Architecture
        </h1>
        <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
          Explore the modular forensics infrastructure, signal processing algorithms, and deep learning model abstractions powering our multimodal trust scoring platform.
        </p>
      </div>

      {/* 6 Architecture Pillars Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {pillars.map((pillar) => {
          const Icon = pillar.icon;
          return (
            <div
              key={pillar.id}
              className="p-8 rounded-3xl glass-panel border border-slate-800 space-y-6 flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="p-3 rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-mono border ${pillar.statusColor}`}>
                    {pillar.status}
                  </span>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-white">{pillar.title}</h3>
                  <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
                    {pillar.description}
                  </p>
                </div>

                <div className="space-y-2 pt-2">
                  <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Core Technical Components:
                  </div>
                  <ul className="space-y-1.5 text-xs text-slate-300">
                    {pillar.components.map((comp, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                        <span>{comp}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-[11px] text-slate-400 font-mono">
                <span className="text-cyan-400 font-semibold font-sans mr-2">PyTorch Target Architecture:</span>
                {pillar.futureModels}
              </div>
            </div>
          );
        })}
      </div>

      {/* Scientific Limitation statement banner */}
      <DisclaimerBanner />
    </div>
  );
}
