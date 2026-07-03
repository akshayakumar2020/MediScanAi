import api from './api';

const adminService = {
  // Users
  getUsers: (params) => api.get('/admin/users', { params }),
  getUserById: (id) => api.get(`/admin/users/${id}`),
  suspendUser: (id) => api.put(`/admin/users/suspend/${id}`),
  blockUser: (id) => api.put(`/admin/users/block/${id}`),
  activateUser: (id) => api.put(`/admin/users/activate/${id}`),
  deleteUser: (id) => api.delete(`/admin/users/delete/${id}`),

  // Doctors
  getDoctors: (params) => api.get('/admin/doctors', { params }),
  getDoctorById: (id) => api.get(`/admin/doctors/${id}`),
  approveDoctor: (id) => api.put(`/admin/doctors/approve/${id}`),
  rejectDoctor: (id) => api.put(`/admin/doctors/reject/${id}`),
  suspendDoctor: (id) => api.put(`/admin/doctors/suspend/${id}`),
  blockDoctor: (id) => api.put(`/admin/doctors/block/${id}`),
  deleteDoctor: (id) => api.delete(`/admin/doctors/delete/${id}`),

  // Reports
  getAllReports: (params) => api.get('/admin/reports', { params }),

  // Analytics
  getAnalytics: () => api.get('/admin/analytics'),
  getSystemHealth: () => api.get('/admin/system-health'),
};

export default adminService;
