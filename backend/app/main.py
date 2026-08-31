import uuid
from contextlib import asynccontextmanager
from datetime import datetime, timezone, timedelta
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import uvicorn

from app.core.config import settings
from app.api.routes import analyze, analysis, config
from app.services.repository import repository
from app.schemas.analysis import (
    AnalysisResponse, AnalysisStatus, ContentType, CoreSignals,
    ModelBreakdown, ImageFeatures, Finding, FindingSeverity,
    TrustBand, RiskLevel, ProcessingStep
)

def seed_sample_data():
    """Seed sample realistic analyses if the repository is empty."""
    items, total, _ = repository.list_analyses(limit=5)
    if total == 0:
        now = datetime.now(timezone.utc)
        
        # Sample 1: Authentic Photography
        sample_1 = AnalysisResponse(
            id="demo_auth_photo_01",
            status=AnalysisStatus.COMPLETED,
            content_type=ContentType.IMAGE,
            filename="national_park_wildlife.jpg",
            file_size=1845200,
            preview_url=None,
            associated_claim="Photo of mountain gorilla taken in Volcanoes National Park, Rwanda.",
            created_at=now - timedelta(hours=2),
            completed_at=now - timedelta(hours=2) + timedelta(seconds=1),
            trust_score=94,
            trust_band=TrustBand.HIGH_TRUST,
            risk_level=RiskLevel.MINIMAL,
            confidence=0.95,
            summary_explanation="Content is classified under 'High Trust' (Minimal Risk). Visual features, optical sensor noise distributions, and compression uniformity strongly support organic capture with minimal manipulation indicators.",
            signals=CoreSignals(
                authenticity_score=96.0,
                manipulation_risk=3.5,
                source_reliability=92.0,
                claim_support=90.0
            ),
            model_breakdown=ModelBreakdown(
                authentic_probability=0.96,
                ai_generated_probability=0.02,
                manipulated_probability=0.02,
                model_name="TrustNet-Vision-Ensemble-v1 (Demo / Mock)",
                is_demo_inference=True,
                calibrated_uncertainty=0.05
            ),
            features=ImageFeatures(
                dimensions=[3840, 2160],
                format="jpeg",
                color_channels=3,
                file_size_bytes=1845200,
                noise_variance=48.5,
                sharpness_variance=210.4,
                ela_discrepancy_score=11.2,
                has_exif=True,
                camera_make="Canon EOS R5",
                software_detected=None,
                compression_quality_estimate=92
            ),
            findings=[
                Finding(
                    id="find_demo_1",
                    severity=FindingSeverity.POSITIVE,
                    category="Provenance & Metadata",
                    title="Verified Camera Hardware Signature",
                    description="Authentic optical hardware metadata detected (Canon EOS R5). Valid capture timestamps and exposure parameters.",
                    technical_detail="EXIF hardware tags verified."
                ),
                Finding(
                    id="find_demo_2",
                    severity=FindingSeverity.POSITIVE,
                    category="Sensor Noise Distribution",
                    title="Natural Optical Sensor Noise Consistency",
                    description="High-frequency noise floor matches expected physical camera sensor distribution.",
                    technical_detail="Noise residual variance: 48.5."
                ),
                Finding(
                    id="find_demo_3",
                    severity=FindingSeverity.POSITIVE,
                    category="Compression Analysis",
                    title="Uniform Compression Artifact Distribution",
                    description="Error Level Analysis demonstrates consistent re-compression error rates across all quadrants.",
                    technical_detail="ELA discrepancy index: 11.2/100."
                )
            ],
            processing_timeline=[
                ProcessingStep(step_number=1, name="File Ingestion & Signature Validation", status="completed", duration_ms=40),
                ProcessingStep(step_number=2, name="EXIF & Hardware Metadata Extraction", status="completed", duration_ms=55),
                ProcessingStep(step_number=3, name="Error Level Analysis (ELA)", status="completed", duration_ms=105),
                ProcessingStep(step_number=4, name="OpenCV High-Frequency Noise & Sharpness", status="completed", duration_ms=80),
                ProcessingStep(step_number=5, name="Deep Vision Probabilistic Classification", status="completed", duration_ms=200),
                ProcessingStep(step_number=6, name="Multi-Signal Fusion & Trust Scoring", status="completed", duration_ms=25),
                ProcessingStep(step_number=7, name="Explainability & Finding Synthesis", status="completed", duration_ms=35)
            ]
        )
        
        # Sample 2: Synthetic AI Generated Portrait
        sample_2 = AnalysisResponse(
            id="demo_synthetic_ai_02",
            status=AnalysisStatus.COMPLETED,
            content_type=ContentType.IMAGE,
            filename="synthetic_executive_headshot.png",
            file_size=980400,
            preview_url=None,
            associated_claim="Profile picture of CEO at newly founded fintech startup.",
            created_at=now - timedelta(hours=5),
            completed_at=now - timedelta(hours=5) + timedelta(seconds=1),
            trust_score=16,
            trust_band=TrustBand.VERY_LOW_TRUST,
            risk_level=RiskLevel.CRITICAL,
            confidence=0.92,
            summary_explanation="Content evaluated as 'Very Low Trust' with Critical Risk. Multiple critical anomaly indicators (including synthetic smoothing, compression discrepancy, and latent diffusion markers) were detected.",
            signals=CoreSignals(
                authenticity_score=12.0,
                manipulation_risk=88.0,
                source_reliability=20.0,
                claim_support=30.0
            ),
            model_breakdown=ModelBreakdown(
                authentic_probability=0.08,
                ai_generated_probability=0.86,
                manipulated_probability=0.06,
                model_name="TrustNet-Vision-Ensemble-v1 (Demo / Mock)",
                is_demo_inference=True,
                calibrated_uncertainty=0.08
            ),
            features=ImageFeatures(
                dimensions=[1024, 1024],
                format="png",
                color_channels=3,
                file_size_bytes=980400,
                noise_variance=6.2,
                sharpness_variance=95.0,
                ela_discrepancy_score=38.4,
                has_exif=False,
                camera_make=None,
                software_detected=None,
                compression_quality_estimate=95
            ),
            findings=[
                Finding(
                    id="find_demo_4",
                    severity=FindingSeverity.ALERT,
                    category="Sensor Noise Distribution",
                    title="Synthetic Smoothing / Unnatural Uniformity",
                    description="Image exhibits unnaturally low sensor noise (6.2 variance), a hallmark of latent diffusion synthesis.",
                    technical_detail="Noise residual variance below organic camera baseline (20.0)."
                ),
                Finding(
                    id="find_demo_5",
                    severity=FindingSeverity.ALERT,
                    category="Deep Model Ensemble",
                    title="Generative AI Structural Indicators",
                    description="Deep learning vision ensemble detected 86% probability of synthetic generative model output.",
                    technical_detail="Feature embeddings match Stable Diffusion / Midjourney latent distributions."
                ),
                Finding(
                    id="find_demo_6",
                    severity=FindingSeverity.CAUTION,
                    category="Provenance & Metadata",
                    title="Stripped or Absent Metadata",
                    description="No hardware capture tags found in file headers.",
                    technical_detail="EXIF metadata block missing."
                )
            ],
            processing_timeline=[]
        )

        # Sample 3: Manipulated / Spliced Document
        sample_3 = AnalysisResponse(
            id="demo_manipulated_doc_03",
            status=AnalysisStatus.COMPLETED,
            content_type=ContentType.IMAGE,
            filename="financial_statement_receipt.jpg",
            file_size=640100,
            preview_url=None,
            associated_claim="Proof of wire transfer invoice payment.",
            created_at=now - timedelta(hours=9),
            completed_at=now - timedelta(hours=9) + timedelta(seconds=1),
            trust_score=31,
            trust_band=TrustBand.LOW_TRUST,
            risk_level=RiskLevel.HIGH,
            confidence=0.88,
            summary_explanation="Content evaluated as 'Low Trust' with High Risk. Significant localized compression inconsistency and software alteration tags detected.",
            signals=CoreSignals(
                authenticity_score=28.0,
                manipulation_risk=82.0,
                source_reliability=35.0,
                claim_support=40.0
            ),
            model_breakdown=ModelBreakdown(
                authentic_probability=0.18,
                ai_generated_probability=0.10,
                manipulated_probability=0.72,
                model_name="TrustNet-Vision-Ensemble-v1 (Demo / Mock)",
                is_demo_inference=True,
                calibrated_uncertainty=0.12
            ),
            features=ImageFeatures(
                dimensions=[1600, 1200],
                format="jpeg",
                color_channels=3,
                file_size_bytes=640100,
                noise_variance=32.1,
                sharpness_variance=140.5,
                ela_discrepancy_score=58.2,
                has_exif=True,
                camera_make=None,
                software_detected="Adobe Photoshop 24.1",
                compression_quality_estimate=78
            ),
            findings=[
                Finding(
                    id="find_demo_7",
                    severity=FindingSeverity.ALERT,
                    category="Provenance & Metadata",
                    title="Post-Processing Software Tag Detected",
                    description="Embedded metadata references image alteration tool: 'Adobe Photoshop 24.1'.",
                    technical_detail="Software header present in EXIF dictionary."
                ),
                Finding(
                    id="find_demo_8",
                    severity=FindingSeverity.ALERT,
                    category="Compression Analysis",
                    title="Localized Compression Inconsistency (ELA Discrepancy)",
                    description="Significant divergence in compression artifact rates (58.2/100) indicates targeted editing or splicing.",
                    technical_detail="ELA discrepancy score exceeds critical 40.0 threshold."
                )
            ],
            processing_timeline=[]
        )

        repository.save(sample_1)
        repository.save(sample_2)
        repository.save(sample_3)

@asynccontextmanager
async def lifespan(app: FastAPI):
    seed_sample_data()
    yield

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Multimodal Content Authenticity & Trust Scoring Platform",
    docs_url="/api/docs",
    redoc_url="/api/redoc",
    openapi_url="/api/openapi.json",
    lifespan=lifespan
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS + ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Friendly Global Exception Handler
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    return JSONResponse(
        status_code=500,
        content={
            "error": "Internal Server Error",
            "message": "An unexpected error occurred during analysis processing. Please verify file integrity and retry.",
            "type": exc.__class__.__name__
        }
    )

# Include Routers
app.include_router(analyze.router, prefix="/api")
app.include_router(analysis.router, prefix="/api")
app.include_router(config.router, prefix="/api")

@app.get("/api/health", tags=["System"])
async def health_check():
    return {
        "status": "healthy",
        "service": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "environment": settings.ENVIRONMENT,
        "timestamp": datetime.now(timezone.utc).isoformat()
    }

if __name__ == "__main__":
    uvicorn.run("main:app", host=settings.HOST, port=settings.PORT, reload=True)
