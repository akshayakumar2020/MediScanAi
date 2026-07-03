import api from './api';

const chatService = {
  sendMessage: (message) => api.post('/chat/send', { message }),
  getHistory: () => api.get('/chat/history'),
};

export default chatService;
