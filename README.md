# 🏥 Mediqon - AI-Based Multi-Disease Risk Prediction & Medical Decision Support System

[![React](https://img.shields.io/badge/React-19-blue.svg?style=for-the-badge&logo=react)](https://react.dev/)
[![NestJS](https://img.shields.io/badge/NestJS-11-red.svg?style=for-the-badge&logo=nestjs)](https://nestjs.com/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.110-009688.svg?style=for-the-badge&logo=fastapi)](https://fastapi.tiangolo.com/)
[![Scikit--Learn](https://img.shields.io/badge/Scikit--Learn-Random_Forest-F7931E.svg?style=for-the-badge&logo=scikit-learn)](https://scikit-learn.org/)
[![Google Gemini](https://img.shields.io/badge/AI-Google_Gemini-8E44AD.svg?style=for-the-badge)](https://ai.google.dev/)
[![Vapi.ai](https://img.shields.io/badge/AI-Voice_Concierge-6D28D9.svg?style=for-the-badge)](https://vapi.ai/)

**Mediqon** is an advanced healthcare ecosystem that combines **Machine Learning Multi-Disease Risk Predictions**, **Google Gemini AI Educational Decision Support**, **Vapi AI Voice Assistant**, and an **Interactive Patient Portal** for proactive health monitoring.

---

## 🏗️ System Architecture

```
React Frontend (Vite)
       │
       ▼ (JWT Authenticated REST)
NestJS Backend (Port 3000)
       ├──► PostgreSQL Database (prediction_history table)
       ├──► Google Gemini API (Non-Diagnostic AI Explanations)
       └──► Python FastAPI ML Microservice (Port 8000)
                 ├── Heart Disease Model (Random Forest Pipeline)
                 ├── Diabetes Model (Random Forest Pipeline)
                 └── Chronic Kidney Disease Model (Random Forest Pipeline)
```

---

## 🤖 How the AI Agent & Prediction Workflow Works

1. **User Input**: Patient enters physiological parameters (or selects a demo profile) on the frontend assessment pages (`/predictions/heart`, `/predictions/diabetes`, `/predictions/kidney`).
2. **NestJS Gateway**: Frontend sends JWT-authenticated requests to NestJS backend (`/api/ml/predict/*`).
3. **ML Microservice Execution**: NestJS forwards data to the Python FastAPI service (`http://127.0.0.1:8000`), which runs reproducible Scikit-Learn `StandardScaler` + `RandomForestClassifier` pipelines.
4. **Risk Classification**: The probability score ($0.00$ to $1.00$) is categorized into prototype risk tiers:
   - **Low Risk**: $< 0.40$
   - **Moderate Risk**: $0.40 - 0.69$
   - **High Risk**: $\ge 0.70$
5. **Database Persistence**: Prediction results, risk levels, and contributing risk factors are saved directly to PostgreSQL (`prediction_history` table).
6. **Gemini AI Explanation**: User clicks "Explain with AI". NestJS sends the structured prediction output to Google Gemini API to generate a simple, non-diagnostic educational breakdown explaining what the statistical score means.

---

## 📊 Machine Learning Models & Evaluation

Models were trained using reproducible Scikit-Learn pipelines combining feature scaling and Random Forest classifiers.

| Disease Module | Benchmark Dataset | Parameters | Accuracy | Precision | Recall | F1 Score | ROC-AUC | Saved Model |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Heart Disease** | UCI Cleveland | 13 parameters | **70.0%** | 71.9% | 84.7% | **0.7778** | **0.7729** | [`heart_model.pkl`](file:///c:/Users/rithe/Mediqon/Mediqon/ml-service/app/models/heart_model.pkl) |
| **Diabetes** | Pima Indians | 8 parameters | **73.0%** | 73.1% | 84.5% | **0.7840** | **0.7657** | [`diabetes_model.pkl`](file:///c:/Users/rithe/Mediqon/Mediqon/ml-service/app/models/diabetes_model.pkl) |
| **Chronic Kidney Disease** | UCI CKD | 24 parameters | **78.5%** | 77.1% | 99.3% | **0.8677** | **0.7663** | [`kidney_model.pkl`](file:///c:/Users/rithe/Mediqon/Mediqon/ml-service/app/models/kidney_model.pkl) |

---

## 🛠️ Technology Stack

### Machine Learning Microservice (`ml-service/`)
- **Python 3.10+ & FastAPI**: High-performance asynchronous REST microservice.
- **Scikit-Learn & Joblib**: Model training, pipeline serialization, and probability scoring.
- **Pandas & NumPy**: Data processing and statistical feature generation.
- **Pytest**: Integration and unit test suite.

### Backend Engine (`mediqon-backend/`)
- **NestJS & TypeScript**: Modular backend architecture.
- **PostgreSQL & TypeORM**: Persistent storage for users, appointments, doctors, and prediction audit history.
- **JWT & Passport.js**: Secure token authentication.
- **Google Gemini API**: Generative AI non-diagnostic explanation engine.

### Frontend Client (`Mediqon-frontend/`)
- **React 19 & Vite**: Ultra-fast component rendering.
- **Tailwind CSS 4 & Framer Motion**: Fluid animations and glassmorphic UI components.
- **Axios & React Router v7**: API integration and client-side routing.

---

## 🚀 Running the Mediqon Ecosystem

### Prerequisites
- Node.js (v18+)
- Python (v3.10+)
- PostgreSQL (v14+)

### 1. Python ML Service
```powershell
cd Mediqon\ml-service
.\.venv\Scripts\python.exe -m uvicorn app.main:app --port 8000
```
*Server runs on `http://127.0.0.1:8000` (Swagger docs at `http://127.0.0.1:8000/docs`).*

### 2. NestJS Backend
```powershell
cd Mediqon\mediqon-backend
npm install
npm run start:dev
```
*Backend runs on `http://localhost:3000`.*

### 3. React Frontend
```powershell
cd Mediqon\Mediqon-frontend
npm install
npm run dev
```
*Frontend runs on `http://localhost:5173`.*

---

## 🛡️ Academic Prototype & Medical Safety Disclaimer

> [!IMPORTANT]
> **This system is an academic research prototype.**
> The machine learning models and AI assistant outputs are provided strictly for educational and informational purposes. The generated probability scores and prototype risk categories do NOT constitute medical diagnoses, treatment advice, or prescriptions. Patients and users must consult qualified healthcare professionals for medical evaluation and diagnostic testing.
