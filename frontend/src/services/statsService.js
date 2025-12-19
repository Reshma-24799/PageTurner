import api from './api';

const statsService = {
  // Get reading statistics
  getStats: async () => {
    const response = await api.get('/stats');
    return response.data.data;
  },

  // Get monthly goals progress
  getGoalsProgress: async () => {
    const response = await api.get('/stats/goals');
    return response.data.data;
  },
};

export default statsService;