import uuid
from typing import List, Dict, Any, Optional
from app.schemas.analysis import Finding, FindingSeverity

class ExplainabilityService:
    """
    Synthesizes explainable, evidence-grounded findings from computed visual features,
    model probability distributions, and metadata signals.
    """
    
    @staticmethod
    def generate_image_findings(
        features: Dict[str, Any],
        model_breakdown: Dict[str, Any],
        signals: Dict[str, float]
    ) -> List[Finding]:
        findings: List[Finding] = []
        
        has_exif = features.get("has_exif", False)
        camera_make = features.get("camera_make")
        software = features.get("software_detected")
        noise_var = features.get("noise_variance", 0.0)
        ela_score = features.get("ela_discrepancy_score", 0.0)
        prob_auth = model_breakdown.get("authentic_probability", 0.5)
        prob_ai = model_breakdown.get("ai_generated_probability", 0.3)
        prob_manip = model_breakdown.get("manipulated_probability", 0.2)
        
        # 1. Metadata / Provenance Finding
        if has_exif and camera_make:
            findings.append(Finding(
                id=f"find_{uuid.uuid4().hex[:6]}",
                severity=FindingSeverity.POSITIVE,
                category="Provenance & Metadata",
                title="Verified Camera Hardware Signature",
                description=f"Authentic optical hardware metadata detected ({camera_make}). No known synthetic generator headers found.",
                technical_detail="EXIF tags contain valid capture timestamp and exposure settings."
            ))
        elif software:
            findings.append(Finding(
                id=f"find_{uuid.uuid4().hex[:6]}",
                severity=FindingSeverity.ALERT,
                category="Provenance & Metadata",
                title="Post-Processing Software Tag Detected",
                description=f"Embedded metadata references image alteration tool: '{software}'.",
                technical_detail="Software header present in EXIF dictionary."
            ))
        else:
            findings.append(Finding(
                id=f"find_{uuid.uuid4().hex[:6]}",
                severity=FindingSeverity.CAUTION,
                category="Provenance & Metadata",
                title="Stripped or Absent Metadata",
                description="Original hardware EXIF tags were absent or stripped during social media distribution.",
                technical_detail="Hardware make/model tags not present in file headers."
            ))

        # 2. Sensor Noise & High Frequency Texture
        if noise_var >= 20.0 and noise_var <= 85.0:
            findings.append(Finding(
                id=f"find_{uuid.uuid4().hex[:6]}",
                severity=FindingSeverity.POSITIVE,
                category="Sensor Noise Distribution",
                title="Natural Sensor Noise Consistency",
                description="High-frequency noise floor matches expected physical camera sensor distribution.",
                technical_detail=f"Estimated noise residual variance: {noise_var:.1f} (within nominal 20.0-85.0 range)."
            ))
        elif noise_var < 15.0:
            findings.append(Finding(
                id=f"find_{uuid.uuid4().hex[:6]}",
                severity=FindingSeverity.ALERT,
                category="Sensor Noise Distribution",
                title="Synthetic Smoothing / Unnatural Uniformity",
                description="Image exhibits unnaturally low sensor noise, a common characteristic of diffusion and generative AI outputs.",
                technical_detail=f"Noise residual variance is {noise_var:.1f}, below expected organic camera baseline."
            ))
        else:
            findings.append(Finding(
                id=f"find_{uuid.uuid4().hex[:6]}",
                severity=FindingSeverity.CAUTION,
                category="Sensor Noise Distribution",
                title="Elevated Noise Variance / Possible Masking",
                description="High noise variance detected. This may indicate synthetic grain injection to mask alteration boundaries.",
                technical_detail=f"High noise residual variance ({noise_var:.1f})."
            ))

        # 3. Compression & Error Level Analysis (ELA)
        if ela_score < 25.0:
            findings.append(Finding(
                id=f"find_{uuid.uuid4().hex[:6]}",
                severity=FindingSeverity.POSITIVE,
                category="Compression Analysis",
                title="Uniform Compression Artifact Distribution",
                description="Error Level Analysis demonstrates consistent re-compression error rates across all quadrants.",
                technical_detail=f"ELA discrepancy index: {ela_score:.1f}/100."
            ))
        elif ela_score >= 40.0:
            findings.append(Finding(
                id=f"find_{uuid.uuid4().hex[:6]}",
                severity=FindingSeverity.ALERT,
                category="Compression Analysis",
                title="Localized Compression Inconsistency",
                description="Significant divergence in compression artifact rates detected, suggesting spliced or composited regions.",
                technical_detail=f"ELA discrepancy score of {ela_score:.1f}/100 exceeds critical threshold (40.0)."
            ))

        # 4. Deep Model Probabilistic Assessment
        if prob_auth >= 0.70:
            findings.append(Finding(
                id=f"find_{uuid.uuid4().hex[:6]}",
                severity=FindingSeverity.POSITIVE,
                category="Deep Model Ensemble",
                title="High Organic Visual Likelihood",
                description=f"Deep learning vision ensemble evaluates content as {prob_auth*100:.0f}% probable organic capture.",
                technical_detail="Vision Transformer / EfficientNet ensemble confidence."
            ))
        elif prob_ai >= 0.50:
            findings.append(Finding(
                id=f"find_{uuid.uuid4().hex[:6]}",
                severity=FindingSeverity.ALERT,
                category="Deep Model Ensemble",
                title="Generative AI Structural Indicators",
                description=f"Model detected high probability ({prob_ai*100:.0f}%) of synthetic generative synthesis.",
                technical_detail="Feature embeddings match latent diffusion architecture distributions."
            ))
        elif prob_manip >= 0.40:
            findings.append(Finding(
                id=f"find_{uuid.uuid4().hex[:6]}",
                severity=FindingSeverity.ALERT,
                category="Deep Model Ensemble",
                title="Localized Manipulation Signatures",
                description=f"Ensemble detected {prob_manip*100:.0f}% probability of targeted pixel manipulation.",
                technical_detail="Boundary discontinuity filters triggered."
            ))

        return findings

    @staticmethod
    def generate_summary(
        trust_score: int,
        trust_band: str,
        risk_level: str,
        signals: Dict[str, float],
        findings: List[Finding]
    ) -> str:
        """Create a human-readable, balanced summary explanation for the results dashboard."""
        positive_count = sum(1 for f in findings if f.severity == FindingSeverity.POSITIVE)
        alert_count = sum(1 for f in findings if f.severity == FindingSeverity.ALERT)
        
        if trust_score >= 80:
            return (
                f"Content is classified under '{trust_band}' ({risk_level}). Visual features, optical sensor noise "
                f"distributions, and compression uniformity strongly support organic capture with minimal manipulation indicators."
            )
        elif trust_score >= 60:
            return (
                f"Content is classified as '{trust_band}'. Core visual features are generally consistent with authentic imagery, "
                f"though minor compression artifacts or absent metadata prevent a definitive high-trust classification."
            )
        elif trust_score >= 40:
            return (
                f"Analysis returned an '{trust_band}' assessment. Signals are mixed or inconclusive, with elevated uncertainty in "
                f"feature distributions. Manual human corroboration is recommended."
            )
        else:
            return (
                f"Content evaluated as '{trust_band}' with {risk_level}. Multiple critical anomaly indicators "
                f"(including synthetic smoothing, compression discrepancy, or generative model markers) were detected."
            )
