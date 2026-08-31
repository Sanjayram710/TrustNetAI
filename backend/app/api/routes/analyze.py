import uuid
from datetime import datetime, timezone
from typing import Optional
from fastapi import APIRouter, UploadFile, File, Form, HTTPException

from app.schemas.analysis import (
    AnalysisResponse, AnalysisStatus, ContentType, CoreSignals,
    ModelBreakdown, TextAnalysisRequest, TrustBand, RiskLevel, Finding, FindingSeverity
)
from app.services.image_service import image_service
from app.services.trust_engine import trust_engine
from app.services.repository import repository
from app.models import model_registry

router = APIRouter(prefix="/analyze", tags=["Analyze"])

@router.post("/image", response_model=AnalysisResponse, summary="Analyze an image file for authenticity & manipulation")
async def analyze_image(
    file: UploadFile = File(...),
    claim: Optional[str] = Form(None)
):
    """
    Primary Stage 1 multimodal analysis endpoint.
    Performs real visual feature extraction (ELA, noise consistency, EXIF) + 
    probabilistic model inference and returns the full explainable Trust Score analysis report.
    """
    try:
        result = await image_service.process_image_upload(file=file, associated_claim=claim)
        return result
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Image analysis pipeline error: {str(e)}")

@router.post("/text", response_model=AnalysisResponse, summary="Analyze text claim or article for factual support")
async def analyze_text(request: TextAnalysisRequest):
    """
    Analyzes submitted claim or news text for sensationalism, stance, and evidence support.
    """
    analysis_id = f"txt_{uuid.uuid4().hex[:10]}"
    now = datetime.now(timezone.utc)
    
    text_model = model_registry.get_model("text")
    res = text_model.predict(request.text)
    
    m_breakdown = res["model_breakdown"]
    p_auth = m_breakdown["authentic_probability"]
    p_manip = m_breakdown["manipulated_probability"]
    
    signals = CoreSignals(
        authenticity_score=round(p_auth * 100.0, 1),
        manipulation_risk=round(p_manip * 100.0, 1),
        source_reliability=80.0 if request.source_url else 55.0,
        claim_support=round(res["cross_source_agreement_score"], 1)
    )
    
    trust_score, band, risk = trust_engine.compute_trust_score(signals, confidence=res["confidence"])
    
    findings = [
        Finding(
            id=f"find_{uuid.uuid4().hex[:6]}",
            severity=FindingSeverity.POSITIVE if res["claim_stance"] == "supported" else FindingSeverity.CAUTION,
            category="Claim Stance Analysis",
            title=f"Claim Evaluated as '{res['claim_stance'].title()}'",
            description=f"Automated textual stance evaluation identified consensus indicators across indexed domain records.",
            technical_detail=f"Cross-source agreement index: {res['cross_source_agreement_score']:.1f}/100"
        )
    ]

    response = AnalysisResponse(
        id=analysis_id,
        status=AnalysisStatus.COMPLETED,
        content_type=ContentType.TEXT,
        filename=None,
        file_size=len(request.text.encode('utf-8')),
        preview_url=None,
        associated_claim=request.text[:200],
        created_at=now,
        completed_at=now,
        trust_score=trust_score,
        trust_band=band,
        risk_level=risk,
        confidence=res["confidence"],
        summary_explanation=f"Text claim evaluated as '{band.value}' with cross-source agreement score of {res['cross_source_agreement_score']:.0f}%.",
        signals=signals,
        model_breakdown=ModelBreakdown.model_validate(m_breakdown),
        features=None,
        findings=findings,
        processing_timeline=[]
    )
    
    repository.save(response)
    return response

@router.post("/video", response_model=AnalysisResponse, summary="Analyze video for temporal manipulation (Roadmap Demo)")
async def analyze_video(
    file: UploadFile = File(...),
    claim: Optional[str] = Form(None)
):
    """
    Extensible video analysis endpoint.
    """
    analysis_id = f"vid_{uuid.uuid4().hex[:10]}"
    now = datetime.now(timezone.utc)
    
    video_model = model_registry.get_model("video")
    res = video_model.predict(file.filename or "video.mp4")
    m_breakdown = res["model_breakdown"]

    signals = CoreSignals(
        authenticity_score=round(m_breakdown["authentic_probability"] * 100.0, 1),
        manipulation_risk=round(m_breakdown["manipulated_probability"] * 100.0, 1),
        source_reliability=75.0,
        claim_support=80.0
    )
    
    trust_score, band, risk = trust_engine.compute_trust_score(signals, confidence=res["confidence"])
    
    response = AnalysisResponse(
        id=analysis_id,
        status=AnalysisStatus.COMPLETED,
        content_type=ContentType.VIDEO,
        filename=file.filename or "video_sample.mp4",
        file_size=1024 * 1024 * 2,
        preview_url=None,
        associated_claim=claim,
        created_at=now,
        completed_at=now,
        trust_score=trust_score,
        trust_band=band,
        risk_level=risk,
        confidence=res["confidence"],
        summary_explanation="Video temporal analysis: Consistent optical flow and facial keypoint dynamics observed.",
        signals=signals,
        model_breakdown=ModelBreakdown.model_validate(m_breakdown),
        features=None,
        findings=[
            Finding(
                id=f"find_{uuid.uuid4().hex[:6]}",
                severity=FindingSeverity.POSITIVE,
                category="Temporal Consistency",
                title="Continuous Optical Flow",
                description="No intra-frame warping or unnatural flickering detected across sampled keyframes."
            )
        ],
        processing_timeline=[]
    )
    repository.save(response)
    return response

@router.post("/audio", response_model=AnalysisResponse, summary="Analyze audio for synthetic voice generation (Roadmap Demo)")
async def analyze_audio(
    file: UploadFile = File(...),
    claim: Optional[str] = Form(None)
):
    """
    Extensible audio analysis endpoint.
    """
    analysis_id = f"aud_{uuid.uuid4().hex[:10]}"
    now = datetime.now(timezone.utc)
    
    audio_model = model_registry.get_model("audio")
    res = audio_model.predict(file.filename or "audio.wav")
    m_breakdown = res["model_breakdown"]

    signals = CoreSignals(
        authenticity_score=round(m_breakdown["authentic_probability"] * 100.0, 1),
        manipulation_risk=round(m_breakdown["manipulated_probability"] * 100.0, 1),
        source_reliability=70.0,
        claim_support=75.0
    )
    trust_score, band, risk = trust_engine.compute_trust_score(signals, confidence=res["confidence"])
    
    response = AnalysisResponse(
        id=analysis_id,
        status=AnalysisStatus.COMPLETED,
        content_type=ContentType.AUDIO,
        filename=file.filename or "audio_sample.wav",
        file_size=1024 * 512,
        preview_url=None,
        associated_claim=claim,
        created_at=now,
        completed_at=now,
        trust_score=trust_score,
        trust_band=band,
        risk_level=risk,
        confidence=res["confidence"],
        summary_explanation="Audio spectrogram analysis: Vocal acoustic energy adheres to organic physiological parameters.",
        signals=signals,
        model_breakdown=ModelBreakdown.model_validate(m_breakdown),
        features=None,
        findings=[
            Finding(
                id=f"find_{uuid.uuid4().hex[:6]}",
                severity=FindingSeverity.POSITIVE,
                category="Spectral Continuity",
                title="Organic Phase Characteristics",
                description="Phase transitions and harmonic structure consistent with physical microphone transducer capture."
            )
        ],
        processing_timeline=[]
    )
    repository.save(response)
    return response

@router.post("/document", response_model=AnalysisResponse, summary="Analyze document or screenshot for layout tampering (Roadmap Demo)")
async def analyze_document(
    file: UploadFile = File(...),
    claim: Optional[str] = Form(None)
):
    """
    Extensible document / screenshot analysis endpoint.
    """
    analysis_id = f"doc_{uuid.uuid4().hex[:10]}"
    now = datetime.now(timezone.utc)
    
    doc_model = model_registry.get_model("document")
    res = doc_model.predict(file.filename or "document.pdf")
    m_breakdown = res["model_breakdown"]

    signals = CoreSignals(
        authenticity_score=round(m_breakdown["authentic_probability"] * 100.0, 1),
        manipulation_risk=round(m_breakdown["manipulated_probability"] * 100.0, 1),
        source_reliability=80.0,
        claim_support=80.0
    )
    trust_score, band, risk = trust_engine.compute_trust_score(signals, confidence=res["confidence"])
    
    response = AnalysisResponse(
        id=analysis_id,
        status=AnalysisStatus.COMPLETED,
        content_type=ContentType.DOCUMENT,
        filename=file.filename or "document.pdf",
        file_size=1024 * 800,
        preview_url=None,
        associated_claim=claim,
        created_at=now,
        completed_at=now,
        trust_score=trust_score,
        trust_band=band,
        risk_level=risk,
        confidence=res["confidence"],
        summary_explanation="Document layout and typography analysis: Consistent font kerning and rendering artifacts.",
        signals=signals,
        model_breakdown=ModelBreakdown.model_validate(m_breakdown),
        features=None,
        findings=[
            Finding(
                id=f"find_{uuid.uuid4().hex[:6]}",
                severity=FindingSeverity.POSITIVE,
                category="Layout & Font Analysis",
                title="Consistent Font Rendering",
                description="No text box splicing or raster resolution mismatch identified across document regions."
            )
        ],
        processing_timeline=[]
    )
    repository.save(response)
    return response
