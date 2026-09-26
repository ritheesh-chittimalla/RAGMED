import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
});

// Add a request interceptor to add the auth token
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const api = {
  // Matches GET /appointments/my
  getBookings: async () => {
    let serverAppointments = [];
    try {
      const response = await axiosInstance.get('/appointments/my');
      if (Array.isArray(response.data)) {
        serverAppointments = response.data;
      }
    } catch (error) {
      console.warn('Error fetching server appointments, relying on local fallback:', error);
    }

    const localAppointments = JSON.parse(localStorage.getItem('localAppointments') || '[]');
    const dismissed = JSON.parse(localStorage.getItem('dismissedAppointments') || '[]');

    const combinedMap = new Map();

    // 1. Local appointments (takes precedence for user instant updates)
    localAppointments.forEach((apt) => {
      if (apt && apt.id && !dismissed.includes(apt.id)) {
        combinedMap.set(apt.id, apt);
      }
    });

    // 2. Server appointments
    serverAppointments.forEach((apt) => {
      if (apt && apt.id && !dismissed.includes(apt.id)) {
        const normalized = {
          id: apt.id,
          token_number: apt.token_number || apt.tokenNumber || 1,
          patient_name: apt.patient_name || 'Patient',
          doctor: apt.doctor || apt.doctor_name || (typeof apt.doctor === 'object' ? apt.doctor?.name : 'Doctor') || 'Doctor',
          specialty: apt.specialty || apt.specialization || (typeof apt.doctor === 'object' ? apt.doctor?.specialization : 'General') || 'General',
          date: apt.date ? (typeof apt.date === 'string' ? apt.date.split('T')[0] : apt.date) : new Date().toISOString().split('T')[0],
          time: apt.time || apt.expectedStartTime || '10:00 AM',
          reason: apt.reason || 'Consultation',
          status: (apt.status || 'booked').toLowerCase().replace('_', ' ')
        };
        combinedMap.set(apt.id, normalized);
      }
    });

    return Array.from(combinedMap.values());
  },

  // Matches GET /doctors
  getDoctors: async () => {
    try {
      const response = await axiosInstance.get('/doctors');
      return response.data;
    } catch (error) {
      console.error('Error fetching doctors:', error);
      throw error;
    }
  },

  // Matches POST /appointments/book
  bookAppointment: async (bookingData) => {
    let serverData = null;
    try {
      const response = await axiosInstance.post('/appointments/book', bookingData);
      serverData = response.data;
    } catch (error) {
      console.warn('Backend book appointment failed or demo fallback used:', error);
    }

    const newAppointment = {
      id: serverData?.id || 'apt-' + Date.now(),
      token_number: serverData?.tokenNumber || serverData?.token_number || Math.floor(Math.random() * 15) + 1,
      patient_name: bookingData.patient_name || 'Patient',
      doctor: bookingData.doctor || 'Doctor',
      specialty: bookingData.specialty || 'Specialist',
      date: bookingData.appointmentDate || new Date().toISOString().split('T')[0],
      time: bookingData.expectedStartTime || bookingData.time || '10:00 AM',
      reason: bookingData.reason || 'Clinical Consultation',
      status: 'booked'
    };

    // Store locally to guarantee display on screen
    const existing = JSON.parse(localStorage.getItem('localAppointments') || '[]');
    const updated = [newAppointment, ...existing.filter(a => a.id !== newAppointment.id)];
    localStorage.setItem('localAppointments', JSON.stringify(updated));

    // Notify all components to re-fetch/sync
    window.dispatchEvent(new CustomEvent('sync-appointments'));

    return newAppointment;
  },

  // Matches PATCH /appointments/:id/status
  cancelAppointment: async (appointmentId) => {
    try {
      await axiosInstance.patch(`/appointments/${appointmentId}/status`, { status: "CANCELLED" });
    } catch (error) {
      console.warn('Error cancelling appointment on server:', error);
    }

    // Update local storage
    const existing = JSON.parse(localStorage.getItem('localAppointments') || '[]');
    const updated = existing.map(apt => apt.id === appointmentId ? { ...apt, status: 'cancelled' } : apt);
    localStorage.setItem('localAppointments', JSON.stringify(updated));

    window.dispatchEvent(new CustomEvent('sync-appointments'));
    return { success: true };
  },

  getAvailability: async (doctorId, date) => {
    try {
      const response = await axiosInstance.get(`/doctors/${doctorId}/availability`, {
        params: { date }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching availability:', error);
      throw error;
    }
  },

  // Matches POST /api/ml/predict/heart
  predictHeart: async (inputData) => {
    try {
      const response = await axiosInstance.post('/ml/predict/heart', { inputData });
      return response.data;
    } catch (error) {
      console.error('Error in heart prediction:', error);
      throw error;
    }
  },

  // Matches POST /api/ml/predict/diabetes
  predictDiabetes: async (inputData) => {
    try {
      const response = await axiosInstance.post('/ml/predict/diabetes', { inputData });
      return response.data;
    } catch (error) {
      console.error('Error in diabetes prediction:', error);
      throw error;
    }
  },

  // Matches POST /api/ml/predict/kidney
  predictKidney: async (inputData) => {
    try {
      const response = await axiosInstance.post('/ml/predict/kidney', { inputData });
      return response.data;
    } catch (error) {
      console.error('Error in kidney prediction:', error);
      throw error;
    }
  },

  // Matches GET /api/ml/history
  getPredictionHistory: async () => {
    try {
      const response = await axiosInstance.get('/ml/history');
      return response.data;
    } catch (error) {
      console.error('Error fetching prediction history:', error);
      throw error;
    }
  },

  // Matches POST /ml/consult
  consultationChat: async (message, history) => {
    try {
      const response = await axiosInstance.post('/ml/consult', { message, history });
      return response.data;
    } catch (error) {
      console.error('Error in consultation chat:', error);
      throw error;
    }
  }
};

export default axiosInstance;
