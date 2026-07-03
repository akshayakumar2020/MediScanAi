import api from './api';

const doctorService = {
  getAll: (params) => api.get('/doctors', { params }),
  getById: (id) => api.get(`/doctors/${id}`),
  getPatients: () => api.get('/doctors/patients'),
  getPendingReports: () => api.get('/doctors/reports/pending'),
  addNote: (data) => api.post('/doctors/notes', data),
  getNotes: (reportId) => api.get(`/doctors/notes/${reportId}`),
  getSchedule: () => api.get('/doctors/schedule'),
  getStats: () => api.get('/doctors/stats'),
  getAvailableSlots: (id, date) => api.get(`/doctors/${id}/slots?date=${date}`),
  markLeave: (id, data) => api.post(`/doctors/${id}/leaves`, data),
};

export default doctorService;
