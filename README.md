# TrustNet AI — Multimodal Content Authenticity & Trust Scoring Platform

**TrustNet AI** is a full-stack, multimodal digital content authenticity and trust scoring platform. It analyzes digital artifacts (images, videos, audio recordings, text claims, screenshots, and documents) to determine whether content is authentic, AI-generated (synthetic), or manipulated, delivering an explainable 0–100 Trust Score.

---

## 🌟 Key Features

- **Multimodal Forensics Architecture**:
  - **Image Forensics (Active Stage 1 MVP)**: Real OpenCV high-pass sensor noise residual extraction, Error Level Analysis (ELA) compression discrepancy calculation, Laplacian sharpness gradient variance, and EXIF camera hardware provenance validation.
  - **Text & Claims Analysis**: NLP claim stance evaluation, sensationalism density scoring, and cross-source consensus verification.
  - **Video & Audio Architecture (Roadmap Stages 3 & 4)**: Temporal keyframe continuity and Mel spectrogram voice clone classification interfaces.
- **Explainable Trust Score Engine**:
  - Multi-signal weighted fusion isolating *Media Authenticity*, *Manipulation Risk*, *Source Reliability*, and *Claim Support*.
  - Non-linear critical tampering penalty and Bayesian confidence calibration.
- **Explainable Findings & Evidence**:
  - Generates evidence-grounded findings directly from computed physical measurements with severity levels (`Positive`, `Caution`, `Alert`).
- **Interactive Results & History Dashboard**:
  - Circular SVG Trust Score Gauge with glowing theme colors mapped to calibrated trust bands (`High Trust`, `Moderate Trust`, `Uncertain`, `Low Trust`, `Very Low Trust`).
  - Analysis history with filtering, searching, summary metrics, and JSON export.
- **Scientific Limitation & Integrity**:
  - Models are clearly labeled with probabilistic confidence intervals and `DEMO / MOCK INFERENCE` banners.

---

## 🏗️ Architecture & Monorepo Structure

```text
TrustNetAI/
├── backend/                      # Python 3.11 / FastAPI Service
│   ├── app/
│   │   ├── api/routes/           # /api/analyze, /api/analysis, /api/config
│   │   ├── core/                 # App settings, file security, MIME validation
│   │   ├── models/               # Base model abstraction, ImageAuthenticityModel
│   │   ├── schemas/              # Pydantic v2 schemas
│   │   ├── services/             # Image service, Trust score engine, Explainability, Repository
│   │   └── main.py               # FastAPI entrypoint & CORS middleware
│   ├── tests/                    # Pytest test suite (16 passing tests)
│   ├── requirements.txt
│   └── pytest.ini
├── frontend/                     # Next.js 14 / TypeScript / Tailwind CSS
│   ├── src/
│   │   ├── app/                  # App router: /, /analyze, /results/[id], /dashboard, /technology, /about
│   │   ├── components/           # UI, analyze, results, layout components
│   │   └── lib/                  # Typed API client, types, constants
│   ├── package.json
│   └── tailwind.config.ts
├── docs/                         # Comprehensive architectural & formula documentation
│   ├── architecture.md
│   ├── trust_score_formula.md
│   └── api_reference.md
├── docker/                       # Container definitions
│   ├── Dockerfile.backend
│   └── Dockerfile.frontend
├── docker-compose.yml
├── .env.example
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: v18+ (tested on Node v22)
- **Python**: 3.10+ (tested on Python 3.11)
- **pip** and **npm**

---

### 1. Backend Setup & Execution

1. Navigate to the `backend/` directory:
   ```bash
   cd backend
   ```
2. Install Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Run the automated Pytest suite:
   ```bash
   python -m pytest tests
   ```
4. Start the FastAPI development server on port 8000:
   ```bash
   uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
   ```
   *The backend API documentation is available at `http://localhost:8000/api/docs`.*

---

### 2. Frontend Setup & Execution

1. Navigate to the `frontend/` directory:
   ```bash
   cd frontend
   ```
2. Install npm dependencies:
   ```bash
   npm install
   ```
3. Start the Next.js development server on port 3000:
   ```bash
   npm run dev
   ```
4. Open [http://localhost:3000](http://localhost:3000) in your web browser.

---

### 3. Running with Docker Compose

To launch the full stack with containerization:
```bash
docker-compose up --build
```
- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:8000/api/docs`

---

## ⚙️ Environment Variables

Copy `.env.example` to create your local `.env`:

```env
# Frontend Configuration
NEXT_PUBLIC_API_URL=http://localhost:8000

# Backend Configuration
ENVIRONMENT=development
HOST=127.0.0.1
PORT=8000
ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000

# Storage and Upload Limits
UPLOAD_DIR=./uploads
MAX_FILE_SIZE_MB=15
ALLOWED_IMAGE_EXTENSIONS=jpg,jpeg,png,webp
```

---

## 🔬 AI Inference: Real vs. Demo Components

| Component | Status | Implementation Details |
|---|---|---|
| **Noise Residual Extraction** | **Real (CV)** | OpenCV Gaussian high-pass filter variance computation. |
| **Error Level Analysis (ELA)** | **Real (CV)** | Pillow JPEG re-compression delta measuring pixel difference. |
| **Sharpness / Blur Variance** | **Real (CV)** | Laplacian second-derivative variance. |
| **Hardware EXIF Provenance** | **Real (CV)** | Pillow EXIF hardware metadata & editing software tag detection. |
| **Deep Vision Model** | **Demo / Mock** | Heuristic probability calibration with calibrated uncertainty. Ready for PyTorch EfficientNet/ConvNeXt weights. |
| **Trust Scoring Fusion** | **Real** | Weighted multi-signal fusion with critical tampering penalty. |
| **Explainable Findings** | **Real** | Evidence-grounded finding synthesizer. |

---

## 🧪 Testing Performed

- **Backend Pytest Suite** (`python -m pytest tests`):
  - File security & sanitization tests (`test_security.py`).
  - MIME type and magic byte header verification.
  - Max file size enforcement (413 Payload Too Large).
  - Trust score formula boundary & critical tampering penalty tests (`test_trust_engine.py`).
  - Bayesian confidence neutrality regression tests.
  - End-to-end API integration tests (`test_api.py`) for `/api/health`, `/api/config/trust-engine`, `/api/analysis`, `/api/analyze/image`, `/api/analyze/text`.
- **Frontend Type Checking & Build**:
  - Verified TypeScript interfaces and Next.js page routing.

---

## 📜 Scientific Limitations & Disclaimer

> **Important**: This result represents a model-based probabilistic assessment and should not be treated as absolute proof of authenticity or deception. AI detection is statistical and subject to false positives from non-malicious compression, social media re-encoding, or optical sensor variations.
