'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Camera, Video, Mic, FileText, FileCheck, 
  Sparkles, AlertCircle, RefreshCw, Send, Layers 
} from 'lucide-react';
import { Dropzone } from '@/components/analyze/Dropzone';
import { StagedProgress } from '@/components/analyze/StagedProgress';
import { DisclaimerBanner } from '@/components/layout/DisclaimerBanner';
import { api } from '@/lib/api';
import { AnalysisResponse, ContentType } from '@/lib/types';

export default function AnalyzePage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<ContentType>('image');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResponse | null>(null);

  // Text analysis state
  const [textContent, setTextContent] = useState('');
  const [textSourceUrl, setTextSourceUrl] = useState('');

  const tabs: { id: ContentType; label: string; icon: any; badge?: string }[] = [
    { id: 'image', label: 'Image Forensics', icon: Camera, badge: 'Active MVP' },
    { id: 'text', label: 'Text & Claims', icon: FileText, badge: 'Live NLP' },
    { id: 'video', label: 'Video Intelligence', icon: Video, badge: 'Demo' },
    { id: 'audio', label: 'Audio & Voice', icon: Mic, badge: 'Demo' },
    { id: 'document', label: 'Document / OCR', icon: FileCheck, badge: 'Demo' },
  ];

  const handleImageAnalyze = async (file: File, claim?: string) => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const result = await api.analyzeImage(file, claim);
      setAnalysisResult(result);
    } catch (err: any) {
      setIsLoading(false);
      setErrorMessage(err.message || 'An error occurred during analysis.');
    }
  };

  const handleTextAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!textContent.trim()) {
      setErrorMessage('Please enter claim or news text to analyze.');
      return;
    }
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const result = await api.analyzeText(textContent, textSourceUrl);
      setAnalysisResult(result);
    } catch (err: any) {
      setIsLoading(false);
      setErrorMessage(err.message || 'An error occurred during text analysis.');
    }
  };

  const handleProgressComplete = () => {
    if (analysisResult) {
      router.push(`/results/${analysisResult.id}`);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-xs font-mono text-cyan-400">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Multimodal Content Verification Hub</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Analyze Content Authenticity
        </h1>
        <p className="text-sm sm:text-base text-slate-400 max-w-xl mx-auto">
          Upload media or paste claims to evaluate optical sensor noise, compression patterns, metadata integrity, and model probability.
        </p>
      </div>

      {/* If loading, show Staged Progress Screen */}
      {isLoading ? (
        <StagedProgress onComplete={handleProgressComplete} />
      ) : (
        <div className="space-y-8">
          {/* Modality Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 p-1.5 rounded-2xl bg-slate-900/80 border border-slate-800">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setErrorMessage(null);
                  }}
                  className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-slate-800 text-cyan-400 border border-cyan-500/40 shadow-lg'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                  {tab.badge && (
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${
                        isActive
                          ? 'bg-cyan-500/20 text-cyan-300'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Error Message Display */}
          {errorMessage && (
            <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-start gap-3 text-xs text-rose-300">
              <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <div className="font-bold text-rose-200">Analysis Error</div>
                <div>{errorMessage}</div>
              </div>
            </div>
          )}

          {/* Active Tab Panel */}
          <div className="p-6 sm:p-8 rounded-3xl glass-panel border border-slate-800">
            {activeTab === 'image' && (
              <Dropzone onAnalyze={handleImageAnalyze} isLoading={isLoading} />
            )}

            {activeTab === 'text' && (
              <form onSubmit={handleTextAnalyze} className="space-y-6">
                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                    Claim or Article Text to Verify:
                  </label>
                  <textarea
                    rows={5}
                    value={textContent}
                    onChange={(e) => setTextContent(e.target.value)}
                    placeholder="Enter claim text (e.g. 'Researchers achieve net energy gain in nuclear fusion replication at national laboratory...')"
                    className="w-full p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors resize-none"
                    disabled={isLoading}
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                    Source URL (Optional):
                  </label>
                  <input
                    type="url"
                    value={textSourceUrl}
                    onChange={(e) => setTextSourceUrl(e.target.value)}
                    placeholder="https://example-news.org/article-breakthrough"
                    className="w-full px-4 py-3 rounded-xl bg-slate-900/80 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
                    disabled={isLoading}
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading || !textContent.trim()}
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 text-white font-bold text-base hover:from-cyan-400 hover:to-indigo-500 disabled:opacity-50 transition-all shadow-glow-cyan flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Analyze Claim Stance with TrustNet AI</span>
                </button>
              </form>
            )}

            {activeTab === 'video' && (
              <div className="space-y-6">
                <div className="p-4 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-xs text-cyan-300">
                  <strong>Stage 3 Architecture Demo:</strong> Temporal keyframe analysis and optical face tracking are ready for model weight integration. You can upload a sample MP4/MOV to view simulated temporal forensics.
                </div>
                <Dropzone onAnalyze={handleImageAnalyze} isLoading={isLoading} />
              </div>
            )}

            {activeTab === 'audio' && (
              <div className="space-y-6">
                <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/20 text-xs text-purple-300">
                  <strong>Stage 4 Architecture Demo:</strong> Mel spectrogram acoustic feature extraction and voice cloning classification are configured. Upload audio or sample to inspect acoustic forensics.
                </div>
                <Dropzone onAnalyze={handleImageAnalyze} isLoading={isLoading} />
              </div>
            )}

            {activeTab === 'document' && (
              <div className="space-y-6">
                <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300">
                  <strong>Stage 6 Architecture Demo:</strong> Layout tampering, font rendering consistency, and OCR verification pipeline.
                </div>
                <Dropzone onAnalyze={handleImageAnalyze} isLoading={isLoading} />
              </div>
            )}
          </div>

          <DisclaimerBanner />
        </div>
      )}
    </div>
  );
}
