import io
import numpy as np
from PIL import Image, ImageChops, ExifTags
from typing import Dict, Any, Tuple, Optional
import cv2

class ComputerVisionForensics:
    """
    Physical & Digital Feature Extractor.
    Extracts high-frequency noise variance, Laplacian sharpness, ELA compression discrepancy, and EXIF provenance.
    """

    @staticmethod
    def extract_exif(pil_img: Image.Image) -> Dict[str, Any]:
        """Extract camera hardware metadata and detect image editing software tags."""
        exif_info = {
            "has_exif": False,
            "camera_make": None,
            "camera_model": None,
            "software_detected": None,
            "datetime_original": None
        }
        try:
            raw_exif = pil_img.getexif()
            if raw_exif:
                exif_info["has_exif"] = True
                for tag_id, value in raw_exif.items():
                    tag = ExifTags.TAGS.get(tag_id, tag_id)
                    if tag == "Make":
                        exif_info["camera_make"] = str(value).strip()
                    elif tag == "Model":
                        exif_info["camera_model"] = str(value).strip()
                    elif tag == "Software":
                        exif_info["software_detected"] = str(value).strip()
                    elif tag == "DateTimeOriginal":
                        exif_info["datetime_original"] = str(value).strip()
        except Exception:
            pass
        return exif_info

    @staticmethod
    def compute_ela(pil_img: Image.Image, quality: int = 90) -> float:
        """
        Perform Error Level Analysis (ELA).
        Measures pixel difference magnitude between original and re-compressed JPEG.
        """
        try:
            rgb_img = pil_img.convert("RGB")
            buffer = io.BytesIO()
            rgb_img.save(buffer, "JPEG", quality=quality)
            buffer.seek(0)
            compressed_img = Image.open(buffer)
            diff = ImageChops.difference(rgb_img, compressed_img)
            diff_np = np.array(diff)
            mean_error = float(np.mean(diff_np))
            max_error = float(np.max(diff_np))
            return min(100.0, (mean_error * 12.0) + (max_error * 0.2))
        except Exception:
            return 15.0

    @staticmethod
    def compute_cv_metrics(pil_img: Image.Image) -> Dict[str, float]:
        """
        Compute OpenCV visual feature statistics:
        - Laplacian variance (focus/sharpness measure)
        - High-frequency noise variance (Gaussian blur residual)
        """
        try:
            cv_img = np.array(pil_img.convert("RGB"))
            gray = cv2.cvtColor(cv_img, cv2.COLOR_RGB2GRAY)
            laplacian_var = float(cv2.Laplacian(gray, cv2.CV_64F).var())
            blurred = cv2.GaussianBlur(gray, (5, 5), 0)
            noise_residual = cv2.absdiff(gray, blurred)
            noise_var = float(np.var(noise_residual))
            return {
                "sharpness_variance": round(laplacian_var, 2),
                "noise_variance": round(noise_var, 2),
            }
        except Exception:
            return {
                "sharpness_variance": 120.0,
                "noise_variance": 35.0,
            }
