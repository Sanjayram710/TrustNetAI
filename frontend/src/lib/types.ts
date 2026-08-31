export type ContentType = 'image' | 'video' | 'audio' | 'text' | 'document';

export type AnalysisStatus = 'pending' | 'processing' | 'completed' | 'failed';

export type TrustBand = 'High Trust' | 'Moderate Trust' | 'Uncertain' | 'Low Trust' | 'Very Low Trust';

export type RiskLevel = 'Minimal Risk' | 'Low Risk' | 'Elevated Risk' | 'High Risk' | 'Critical Risk';

export type FindingSeverity = 'positive' | 'caution' | 'alert';

export interface Finding {
  id: string;
  severity: FindingSeverity;
  category: string;
  title: string;
  description: string;
  technical_detail?: string;
}

export interface CoreSignals {
  authenticity_score: number;
  manipulation_risk: number;
  source_reliability: number;
  claim_support: number;
}

export interface ModelBreakdown {
  authentic_probability: number;
  ai_generated_probability: number;
  manipulated_probability: number;
  model_name: string;
  model_version?: string;
  is_demo_inference: boolean;
  calibrated_uncertainty: number;
}

export interface ImageFeatures {
  dimensions: [number, number];
  format: string;
  color_channels: number;
  file_size_bytes: number;
  noise_variance: number;
  sharpness_variance: number;
  ela_discrepancy_score: number;
  has_exif: boolean;
  camera_make?: string | null;
  software_detected?: string | null;
  compression_quality_estimate: number;
}

export interface ProcessingStep {
  step_number: number;
  name: string;
  status: 'completed' | 'in_progress' | 'pending';
  duration_ms?: number;
  message?: string;
}

export interface AnalysisResponse {
  id: string;
  status: AnalysisStatus;
  content_type: ContentType;
  filename?: string | null;
  file_size?: number | null;
  preview_url?: string | null;
  associated_claim?: string | null;
  created_at: string;
  completed_at?: string | null;
  
  trust_score: number;
  trust_band: TrustBand;
  risk_level: RiskLevel;
  confidence: number;
  summary_explanation: string;
  
  signals: CoreSignals;
  model_breakdown: ModelBreakdown;
  features?: ImageFeatures | null;
  findings: Finding[];
  processing_timeline: ProcessingStep[];
  disclaimer: string;
}

export interface AnalysisSummaryMetrics {
  total_analyses: number;
  authentic_count: number;
  suspicious_count: number;
  high_risk_count: number;
  average_trust_score: number;
}

export interface AnalysisListResponse {
  metrics: AnalysisSummaryMetrics;
  items: AnalysisResponse[];
  total: number;
  page: number;
  page_size: number;
}

export interface TrustEngineConfig {
  weights: {
    media_authenticity: number;
    manipulation_risk: number;
    source_reliability: number;
    claim_support: number;
  };
  trust_bands: Record<string, { min: number; max: number; risk_level: string }>;
  tampering_penalty_threshold: number;
  formula_version: string;
}
