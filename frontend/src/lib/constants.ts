import { TrustBand, RiskLevel } from './types';

export const TRUST_BAND_COLORS: Record<TrustBand, {
  text: string;
  bg: string;
  border: string;
  glow: string;
  barColor: string;
}> = {
  'High Trust': {
    text: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/30',
    glow: 'shadow-glow-emerald',
    barColor: '#10b981',
  },
  'Moderate Trust': {
    text: 'text-cyan-400',
    bg: 'bg-cyan-500/10',
    border: 'border-cyan-500/30',
    glow: 'shadow-glow-cyan',
    barColor: '#06b6d4',
  },
  'Uncertain': {
    text: 'text-amber-400',
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/30',
    glow: 'shadow-glow-amber',
    barColor: '#f59e0b',
  },
  'Low Trust': {
    text: 'text-orange-400',
    bg: 'bg-orange-500/10',
    border: 'border-orange-500/30',
    glow: 'shadow-orange-500/30',
    barColor: '#f97316',
  },
  'Very Low Trust': {
    text: 'text-rose-400',
    bg: 'bg-rose-500/10',
    border: 'border-rose-500/30',
    glow: 'shadow-glow-rose',
    barColor: '#f43f5e',
  },
};

export const SAMPLE_PRESETS = [
  {
    id: 'sample_camera',
    title: 'Authentic Photo (Canon EOS)',
    description: 'High-resolution nature photo with natural sensor noise floor and verified EXIF data.',
    type: 'image',
    claim: 'Unedited wildlife photograph captured in national park.',
    badge: 'Expected: High Trust',
    color: 'emerald',
  },
  {
    id: 'sample_diffusion',
    title: 'AI Diffusion Portrait',
    description: 'Midjourney/Flux generated portrait with hyper-smooth textures and absent EXIF.',
    type: 'image',
    claim: 'Authentic passport photograph submitted for verification.',
    badge: 'Expected: Very Low Trust',
    color: 'rose',
  },
  {
    id: 'sample_spliced',
    title: 'Manipulated Invoice / Document',
    description: 'Spliced financial statement with high Error Level Analysis (ELA) discrepancy.',
    type: 'image',
    claim: 'Official bank wire receipt payment confirmation.',
    badge: 'Expected: Low Trust (Spliced)',
    color: 'amber',
  },
];
