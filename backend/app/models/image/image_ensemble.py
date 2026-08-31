import math
from typing import Dict, Any, Optional
from PIL import Image

from app.models.base import BaseAuthenticityModel, ModelMetadata
from app.models.image.cv_forensics import ComputerVisionForensics
from app.models.image.adapters import IMAGE_MODEL_ADAPTERS

class ImageAuthenticityModel(BaseAuthenticityModel):
    """
    Image Authenticity & Manipulation Detection Ensemble.
    Combines physical CV feature extraction with deep ensemble probability estimation.
    """

    def __init__(self):
        metadata = ModelMetadata(
            name="TrustNet-Vision-Ensemble-v1 (Demo / Mock)",
            version="1.0.0-demo",
            modality="image",
            is_demo_inference=True,
            target_architectures=list(IMAGE_MODEL_ADAPTERS.keys()),
            description="Multi-frequency vision ensemble fusing OpenCV ELA, high-pass noise variance, and calibrated classification."
        )
        super().__init__(metadata)

    def preprocess(self, image_path: str) -> Dict[str, Any]:
        """Load image file and extract forensic features."""
        with Image.open(image_path) as pil_img:
            width, height = pil_img.size
            img_format = pil_img.format or "JPEG"
            exif = ComputerVisionForensics.extract_exif(pil_img)
            ela_score = ComputerVisionForensics.compute_ela(pil_img)
            cv_metrics = ComputerVisionForensics.compute_cv_metrics(pil_img)

        return {
            "image_path": image_path,
            "dimensions": [width, height],
            "format": img_format.lower(),
            "exif": exif,
            "ela_score": round(ela_score, 2),
            "cv_metrics": cv_metrics,
        }

    def forward(self, preprocessed_data: Dict[str, Any]) -> Dict[str, Any]:
        """Execute forward pass heuristic modeling / deep neural classifier simulation."""
        exif = preprocessed_data["exif"]
        ela_score = preprocessed_data["ela_score"]
        noise_v = preprocessed_data["cv_metrics"]["noise_variance"]
        
        has_exif = exif["has_exif"]
        software = exif.get("software_detected")

        p_auth = 0.50
        p_ai = 0.30
        p_manip = 0.20

        if has_exif and exif.get("camera_make"):
            p_auth += 0.30
            p_ai -= 0.20
            p_manip -= 0.10

        if software and any(app in software.lower() for app in ["photoshop", "gimp", "lightroom", "midjourney", "stable"]):
            p_manip += 0.35
            p_auth -= 0.25

        if noise_v < 10.0:  # Synthetic smoothing
            p_ai += 0.25
            p_auth -= 0.20
        elif noise_v > 90.0:  # Noise injection
            p_manip += 0.20
            p_auth -= 0.15

        if ela_score > 40.0:  # High ELA delta
            p_manip += 0.25
            p_auth -= 0.20

        exp_auth = math.exp(max(0.01, p_auth * 2.5))
        exp_ai = math.exp(max(0.01, p_ai * 2.5))
        exp_manip = math.exp(max(0.01, p_manip * 2.5))
        sum_exp = exp_auth + exp_ai + exp_manip

        return {
            "raw_prob_auth": exp_auth / sum_exp,
            "raw_prob_ai": exp_ai / sum_exp,
            "raw_prob_manip": exp_manip / sum_exp,
            "preprocessed": preprocessed_data
        }

    def postprocess(self, raw_output: Dict[str, Any]) -> Dict[str, Any]:
        """Normalize distributions, derive margin confidence, and format response."""
        prob_auth = round(raw_output["raw_prob_auth"], 3)
        prob_ai = round(raw_output["raw_prob_ai"], 3)
        prob_manip = round(raw_output["raw_prob_manip"], 3)

        prob_diff = 1.0 - (prob_auth + prob_ai + prob_manip)
        prob_auth = round(prob_auth + prob_diff, 3)

        probs_sorted = sorted([prob_auth, prob_ai, prob_manip], reverse=True)
        margin = probs_sorted[0] - probs_sorted[1]
        confidence = round(min(0.96, max(0.65, 0.60 + (margin * 0.45))), 2)

        prep = raw_output["preprocessed"]
        exif = prep["exif"]
        cv_metrics = prep["cv_metrics"]

        return {
            "model_breakdown": {
                "authentic_probability": prob_auth,
                "ai_generated_probability": prob_ai,
                "manipulated_probability": prob_manip,
                "model_name": self.metadata.name,
                "model_version": self.metadata.version,
                "is_demo_inference": self.metadata.is_demo_inference,
                "calibrated_uncertainty": round(1.0 - confidence, 2)
            },
            "features": {
                "dimensions": prep["dimensions"],
                "format": prep["format"],
                "color_channels": 3,
                "noise_variance": cv_metrics["noise_variance"],
                "sharpness_variance": cv_metrics["sharpness_variance"],
                "ela_discrepancy_score": prep["ela_score"],
                "has_exif": exif["has_exif"],
                "camera_make": exif["camera_make"],
                "software_detected": exif["software_detected"],
                "compression_quality_estimate": 88
            },
            "confidence": confidence
        }
