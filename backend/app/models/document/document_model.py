from typing import Dict, Any
from app.models.base import BaseAuthenticityModel, ModelMetadata
from app.models.document.adapters import DOC_MODEL_ADAPTERS

class DocumentAuthenticityModel(BaseAuthenticityModel):
    """
    Document & Screenshot Forensics Model.
    Prepares structure for layout analysis, font raster consistency, and OCR bounding box verification.
    """

    def __init__(self):
        metadata = ModelMetadata(
            name="TrustNet-DocLayout-v1 (Demo / Roadmap)",
            version="1.0.0-demo",
            modality="document",
            is_demo_inference=True,
            target_architectures=list(DOC_MODEL_ADAPTERS.keys()),
            description="OCR text layer and document layout tampering verification pipeline."
        )
        super().__init__(metadata)

    def preprocess(self, doc_path: str) -> Dict[str, Any]:
        return {"doc_path": doc_path}

    def forward(self, preprocessed_data: Dict[str, Any]) -> Dict[str, Any]:
        return {
            "p_auth": 0.85,
            "p_ai": 0.08,
            "p_manip": 0.07,
            "layout_uniformity": 91.2
        }

    def postprocess(self, raw_output: Dict[str, Any]) -> Dict[str, Any]:
        return {
            "model_breakdown": {
                "authentic_probability": raw_output["p_auth"],
                "ai_generated_probability": raw_output["p_ai"],
                "manipulated_probability": raw_output["p_manip"],
                "model_name": self.metadata.name,
                "model_version": self.metadata.version,
                "is_demo_inference": True,
                "calibrated_uncertainty": 0.12
            },
            "layout_uniformity_score": raw_output["layout_uniformity"],
            "confidence": 0.88
        }
