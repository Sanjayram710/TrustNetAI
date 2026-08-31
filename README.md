# TrustNet AI — Multimodal Content Authenticity & Trust Scoring Platform

![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)
![Python: 3.11](https://img.shields.io/badge/Python-3.11-brightgreen.svg)
![FastAPI: 0.111+](https://img.shields.io/badge/FastAPI-0.111+-009688.svg)
![Next.js: 14.2](https://img.shields.io/badge/Next.js-14.2-black.svg)
![TypeScript: 5.5](https://img.shields.io/badge/TypeScript-5.5-blue.svg)
![TailwindCSS: 3.4](https://img.shields.io/badge/TailwindCSS-3.4-38B2AC.svg)

**TrustNet AI** is a production-style full-stack AI platform designed for multimodal content authenticity estimation and explainable trust scoring. It analyzes digital artifacts (images, videos, audio clips, news claims, and documents) to determine whether content is authentic, AI-generated (synthetic), or manipulated, delivering an explainable 0–100 Trust Score.

---

## 📑 Table of Contents

1. [Project Overview](#1-project-overview)
2. [Key Features](#2-key-features)
3. [Architecture & System Design](#3-architecture--system-design)
4. [Technology Stack](#4-technology-stack)
5. [Installation & Quickstart](#5-installation--quickstart)
6. [Frontend Setup](#6-frontend-setup)
7. [Backend Setup](#7-backend-setup)
8. [Environment Variables](#8-environment-variables)
9. [API Documentation](#9-api-documentation)
10. [Model Integration Architecture](#10-model-integration-architecture)
11. [Dataset Instructions & Mounting](#11-dataset-instructions--mounting)
12. [Testing & Verification](#12-testing--verification)
13. [Future Roadmap (Stages 1–6)](#13-future-roadmap-stages-16)
14. [Scientific Limitations & Ethical AI](#14-scientific-limitations--ethical-ai)

---

## 1. Project Overview

Digital content manipulation and generative diffusion models (Midjourney, DALL-E 3, Stable Diffusion, Sora) have created an urgent need for verifiable, explainable content forensics. TrustNet AI does not present itself as an infallible "truth machine"; rather, it computes independent statistical signals across:
- **Media Authenticity** ($S_{\text{auth}}$): Probability of organic sensor capture vs. synthetic generation.
- **Manipulation Risk** ($S_{\text{manip}}$): Probability of localized splicing, copy-move, or retouching.
- **Source Reliability** ($S_{\text{src}}$): Metadata provenance and header integrity.
- **Claim Support** ($S_{\text{claim}}$): Contextual proposition corroboration and stance consensus.

These dimensions are fused via a transparent mathematical engine with non-linear tampering penalties into a calibrated 0–100 Trust Score.

---

## 2. Key Features

- **Multimodal Analysis Hub**: Support for Images, Text & Claims, Videos, Audio clips, and Documents.
- **Computer Vision Forensics**:
  - High-pass spatial filter noise residual variance ($Var_{\text{noise}}$).
  - Error Level Analysis (ELA) re-compression discrepancy delta mapping.
  - Laplacian gradient sharpness variance.
  - EXIF camera hardware tags and post-processing software header detection.
- **Explainability & Transparency**:
  - *"Why did TrustNet give this score?"* section with signal-grounded reasoning.
  - Multi-dimensional Forensic Radar Chart comparing all 4 signal vectors.
  - Visual model breakdown for Authentic, AI-Generated, and Manipulated predictions with calibrated uncertainty margins.
  - Transparent evidence status (`Evidence retrieval is currently unavailable.` when search APIs are unconfigured).
- **History Analytics Dashboard**: Search, filter by modality and risk band, aggregate metrics (Total, Authentic, Suspicious, High Risk, Avg Trust Score), and persistent storage.

---

## 3. Architecture & System Design

```text
TrustNetAI/
├── backend/                      # Python 3.11 / FastAPI Service
│   ├── app/
│   │   ├── api/routes/           # /api/analyze, /api/analysis, /api/config
│   │   ├── core/                 # Config, security, MIME & magic bytes
│   │   ├── models/               # BaseAuthenticityModel, ModelRegistry, image/video/audio/text/doc
│   │   ├── schemas/              # Pydantic v2 schemas
│   │   ├── services/             # Image service, Trust score engine, Explainability, Repository
│   │   └── main.py               # FastAPI entrypoint, lifespan, CORS
│   ├── tests/                    # Pytest test suite (16 passing tests)
│   ├── requirements.txt
│   └── pytest.ini
├── frontend/                     # Next.js 14 / TypeScript / Tailwind CSS
│   ├── src/
│   │   ├── app/                  # App router: /, /analyze, /results/[id], /dashboard, /technology, /about
│   │   ├── components/           # Radar charts, gauges, timelines, dropzones
│   │   └── lib/                  # Typed API client, types, constants
│   ├── package.json
│   └── tailwind.config.ts
├── datasets/                     # Dataset schemas and benchmark mounting guides
│   └── README.md
├── notebooks/                    # Prototyping & feature exploration notebooks
│   └── README.md
├── docs/                         # Comprehensive documentation
│   ├── architecture.md
│   ├── trust_score_formula.md
│   └── api_reference.md
├── docker/                       # Dockerfiles
│   ├── Dockerfile.backend
│   └── Dockerfile.frontend
├── docker-compose.yml
├── .env.example
└── README.md
```

---

## 4. Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | Next.js 14 (App Router), React 18, TypeScript, Tailwind CSS, Framer Motion, Recharts, Lucide Icons |
| **Backend** | Python 3.11, FastAPI, Pydantic v2, Pillow, OpenCV, NumPy, Pytest, Uvicorn |
| **Persistence** | Thread-safe in-memory cache + persistent JSON repository (PostgreSQL-ready schema) |
| **DevOps** | Docker, Docker Compose, GitHub Actions compatible |

---

## 5. Installation & Quickstart

```bash
# Clone the repository
git clone https://github.com/Sanjayram710/TrustNetAI.git
cd TrustNetAI

# Copy environment variables
cp .env.example .env
```

### Running with Docker Compose
```bash
docker-compose up --build
```
- Frontend: `http://localhost:3000`
- Backend API Docs: `http://localhost:8000/api/docs`

---

## 6. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 7. Backend Setup

```bash
cd backend
pip install -r requirements.txt
python -m pytest tests
uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```

---

## 8. Environment Variables

Create `.env` using `.env.example`:

```env
# Frontend
NEXT_PUBLIC_API_URL=http://localhost:8000

# Backend
ENVIRONMENT=development
HOST=127.0.0.1
PORT=8000
ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000

# Storage & Upload Limits
UPLOAD_DIR=./uploads
MAX_FILE_SIZE_MB=15
ALLOWED_IMAGE_EXTENSIONS=jpg,jpeg,png,webp
```

---

## 9. API Documentation

Interactive Swagger OpenAPI docs are live at `http://localhost:8000/api/docs`.

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/analyze/image` | Upload image for ELA, noise residual, and deep vision ensemble analysis. |
| `POST` | `/api/analyze/text` | Submit text claim for stance and cross-source consensus analysis. |
| `POST` | `/api/analyze/video` | Video temporal and frame-level analysis endpoint (Roadmap Demo). |
| `POST` | `/api/analyze/audio` | Audio synthetic voice clone detection endpoint (Roadmap Demo). |
| `POST` | `/api/analyze/document`| Document layout tampering and font consistency endpoint (Roadmap Demo). |
| `GET` | `/api/analysis/{id}` | Retrieve full analysis report and grounded findings by ID. |
| `GET` | `/api/analysis` | List analysis history with pagination, search, and modality/risk filters. |
| `GET` | `/api/config/trust-engine` | Inspect active trust weights and band thresholds. |
| `PUT` | `/api/config/trust-engine` | Update trust scoring weights dynamically at runtime. |
| `GET` | `/api/health` | Service health status. |

---

## 10. Model Integration Architecture

Models inherit from [`BaseAuthenticityModel`](backend/app/models/base.py) and are managed as singletons via [`ModelRegistry`](backend/app/models/registry.py):

- **Image Adapters**: EfficientNet-B4, Xception, Vision Transformer (ViT-L/14), ConvNeXt-Large.
- **Video Adapters**: TimeSformer, Video Swin Transformer, 3D ResNet-18.
- **Audio Adapters**: Wav2Vec 2.0, Audio Spectrogram Transformer (AST), RawNet2.
- **Text Adapters**: DeBERTa-v3-Large, RoBERTa-Large-MNLI.
- **OCR Adapters**: Tesseract, EasyOCR, PaddleOCR.

---

## 11. Dataset Instructions & Mounting

See [`datasets/README.md`](datasets/README.md) for instructions on mounting official academic benchmarks:
- **FaceForensics++**: Facial tampering & compression forensics.
- **GenImage**: Generative diffusion vs. authentic camera photos.
- **CASIA v2.0**: Splicing & copy-move ground-truth masks.
- **ASVspoof 2021**: Voice cloning and synthetic audio.
- **FEVER / LIAR**: Fact verification and stance extraction.

---

## 12. Testing & Verification

### Automated Backend Tests
```bash
cd backend
python -m pytest tests -v
```
All 16 unit and integration tests validate file security, magic byte matching, upload size restrictions, tampering penalties, and API routing.

### Frontend Typecheck & Build
```bash
cd frontend
npm run build
```

---

## 13. Future Roadmap (Stages 1–6)

- **Stage 1 (Current Active MVP)**: Image forensics, ELA, OpenCV noise residuals, FastAPI backend, Next.js results & history dashboard, explainability.
- **Stage 2**: Mounting genuine pre-trained EfficientNet / ViT weights with softmax temperature calibration.
- **Stage 3**: Video frame extraction, face tracking, space-time attention flow, and suspicious frame timeline.
- **Stage 4**: Audio Mel spectrogram transformation, phase discontinuity, and neural vocoder detection.
- **Stage 5**: Automated claim proposition extraction and live vector retrieval across verified fact-checking corpuses.
- **Stage 6**: End-to-end multimodal attention fusion, enterprise team workspaces, and PDF compliance export.

---

## 14. Scientific Limitations & Ethical AI

> **Important**: Output scores represent model-based statistical estimations and should **not** be treated as absolute proof of authenticity or deception. AI detection is probabilistic and subject to false positives from legitimate post-processing, social media re-compression, or optical hardware variations.
>
> TrustNet AI enforces privacy-by-design: all uploads are processed ephemerally with zero permanent storage of biometric assets.
