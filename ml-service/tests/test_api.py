"""
Unit and Integration tests for FastAPI ML Prediction endpoints.
"""

from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_health_endpoint():
    response = client.get("/health")
    assert response.status_code == 200
    json_data = response.json()
    assert json_data["status"] == "healthy"
    assert "service" in json_data


def test_predict_heart_endpoint():
    payload = {
        "age": 55,
        "sex": 1,
        "cp": 2,
        "trestbps": 140,
        "chol": 240,
        "fbs": 0,
        "restecg": 1,
        "thalach": 150,
        "exang": 0,
        "oldpeak": 1.5,
        "slope": 1,
        "ca": 0,
        "thal": 2
    }
    response = client.post("/predict/heart", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["disease"] == "Heart Disease"
    assert data["prediction"] in [0, 1]
    assert 0.0 <= data["probability"] <= 1.0
    assert data["risk_level"] in ["Low", "Moderate", "High"]
    assert isinstance(data["top_risk_factors"], list)
    assert "disclaimer" in data


def test_predict_diabetes_endpoint():
    payload = {
        "pregnancies": 2,
        "glucose": 138.0,
        "blood_pressure": 72.0,
        "skin_thickness": 35.0,
        "insulin": 0.0,
        "bmi": 33.6,
        "dpf": 0.627,
        "age": 47
    }
    response = client.post("/predict/diabetes", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["disease"] == "Diabetes"
    assert data["prediction"] in [0, 1]
    assert 0.0 <= data["probability"] <= 1.0
    assert data["risk_level"] in ["Low", "Moderate", "High"]


def test_predict_kidney_endpoint():
    payload = {
        "age": 48,
        "bp": 80.0,
        "sg": 1.020,
        "al": 1,
        "su": 0,
        "rbc": 0,
        "pc": 0,
        "pcc": 0,
        "ba": 0,
        "bgr": 121.0,
        "bu": 36.0,
        "sc": 1.2,
        "sod": 137.0,
        "pot": 4.4,
        "hemo": 15.4,
        "pcv": 44.0,
        "wbcc": 7800.0,
        "rbcc": 5.2,
        "htn": 1,
        "dm": 1,
        "cad": 0,
        "appet": 0,
        "pe": 0,
        "ane": 0
    }
    response = client.post("/predict/kidney", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["disease"] == "Chronic Kidney Disease"
    assert data["prediction"] in [0, 1]
    assert 0.0 <= data["probability"] <= 1.0
    assert data["risk_level"] in ["Low", "Moderate", "High"]


def test_invalid_input_validation():
    # Sending missing fields should trigger 422 Unprocessable Entity
    response = client.post("/predict/heart", json={"age": 55})
    assert response.status_code == 422
