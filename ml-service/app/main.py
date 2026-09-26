import os
import sys
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from app.schemas import (
    HeartPredictionInput,
    DiabetesPredictionInput,
    KidneyPredictionInput,
    PredictionResponse
)
from app.services.heart import predict_heart_risk
from app.services.diabetes import predict_diabetes_risk
from app.services.kidney import predict_kidney_risk

app = FastAPI(
    title="Mediqon AI Disease Prediction Service",
    description="Microservice providing machine learning predictions for Heart, Diabetes, and Kidney disease risk.",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health", summary="Service Health Check")
def health_check():
    return {
        "status": "healthy",
        "service": "Mediqon ML Service",
        "version": "1.0.0"
    }

@app.post("/predict/heart", response_model=PredictionResponse, summary="Heart Disease Risk Prediction")
def predict_heart(payload: HeartPredictionInput):
    try:
        return predict_heart_risk(payload)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Heart disease prediction error: {str(e)}")

@app.post("/predict/diabetes", response_model=PredictionResponse, summary="Diabetes Risk Prediction")
def predict_diabetes(payload: DiabetesPredictionInput):
    try:
        return predict_diabetes_risk(payload)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Diabetes prediction error: {str(e)}")

@app.post("/predict/kidney", response_model=PredictionResponse, summary="Kidney Disease Risk Prediction")
def predict_kidney(payload: KidneyPredictionInput):
    try:
        return predict_kidney_risk(payload)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Kidney disease prediction error: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
