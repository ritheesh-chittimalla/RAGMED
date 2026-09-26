import os
import joblib
import pandas as pd
from app.schemas import HeartPredictionInput, PredictionResponse
from app.config import calculate_risk_level, DISCLAIMER

MODEL_PATH = os.path.join(os.path.dirname(__file__), "..", "models", "heart_model.pkl")

_heart_pipeline = None

def get_heart_pipeline():
    global _heart_pipeline
    if _heart_pipeline is None:
        if not os.path.exists(MODEL_PATH):
            from app.training.train_heart import train_heart_model
            train_heart_model()
        _heart_pipeline = joblib.load(MODEL_PATH)
    return _heart_pipeline


def predict_heart_risk(input_data: HeartPredictionInput) -> PredictionResponse:
    pipeline = get_heart_pipeline()
    
    input_df = pd.DataFrame([{
        'age': input_data.age,
        'sex': input_data.sex,
        'cp': input_data.cp,
        'trestbps': input_data.trestbps,
        'chol': input_data.chol,
        'fbs': input_data.fbs,
        'restecg': input_data.restecg,
        'thalach': input_data.thalach,
        'exang': input_data.exang,
        'oldpeak': input_data.oldpeak,
        'slope': input_data.slope,
        'ca': input_data.ca,
        'thal': input_data.thal
    }])
    
    raw_pred = int(pipeline.predict(input_df)[0])
    prob = float(pipeline.predict_proba(input_df)[0][1])
    risk_level = calculate_risk_level(prob)
    
    risk_factors = []
    if input_data.age > 55:
        risk_factors.append(f"Age ({input_data.age} years)")
    if input_data.trestbps >= 130:
        risk_factors.append(f"Elevated Resting BP ({input_data.trestbps} mm Hg)")
    if input_data.chol >= 200:
        risk_factors.append(f"High Serum Cholesterol ({input_data.chol} mg/dl)")
    if input_data.cp in [0, 3]:
        risk_factors.append("Chest Pain Type (Typical/Asymptomatic Angina)")
    if input_data.exang == 1:
        risk_factors.append("Exercise Induced Angina")
    if input_data.oldpeak >= 1.0:
        risk_factors.append(f"ST Depression ({input_data.oldpeak})")
    if input_data.ca > 0:
        risk_factors.append(f"Fluoroscopy Vessels ({input_data.ca})")
    if input_data.thal == 3:
        risk_factors.append("Reversible Thalassemia Defect")
        
    if not risk_factors:
        risk_factors = ["Normal physiological indicators"]

    prediction_label = "Elevated Risk" if raw_pred == 1 else "Normal / Lower Risk"
    
    return PredictionResponse(
        disease="Heart Disease",
        prediction=raw_pred,
        prediction_label=prediction_label,
        probability=round(prob, 4),
        risk_level=risk_level,
        top_risk_factors=risk_factors[:5],
        disclaimer=DISCLAIMER
    )
