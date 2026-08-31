import pytest
from app.services.trust_engine import TrustScoreEngine
from app.schemas.analysis import CoreSignals, TrustBand, RiskLevel

def test_trust_score_engine_config():
    engine = TrustScoreEngine()
    cfg = engine.get_config()
    assert "weights" in cfg
    assert "trust_bands" in cfg
    assert "High Trust" in cfg["trust_bands"]

def test_compute_high_trust_score():
    engine = TrustScoreEngine()
    signals = CoreSignals(
        authenticity_score=95.0,
        manipulation_risk=4.0,
        source_reliability=90.0,
        claim_support=85.0
    )
    score, band, risk = engine.compute_trust_score(signals, confidence=0.95)
    
    assert score >= 80
    assert band == TrustBand.HIGH_TRUST
    assert risk == RiskLevel.MINIMAL

def test_compute_low_trust_score_with_high_manipulation():
    engine = TrustScoreEngine()
    signals = CoreSignals(
        authenticity_score=15.0,
        manipulation_risk=90.0,
        source_reliability=20.0,
        claim_support=25.0
    )
    score, band, risk = engine.compute_trust_score(signals, confidence=0.90)
    
    assert score < 30
    assert band in [TrustBand.LOW_TRUST, TrustBand.VERY_LOW_TRUST]
    assert risk in [RiskLevel.HIGH, RiskLevel.CRITICAL]

def test_critical_tampering_penalty():
    engine = TrustScoreEngine()
    # High authenticity but sudden high manipulation penalty trigger
    signals_tampered = CoreSignals(
        authenticity_score=70.0,
        manipulation_risk=85.0,
        source_reliability=50.0,
        claim_support=50.0
    )
    score, band, risk = engine.compute_trust_score(signals_tampered, confidence=0.90)
    assert score <= 45

def test_confidence_calibration_neutrality_regression():
    engine = TrustScoreEngine()
    signals = CoreSignals(
        authenticity_score=100.0,
        manipulation_risk=0.0,
        source_reliability=100.0,
        claim_support=100.0
    )
    # High signals but low confidence (e.g. 0.3) -> should regress towards 50
    score, _, _ = engine.compute_trust_score(signals, confidence=0.30)
    assert score < 95
    assert score >= 60
