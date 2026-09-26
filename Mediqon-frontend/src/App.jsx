import { lazy, Suspense } from 'react';
import './App.css';
import './index.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider, RequireAuth } from './contexts/AuthContext';
import { ToastProvider } from './contexts/ToastContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { LocationProvider } from './contexts/LocationContext';
import Layout from './components/Layout';
import ErrorBoundary from './components/ErrorBoundary';
import { motion } from 'framer-motion';
import mediqonLogo from './assets/mediqon-logo.png';

// Lazy Loaded Pages to reduce initial bundle size
const LandingPage = lazy(() => import('./pages/Landingpage'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Bookings = lazy(() => import('./pages/Bookings'));
const Doctors = lazy(() => import('./pages/Doctors'));
const Records = lazy(() => import('./pages/Records'));
const Timeline = lazy(() => import('./pages/Timeline'));
const Notifications = lazy(() => import('./pages/Notifications'));
const Settings = lazy(() => import('./pages/Settings'));
const Assistant = lazy(() => import('./pages/Assistant'));
const Vitals = lazy(() => import('./pages/Vitals'));
const AddVitals = lazy(() => import('./pages/AddVitals'));
const Consultation = lazy(() => import('./pages/Consultation'));
const Wellness = lazy(() => import('./pages/Wellness'));
const PredictionsHub = lazy(() => import('./pages/predictions/PredictionsHub'));
const HeartAssessment = lazy(() => import('./pages/predictions/HeartAssessment'));
const DiabetesAssessment = lazy(() => import('./pages/predictions/DiabetesAssessment'));
const KidneyAssessment = lazy(() => import('./pages/predictions/KidneyAssessment'));
const PredictionHistory = lazy(() => import('./pages/predictions/PredictionHistory'));

// Optimized Page Transitions and Loading State
const PageLoader = () => (
  <div className="fixed inset-0 bg-background flex items-center justify-center z-50">
    <div className="flex flex-col items-center gap-6">
      <motion.div 
        animate={{ 
          scale: [1, 1.05, 1],
          opacity: [0.7, 1, 0.7],
        }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        <img src={mediqonLogo} alt="Mediqon" className="w-16 h-16 rounded-2xl shadow-lg" />
      </motion.div>
      <span className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground/50">Loading</span>
    </div>
  </div>
);

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <LocationProvider>
          <LanguageProvider>
            <ThemeProvider>
            <AuthProvider>
              <ToastProvider>
            <Suspense fallback={<PageLoader />}>
              <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              {/* Authenticated Routes Wrapped in Premium Layout */}
              <Route 
                path="/bookings" 
                element={
                  <RequireAuth>
                    <Layout><Bookings /></Layout>
                  </RequireAuth>
                } 
              />
              
              <Route 
                path="/doctors" 
                element={
                  <RequireAuth>
                    <Layout><Doctors /></Layout>
                  </RequireAuth>
                } 
              />

              <Route 
                path="/records" 
                element={
                  <RequireAuth>
                    <Layout><Records /></Layout>
                  </RequireAuth>
                } 
              />
              
              <Route 
                path="/timeline" 
                element={
                  <RequireAuth>
                    <Layout><Timeline /></Layout>
                  </RequireAuth>
                } 
              />
              <Route 
                path="/dashboard" 
                element={
                  <RequireAuth>
                    <Layout><Dashboard /></Layout>
                  </RequireAuth>
                } 
              />
              <Route 
                path="/notifications" 
                element={
                  <RequireAuth>
                    <Layout><Notifications /></Layout>
                  </RequireAuth>
                } 
              />
              <Route 
                path="/settings" 
                element={
                  <RequireAuth>
                    <Layout><Settings /></Layout>
                  </RequireAuth>
                } 
              />
              <Route 
                path="/assistant" 
                element={
                  <RequireAuth>
                    <Layout><Assistant /></Layout>
                  </RequireAuth>
                } 
              />
              <Route 
                path="/vitals" 
                element={
                  <RequireAuth>
                    <Layout><Vitals /></Layout>
                  </RequireAuth>
                } 
              />
              <Route 
                path="/vitals/add" 
                element={
                  <RequireAuth>
                    <Layout><AddVitals /></Layout>
                  </RequireAuth>
                } 
              />
              <Route 
                path="/consultation" 
                element={
                  <RequireAuth>
                    <Layout><Consultation /></Layout>
                  </RequireAuth>
                } 
              />
              <Route 
                path="/wellness" 
                element={
                  <RequireAuth>
                    <Layout><Wellness /></Layout>
                  </RequireAuth>
                } 
              />
              <Route 
                path="/predictions" 
                element={
                  <RequireAuth>
                    <Layout><PredictionsHub /></Layout>
                  </RequireAuth>
                } 
              />
              <Route 
                path="/predictions/heart" 
                element={
                  <RequireAuth>
                    <Layout><HeartAssessment /></Layout>
                  </RequireAuth>
                } 
              />
              <Route 
                path="/predictions/diabetes" 
                element={
                  <RequireAuth>
                    <Layout><DiabetesAssessment /></Layout>
                  </RequireAuth>
                } 
              />
              <Route 
                path="/predictions/kidney" 
                element={
                  <RequireAuth>
                    <Layout><KidneyAssessment /></Layout>
                  </RequireAuth>
                } 
              />
              <Route 
                path="/predictions/history" 
                element={
                  <RequireAuth>
                    <Layout><PredictionHistory /></Layout>
                  </RequireAuth>
                } 
              />
            </Routes>
          </Suspense>
        </ToastProvider>
      </AuthProvider>
      </ThemeProvider>
      </LanguageProvider>
      </LocationProvider>
    </Router>
  </ErrorBoundary>
  );
}

export default App;
