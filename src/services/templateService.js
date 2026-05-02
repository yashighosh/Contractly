import api from './api';

export const templateService = {
  getAll:   (params) => api.get('/templates', { params }),
  getById:  (id)     => api.get(`/templates/${id}`),
  create:   (data)   => api.post('/templates', data),
  update:   (id, d)  => api.put(`/templates/${id}`, d),
  delete:   (id)     => api.delete(`/templates/${id}`),
  useTemplate: (id)  => api.post(`/templates/${id}/use`),
};
