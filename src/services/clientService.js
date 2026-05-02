import api from './api';

export const clientService = {
  getAll:   (params) => api.get('/clients', { params }),
  getById:  (id)     => api.get(`/clients/${id}`),
  create:   (data)   => api.post('/clients', data),
  update:   (id, d)  => api.put(`/clients/${id}`, d),
  delete:   (id)     => api.delete(`/clients/${id}`),
};
