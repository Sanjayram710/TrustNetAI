# TrustNet AI — Trust Score Formula & Scoring Engine

The TrustNet AI Trust Score is a transparent, multi-dimensional index on a continuous scale from `0` (Very Low Trust / High Risk of Manipulation or Synthetic Generation) to `100` (High Trust / Strong Authenticity & Evidence).

---

## 1. Core Dimensions

The Trust Score fuses four independent sub-signals:

| Signal Name | Symbol | Range | Description |
|---|---|---|---|
| **Media Authenticity** | $S_{\text{auth}}$ | $0 - 100$ | Probability that the media represents organic capture vs. synthetic generation. |
| **Manipulation Risk** | $S_{\text{manip}}$ | $0 - 100$ | Probability that content has undergone local editing, splicing, or deepfake tampering. |
| **Source Reliability** | $S_{\text{src}}$ | $0 - 100$ | Metadata integrity, provenance verification, and platform origin confidence. |
| **Claim Support** | $S_{\text{claim}}$ | $0 - 100$ | Factual and contextual corroboration across verifiable sources. |

---

## 2. Mathematical Formulation

### Base Weighted Score
The primary score component is computed via linear combination:

$$S_{\text{base}} = w_{\text{auth}} \cdot S_{\text{auth}} + w_{\text{manip}} \cdot (100 - S_{\text{manip}}) + w_{\text{src}} \cdot S_{\text{src}} + w_{\text{claim}} \cdot S_{\text{claim}}$$

Where default normalized weights satisfy $\sum w_i = 1.0$:
- $w_{\text{auth}} = 0.40$
- $w_{\text{manip}} = 0.30$
- $w_{\text{src}} = 0.15$
- $w_{\text{claim}} = 0.15$

*(For image-only analysis without claims, weights adapt dynamically: $w_{\text{auth}} = 0.50$, $w_{\text{manip}} = 0.35$, $w_{\text{src}} = 0.15$, $w_{\text{claim}} = 0.00$.)*

### Non-Linear Penalty Adjustments
To prevent high authenticity scores from masking severe local tampering:
1. **Critical Tampering Penalty**:
   If $S_{\text{manip}} > 75$, apply penalty:
   $$\text{Penalty}_{\text{tamper}} = (S_{\text{manip}} - 75) \times 0.6$$
2. **Confidence Calibration**:
   If overall model confidence $C \in [0, 1]$ is low ($C < 0.60$), regress the score towards prior neutrality ($50.0$):
   $$\text{Trust Score} = C \cdot (S_{\text{base}} - \text{Penalty}_{\text{tamper}}) + (1 - C) \cdot 50.0$$

Final score is clamped to $[0, 100]$ and rounded to the nearest integer.

---

## 3. Trust Score Bands

| Score Range | Trust Band | Risk Level | Description |
|---|---|---|---|
| **80 – 100** | **High Trust** | Minimal Risk | Strong visual authenticity signals, consistent noise floor, verified metadata. |
| **60 – 79** | **Moderate Trust** | Low / Moderate | Likely authentic with minor non-tampering compression or missing metadata. |
| **40 – 59** | **Uncertain** | Elevated Risk | Inconclusive signals, low model confidence, or ambiguous feature distributions. |
| **20 – 39** | **Low Trust** | High Risk | High probability of synthetic generation or localized artifact anomalies. |
| **0 – 19** | **Very Low Trust** | Critical Risk | Severe manipulation patterns or blatant deepfake generation signatures. |

---

## 4. Configuration & Extensibility

All weights and threshold parameters are exposed via `app/services/trust_engine.py` and can be inspected via the `GET /api/config/trust-engine` endpoint.
