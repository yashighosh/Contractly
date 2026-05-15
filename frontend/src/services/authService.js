import api from './api';

export const authService = {
  login:    (data)  => api.post('/v1/auth/login', data).then(res => res.data.data),
  register: (data)  => api.post('/v1/auth/signup', data).then(res => res.data.data),
  me:       ()      => api.get('/v1/auth/me').then(res => res.data.data),
  logout:   (sessionId) => api.post('/v1/auth/logout', { sessionId }),
};
