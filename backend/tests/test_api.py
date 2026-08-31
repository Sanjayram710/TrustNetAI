import pytest
from io import BytesIO
from fastapi.testclient import TestClient
from PIL import Image

from app.main import app

client = TestClient(app)

def create_test_image_bytes():
    img = Image.new("RGB", (200, 200), color=(73, 109, 137))
    buf = BytesIO()
    img.save(buf, format="JPEG")
    buf.seek(0)
    return buf.getvalue()

def test_health_endpoint():
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert "service" in data

def test_trust_engine_config_endpoint():
    response = client.get("/api/config/trust-engine")
    assert response.status_code == 200
    data = response.json()
    assert "weights" in data
    assert "trust_bands" in data

def test_list_analyses_endpoint():
    response = client.get("/api/analysis")
    assert response.status_code == 200
    data = response.json()
    assert "metrics" in data
    assert "items" in data
    assert "total" in data

def test_analyze_image_endpoint():
    img_bytes = create_test_image_bytes()
    files = {"file": ("test_upload.jpg", img_bytes, "image/jpeg")}
    data = {"claim": "Authentic nature photography"}
    
    response = client.post("/api/analyze/image", files=files, data=data)
    assert response.status_code == 200
    res_json = response.json()
    
    assert "id" in res_json
    assert res_json["content_type"] == "image"
    assert "trust_score" in res_json
    assert "signals" in res_json
    assert "findings" in res_json
    assert len(res_json["findings"]) > 0
    assert res_json["model_breakdown"]["is_demo_inference"] is True
    
    # Check that we can retrieve it by ID
    analysis_id = res_json["id"]
    get_res = client.get(f"/api/analysis/{analysis_id}")
    assert get_res.status_code == 200
    assert get_res.json()["id"] == analysis_id

def test_analyze_text_claim_endpoint():
    payload = {
        "text": "Breaking news: Researchers achieve breakthrough in clean fusion energy with documented peer-reviewed replication.",
        "source_url": "https://nature.com/articles/fusion-breakthrough"
    }
    response = client.post("/api/analyze/text", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["content_type"] == "text"
    assert data["trust_score"] > 0
    assert "signals" in data
