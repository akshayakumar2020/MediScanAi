import api from './api';

const appointmentService = {
  create: (data) => api.post('/appointments', data),
  getAll: (params) => api.get('/appointments', { params }),
  getById: (id) => api.get(`/appointments/${id}`),
  cancel: (id) => api.delete(`/appointments/${id}`),
  update: (id, data) => api.put(`/appointments/${id}`, data),
  reschedule: (id, data) => api.put(`/appointments/${id}/reschedule`, data),
};

export default appointmentService;
