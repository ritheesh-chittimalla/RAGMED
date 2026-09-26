import os
import pandas as pd
import numpy as np

DATA_DIR = os.path.join(os.path.dirname(__file__), "..", "..", "data")
os.makedirs(DATA_DIR, exist_ok=True)

def generate_heart_dataset(n_samples: int = 1000, seed: int = 42) -> str:
    np.random.seed(seed)
    
    age = np.random.normal(54, 9, n_samples).clip(29, 77).astype(int)
    sex = np.random.binomial(1, 0.68, n_samples)
    cp = np.random.choice([0, 1, 2, 3], size=n_samples, p=[0.47, 0.16, 0.28, 0.09])
    trestbps = np.random.normal(131, 17, n_samples).clip(94, 200).astype(int)
    chol = np.random.normal(246, 51, n_samples).clip(126, 564).astype(int)
    fbs = np.random.binomial(1, 0.15, n_samples)
    restecg = np.random.choice([0, 1, 2], size=n_samples, p=[0.49, 0.48, 0.03])
    thalach = (220 - age*0.7 - np.random.normal(20, 15, n_samples)).clip(71, 202).astype(int)
    exang = np.random.binomial(1, 0.32, n_samples)
    oldpeak = np.round(np.random.exponential(1.0, n_samples).clip(0.0, 6.2), 1)
    slope = np.random.choice([0, 1, 2], size=n_samples, p=[0.46, 0.46, 0.08])
    ca = np.random.choice([0, 1, 2, 3], size=n_samples, p=[0.58, 0.21, 0.13, 0.08])
    thal = np.random.choice([1, 2, 3], size=n_samples, p=[0.06, 0.55, 0.39])
    
    log_odds = (
        -1.8
        + 0.04 * (age - 50)
        + 0.6 * sex
        + 0.7 * (cp == 0) + 0.4 * (cp == 3)
        + 0.02 * (trestbps - 120)
        + 0.005 * (chol - 200)
        + 0.5 * exang
        - 0.03 * (thalach - 140)
        + 0.8 * oldpeak
        + 0.9 * ca
        + 0.8 * (thal == 3)
    )
    prob = 1 / (1 + np.exp(-log_odds))
    target = (np.random.rand(n_samples) < prob).astype(int)
    
    df = pd.DataFrame({
        'age': age,
        'sex': sex,
        'cp': cp,
        'trestbps': trestbps,
        'chol': chol,
        'fbs': fbs,
        'restecg': restecg,
        'thalach': thalach,
        'exang': exang,
        'oldpeak': oldpeak,
        'slope': slope,
        'ca': ca,
        'thal': thal,
        'target': target
    })
    
    filepath = os.path.join(DATA_DIR, 'heart.csv')
    df.to_csv(filepath, index=False)
    print(f"[Dataset Generator] Heart dataset created at {filepath} ({n_samples} samples, target balance: {target.mean():.2%})")
    return filepath


def generate_diabetes_dataset(n_samples: int = 1000, seed: int = 42) -> str:
    np.random.seed(seed)
    
    age = np.random.normal(33, 11, n_samples).clip(21, 81).astype(int)
    pregnancies = np.random.poisson(3.8, n_samples).clip(0, 17)
    glucose = np.random.normal(121, 31, n_samples).clip(44, 199).round(1)
    blood_pressure = np.random.normal(69, 19, n_samples).clip(24, 122).round(1)
    skin_thickness = np.random.normal(20, 15, n_samples).clip(0, 99).round(1)
    insulin = np.random.exponential(80, n_samples).clip(0, 846).round(1)
    bmi = np.random.normal(32, 7, n_samples).clip(18.2, 67.1).round(1)
    dpf = np.round(np.random.gamma(2, 0.24, n_samples).clip(0.078, 2.42), 3)
    
    log_odds = (
        -1.8
        + 0.12 * pregnancies
        + 0.035 * (glucose - 100)
        + 0.08 * (bmi - 25)
        + 0.03 * (age - 30)
        + 0.9 * dpf
        + 0.01 * (blood_pressure - 70)
    )
    prob = 1 / (1 + np.exp(-log_odds))
    outcome = (np.random.rand(n_samples) < prob).astype(int)
    
    df = pd.DataFrame({
        'pregnancies': pregnancies,
        'glucose': glucose,
        'blood_pressure': blood_pressure,
        'skin_thickness': skin_thickness,
        'insulin': insulin,
        'bmi': bmi,
        'dpf': dpf,
        'age': age,
        'outcome': outcome
    })
    
    filepath = os.path.join(DATA_DIR, 'diabetes.csv')
    df.to_csv(filepath, index=False)
    print(f"[Dataset Generator] Diabetes dataset created at {filepath} ({n_samples} samples, target balance: {outcome.mean():.2%})")
    return filepath


def generate_kidney_dataset(n_samples: int = 1000, seed: int = 42) -> str:
    np.random.seed(seed)
    
    age = np.random.normal(51, 17, n_samples).clip(12, 90).astype(int)
    bp = np.random.choice([50, 60, 70, 80, 90, 100, 110, 120], size=n_samples, p=[0.02, 0.08, 0.35, 0.30, 0.15, 0.06, 0.03, 0.01])
    sg = np.random.choice([1.005, 1.010, 1.015, 1.020, 1.025], size=n_samples, p=[0.05, 0.15, 0.25, 0.40, 0.15])
    al = np.random.choice([0, 1, 2, 3, 4, 5], size=n_samples, p=[0.50, 0.20, 0.15, 0.10, 0.04, 0.01])
    su = np.random.choice([0, 1, 2, 3, 4, 5], size=n_samples, p=[0.80, 0.08, 0.06, 0.04, 0.01, 0.01])
    rbc = np.random.choice([0, 1], size=n_samples, p=[0.80, 0.20])
    pc = np.random.choice([0, 1], size=n_samples, p=[0.75, 0.25])
    pcc = np.random.choice([0, 1], size=n_samples, p=[0.90, 0.10])
    ba = np.random.choice([0, 1], size=n_samples, p=[0.94, 0.06])
    bgr = np.random.normal(148, 79, n_samples).clip(70, 490).round(1)
    bu = np.random.normal(57, 50, n_samples).clip(10, 391).round(1)
    sc = np.round(np.random.exponential(3.0, n_samples).clip(0.4, 15.0), 1)
    sod = np.random.normal(137, 10, n_samples).clip(104, 163).round(1)
    pot = np.random.normal(4.6, 3.0, n_samples).clip(2.5, 9.0).round(1)
    hemo = np.random.normal(12.5, 2.9, n_samples).clip(3.1, 17.8).round(1)
    pcv = (hemo * 3.1 + np.random.normal(0, 2, n_samples)).clip(16, 54).astype(int)
    wbcc = np.random.normal(8400, 2900, n_samples).clip(2200, 26400).astype(int)
    rbcc = np.round((hemo / 2.8 + np.random.normal(0, 0.3, n_samples)).clip(2.1, 8.0), 1)
    htn = np.random.choice([0, 1], size=n_samples, p=[0.63, 0.37])
    dm = np.random.choice([0, 1], size=n_samples, p=[0.66, 0.34])
    cad = np.random.choice([0, 1], size=n_samples, p=[0.91, 0.09])
    appet = np.random.choice([0, 1], size=n_samples, p=[0.80, 0.20])
    pe = np.random.choice([0, 1], size=n_samples, p=[0.81, 0.19])
    ane = np.random.choice([0, 1], size=n_samples, p=[0.85, 0.15])
    
    log_odds = (
        -1.5
        + 1.5 * (sc > 1.4)
        + 1.2 * (al > 0)
        + 1.0 * htn
        + 0.8 * dm
        - 0.3 * (hemo - 12)
        - 80 * (sg - 1.020)
        + 0.01 * (bu - 40)
        + 0.8 * rbc
        + 0.6 * appet
    )
    prob = 1 / (1 + np.exp(-log_odds))
    target = (np.random.rand(n_samples) < prob).astype(int)
    
    df = pd.DataFrame({
        'age': age,
        'bp': bp,
        'sg': sg,
        'al': al,
        'su': su,
        'rbc': rbc,
        'pc': pc,
        'pcc': pcc,
        'ba': ba,
        'bgr': bgr,
        'bu': bu,
        'sc': sc,
        'sod': sod,
        'pot': pot,
        'hemo': hemo,
        'pcv': pcv,
        'wbcc': wbcc,
        'rbcc': rbcc,
        'htn': htn,
        'dm': dm,
        'cad': cad,
        'appet': appet,
        'pe': pe,
        'ane': ane,
        'target': target
    })
    
    filepath = os.path.join(DATA_DIR, 'kidney.csv')
    df.to_csv(filepath, index=False)
    print(f"[Dataset Generator] Kidney dataset created at {filepath} ({n_samples} samples, target balance: {target.mean():.2%})")
    return filepath


if __name__ == "__main__":
    generate_heart_dataset()
    generate_diabetes_dataset()
    generate_kidney_dataset()
