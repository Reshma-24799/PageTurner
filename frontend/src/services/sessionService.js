import api from './api';

const sessionService = {
  // Get all sessions
  getSessions: async () => {
    const response = await api.get('/sessions');
    return response.data.data;
  },

  // Get sessions for a specific book
  getBookSessions: async (bookId) => {
    const response = await api.get(`/sessions/book/${bookId}`);
    return response.data.data;
  },

  // Create session
  createSession: async (sessionData) => {
    const response = await api.post('/sessions', sessionData);
    return response.data.data;
  },

  // Update session
  updateSession: async (id, sessionData) => {
    const response = await api.put(`/sessions/${id}`, sessionData);
    return response.data.data;
  },

  // Delete session
  deleteSession: async (id) => {
    const response = await api.delete(`/sessions/${id}`);
    return response.data;
  },
};

export default sessionService;