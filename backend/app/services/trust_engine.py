from typing import Dict, Any, Tuple
from app.core.config import settings
from app.schemas.analysis import CoreSignals, TrustBand, RiskLevel

class TrustScoreEngine:
    """
    TrustNet AI Multi-Signal Fusion & Scoring Service.
    Combines independent authenticity, manipulation, provenance, and claim signals into a 0-100 Trust Score.
    """

    def __init__(
        self,
        weight_auth: float = settings.WEIGHT_AUTHENTICITY,
        weight_manip: float = settings.WEIGHT_MANIPULATION,
        weight_src: float = settings.WEIGHT_SOURCE_RELIABILITY,
        weight_claim: float = settings.WEIGHT_CLAIM_SUPPORT,
    ):
        # Normalize weights
        total_w = weight_auth + weight_manip + weight_src + weight_claim
        self.w_auth = weight_auth / total_w
        self.w_manip = weight_manip / total_w
        self.w_src = weight_src / total_w
        self.w_claim = weight_claim / total_w

    def get_config(self) -> Dict[str, Any]:
        """Return active engine configuration and band definitions."""
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
        """
        Compute fused trust score and assign appropriate TrustBand and RiskLevel.
        """
        s_auth = signals.authenticity_score
        s_manip = signals.manipulation_risk
        s_src = signals.source_reliability
        s_claim = signals.claim_support
        
        # 1. Base Weighted Score (manipulation risk is inverted so 0 risk = 100 score contribution)
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
        
        # 3. Confidence Calibration (if model is uncertain, regress toward 50.0)
        c = max(0.2, min(1.0, confidence))
        final_score_raw = (c * score_penalized) + ((1.0 - c) * 50.0)
        
        # Clamp to [0, 100] and round to integer
        final_score = int(round(max(0.0, min(100.0, final_score_raw))))
        
        # 4. Map to Band & Risk
        band, risk = self.classify_band_and_risk(final_score)
        
        return final_score, band, risk

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
