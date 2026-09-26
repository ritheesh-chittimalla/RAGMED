import os
import json
import joblib
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, roc_auc_score, confusion_matrix
from sklearn.pipeline import Pipeline

from generate_datasets import generate_diabetes_dataset

MODEL_DIR = os.path.join(os.path.dirname(__file__), "..", "models")
DATA_PATH = os.path.join(os.path.dirname(__file__), "..", "..", "data", "diabetes.csv")
os.makedirs(MODEL_DIR, exist_ok=True)

def train_diabetes_model():
    if not os.path.exists(DATA_PATH):
        generate_diabetes_dataset()
        
    df = pd.read_csv(DATA_PATH)
    X = df.drop(columns=['outcome'])
    y = df['outcome']
    
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)
    
    pipeline = Pipeline([
        ('scaler', StandardScaler()),
        ('classifier', RandomForestClassifier(n_estimators=100, max_depth=6, random_state=42))
    ])
    
    pipeline.fit(X_train, y_train)
    
    y_pred = pipeline.predict(X_test)
    y_prob = pipeline.predict_proba(X_test)[:, 1]
    
    acc = float(accuracy_score(y_test, y_pred))
    prec = float(precision_score(y_test, y_pred))
    rec = float(recall_score(y_test, y_pred))
    f1 = float(f1_score(y_test, y_pred))
    auc = float(roc_auc_score(y_test, y_prob))
    cm = confusion_matrix(y_test, y_pred).tolist()
    
    rf_model = pipeline.named_steps['classifier']
    feature_names = X.columns.tolist()
    importances = dict(zip(feature_names, [float(x) for x in rf_model.feature_importances_]))
    
    metrics = {
        "disease": "Diabetes",
        "accuracy": acc,
        "precision": prec,
        "recall": rec,
        "f1_score": f1,
        "roc_auc": auc,
        "confusion_matrix": cm,
        "feature_importances": importances
    }
    
    model_path = os.path.join(MODEL_DIR, "diabetes_model.pkl")
    joblib.dump(pipeline, model_path)
    print(f"[SUCCESS] Diabetes Model saved at: {model_path}")
    print(f"   Accuracy: {acc:.4f} | Precision: {prec:.4f} | Recall: {rec:.4f} | F1: {f1:.4f} | ROC-AUC: {auc:.4f}")
    
    metrics_file = os.path.join(MODEL_DIR, "metrics.json")
    all_metrics = {}
    if os.path.exists(metrics_file):
        try:
            with open(metrics_file, "r") as f:
                all_metrics = json.load(f)
        except Exception:
            all_metrics = {}
            
    all_metrics["diabetes"] = metrics
    with open(metrics_file, "w") as f:
        json.dump(all_metrics, f, indent=2)
        
    return metrics

if __name__ == "__main__":
    train_diabetes_model()
