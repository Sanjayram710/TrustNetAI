# TrustNet AI — Datasets & Benchmark Directory

This directory provides specifications, schemas, and mounting instructions for integrating academic and benchmark datasets into the TrustNet AI evaluation pipeline.

> **Important**: In accordance with scientific integrity guidelines, no synthetic or fabricated datasets are packaged into this repository. Users and researchers should download and place official benchmark datasets in accordance with their respective institutional licenses.

---

## 📁 Recommended Benchmark Datasets

### 1. Image Authenticity & Manipulation
- **FaceForensics++ (FF++)**:
  - Contains pristine video frames and manipulated variants across 4 manipulation methods (Deepfakes, Face2Face, FaceSwap, NeuralTextures).
  - Target Path: `datasets/faceforensics/`
- **GenImage**:
  - 1M+ pairs of authentic camera photos vs. state-of-the-art generative AI outputs (Stable Diffusion v1.4/v1.5, Midjourney, DALL-E, Wukong, VQDM).
  - Target Path: `datasets/genimage/`
- **CASIA Image Tampering Database (v1.0 & v2.0)**:
  - Splicing and copy-move manipulation benchmark with ground-truth binary masks.
  - Target Path: `datasets/casia/`

### 2. Audio & Speech Anti-Spoofing
- **ASVspoof 2019 / 2021**:
  - Logical Access (LA) and Speech Deepfake (DF) partitions evaluating synthetic text-to-speech (TTS) and voice conversion (VC).
  - Target Path: `datasets/asvspoof/`

### 3. Text & Claim Verification
- **FEVER (Fact Extraction and VERification)**:
  - 185,000+ claims categorized as *Supported*, *Refuted*, or *NotEnoughInfo* against Wikipedia context.
  - Target Path: `datasets/fever/`
- **LIAR**:
  - 12,800 human-labeled short statements graded on a 6-point truth spectrum from PolitiFact.
  - Target Path: `datasets/liar/`

---

## 🛠️ Dataset Directory Structure

```text
datasets/
├── raw/                      # Downloaded original archives (unprocessed)
├── processed/                # Cropped faces, normalized patches, spectrograms
│   ├── images/
│   │   ├── train/
│   │   ├── val/
│   │   └── test/
│   └── metadata.csv          # Ground-truth labels, provenance, manipulation type
└── README.md
```
