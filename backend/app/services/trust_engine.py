from typing import Dict, Any, Tuple, Optional
from pydantic import BaseModel, Field
from app.core.config import settings
from app.schemas.analysis import CoreSignals, TrustBand, RiskLevel

class TrustEngineWeights(BaseModel):
    media_authenticity: float = Field(0.45, ge=0.0, le=1.0)
    manipulation_risk: float = Field(0.35, ge=0.0, le=1.0)
    source_reliability: float = Field(0.10, ge=0.0, le=1.0)
    claim_support: float = Field(0.10, ge=0.0, le=1.0)

class TrustScoreEngine:
    """
    TrustNet AI Multi-Signal Fusion & Scoring Engine.
    Combines independent authenticity, manipulation risk, provenance, and claim signals into a 0-100 Trust Score.
    """

    def __init__(
        self,
        weight_auth: float = settings.WEIGHT_AUTHENTICITY,
        weight_manip: float = settings.WEIGHT_MANIPULATION,
        weight_src: float = settings.WEIGHT_SOURCE_RELIABILITY,
        weight_claim: float = settings.WEIGHT_CLAIM_SUPPORT,
    ):
        self.set_weights(weight_auth, weight_manip, weight_src, weight_claim)

    def set_weights(self, w_auth: float, w_manip: float, w_src: float, w_claim: float) -> None:
        total_w = w_auth + w_manip + w_src + w_claim
        if total_w <= 0:
            total_w = 1.0
        self.w_auth = w_auth / total_w
        self.w_manip = w_manip / total_w
        self.w_src = w_src / total_w
        self.w_claim = w_claim / total_w

    def get_config(self) -> Dict[str, Any]:
        """Return active engine configuration, weights, and band criteria."""
        return {
            "weights": {
                "media_authenticity": round(self.w_auth, 3),
                "manipulation_risk": round(self.w_manip, 3),
                "source_reliability": round(self.w_src, 3),
                "claim_support": round(self.w_claim, 3)
            },
            "trust_bands": {
                "High Trust": {"min": 80, "max": 100, "risk_level": "Minimal Risk"},
                "Moderate Trust": {"min": 60, "max": 79, "risk_level": "Low Risk"},
                "Uncertain": {"min": 40, "max": 59, "risk_level": "Elevated Risk"},
                "Low Trust": {"min": 20, "max": 39, "risk_level": "High Risk"},
                "Very Low Trust": {"min": 0, "max": 19, "risk_level": "Critical Risk"}
            },
            "tampering_penalty_threshold": 75.0,
            "formula_version": "2.1-calibrated"
        }

    def compute_trust_score(
        self,
        signals: CoreSignals,
        confidence: float = 0.85
    ) -> Tuple[int, TrustBand, RiskLevel]:
        """Compute fused trust score and assign appropriate TrustBand and RiskLevel."""
        s_auth = signals.authenticity_score
        s_manip = signals.manipulation_risk
        s_src = signals.source_reliability
        s_claim = signals.claim_support
        
        # 1. Base Weighted Score (manipulation risk is inverted so 0 risk = 100 contribution)
        s_base = (
            (self.w_auth * s_auth) +
            (self.w_manip * (100.0 - s_manip)) +
            (self.w_src * s_src) +
            (self.w_claim * s_claim)
        )
        
        # 2. Critical Tampering Penalty
        penalty = 0.0
        if s_manip > 75.0:
            penalty = (s_manip - 75.0) * 0.6
            
        score_penalized = max(0.0, s_base - penalty)
        
        # 3. Confidence Calibration (if model is uncertain, regress toward 50.0 neutrality)
        c = max(0.2, min(1.0, confidence))
        final_score_raw = (c * score_penalized) + ((1.0 - c) * 50.0)
        
        # Clamp to [0, 100] and round to integer
        final_score = int(round(max(0.0, min(100.0, final_score_raw))))
        
        # 4. Map to Band & Risk
        band, risk = self.classify_band_and_risk(final_score)
        
        return final_score, band, risk

    def calculate(
        self,
        signals: CoreSignals,
        confidence: float = 0.85,
        custom_weights: Optional[TrustEngineWeights] = None
    ) -> Dict[str, Any]:
        """High-level calculate method returning full scoring dictionary."""
        if custom_weights:
            self.set_weights(
                custom_weights.media_authenticity,
                custom_weights.manipulation_risk,
                custom_weights.source_reliability,
                custom_weights.claim_support
            )

        trust_score, band, risk = self.compute_trust_score(signals, confidence)
        return {
            "trust_score": trust_score,
            "trust_band": band,
            "risk_level": risk,
            "confidence": confidence,
            "signals": signals
        }

    @staticmethod
    def classify_band_and_risk(score: int) -> Tuple[TrustBand, RiskLevel]:
        if score >= 80:
            return TrustBand.HIGH_TRUST, RiskLevel.MINIMAL
        elif score >= 60:
            return TrustBand.MODERATE_TRUST, RiskLevel.LOW
        elif score >= 40:
            return TrustBand.UNCERTAIN, RiskLevel.ELEVATED
        elif score >= 20:
            return TrustBand.LOW_TRUST, RiskLevel.HIGH
        else:
            return TrustBand.VERY_LOW_TRUST, RiskLevel.CRITICAL

trust_engine = TrustScoreEngine()
