import api from './api';

export const dashboardService = {
  getStats:  ()      => api.get('/v1/dashboard/stats').then(r => r.data.data),
  getRecent: (limit) => api.get('/v1/dashboard/recent', { params: { limit } }).then(r => r.data.data),
};
