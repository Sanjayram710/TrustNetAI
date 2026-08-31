# TrustNet AI — Research & Prototyping Notebooks

This directory contains Jupyter notebooks used for research, feature exploration, and model evaluation before exporting weights into production service adapters.

---

## 📓 Notebook Catalog

1. **`01_image_forensics_exploration.ipynb`**:
   - Error Level Analysis (ELA) parameter tuning across JPEG quality ranges ($Q \in [75, 95]$).
   - High-pass spatial filter noise extraction and histogram analysis.
   - EXIF tag parsing and metadata integrity anomaly detection.

2. **`02_trust_score_calibration.ipynb`**:
   - Evaluating multi-signal linear combinations vs. logistic regression fusion.
   - Non-linear penalty curve tuning on simulated tampering distributions.
   - Bayesian confidence shrinkage towards neutral prior ($50.0$).

3. **`03_temporal_video_prototyping.ipynb`**:
   - OpenCV keyframe extraction and facial bounding box tracking.
   - Space-time optical flow discontinuity detection.

4. **`04_audio_spectrogram_features.ipynb`**:
   - Short-Time Fourier Transform (STFT) & Mel-scale filter bank feature transformation.
   - High-frequency phase artifact visualization.
