import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Github, ExternalLink } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-slate-800/80 bg-slate-950 py-12 px-4 sm:px-6 lg:px-8 mt-20">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Brand Column */}
        <div className="space-y-4 md:col-span-2">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-500/30 text-cyan-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <span className="font-bold text-lg text-white">TrustNet AI</span>
          </div>
          <p className="text-sm text-slate-400 max-w-md leading-relaxed">
            Next-generation multimodal digital content authenticity and trust scoring engine. Fuses optical sensor noise, compression patterns, metadata integrity, and deep learning models to combat deceptive synthetic media.
          </p>
          <div className="text-xs text-slate-500">
            &copy; {new Date().getFullYear()} TrustNet AI Architecture. Built for verifiable digital integrity.
          </div>
        </div>

        {/* Navigation */}
        <div className="space-y-3">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-300">
            Product Platform
          </div>
          <ul className="space-y-2 text-sm text-slate-400">
            <li>
              <Link href="/analyze" className="hover:text-cyan-400 transition-colors">
                Multimodal Analyzer
              </Link>
            </li>
            <li>
              <Link href="/dashboard" className="hover:text-cyan-400 transition-colors">
                Analysis History & Metrics
              </Link>
            </li>
            <li>
              <Link href="/technology" className="hover:text-cyan-400 transition-colors">
                AI Architecture & Roadmap
              </Link>
            </li>
            <li>
              <Link href="/about" className="hover:text-cyan-400 transition-colors">
                Scientific Limitations & Ethics
              </Link>
            </li>
          </ul>
        </div>

        {/* Technical Principles */}
        <div className="space-y-3">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-300">
            Core Signals
          </div>
          <ul className="space-y-2 text-xs text-slate-400">
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              Media Authenticity Index
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-400"></span>
              Manipulation & Splicing Risk
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
              Hardware Source Reliability
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-400"></span>
              Cross-Source Claim Support
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
};
