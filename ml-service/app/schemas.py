from pydantic import BaseModel, Field
from typing import Dict, Any, Optional

class HeartPredictionInput(BaseModel):
    age: int = Field(..., ge=1, le=120, description="Age in years", json_schema_extra={"example": 55})
    sex: int = Field(..., ge=0, le=1, description="Sex (1 = male, 0 = female)", json_schema_extra={"example": 1})
    cp: int = Field(..., ge=0, le=3, description="Chest pain type (0: typical angina, 1: atypical, 2: non-anginal, 3: asymptomatic)", json_schema_extra={"example": 2})
    trestbps: int = Field(..., ge=80, le=240, description="Resting blood pressure in mm Hg", json_schema_extra={"example": 140})
    chol: int = Field(..., ge=100, le=600, description="Serum cholesterol in mg/dl", json_schema_extra={"example": 240})
    fbs: int = Field(..., ge=0, le=1, description="Fasting blood sugar > 120 mg/dl (1 = true, 0 = false)", json_schema_extra={"example": 0})
    restecg: int = Field(..., ge=0, le=2, description="Resting ECG results (0: normal, 1: ST-T wave abnormality, 2: LV hypertrophy)", json_schema_extra={"example": 1})
    thalach: int = Field(..., ge=60, le=220, description="Maximum heart rate achieved", json_schema_extra={"example": 150})
    exang: int = Field(..., ge=0, le=1, description="Exercise induced angina (1 = yes, 0 = no)", json_schema_extra={"example": 0})
    oldpeak: float = Field(..., ge=0.0, le=10.0, description="ST depression induced by exercise relative to rest", json_schema_extra={"example": 1.5})
    slope: int = Field(..., ge=0, le=2, description="Slope of peak exercise ST segment (0: upsloping, 1: flat, 2: downsloping)", json_schema_extra={"example": 1})
    ca: int = Field(..., ge=0, le=4, description="Number of major vessels (0-4) colored by fluoroscopy", json_schema_extra={"example": 0})
    thal: int = Field(..., ge=0, le=3, description="Thalassemia (1: normal, 2: fixed defect, 3: reversible defect)", json_schema_extra={"example": 2})


class DiabetesPredictionInput(BaseModel):
    pregnancies: int = Field(..., ge=0, le=20, description="Number of pregnancies", json_schema_extra={"example": 2})
    glucose: float = Field(..., ge=0, le=300, description="Plasma glucose concentration (2h in oral glucose tolerance test)", json_schema_extra={"example": 138.0})
    blood_pressure: float = Field(..., ge=0, le=200, description="Diastolic blood pressure (mm Hg)", json_schema_extra={"example": 72.0})
    skin_thickness: float = Field(..., ge=0, le=100, description="Triceps skin fold thickness (mm)", json_schema_extra={"example": 35.0})
    insulin: float = Field(..., ge=0, le=900, description="2-Hour serum insulin (mu U/ml)", json_schema_extra={"example": 0.0})
    bmi: float = Field(..., ge=0.0, le=70.0, description="Body mass index (weight in kg/(height in m)^2)", json_schema_extra={"example": 33.6})
    dpf: float = Field(..., ge=0.0, le=3.0, description="Diabetes pedigree function", json_schema_extra={"example": 0.627})
    age: int = Field(..., ge=1, le=120, description="Age in years", json_schema_extra={"example": 47})


class KidneyPredictionInput(BaseModel):
    age: int = Field(..., ge=1, le=120, description="Age in years", json_schema_extra={"example": 48})
    bp: float = Field(..., ge=40, le=200, description="Blood Pressure in mm/Hg", json_schema_extra={"example": 80.0})
    sg: float = Field(..., ge=1.000, le=1.030, description="Specific Gravity (e.g. 1.020)", json_schema_extra={"example": 1.020})
    al: int = Field(..., ge=0, le=5, description="Albumin (0 to 5)", json_schema_extra={"example": 1})
    su: int = Field(..., ge=0, le=5, description="Sugar (0 to 5)", json_schema_extra={"example": 0})
    rbc: int = Field(..., ge=0, le=1, description="Red Blood Cells (0: normal, 1: abnormal)", json_schema_extra={"example": 0})
    pc: int = Field(..., ge=0, le=1, description="Pus Cell (0: normal, 1: abnormal)", json_schema_extra={"example": 0})
    pcc: int = Field(..., ge=0, le=1, description="Pus Cell Clumps (0: not present, 1: present)", json_schema_extra={"example": 0})
    ba: int = Field(..., ge=0, le=1, description="Bacteria (0: not present, 1: present)", json_schema_extra={"example": 0})
    bgr: float = Field(..., ge=50, le=500, description="Blood Glucose Random in mgs/dl", json_schema_extra={"example": 121.0})
    bu: float = Field(..., ge=10, le=400, description="Blood Urea in mgs/dl", json_schema_extra={"example": 36.0})
    sc: float = Field(..., ge=0.4, le=20.0, description="Serum Creatinine in mgs/dl", json_schema_extra={"example": 1.2})
    sod: float = Field(..., ge=100, le=180, description="Sodium in mEq/L", json_schema_extra={"example": 137.0})
    pot: float = Field(..., ge=2.5, le=10.0, description="Potassium in mEq/L", json_schema_extra={"example": 4.4})
    hemo: float = Field(..., ge=3.0, le=20.0, description="Hemoglobin in gms", json_schema_extra={"example": 15.4})
    pcv: float = Field(..., ge=15, le=60, description="Packed Cell Volume", json_schema_extra={"example": 44.0})
    wbcc: float = Field(..., ge=2000, le=30000, description="White Blood Cell Count", json_schema_extra={"example": 7800.0})
    rbcc: float = Field(..., ge=2.0, le=8.0, description="Red Blood Cell Count", json_schema_extra={"example": 5.2})
    htn: int = Field(..., ge=0, le=1, description="Hypertension (0: no, 1: yes)", json_schema_extra={"example": 1})
    dm: int = Field(..., ge=0, le=1, description="Diabetes Mellitus (0: no, 1: yes)", json_schema_extra={"example": 1})
    cad: int = Field(..., ge=0, le=1, description="Coronary Artery Disease (0: no, 1: yes)", json_schema_extra={"example": 0})
    appet: int = Field(..., ge=0, le=1, description="Appetite (0: good, 1: poor)", json_schema_extra={"example": 0})
    pe: int = Field(..., ge=0, le=1, description="Pedal Edema (0: no, 1: yes)", json_schema_extra={"example": 0})
    ane: int = Field(..., ge=0, le=1, description="Anemia (0: no, 1: yes)", json_schema_extra={"example": 0})


class PredictionResponse(BaseModel):
    disease: str = Field(..., description="Target disease name")
    prediction: int = Field(..., description="Binary prediction (0 = Lower Risk, 1 = Higher Risk)")
    prediction_label: str = Field(..., description="Human readable prediction label")
    probability: float = Field(..., description="Predicted risk probability (0.00 to 1.00)")
    risk_level: str = Field(..., description="Prototype risk level category (Low, Moderate, High)")
    top_risk_factors: list[str] = Field(default_factory=list, description="Key contributing risk factors")
    disclaimer: str = Field(..., description="Medical prototype disclaimer")
