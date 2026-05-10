import api from './api';

export const clientService = {
  getAll:   (params) => api.get('/v1/clients', { params }),
  getById:  (id)     => api.get(`/v1/clients/${id}`),
  create:   (data)   => api.post('/v1/clients', data),
  update:   (id, d)  => api.put(`/v1/clients/${id}`, d),
  delete:   (id)     => api.delete(`/v1/clients/${id}`),
};
