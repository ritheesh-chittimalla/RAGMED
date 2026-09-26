# 🏥 Mediqon - AI-Based Multi-Disease Risk Prediction & Healthcare Ecosystem

Welcome to **Mediqon**, an advanced healthcare application combining machine learning multi-disease risk prediction, an interactive patient portal, tele-consultation telemetry, Vapi voice assistant integration, and hospital appointment management.

---

## 📋 Table of Contents
1. [System Overview & Architecture](#-system-overview--architecture)
2. [Microservices & Components](#-microservices--components)
3. [Machine Learning Models & Kaggle Datasets](#-machine-learning-models--kaggle-datasets)
4. [Key System Features](#-key-system-features)
5. [Prerequisites](#-prerequisites)
6. [Step-by-Step Guide: How to Run the Project](#-step-by-step-guide-how-to-run-the-project)
7. [Environment Configuration (`.env`)](#-environment-configuration-env)
8. [API Reference & Microservice Endpoints](#-api-reference--microservice-endpoints)
9. [Disclaimer](#-academic-prototype--medical-disclaimer)

---

## 🏗️ System Overview & Architecture

Mediqon is built using a modern 3-tier microservice architecture:

```
                          ┌───────────────────────────┐
                          │   React 19 + Vite Client  │
                          │   (Port 5173 - Frontend)  │
                          └─────────────┬─────────────┘
                                        │
                         JWT Authenticated REST Requests
                                        │
                                        ▼
                          ┌───────────────────────────┐
                          │    NestJS Gateway API     │
                          │   (Port 3000 - Backend)   │
                          └──────┬─────────────┬──────┘
                                 │             │
                    TypeORM Sync │             │ Microservice HTTP Calls
                                 ▼             ▼
                     ┌───────────────┐     ┌────────────────────────────┐
                     │ MySQL / PG    │     │   Python FastAPI Service   │
                     │ Database      │     │  (Port 8000 - ML Inference)│
                     └───────────────┘     └────────────────────────────┘
```

---

## 🧩 Microservices & Components

### 1. Python ML Microservice (`ml-service/`)
- **Technology**: Python 3.10+, FastAPI, Uvicorn, Scikit-Learn, Pandas, Joblib.
- **Port**: `http://127.0.0.1:8000` (Swagger docs at `http://127.0.0.1:8000/docs`).
- **Role**: Handles machine learning model inference using reproducible `StandardScaler` + `RandomForestClassifier` pipelines.

### 2. NestJS Gateway Backend (`mediqon-backend/`)
- **Technology**: Node.js, NestJS, TypeORM, MySQL/PostgreSQL, Passport JWT, bcrypt.
- **Port**: `http://localhost:3000`.
- **Role**: Authentication (User registration & JWT login), appointment management, prediction audit history persistence, Vapi AI integration, and Tele-Consultation chat gateway.

### 3. React Frontend Client (`Mediqon-frontend/`)
- **Technology**: React 19, Vite, Tailwind CSS 4, Framer Motion, Axios, Lucide React icons.
- **Port**: `http://localhost:5173`.
- **Role**: Interactive patient portal containing prediction assessment tools, tele-consultation UI, vitals tracker, appointment booking, and health record vault.

---

## 📊 Machine Learning Models & Kaggle Datasets

Models were trained using Scikit-Learn pipelines combining feature scaling (`StandardScaler`) and `RandomForestClassifier` estimators.

| Disease Module | Benchmark Dataset Source | Local Data File | Sample Count | Input Parameters | Performance |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Heart Disease** | [UCI Cleveland Heart Disease](https://archive.ics.uci.edu/ml/machine-learning-databases/heart-disease/processed.cleveland.data) | [`ml-service/data/heart.csv`](file:///c:/Users/rithe/Mediqon/Mediqon/ml-service/data/heart.csv) | 297 records | 13 clinical metrics | ~70-78% Accuracy / ~0.77 ROC-AUC |
| **Diabetes** | [Kaggle Pima Indians NIDDK](https://raw.githubusercontent.com/jbrownlee/Datasets/master/pima-indians-diabetes.data.csv) | [`ml-service/data/diabetes.csv`](file:///c:/Users/rithe/Mediqon/Mediqon/ml-service/data/diabetes.csv) | 768 records | 8 metabolic metrics | ~73-78% Accuracy / ~0.76 ROC-AUC |
| **Chronic Kidney Disease** | [UCI Chronic Kidney Disease (CKD)](https://archive.ics.uci.edu/ml/datasets/Chronic_Kidney_Disease) | [`ml-service/data/kidney.csv`](file:///c:/Users/rithe/Mediqon/Mediqon/ml-service/data/kidney.csv) | 400 records | 24 renal metrics | ~78-86% Accuracy / ~0.76 ROC-AUC |

---

## ✨ Key System Features

- **Multi-Disease Risk Predictions**: Input physiological indicators to calculate statistical risk probability percentages for Heart, Diabetes, and Kidney conditions.
- **Automatic Report OCR / Extraction**: Upload clinical lab reports to automatically pre-fill parameter forms.
- **Clinical Tele-Consultation**: Live video telemetry simulation and interactive chat session with Consultant Cardiologist Dr. Sarah Johnson.
- **Vapi AI Voice Assistant**: Voice interaction for appointment scheduling, doctor availability checking, and instant inquiry resolution.
- **Medical Record Vault & Vitals**: Track historical health trends, blood pressure, resting heart rate, glucose levels, and medical history.

---

## 💻 Prerequisites

Ensure you have the following installed on your machine:
- **Node.js** (v18.0.0 or higher)
- **Python** (v3.10 to v3.13)
- **MySQL** (listening on port `3306`) OR **PostgreSQL** (listening on port `5432`)

---

## 🚀 Step-by-Step Guide: How to Run the Project

### Option A: Run All Services via Shell / Terminal

#### Step 1: Start Python ML Microservice
From the root workspace `C:\Users\rithe\Mediqon`, navigate to `Mediqon\ml-service`:
```powershell
cd Mediqon\ml-service
.\.venv\Scripts\python.exe -m uvicorn app.main:app --port 8000
```
*Verification*: Open `http://127.0.0.1:8000/docs` in your browser.

---

#### Step 2: Start NestJS Backend
Open a second terminal and navigate to `Mediqon\mediqon-backend`:
```powershell
cd Mediqon\mediqon-backend
npm install
npm run start:dev
```
*Verification*: Terminal will display `Application is running on: http://localhost:3000`.

---

#### Step 3: Start React Frontend Client
Open a third terminal and navigate to `Mediqon\Mediqon-frontend`:
```powershell
cd Mediqon\Mediqon-frontend
npm install
npm run dev
```
*Verification*: Terminal will display `Local: http://localhost:5173/`.

---

## ⚙️ Environment Configuration (`.env`)

Backend environment variables are configured in [`mediqon-backend/.env`](file:///c:/Users/rithe/Mediqon/Mediqon/mediqon-backend/.env):

```env
PORT=3000
DB_TYPE=mysql
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=root
DB_NAME=mediqon

JWT_SECRET=mediqon_super_secret_jwt_key_2026_academic_prototype
ML_SERVICE_URL=http://127.0.0.1:8000
GEMINI_API_KEY=your_optional_gemini_api_key
```

---

## 🔌 API Reference & Microservice Endpoints

### 1. Python ML Microservice (`http://127.0.0.1:8000`)
- `GET /health` - Health check.
- `POST /predict/heart` - Heart disease risk inference.
- `POST /predict/diabetes` - Diabetes risk inference.
- `POST /predict/kidney` - Chronic kidney disease risk inference.

### 2. NestJS Backend Gateway (`http://localhost:3000`)
- `POST /auth/register` - Create patient account.
- `POST /auth/login` - Authenticate & obtain JWT.
- `POST /ml/predict/heart` - Process heart prediction & save audit log.
- `POST /ml/predict/diabetes` - Process diabetes prediction & save audit log.
- `POST /ml/predict/kidney` - Process kidney prediction & save audit log.
- `GET /ml/history` - Fetch patient historical assessment records.
- `POST /ml/consult` - Tele-consultation text session chat endpoint.

---

## 🛡️ Academic Prototype & Medical Disclaimer

> **IMPORTANT**: This application is an **academic research prototype**. The predictions generated by the machine learning models are purely statistical estimates based on historical benchmark datasets and do **NOT** constitute clinical medical diagnosis, advice, or treatment recommendations. Always consult qualified healthcare professionals for real medical evaluations.
