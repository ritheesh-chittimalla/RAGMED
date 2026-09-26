import os
import joblib
import pandas as pd
from app.schemas import KidneyPredictionInput, PredictionResponse
from app.config import calculate_risk_level, DISCLAIMER

MODEL_PATH = os.path.join(os.path.dirname(__file__), "..", "models", "kidney_model.pkl")

_kidney_pipeline = None

def get_kidney_pipeline():
    global _kidney_pipeline
    if _kidney_pipeline is None:
        if not os.path.exists(MODEL_PATH):
            from app.training.train_kidney import train_kidney_model
            train_kidney_model()
        _kidney_pipeline = joblib.load(MODEL_PATH)
    return _kidney_pipeline


def predict_kidney_risk(input_data: KidneyPredictionInput) -> PredictionResponse:
    pipeline = get_kidney_pipeline()
    
    input_df = pd.DataFrame([{
        'age': input_data.age,
        'bp': input_data.bp,
        'sg': input_data.sg,
        'al': input_data.al,
        'su': input_data.su,
        'rbc': input_data.rbc,
        'pc': input_data.pc,
        'pcc': input_data.pcc,
        'ba': input_data.ba,
        'bgr': input_data.bgr,
        'bu': input_data.bu,
        'sc': input_data.sc,
        'sod': input_data.sod,
        'pot': input_data.pot,
        'hemo': input_data.hemo,
        'pcv': input_data.pcv,
        'wbcc': input_data.wbcc,
        'rbcc': input_data.rbcc,
        'htn': input_data.htn,
        'dm': input_data.dm,
        'cad': input_data.cad,
        'appet': input_data.appet,
        'pe': input_data.pe,
        'ane': input_data.ane
    }])
    
    raw_pred = int(pipeline.predict(input_df)[0])
    prob = float(pipeline.predict_proba(input_df)[0][1])
    risk_level = calculate_risk_level(prob)
    
    risk_factors = []
    if input_data.sc >= 1.4:
        risk_factors.append(f"Elevated Serum Creatinine ({input_data.sc} mg/dL)")
    if input_data.al > 0:
        risk_factors.append(f"Albuminuria Level ({input_data.al})")
    if input_data.hemo < 12.0:
        risk_factors.append(f"Low Hemoglobin ({input_data.hemo} gms)")
    if input_data.htn == 1:
        risk_factors.append("History of Hypertension")
    if input_data.dm == 1:
        risk_factors.append("History of Diabetes Mellitus")
    if input_data.bu >= 40:
        risk_factors.append(f"Elevated Blood Urea ({input_data.bu} mg/dL)")
    if input_data.sg <= 1.015:
        risk_factors.append(f"Low Urine Specific Gravity ({input_data.sg})")
        
    if not risk_factors:
        risk_factors = ["Normal renal indicators"]

    prediction_label = "Elevated Risk" if raw_pred == 1 else "Normal / Lower Risk"
    
    return PredictionResponse(
        disease="Chronic Kidney Disease",
        prediction=raw_pred,
        prediction_label=prediction_label,
        probability=round(prob, 4),
        risk_level=risk_level,
        top_risk_factors=risk_factors[:5],
        disclaimer=DISCLAIMER
    )
