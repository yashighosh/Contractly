import api from './api';

export const signatureService = {
  save:   (data)   => api.post('/signature', data),
  get:    ()       => api.get('/signature'),
  delete: ()       => api.delete('/signature'),
};
