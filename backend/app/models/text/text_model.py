from typing import Dict, Any
from app.models.base import BaseAuthenticityModel, ModelMetadata
from app.models.text.adapters import TEXT_MODEL_ADAPTERS

class TextClaimModel(BaseAuthenticityModel):
    """
    Text & Claim Verification Architecture.
    Prepares structure for claim extraction, cross-source retrieval, and uncertainty-aware stance classification.
    """

    def __init__(self):
        metadata = ModelMetadata(
            name="TrustNet-NLP-ClaimVerifier-v1 (Demo / Roadmap)",
            version="1.0.0-demo",
            modality="text",
            is_demo_inference=True,
            target_architectures=list(TEXT_MODEL_ADAPTERS.keys()),
            description="NLP pipeline parsing proposition veracity and cross-source corroboration consensus."
        )
        super().__init__(metadata)

    def preprocess(self, text: str) -> Dict[str, Any]:
        return {"text": text.strip(), "word_count": len(text.split())}

    def forward(self, preprocessed_data: Dict[str, Any]) -> Dict[str, Any]:
        text = preprocessed_data["text"]
        sensational_terms = ["shocking", "urgent", "secret", "they don't want you to know", "miracle", "100%"]
        sensational_count = sum(1 for term in sensational_terms if term in text.lower())

        stance = "supported" if sensational_count == 0 else "partially supported"
        if sensational_count >= 2:
            stance = "insufficient evidence"

        return {
            "sensational_count": sensational_count,
            "stance": stance,
            "agreement_score": max(30.0, 95.0 - (sensational_count * 20.0))
        }

    def postprocess(self, raw_output: Dict[str, Any]) -> Dict[str, Any]:
        count = raw_output["sensational_count"]
        return {
            "model_breakdown": {
                "authentic_probability": max(0.2, 0.9 - (count * 0.25)),
                "ai_generated_probability": min(0.6, 0.1 + (count * 0.15)),
                "manipulated_probability": min(0.5, 0.05 + (count * 0.2)),
                "model_name": self.metadata.name,
                "model_version": self.metadata.version,
                "is_demo_inference": True,
                "calibrated_uncertainty": 0.20
            },
            "claim_stance": raw_output["stance"],
            "extracted_entities": ["Detected Subject Entity", "Temporal Anchor"],
            "cross_source_agreement_score": raw_output["agreement_score"],
            "confidence": 0.80
        }
