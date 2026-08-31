from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional, Dict, Any
from enum import Enum
from datetime import datetime

class ContentType(str, Enum):
    IMAGE = "image"
    VIDEO = "video"
    AUDIO = "audio"
    TEXT = "text"
    DOCUMENT = "document"

class AnalysisStatus(str, Enum):
    PENDING = "pending"
    PROCESSING = "processing"
    COMPLETED = "completed"
    FAILED = "failed"

class TrustBand(str, Enum):
    HIGH_TRUST = "High Trust"          # 80 - 100
    MODERATE_TRUST = "Moderate Trust"  # 60 - 79
    UNCERTAIN = "Uncertain"            # 40 - 59
    LOW_TRUST = "Low Trust"            # 20 - 39
    VERY_LOW_TRUST = "Very Low Trust"  # 0 - 19

class RiskLevel(str, Enum):
    MINIMAL = "Minimal Risk"
    LOW = "Low Risk"
    ELEVATED = "Elevated Risk"
    HIGH = "High Risk"
    CRITICAL = "Critical Risk"

class FindingSeverity(str, Enum):
    POSITIVE = "positive"  # Green / Indicating authentic traits
    CAUTION = "caution"    # Yellow/Amber / Inconclusive or minor artifact
    ALERT = "alert"        # Red/Rose / High manipulation or synthetic indicator

class Finding(BaseModel):
    id: str
    severity: FindingSeverity
    category: str
    title: str
    description: str
    technical_detail: Optional[str] = None

class CoreSignals(BaseModel):
    authenticity_score: float = Field(..., ge=0.0, le=100.0, description="Estimated organic capture probability (0-100)")
    manipulation_risk: float = Field(..., ge=0.0, le=100.0, description="Estimated probability of tampering/splicing (0-100)")
    source_reliability: float = Field(..., ge=0.0, le=100.0, description="Metadata & provenance integrity (0-100)")
    claim_support: float = Field(..., ge=0.0, le=100.0, description="Contextual evidence corroboration (0-100)")

class ModelBreakdown(BaseModel):
    model_config = ConfigDict(protected_namespaces=())
    
    authentic_probability: float = Field(..., ge=0.0, le=1.0)
    ai_generated_probability: float = Field(..., ge=0.0, le=1.0)
    manipulated_probability: float = Field(..., ge=0.0, le=1.0)
    model_name: str
    model_version: str = "1.0.0"
    is_demo_inference: bool = True
    calibrated_uncertainty: float = Field(0.08, ge=0.0, le=1.0)

class ImageFeatures(BaseModel):
    dimensions: List[int] = Field(default_factory=lambda: [0, 0])
    format: str = "unknown"
    color_channels: int = 3
    file_size_bytes: int = 0
    noise_variance: float = 0.0
    sharpness_variance: float = 0.0
    ela_discrepancy_score: float = 0.0
    has_exif: bool = False
    camera_make: Optional[str] = None
    software_detected: Optional[str] = None
    compression_quality_estimate: int = 85

class ProcessingStep(BaseModel):
    step_number: int
    name: str
    status: str  # completed, in_progress, pending
    duration_ms: Optional[int] = None
    message: Optional[str] = None

class AnalysisResponse(BaseModel):
    model_config = ConfigDict(protected_namespaces=())

    id: str
    status: AnalysisStatus
    content_type: ContentType
    filename: Optional[str] = None
    file_size: Optional[int] = None
    preview_url: Optional[str] = None
    associated_claim: Optional[str] = None
    created_at: datetime
    completed_at: Optional[datetime] = None
    
    # Fusion output
    trust_score: int = Field(..., ge=0, le=100)
    trust_band: TrustBand
    risk_level: RiskLevel
    confidence: float = Field(..., ge=0.0, le=1.0)
    summary_explanation: str
    
    # Granular components
    signals: CoreSignals
    model_breakdown: ModelBreakdown
    features: Optional[ImageFeatures] = None
    findings: List[Finding] = Field(default_factory=list)
    processing_timeline: List[ProcessingStep] = Field(default_factory=list)
    
    # Disclaimer
    disclaimer: str = (
        "This result represents a model-based probabilistic assessment and should not "
        "be treated as absolute proof of authenticity or deception."
    )

class AnalysisStatusResponse(BaseModel):
    id: str
    status: AnalysisStatus
    progress_percentage: int = Field(..., ge=0, le=100)
    current_step: str
    processing_timeline: List[ProcessingStep] = Field(default_factory=list)

class TextAnalysisRequest(BaseModel):
    text: str = Field(..., min_length=5, max_length=10000, description="Claim or article text to analyze")
    source_url: Optional[str] = None
    author: Optional[str] = None

class AnalysisSummaryMetrics(BaseModel):
    total_analyses: int
    authentic_count: int
    suspicious_count: int
    high_risk_count: int
    average_trust_score: float

class AnalysisListResponse(BaseModel):
    metrics: AnalysisSummaryMetrics
    items: List[AnalysisResponse]
    total: int
    page: int
    page_size: int
