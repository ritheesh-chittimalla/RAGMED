import os
import joblib
import pandas as pd
from app.schemas import DiabetesPredictionInput, PredictionResponse
from app.config import calculate_risk_level, DISCLAIMER

MODEL_PATH = os.path.join(os.path.dirname(__file__), "..", "models", "diabetes_model.pkl")

_diabetes_pipeline = None

def get_diabetes_pipeline():
    global _diabetes_pipeline
    if _diabetes_pipeline is None:
        if not os.path.exists(MODEL_PATH):
            from app.training.train_diabetes import train_diabetes_model
            train_diabetes_model()
        _diabetes_pipeline = joblib.load(MODEL_PATH)
    return _diabetes_pipeline


def predict_diabetes_risk(input_data: DiabetesPredictionInput) -> PredictionResponse:
    pipeline = get_diabetes_pipeline()
    
    input_df = pd.DataFrame([{
        'pregnancies': input_data.pregnancies,
        'glucose': input_data.glucose,
        'blood_pressure': input_data.blood_pressure,
        'skin_thickness': input_data.skin_thickness,
        'insulin': input_data.insulin,
        'bmi': input_data.bmi,
        'dpf': input_data.dpf,
        'age': input_data.age
    }])
    
    raw_pred = int(pipeline.predict(input_df)[0])
    prob = float(pipeline.predict_proba(input_df)[0][1])
    risk_level = calculate_risk_level(prob)
    
    risk_factors = []
    if input_data.glucose >= 140:
        risk_factors.append(f"Elevated Glucose ({input_data.glucose} mg/dL)")
    if input_data.bmi >= 30.0:
        risk_factors.append(f"High Body Mass Index ({input_data.bmi})")
    if input_data.age >= 45:
        risk_factors.append(f"Age ({input_data.age} years)")
    if input_data.dpf >= 0.5:
        risk_factors.append(f"Elevated Genetic Pedigree Score ({input_data.dpf})")
    if input_data.pregnancies >= 4:
        risk_factors.append(f"Pregnancy Count ({input_data.pregnancies})")
    if input_data.blood_pressure >= 80:
        risk_factors.append(f"Diastolic BP ({input_data.blood_pressure} mm Hg)")
        
    if not risk_factors:
        risk_factors = ["Normal physiological indicators"]

    prediction_label = "Elevated Risk" if raw_pred == 1 else "Normal / Lower Risk"
    
    return PredictionResponse(
        disease="Diabetes",
        prediction=raw_pred,
        prediction_label=prediction_label,
        probability=round(prob, 4),
        risk_level=risk_level,
        top_risk_factors=risk_factors[:5],
        disclaimer=DISCLAIMER
    )
