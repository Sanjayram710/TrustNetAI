from typing import Dict, Any, Optional
from app.models.base import BaseAuthenticityModel

class TextClaimModel(BaseAuthenticityModel):
    """
    Text & Claim Verification Architecture.
    Prepares structure for claim extraction, cross-source retrieval, and uncertainty-aware stance classification.
    """
    MODEL_NAME = "TrustNet-NLP-ClaimVerifier-v1 (Demo / Roadmap)"
    IS_DEMO = True

    def predict(self, text: str, **kwargs) -> Dict[str, Any]:
        # Basic heuristic analysis for demonstration
        word_count = len(text.split())
        has_question = "?" in text
        sensational_terms = ["shocking", "urgent", "secret", "they don't want you to know", "miracle", "100%"]
        sensational_count = sum(1 for term in sensational_terms if term in text.lower())
        
        stance = "supported" if sensational_count == 0 else "partially supported"
        if sensational_count >= 2:
            stance = "insufficient evidence"

        return {
            "model_breakdown": {
                "authentic_probability": max(0.2, 0.9 - (sensational_count * 0.25)),
                "ai_generated_probability": min(0.6, 0.1 + (sensational_count * 0.15)),
                "manipulated_probability": min(0.5, 0.05 + (sensational_count * 0.2)),
                "model_name": self.MODEL_NAME,
                "is_demo_inference": True,
                "calibrated_uncertainty": 0.20
            },
            "claim_stance": stance,
            "extracted_entities": ["Detected Subject", "Temporal Entity"],
            "cross_source_agreement_score": max(30.0, 95.0 - (sensational_count * 20.0)),
            "confidence": 0.80
        }
