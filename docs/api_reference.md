# TrustNet AI — API Reference

Base URL in local development: `http://localhost:8000`

---

## 1. Endpoints Overview

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/analyze/image` | Upload an image file for deep authenticity analysis. |
| `POST` | `/api/analyze/video` | Upload a video for temporal & frame deepfake analysis. |
| `POST` | `/api/analyze/audio` | Upload an audio file for synthetic voice detection. |
| `POST` | `/api/analyze/text` | Submit text claim for NLP evidence verification. |
| `POST` | `/api/analyze/document` | Upload document/screenshot for layout & OCR analysis. |
| `GET` | `/api/analysis/{id}` | Retrieve complete analysis report and signals by ID. |
| `GET` | `/api/analysis/{id}/status`| Poll processing status and timeline events. |
| `GET` | `/api/analysis` | List historical analyses with query filters & metrics. |
| `GET` | `/api/config/trust-engine` | Inspect active trust score weights and band configurations. |
| `GET` | `/api/health` | Service health status and version metadata. |

---

## 2. Endpoint Details

### `POST /api/analyze/image`
Uploads a single image as `multipart/form-data`.

**Request Parameters:**
- `file` (binary, required): Image file (JPG, PNG, WEBP).
- `claim` (string, optional): Associated claim text.

**Response Schema (`200 OK`):**
```json
{
  "id": "analysis_a8f192b4",
  "status": "completed",
  "content_type": "image",
  "filename": "sample_photo.jpg",
  "file_size": 245102,
  "created_at": "2026-08-31T15:00:00Z",
  "trust_score": 88,
  "trust_band": "High Trust",
  "risk_level": "Minimal Risk",
  "confidence": 0.92,
  "signals": {
    "authenticity_score": 92.0,
    "manipulation_risk": 8.0,
    "source_reliability": 85.0,
    "claim_support": 75.0
  },
  "model_breakdown": {
    "authentic_probability": 0.92,
    "ai_generated_probability": 0.05,
    "manipulated_probability": 0.03,
    "model_name": "TrustNet-Vision-Ensemble-v1 (Demo / Mock)",
    "is_demo_inference": true
  },
  "features": {
    "dimensions": [1920, 1080],
    "ela_discrepancy_score": 12.4,
    "noise_variance": 45.2,
    "sharpness_variance": 182.1,
    "has_exif": true,
    "camera_make": "Sony Alpha",
    "software_detected": null
  },
  "findings": [
    {
      "id": "find_1",
      "severity": "positive",
      "category": "authenticity",
      "title": "Natural Sensor Noise Patterns",
      "description": "High-frequency DCT distribution matches authentic optical camera sensor characteristics."
    }
  ],
  "disclaimer": "This result represents a model-based assessment and should not be treated as absolute proof of authenticity or deception."
}
```
