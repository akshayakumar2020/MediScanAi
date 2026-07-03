import api from './api';

const reportService = {
  upload: (formData) => api.post('/reports/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    timeout: 120000,
  }),
  getAll: (params) => api.get('/reports', { params }),
  getById: (id) => api.get(`/reports/${id}`),
  getPatientReports: (patientId) => api.get(`/reports/patient/${patientId}`),
  deleteReport: (id) => api.delete(`/reports/${id}`),
};

export default reportService;
